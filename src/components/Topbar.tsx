import { CalendarDays, Menu, ShieldCheck } from "lucide-react";
import { INSTITUTION } from "../types";
import { formatDateLong } from "../lib/format";

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          type="button"
          className="topbar__menu"
          onClick={onOpenMenu}
          aria-label="Abrir menú de navegación"
        >
          <Menu size={21} />
        </button>
        <div className="topbar__context">
          <span className="topbar__eyebrow">{INSTITUTION.system}</span>
          <span className="topbar__title">{INSTITUTION.area}</span>
        </div>
      </div>

      <div className="topbar__right">
        <span className="topbar__date">
          <CalendarDays size={15} />
          {formatDateLong()}
        </span>
        <span className="status-pill">
          <span className="status-pill__dot" />
          Datos locales
        </span>
        <div className="user-chip" title="Sesión local de trabajo">
          <span className="user-chip__avatar">AD</span>
          <span className="user-chip__text">
            <strong>Administrador</strong>
            <span>Área Académica</span>
          </span>
        </div>
        <span className="topbar__secure" title="Información almacenada de forma local">
          <ShieldCheck size={17} />
        </span>
      </div>
    </header>
  );
}
