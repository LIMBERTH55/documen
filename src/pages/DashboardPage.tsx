import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarRange,
  Clock,
  Files,
  Inbox,
  Sparkles,
} from "lucide-react";
import {
  GESTIONES,
  MODULE_KEYS,
  MODULE_META,
  TIPO_META,
  correspondenciaPath,
  recordPath,
} from "../types";
import { useRecords } from "../context/RecordsContext";
import {
  formatDateLong,
  formatDateMedium,
  formatDateTime,
  formatNumber,
} from "../lib/format";
import { ModuleIcon, TipoIcon } from "../components/ModuleIcon";

export function DashboardPage() {
  const { records } = useRecords();

  const stats = useMemo(() => {
    const total = records.length;
    const correspondencia = records.filter(
      (record) => record.module === "correspondencia",
    ).length;
    const careers = new Set(records.map((record) => record.carrera)).size;
    const latest = records.reduce<string | null>((current, record) => {
      if (!current) return record.updatedAt;
      return record.updatedAt > current ? record.updatedAt : current;
    }, null);

    return { total, correspondencia, careers, latest };
  }, [records]);

  const yearData = useMemo(() => {
    return GESTIONES.map((gestion) => {
      const yearRecords = records.filter((record) => record.gestion === gestion);
      const modules = MODULE_KEYS.map((module) => ({
        module,
        count: yearRecords.filter((record) => record.module === module).length,
      }));
      return { gestion, total: yearRecords.length, modules };
    });
  }, [records]);

  const moduleTotals = useMemo(
    () =>
      MODULE_KEYS.map((module) => {
        const count = records.filter((record) => record.module === module).length;
        return {
          module,
          count,
          meta: MODULE_META[module],
          percentage: records.length > 0 ? Math.round((count / records.length) * 100) : 0,
        };
      }),
    [records],
  );

  const recentRecords = useMemo(
    () =>
      [...records]
        .sort((a, b) => b.fechaRegistro.localeCompare(a.fechaRegistro))
        .slice(0, 6),
    [records],
  );

  const correspondenciaSummary = useMemo(() => {
    return Object.values(TIPO_META).map((tipo) => {
      const count = records.filter(
        (record) => record.module === "correspondencia" && record.tipo === tipo.key,
      ).length;
      return { tipo, count };
    });
  }, [records]);

  const maxYearTotal = Math.max(...yearData.map((year) => year.total), 1);
  const topYear = [...yearData].sort((a, b) => b.total - a.total)[0];
  const correspondenciaTotal = correspondenciaSummary.reduce((sum, item) => sum + item.count, 0);

  const donutRadius = 52;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let donutOffset = 0;
  const donutSegments = moduleTotals.map((item) => {
    const fraction = records.length > 0 ? item.count / records.length : 0;
    const dash = Math.max(fraction * donutCircumference - 5, 0);
    const segment = {
      ...item,
      dash,
      offset: donutOffset,
      color: item.meta.accent,
    };
    donutOffset += fraction * donutCircumference;
    return segment;
  });

  return (
    <div className="page dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero__content">
          <span className="hero-kicker">
            <Sparkles size={15} />
            Sistema de Gestión Documental Académica
          </span>
          <h1>Todo tu archivo académico, organizado en un solo lugar.</h1>
          <p>
            Administra dictámenes, programaciones especiales, correspondencia recibida y
            auxiliatura de las gestiones 2023, 2024 y 2025.
          </p>
          <div className="hero-actions">
            <a href="#gestiones" className="btn btn--white">
              Explorar gestiones
              <ArrowRight size={17} />
            </a>
            <Link to={correspondenciaPath(2025)} className="btn btn--ghost-light">
              <Inbox size={17} />
              Correspondencia 2025
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-panel__header">
            <span className="hero-panel__pulse" />
            Panel actualizado
          </div>
          <div className="hero-panel__main">
            <span>Gestión con más registros</span>
            <strong>{topYear?.total ? topYear.gestion : "—"}</strong>
            <span>{formatNumber(topYear?.total ?? 0)} documentos registrados</span>
          </div>
          <div className="hero-panel__divider" />
          <div className="hero-panel__row">
            <span>Última actualización</span>
            <strong>{stats.latest ? formatDateTime(stats.latest) : "Sin registros"}</strong>
          </div>
          <div className="hero-panel__row">
            <span>Módulos activos</span>
            <strong>12</strong>
          </div>
        </div>
      </section>

      <section className="stats-grid" aria-label="Estadísticas generales">
        <article className="stat-card">
          <span className="stat-card__icon stat-card__icon--blue">
            <Files size={21} />
          </span>
          <div className="stat-card__body">
            <span className="stat-card__label">Documentos totales</span>
            <strong>{formatNumber(stats.total)}</strong>
            <span className="stat-card__hint">En las 3 gestiones académicas</span>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-card__icon stat-card__icon--indigo">
            <Inbox size={21} />
          </span>
          <div className="stat-card__body">
            <span className="stat-card__label">Correspondencia recibida</span>
            <strong>{formatNumber(stats.correspondencia)}</strong>
            <span className="stat-card__hint">Mesa de exámenes y cursos de verano</span>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-card__icon stat-card__icon--teal">
            <Building2 size={21} />
          </span>
          <div className="stat-card__body">
            <span className="stat-card__label">Carreras atendidas</span>
            <strong>{formatNumber(stats.careers)}</strong>
            <span className="stat-card__hint">Facultades y escuelas profesionales</span>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-card__icon stat-card__icon--amber">
            <CalendarRange size={21} />
          </span>
          <div className="stat-card__body">
            <span className="stat-card__label">Gestiones activas</span>
            <strong>3</strong>
            <span className="stat-card__hint">2023, 2024 y 2025</span>
          </div>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel__header">
            <div>
              <h2>Documentos por gestión</h2>
              <p>Distribución de registros según gestión y módulo.</p>
            </div>
            <span className="panel__tag">
              <CalendarRange size={14} />
              2023–2025
            </span>
          </div>

          <div className="module-legend">
            {MODULE_KEYS.map((module) => (
              <span key={module} className="legend-item">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: MODULE_META[module].accent }}
                />
                {MODULE_META[module].shortLabel}
              </span>
            ))}
          </div>

          <div className="bar-chart">
            <div className="bar-chart__grid" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            {yearData.map((year) => (
              <Link
                key={year.gestion}
                to={`/gestion/${year.gestion}`}
                className="bar-group"
                title={`Ver gestión ${year.gestion}`}
              >
                <span className="bar-group__value">{formatNumber(year.total)}</span>
                <div className="bar-group__track">
                  <div
                    className="bar-group__stack"
                    style={{
                      height: `${Math.max((year.total / maxYearTotal) * 100, year.total > 0 ? 8 : 0)}%`,
                    }}
                  >
                    {[...year.modules].reverse().map((item) =>
                      item.count > 0 ? (
                        <span
                          key={item.module}
                          className="bar-segment"
                          style={{
                            backgroundColor: MODULE_META[item.module].accent,
                            flexGrow: item.count,
                          }}
                          title={`${MODULE_META[item.module].label}: ${item.count}`}
                        />
                      ) : null,
                    )}
                  </div>
                </div>
                <span className="bar-group__label">Gestión {year.gestion}</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="panel distribution-panel">
          <div className="panel__header">
            <div>
              <h2>Distribución por módulo</h2>
              <p>Participación de cada módulo en el archivo total.</p>
            </div>
          </div>

          <div className="donut-wrap">
            <svg viewBox="0 0 140 140" className="donut" role="img" aria-label="Distribución de documentos por módulo">
              <circle cx="70" cy="70" r={donutRadius} fill="none" stroke="#e8eef8" strokeWidth="17" />
              {donutSegments.map((segment) => (
                <circle
                  key={segment.module}
                  cx="70"
                  cy="70"
                  r={donutRadius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="17"
                  strokeDasharray={`${segment.dash} ${donutCircumference - segment.dash}`}
                  strokeDashoffset={-segment.offset}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                />
              ))}
              <text x="70" y="66" textAnchor="middle" className="donut__value">
                {formatNumber(records.length)}
              </text>
              <text x="70" y="84" textAnchor="middle" className="donut__label">
                documentos
              </text>
            </svg>
          </div>

          <div className="donut-legend">
            {moduleTotals.map((item) => (
              <div className="donut-legend__row" key={item.module}>
                <span
                  className="legend-dot"
                  style={{ backgroundColor: item.meta.accent }}
                />
                <span className="donut-legend__name">{item.meta.label}</span>
                <strong>{formatNumber(item.count)}</strong>
                <span className="donut-legend__percent">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="gestiones-section" id="gestiones">
        <div className="section-heading">
          <div>
            <span className="section-heading__eyebrow">Archivo académico</span>
            <h2>Gestiones</h2>
            <p>Ingresa a una gestión para consultar y administrar sus cuatro módulos.</p>
          </div>
          <span className="section-heading__meta">
            <CalendarRange size={16} />
            3 gestiones habilitadas
          </span>
        </div>

        <div className="gestiones-grid">
          {yearData.map((year) => (
            <Link
              key={year.gestion}
              to={`/gestion/${year.gestion}`}
              className="gestion-card"
            >
              <div className="gestion-card__top">
                <div>
                  <span className="gestion-card__eyebrow">Gestión</span>
                  <h3>{year.gestion}</h3>
                </div>
                {year.gestion === 2025 ? (
                  <span className="pill pill--blue">Más reciente</span>
                ) : (
                  <span className="gestion-card__arrow">
                    <ArrowUpRight size={18} />
                  </span>
                )}
              </div>
              <div className="gestion-card__total">
                <strong>{formatNumber(year.total)}</strong>
                <span>documentos registrados</span>
              </div>
              <div className="gestion-card__modules">
                {year.modules.map((item) => (
                  <div className="gestion-card__module" key={item.module}>
                    <span
                      className="gestion-card__module-icon"
                      style={{
                        backgroundColor: MODULE_META[item.module].soft,
                        color: MODULE_META[item.module].accent,
                      }}
                    >
                      <ModuleIcon module={item.module} size={15} />
                    </span>
                    <span>{MODULE_META[item.module].shortLabel}</span>
                    <strong>{item.count}</strong>
                  </div>
                ))}
              </div>
              <span className="gestion-card__link">
                Abrir gestión
                <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-grid dashboard-grid--bottom">
        <article className="panel recent-panel">
          <div className="panel__header">
            <div>
              <h2>Actividad reciente</h2>
              <p>Últimos documentos registrados en el sistema.</p>
            </div>
            <span className="panel__tag">
              <Clock size={14} />
              Últimos 6
            </span>
          </div>

          {recentRecords.length > 0 ? (
            <div className="recent-list">
              {recentRecords.map((record) => {
                const meta = MODULE_META[record.module];
                return (
                  <Link to={recordPath(record)} key={record.id} className="recent-item">
                    <span
                      className="recent-item__icon"
                      style={{ backgroundColor: meta.soft, color: meta.accent }}
                    >
                      <ModuleIcon module={record.module} size={17} />
                    </span>
                    <div className="recent-item__body">
                      <p>{record.descripcion}</p>
                      <div className="recent-item__meta">
                        <span>{record.carrera}</span>
                        <span className="meta-dot" />
                        <span>{record.codigo}</span>
                      </div>
                    </div>
                    <div className="recent-item__side">
                      <span className="module-chip" style={{ color: meta.accent, backgroundColor: meta.soft }}>
                        {record.module === "correspondencia" && record.tipo
                          ? TIPO_META[record.tipo].label
                          : meta.shortLabel}
                      </span>
                      <span>{formatDateMedium(record.fechaRegistro)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="empty-inline">
              <p>No hay actividad registrada todavía.</p>
            </div>
          )}
        </article>

        <article className="panel correspondencia-panel">
          <div className="panel__header">
            <div>
              <h2>Correspondencia</h2>
              <p>Resumen de los documentos recibidos.</p>
            </div>
            <Link to={correspondenciaPath(2025)} className="panel__link" aria-label="Ver correspondencia de 2025">
              Ver todo
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="correspondencia-total">
            <span>Total recibido</span>
            <strong>{formatNumber(correspondenciaTotal)}</strong>
            <span>documentos en las 3 gestiones</span>
          </div>

          <div className="correspondencia-types">
            {correspondenciaSummary.map(({ tipo, count }) => {
              const percentage =
                correspondenciaTotal > 0 ? Math.round((count / correspondenciaTotal) * 100) : 0;
              return (
                <Link
                  key={tipo.key}
                  to={correspondenciaPath(2025, tipo.key)}
                  className="correspondencia-type"
                >
                  <span
                    className="correspondencia-type__icon"
                    style={{ backgroundColor: tipo.soft, color: tipo.accent }}
                  >
                    <TipoIcon tipo={tipo.key} size={18} />
                  </span>
                  <span className="correspondencia-type__body">
                    <span className="correspondencia-type__title">
                      {tipo.label}
                      <strong>{count}</strong>
                    </span>
                    <span className="progress-track">
                      <span
                        className="progress-fill"
                        style={{ width: `${percentage}%`, backgroundColor: tipo.accent }}
                      />
                    </span>
                  </span>
                  <span className="correspondencia-type__percent">{percentage}%</span>
                </Link>
              );
            })}
          </div>

          <div className="panel__footer-note">
            <Sparkles size={15} />
            Exporta cualquier listado a Word desde cada módulo.
          </div>
        </article>
      </section>

      <section className="dashboard-footer-note">
        <span>{formatDateLong()}</span>
        <span>Gestión documental académica · Datos almacenados localmente</span>
      </section>
    </div>
  );
}
