"""Dados iniciais sintéticos. A execução é idempotente: nada é duplicado."""
import json
import subprocess

from . import config, db
from .catalog_data import CATEGORIES, LICENSE, VIDEOS
from .security import hash_password

DEMO_USERS = [
    ("Ana Administradora", "admin@demo.guia.test", "admin", "premium", 0, "Empresa Fictícia Alfa", "Administradora da plataforma"),
    ("Sara Assinante", "assinante@demo.guia.test", "subscriber", "premium", 0, "Empresa Fictícia Beta", "Gestora de contratos"),
    ("Bruno Básico", "basico@demo.guia.test", "subscriber", "trial", 14, "Empresa Fictícia Gama", "Coordenador de compras"),
    ("Elisa Expirada", "expirado@demo.guia.test", "subscriber", "trial", -1, "Empresa Fictícia Delta", "Analista administrativa"),
]


def probe_duration(path) -> int:
    try:
        out = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
            capture_output=True, text=True, timeout=20, check=True,
        )
        return round(float(out.stdout.strip()))
    except (OSError, subprocess.SubprocessError, ValueError):
        return 0


def _meta() -> dict:
    meta_path = config.MEDIA_DIR / "catalog-meta.json"
    return json.loads(meta_path.read_text(encoding="utf-8")) if meta_path.exists() else {}


def run() -> None:
    db.init_db()
    meta = _meta()
    with db.transaction() as conn:
        if conn.execute("SELECT 1 FROM users LIMIT 1").fetchone():
            return
        stamp = db.now_iso()
        password = hash_password(config.DEMO_PASSWORD)
        for name, email, role, plan, trial_days, company, job in DEMO_USERS:
            trial = db.days_from_now(trial_days) if plan == "trial" else None
            conn.execute(
                "INSERT INTO users (name,email,password_hash,role,plan,trial_ends_at,company,job_title,created_at) "
                "VALUES (?,?,?,?,?,?,?,?,?)",
                (name, email, password, role, plan, trial, company, job, stamp),
            )
        category_ids = {}
        for position, (name, slug, description) in enumerate(CATEGORIES):
            cur = conn.execute(
                "INSERT INTO categories (name,slug,description,position) VALUES (?,?,?,?)",
                (name, slug, description, position),
            )
            category_ids[slug] = cur.lastrowid
        video_ids = {}
        for item in VIDEOS:
            file_name = f"{item['slug']}.mp4"
            path = config.VIDEO_DIR / file_name
            has_file = path.exists()
            duration = meta.get(item["slug"], {}).get("duration") or (probe_duration(path) if has_file else 0)
            thumb = f"{item['slug']}.jpg"
            cur = conn.execute(
                "INSERT INTO videos (slug,title,description,category_id,access_level,status,duration_seconds,"
                "file_name,thumb_name,license_note,is_synthetic,created_at,updated_at) "
                "VALUES (?,?,?,?,?,?,?,?,?,?,1,?,?)",
                (item["slug"], item["title"], item["description"], category_ids[item["category"]],
                 item["access_level"], "published" if has_file else "draft", duration,
                 file_name if has_file else None, thumb if (config.THUMB_DIR / thumb).exists() else None,
                 LICENSE, stamp, stamp),
            )
            video_ids[item["slug"]] = (cur.lastrowid, duration)

        # Progresso sintético da assinante, para a demonstração de "continuar assistindo".
        sara = conn.execute("SELECT id FROM users WHERE email='assinante@demo.guia.test'").fetchone()["id"]
        for slug, fraction, completed in (("o-que-muda-ao-terceirizar", 1.0, 1), ("rotina-mensal-do-contrato", 0.4, 0)):
            vid, duration = video_ids[slug]
            if duration:
                conn.execute(
                    "INSERT INTO progress (user_id,video_id,position_seconds,completed,first_watched_at,last_watched_at) "
                    "VALUES (?,?,?,?,?,?)",
                    (sara, vid, round(duration * fraction, 1), completed, stamp, stamp),
                )


if __name__ == "__main__":
    run()
    print("Banco pronto em", config.DATABASE_PATH)
