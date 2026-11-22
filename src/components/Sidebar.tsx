import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  GESTIONES,
  INSTITUTION,
  MODULE_KEYS,
  MODULE_META,
  TIPO_META,
  correspondenciaPath,
  modulePath,
  type Gestion,
  type ModuleKey,
} from "../types";
import { useRecords } from "../context/RecordsContext";
import { formatNumber } from "../lib/format";
import { LogoMark } from "./Logo";
import { ModuleIcon, TipoIcon } from "./ModuleIcon";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

function getActiveYear(pathname: string): Gestion | null {
  const match = pathname.match(/\/gestion\/(\d{4})/);
  if (!match) return null;
  const year = Number(match[1]);
  return GESTIONES.includes(year as Gestion) ? (year as Gestion) : null;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();
  const { records } = useRecords();
  const activeYear = getActiveYear(location.pathname);
  const [openYears, setOpenYears] = useState<Set<Gestion>>(
    () => new Set<Gestion>([2025]),
  );

  useEffect(() => {
    if (activeYear) {
      setOpenYears((current) => {
        if (current.has(activeYear)) return current;
        const next = new Set(current);
        next.add(activeYear);
        return next;
      });
    }
  }, [activeYear]);

  const counts = useMemo(() => {
    const byYear = new Map<Gestion, number>();
    const byModule = new Map<string, number>();
    const byTipo = new Map<string, number>();

    for (const gestion of GESTIONES) {
      byYear.set(gestion, 0);
      for (const module of MODULE_KEYS) {
        byModule.set(`${gestion}-${module}`, 0);
      }
      for (const tipo of Object.keys(TIPO_META)) {
        byTipo.set(`${gestion}-${tipo}`, 0);
      }
    }

    for (const record of records) {
      byYear.set(record.gestion, (byYear.get(record.gestion) ?? 0) + 1);
      const moduleKey = `${record.gestion}-${record.module}`;
      byModule.set(moduleKey, (byModule.get(moduleKey) ?? 0) + 1);
      if (record.module === "correspondencia" && record.tipo) {
        const tipoKey = `${record.gestion}-${record.tipo}`;
        byTipo.set(tipoKey, (byTipo.get(tipoKey) ?? 0) + 1);
      }
    }

    return { byYear, byModule, byTipo };
  }, [records]);

  const toggleYear = (year: Gestion) => {
    setOpenYears((current) => {
      const next = new Set(current);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  const isCorrespondenciaActive = (year: Gestion) =>
    location.pathname.startsWith(`/gestion/${year}/correspondencia`);

  const moduleCount = (year: Gestion, module: ModuleKey) =>
    counts.byModule.get(`${year}-${module}`) ?? 0;

  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`} aria-label="Menú principal">
      <div className="sidebar__brand-row">
        <Link to="/" className="sidebar-brand" onClick={onClose}>
          <LogoMark size={44} />
          <span className="sidebar-brand__text">
            <span className="sidebar-brand__name">SGD Académico</span>
            <span className="sidebar-brand__sub">Gestión Documental</span>
          </span>
        </Link>
        <button
          type="button"
          className="sidebar__close"
          onClick={onClose}
          aria-label="Cerrar menú"
        >
          <X size={20} />
        </button>
      </div>

      <div className="sidebar__institution">
        <span>{INSTITUTION.area}</span>
        <strong>Gestiones {GESTIONES.join(" · ")}</strong>
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link nav-link--dashboard ${isActive ? "is-active" : ""}`}
          onClick={onClose}
        >
          <span className="nav-link__icon">
            <LayoutDashboard size={18} />
          </span>
          <span>Panel de control</span>
        </NavLink>

        <p className="nav-section-label">Gestiones</p>

        <div className="year-groups">
          {GESTIONES.map((year) => {
            const isOpen = openYears.has(year);
            const yearTotal = counts.byYear.get(year) ?? 0;
            const isYearActive = activeYear === year;

            return (
              <div className="year-group" key={year}>
                <button
                  type="button"
                  className={`year-toggle ${isYearActive ? "is-current" : ""}`}
                  onClick={() => toggleYear(year)}
                  aria-expanded={isOpen}
                  aria-controls={`year-panel-${year}`}
                >
                  <span className="year-toggle__year">Gestión {year}</span>
                  <span className="year-toggle__count">{formatNumber(yearTotal)}</span>
                  <ChevronDown
                    size={16}
                    className={`year-toggle__chevron ${isOpen ? "is-open" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen ? (
                  <div className="year-modules" id={`year-panel-${year}`}>
                    {MODULE_KEYS.map((module) => {
                      const meta = MODULE_META[module];
                      const count = moduleCount(year, module);
                      const isCorrespondencia = module === "correspondencia";
                      const showSublinks = isCorrespondencia && isCorrespondenciaActive(year);

                      return (
                        <div key={module} className="year-module-group">
                          <NavLink
                            to={
                              isCorrespondencia
                                ? correspondenciaPath(year)
                                : modulePath(year, module)
                            }
                            className={({ isActive }) =>
                              `nav-link nav-link--module ${isActive ? "is-active" : ""}`
                            }
                            onClick={onClose}
                            title={meta.label}
                          >
                            <span
                              className="nav-link__icon nav-link__icon--module"
                              style={{ backgroundColor: meta.soft, color: meta.accent }}
                            >
                              <ModuleIcon module={module} size={16} />
                            </span>
                            <span className="nav-link__label">
                              {module === "programaciones"
                                ? meta.label
                                : meta.shortLabel}
                            </span>
                            <span className="nav-count">{count}</span>
                          </NavLink>

                          {showSublinks ? (
                            <div className="nav-sublinks">
                              {Object.values(TIPO_META).map((tipo) => {
                                const tipoCount = counts.byTipo.get(`${year}-${tipo.key}`) ?? 0;
                                return (
                                  <NavLink
                                    key={tipo.key}
                                    to={correspondenciaPath(year, tipo.key)}
                                    className={({ isActive }) =>
                                      `nav-sublink ${isActive ? "is-active" : ""}`
                                    }
                                    onClick={onClose}
                                  >
                                    <TipoIcon tipo={tipo.key} size={14} />
                                    <span>{tipo.label}</span>
                                    <span className="nav-count nav-count--small">{tipoCount}</span>
                                  </NavLink>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-storage">
          <span className="sidebar-storage__icon">
            <ShieldCheck size={19} />
          </span>
          <div>
            <strong>Guardado automático</strong>
            <span>Tus registros se conservan en este dispositivo.</span>
          </div>
        </div>
        <p className="sidebar-version">SGD Académico · versión 1.0</p>
      </div>
    </aside>
  );
}
