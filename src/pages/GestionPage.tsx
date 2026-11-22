import { useMemo, type CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CalendarRange,
  Clock,
  Inbox,
} from "lucide-react";
import {
  MODULE_KEYS,
  MODULE_META,
  TIPO_META,
  correspondenciaPath,
  isGestion,
  modulePath,
  recordPath,
  type Gestion,
} from "../types";
import { useRecords } from "../context/RecordsContext";
import { formatDateMedium, formatDateTime, formatNumber } from "../lib/format";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageHeading } from "../components/PageHeading";
import { ModuleIcon } from "../components/ModuleIcon";
import { EmptyState } from "../components/EmptyState";

export function GestionPage() {
  const { gestion: gestionParam } = useParams();
  const { records } = useRecords();

  if (!isGestion(gestionParam)) {
    return <Navigate to="/" replace />;
  }

  return <GestionContent gestion={Number(gestionParam) as Gestion} records={records} />;
}

function GestionContent({
  gestion,
  records,
}: {
  gestion: Gestion;
  records: ReturnType<typeof useRecords>["records"];
}) {
  const yearRecords = useMemo(
    () => records.filter((record) => record.gestion === gestion),
    [records, gestion],
  );

  const moduleStats = useMemo(
    () =>
      MODULE_KEYS.map((module) => {
        const moduleRecords = yearRecords.filter((record) => record.module === module);
        const latest = moduleRecords.reduce<string | null>((current, record) => {
          if (!current) return record.fechaRegistro;
          return record.fechaRegistro > current ? record.fechaRegistro : current;
        }, null);
        return {
          module,
          meta: MODULE_META[module],
          count: moduleRecords.length,
          latest,
          tipos:
            module === "correspondencia"
              ? Object.values(TIPO_META).map((tipo) => ({
                  tipo,
                  count: moduleRecords.filter((record) => record.tipo === tipo.key).length,
                }))
              : [],
        };
      }),
    [yearRecords],
  );

  const correspondenciaCount = yearRecords.filter(
    (record) => record.module === "correspondencia",
  ).length;
  const careersCount = new Set(yearRecords.map((record) => record.carrera)).size;
  const lastUpdate = yearRecords.reduce<string | null>((current, record) => {
    if (!current) return record.updatedAt;
    return record.updatedAt > current ? record.updatedAt : current;
  }, null);

  const recentRecords = useMemo(
    () =>
      [...yearRecords]
        .sort((a, b) => b.fechaRegistro.localeCompare(a.fechaRegistro))
        .slice(0, 5),
    [yearRecords],
  );

  return (
    <div className="page gestion-page">
      <Breadcrumbs items={[{ label: `Gestión ${gestion}` }]} />

      <PageHeading
        icon={<CalendarRange size={24} />}
        eyebrow={<span className="pill pill--blue">Archivo académico</span>}
        title={`Gestión ${gestion}`}
        description={`Consulta y administra los documentos correspondientes al periodo académico ${gestion}.`}
        actions={
          <>
            <Link to={correspondenciaPath(gestion)} className="btn btn--secondary">
              <Inbox size={17} />
              Correspondencia
            </Link>
            <a href="#modulos" className="btn btn--primary">
              Ver módulos
              <ArrowRight size={17} />
            </a>
          </>
        }
      />

      <section className="year-summary-grid" aria-label={`Resumen de la gestión ${gestion}`}>
        <article className="year-stat">
          <span className="year-stat__icon year-stat__icon--blue">
            <CalendarDays size={19} />
          </span>
          <div>
            <span>Documentos registrados</span>
            <strong>{formatNumber(yearRecords.length)}</strong>
          </div>
        </article>
        <article className="year-stat">
          <span className="year-stat__icon year-stat__icon--indigo">
            <Inbox size={19} />
          </span>
          <div>
            <span>Correspondencia recibida</span>
            <strong>{formatNumber(correspondenciaCount)}</strong>
          </div>
        </article>
        <article className="year-stat">
          <span className="year-stat__icon year-stat__icon--teal">
            <Building2 size={19} />
          </span>
          <div>
            <span>Carreras atendidas</span>
            <strong>{formatNumber(careersCount)}</strong>
          </div>
        </article>
        <article className="year-stat">
          <span className="year-stat__icon year-stat__icon--amber">
            <Clock size={19} />
          </span>
          <div>
            <span>Última actualización</span>
            <strong className="year-stat__date">
              {lastUpdate ? formatDateTime(lastUpdate) : "Sin registros"}
            </strong>
          </div>
        </article>
      </section>

      <section className="modules-section" id="modulos">
        <div className="section-heading">
          <div>
            <span className="section-heading__eyebrow">Módulos de la gestión</span>
            <h2>Secciones documentales</h2>
            <p>Selecciona un módulo para consultar, buscar y exportar sus registros.</p>
          </div>
        </div>

        <div className="modules-grid">
          {moduleStats.map((item) => {
            const isCorrespondencia = item.module === "correspondencia";
            const href = isCorrespondencia
              ? correspondenciaPath(gestion)
              : modulePath(gestion, item.module);

            return (
              <Link
                key={item.module}
                to={href}
                className="module-card"
                style={
                  {
                    "--module-accent": item.meta.accent,
                    "--module-soft": item.meta.soft,
                  } as CSSProperties
                }
              >
                <div className="module-card__top">
                  <span className="module-card__icon">
                    <ModuleIcon module={item.module} size={23} />
                  </span>
                  <span className="module-card__count">{formatNumber(item.count)}</span>
                </div>
                <h3>{item.meta.label}</h3>
                <p>{item.meta.description}</p>

                {isCorrespondencia ? (
                  <div className="module-card__split">
                    {item.tipos.map(({ tipo, count }) => (
                      <span key={tipo.key} className="split-item">
                        <span className="split-item__dot" style={{ backgroundColor: tipo.accent }} />
                        {tipo.label}
                        <strong>{count}</strong>
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="module-card__meta">
                    <span>Último registro</span>
                    <strong>
                      {item.latest ? formatDateMedium(item.latest) : "Sin registros"}
                    </strong>
                  </div>
                )}

                <span className="module-card__link">
                  Abrir módulo
                  <ArrowRight size={15} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="panel year-recent-panel">
        <div className="panel__header">
          <div>
            <h2>Últimos registros de la gestión</h2>
            <p>Los documentos más recientes incorporados al archivo de {gestion}.</p>
          </div>
          <Link to={correspondenciaPath(gestion)} className="panel__link">
            Ir a correspondencia
            <ArrowRight size={14} />
          </Link>
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
          <EmptyState
            title="Sin registros en esta gestión"
            description="Ingresa a uno de los módulos para agregar el primer documento de esta gestión."
          />
        )}
      </section>
    </div>
  );
}
