import { useState } from "react";
import { useAuth } from "../auth";
import { Link, navigate, useLocation } from "../router";
import { Logo } from "./ui";

export function Header() {
  const { user, logout } = useAuth();
  const { path } = useLocation();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const current = (to) => (path === to || path.startsWith(`${to}/`) ? "page" : undefined);

  return (
    <header className="header">
      <div className="wrap header-row">
        <Link to="/" className="brand" aria-label="Página inicial" onClick={close}><Logo /></Link>
        <button className="menu-toggle" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>Menu</button>
        <nav id="menu" className={open ? "nav is-open" : "nav"} aria-label="Principal">
          <Link to="/catalogo" aria-current={current("/catalogo")} onClick={close}>Catálogo</Link>
          <Link to="/diagnostico" aria-current={current("/diagnostico")} onClick={close}>Diagnóstico</Link>
          {user && <Link to="/minha-aprendizagem" aria-current={current("/minha-aprendizagem")} onClick={close}>Minha aprendizagem</Link>}
          {user?.role === "admin" && <Link to="/admin" aria-current={current("/admin")} onClick={close}>Administração</Link>}
          <span className="nav-spacer" />
          {user ? (
            <>
              <span className="nav-user" title={user.email}>{user.name.split(" ")[0]}</span>
              <button className="btn btn-outline-light btn-sm" onClick={async () => { close(); await logout(); navigate("/"); }}>Sair</button>
            </>
          ) : (
            <Link to="/entrar" className="btn btn-primary btn-sm" onClick={close}>Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <p>Vídeos, contas e empresas desta demonstração são sintéticos. Conteúdo educativo, que não substitui a avaliação jurídica do seu caso.</p>
      </div>
    </footer>
  );
}
