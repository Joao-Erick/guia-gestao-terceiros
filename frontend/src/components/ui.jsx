import { Link } from "../router";
import { formatTime } from "../api";

export function Logo() {
  return (
    <span className="logo">
      <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
        <path fill="#3563F6" d="M3 8a3 3 0 0 1 3-3h7l3 4h10a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" />
        <path fill="#fff" d="M13 13.2v8.6c0 .6.7 1 1.2.7l6.9-4.3c.5-.3.5-1 0-1.3l-6.9-4.3c-.5-.4-1.2 0-1.2.6z" />
      </svg>
      <span>Guia <small>para a Gestão de Terceiros</small></span>
    </span>
  );
}

export function LockIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function CheckIcon({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export function Loading({ label = "Carregando" }) {
  return <div className="state" role="status"><span className="spinner" />{label}</div>;
}

export function ErrorBox({ error, onRetry }) {
  return (
    <div className="state state-error" role="alert">
      <p>{error?.message || "Não foi possível carregar."}</p>
      {onRetry && <button className="btn btn-ghost" onClick={onRetry}>Tentar novamente</button>}
    </div>
  );
}

export function Field({ label, error, hint, children }) {
  return (
    <label className={`field${error ? " field-error" : ""}`}>
      <span>{label}</span>
      {children}
      {hint && !error && <small>{hint}</small>}
      {error && <small className="error-text">{error}</small>}
    </label>
  );
}

export function ProgressBar({ value, label }) {
  const percent = Math.min(100, Math.round(value * 100));
  return (
    <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={label || "Progresso"}>
      <span style={{ width: `${percent}%` }} />
    </div>
  );
}

export function VideoCard({ video, wide }) {
  const fraction = video.duration_seconds ? video.position_seconds / video.duration_seconds : 0;
  return (
    <Link to={`/assistir/${video.id}`} className={`video-card${video.locked ? " is-locked" : ""}${wide ? " is-wide" : ""}`} data-testid="video-card">
      <div className="cover">
        {video.thumb_url
          ? <img src={video.thumb_url} alt="" loading="lazy" />
          : <div className="cover-fallback"><b>{video.category.name}</b><span>{video.title}</span></div>}
        {video.locked && video.access_level === "premium" && <span className="badge-lock"><LockIcon size={14} />Assinantes</span>}
        {video.locked && video.access_level === "intro" && <span className="badge-intro">Introdutório</span>}
        {!video.locked && video.completed && <span className="badge-done"><CheckIcon size={13} />Concluído</span>}
        {!video.locked && fraction > 0 && !video.completed && <ProgressBar value={fraction} label={`Progresso de ${video.title}`} />}
      </div>
      <h3>{video.title}</h3>
      <p className="card-meta">
        <span>{video.category.name}</span>
        <span>{formatTime(video.duration_seconds)}</span>
      </p>
    </Link>
  );
}
