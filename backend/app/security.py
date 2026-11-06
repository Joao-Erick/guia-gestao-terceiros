"""Hash de senha, sessões, autorização e limite de tentativas de login."""
import base64
import hashlib
import hmac
import secrets
import threading
import time

from . import config, db
from .errors import ApiError

_N, _R, _P = 2**14, 8, 1


def _scrypt(password: str, salt: bytes, n: int, r: int, p: int) -> bytes:
    return hashlib.scrypt(password.encode(), salt=salt, n=n, r=r, p=p, dklen=32, maxmem=64 * 1024 * 1024)


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = _scrypt(password, salt, _N, _R, _P)
    return f"scrypt${_N}${_R}${_P}${base64.b64encode(salt).decode()}${base64.b64encode(digest).decode()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        _, n, r, p, salt, digest = stored.split("$")
        expected = base64.b64decode(digest)
        return hmac.compare_digest(_scrypt(password, base64.b64decode(salt), int(n), int(r), int(p)), expected)
    except (ValueError, TypeError):
        return False


# Mantém o tempo de resposta parecido quando o e-mail não existe.
DUMMY_HASH = hash_password(secrets.token_hex(8))


def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def create_session(conn, user_id: int) -> str:
    token = secrets.token_urlsafe(32)
    conn.execute("DELETE FROM sessions WHERE expires_at <= ?", (db.now_iso(),))
    conn.execute(
        "INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?,?,?,?)",
        (_token_hash(token), user_id, db.hours_from_now(config.SESSION_TTL_HOURS), db.now_iso()),
    )
    return token


def destroy_session(conn, token: str) -> None:
    conn.execute("DELETE FROM sessions WHERE token_hash = ?", (_token_hash(token),))


def set_session_cookie(response, token: str) -> None:
    response.set_cookie(
        config.COOKIE_NAME, token, max_age=config.SESSION_TTL_HOURS * 3600,
        httponly=True, samesite="lax", secure=config.COOKIE_SECURE, path="/",
    )


def clear_session_cookie(response) -> None:
    response.delete_cookie(config.COOKIE_NAME, path="/", httponly=True, samesite="lax", secure=config.COOKIE_SECURE)


def current_user(request):
    token = request.cookies.get(config.COOKIE_NAME)
    if not token:
        return None
    with db.transaction() as conn:
        row = conn.execute(
            "SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id "
            "WHERE s.token_hash = ? AND s.expires_at > ?",
            (_token_hash(token), db.now_iso()),
        ).fetchone()
    return dict(row) if row else None


def require_user(request) -> dict:
    user = current_user(request)
    if not user:
        raise ApiError(401, "not_authenticated", "Entre na sua conta para continuar.")
    return user


def require_admin(request) -> dict:
    user = require_user(request)
    if user["role"] != "admin":
        raise ApiError(403, "admin_only", "Esta área é exclusiva para administradores.")
    return user


def plan_status(user: dict | None) -> str:
    """Retorna anonymous, admin, premium, trial ou trial_expired."""
    if not user:
        return "anonymous"
    if user["role"] == "admin":
        return "admin"
    if user["plan"] == "premium":
        return "premium"
    if user["trial_ends_at"] and user["trial_ends_at"] > db.now_iso():
        return "trial"
    return "trial_expired"


def video_access(user: dict | None, video) -> tuple[bool, str | None]:
    """Regra única de acesso, usada no catálogo, nos detalhes, no stream e no progresso."""
    status = plan_status(user)
    if status in ("admin", "premium"):
        return True, None
    if status == "anonymous":
        return False, "login_required"
    if status == "trial_expired":
        return False, "trial_expired"
    if video["access_level"] == "intro":
        return True, None
    return False, "plan_required"


LOCK_MESSAGES = {
    "login_required": "Entre ou crie uma conta para assistir a este vídeo.",
    "trial_expired": "Seu teste de 14 dias terminou. Fale com o administrador para ativar a assinatura.",
    "plan_required": "Este conteúdo é exclusivo para assinantes.",
}


class LoginLimiter:
    """Limite em memória, por processo. Adequado ao MVP de uma instância."""

    def __init__(self):
        self._failures: dict[str, list[float]] = {}
        self._lock = threading.Lock()

    def check(self, key: str) -> None:
        cutoff = time.monotonic() - config.LOGIN_WINDOW_SECONDS
        with self._lock:
            recent = [t for t in self._failures.get(key, []) if t > cutoff]
            self._failures[key] = recent
            if len(recent) >= config.LOGIN_MAX_ATTEMPTS:
                raise ApiError(429, "too_many_attempts", "Muitas tentativas. Aguarde alguns minutos e tente novamente.")

    def fail(self, key: str) -> None:
        with self._lock:
            self._failures.setdefault(key, []).append(time.monotonic())

    def reset(self, key: str) -> None:
        with self._lock:
            self._failures.pop(key, None)


limiter = LoginLimiter()
