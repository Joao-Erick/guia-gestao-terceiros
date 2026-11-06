import { useState } from "react";
import { api, pending } from "../api";
import { useAuth } from "../auth";
import { Link, navigate, useLocation } from "../router";
import { Field } from "../components/ui";

export default function Login() {
  const { login, register } = useAuth();
  const { query } = useLocation();
  const [mode, setMode] = useState(query.get("modo") === "cadastro" ? "register" : "login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const next = query.get("next");
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/minha-aprendizagem";
  const saving = query.get("salvar") === "1";

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "login") await login({ email: form.email, password: form.password });
      else await register(form);
      const draft = pending.read();
      if (saving && draft) {
        await api("/api/paths", { method: "POST", body: { situation: draft.situation, answers: draft.answers } });
        pending.clear();
        navigate("/minha-aprendizagem?trilha=salva", { replace: true });
      } else {
        navigate(safeNext, { replace: true });
      }
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  const isRegister = mode === "register";
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs" role="tablist">
          <button role="tab" aria-selected={!isRegister} onClick={() => { setMode("login"); setError(null); }}>Entrar</button>
          <button role="tab" aria-selected={isRegister} onClick={() => { setMode("register"); setError(null); }}>Criar conta</button>
        </div>
        <h1>{isRegister ? "Crie sua conta" : "Entre na sua conta"}</h1>
        <p className="muted">
          {saving ? "Sua trilha será salva assim que você concluir este passo."
            : isRegister ? "Seu teste de 14 dias libera os vídeos introdutórios. Não pedimos pagamento."
            : "Continue de onde parou."}
        </p>
        <form onSubmit={submit} noValidate>
          {isRegister && (
            <Field label="Nome" error={error?.fields?.name}>
              <input value={form.name} onChange={update("name")} autoComplete="name" required />
            </Field>
          )}
          <Field label="E-mail" error={error?.fields?.email}>
            <input type="email" value={form.email} onChange={update("email")} autoComplete="email" required />
          </Field>
          <Field label="Senha" error={error?.fields?.password} hint={isRegister ? "Use ao menos 8 caracteres, com letras e números." : undefined}>
            <input type="password" value={form.password} onChange={update("password")} autoComplete={isRegister ? "new-password" : "current-password"} required />
          </Field>
          {error && !Object.keys(error.fields).length && <p className="form-error" role="alert">{error.message}</p>}
          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? "Aguarde" : isRegister ? "Criar conta" : "Entrar"}
          </button>
        </form>
        <p className="demo-note">Prefere conhecer antes? <Link to="/diagnostico">Faça o diagnóstico sem cadastro</Link>.</p>
      </div>
    </div>
  );
}
