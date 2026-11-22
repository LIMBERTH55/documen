import { useMemo, type CSSProperties } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Inbox,
  Layers3,
} from "lucide-react";
import {
  TIPO_META,
  correspondenciaPath,
  isGestion,
  recordPath,
  type Gestion,
} from "../types";
import { useRecords } from "../context/RecordsContext";
import { formatDateMedium, formatNumber } from "../lib/format";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageHeading } from "../components/PageHeading";
import { TipoIcon } from "../components/ModuleIcon";
import { EmptyState } from "../components/EmptyState";

export function CorrespondenciaPage() {
  const { gestion: gestionParam } = useParams();
  const { records } = useRecords();

  if (!isGestion(gestionParam)) {
    return <Navigate to="/" replace />;
  }

  return (
    <CorrespondenciaContent
      gestion={Number(gestionParam) as Gestion}
      records={records}
    />
  );
}

function CorrespondenciaContent({
  gestion,
  records,
}: {
  gestion: Gestion;
  records: ReturnType<typeof useRecords>["records"];
}) {
  const correspondenciaRecords = useMemo(
    () =>
      records.filter(
        (record) => record.gestion === gestion && record.module === "correspondencia",
      ),
    [records, gestion],
  );

  const optionData = useMemo(
    () =>
      Object.values(TIPO_META).map((tipo) => {
        const tipoRecords = correspondenciaRecords.filter(
          (record) => record.tipo === tipo.key,
        );
        const careers = new Set(tipoRecords.map((record) => record.carrera)).size;
        const latest = tipoRecords.reduce<string | null>((current, record) => {
          if (!current) return record.fechaRegistro;
          return record.fechaRegistro > current ? record.fechaRegistro : current;
        }, null);

        return { tipo, records: tipoRecords, count: tipoRecords.length, careers, latest };
      }),
    [correspondenciaRecords],
  );

  const recentRecords = useMemo(
    () =>
      [...correspondenciaRecords]
        .sort((a, b) => b.fechaRegistro.localeCompare(a.fechaRegistro))
        .slice(0, 5),
    [correspondenciaRecords],
  );

  return (
    <div className="page correspondencia-page">
      <Breadcrumbs
        items={[
          { label: `Gestión ${gestion}`, to: `/gestion/${gestion}` },
          { label: "Correspondencia Recibida" },
        ]}
      />

      <PageHeading
        icon={<Inbox size={24} />}
        eyebrow={<span className="pill pill--blue">Gestión {gestion}</span>}
        title="Correspondencia Recibida"
        description="Selecciona el tipo de correspondencia para consultar los documentos recibidos, registrarlos y exportarlos."
        actions={
          <Link to={`/gestion/${gestion}`} className="btn btn--secondary">
            <ArrowLeft size={17} />
            Volver a la gestión
          </Link>
        }
      />

      <div className="correspondencia-banner">
        <span className="correspondencia-banner__icon">
          <Layers3 size={22} />
        </span>
        <div>
          <strong>Dos tipos de correspondencia</strong>
          <p>
            Los documentos se organizan en <b>Mesa de Exámenes</b> y{" "}
            <b>Cursos de Verano</b>. Ingresa a cualquiera de las opciones para ver su tabla
            de registros.
          </p>
        </div>
        <span className="correspondencia-banner__total">
          <strong>{formatNumber(correspondenciaRecords.length)}</strong>
          <span>registros recibidos</span>
        </span>
      </div>

      <section className="correspondencia-options" aria-label="Tipos de correspondencia">
        {optionData.map(({ tipo, count, careers, latest }, index) => (
          <Link
            key={tipo.key}
            to={correspondenciaPath(gestion, tipo.key)}
            className="correspondencia-option"
            style={
              {
                "--option-accent": tipo.accent,
                "--option-soft": tipo.soft,
                "--option-index": index,
              } as CSSProperties
            }
          >
            <span className="correspondencia-option__watermark" aria-hidden="true">
              <TipoIcon tipo={tipo.key} size={160} strokeWidth={1.2} />
            </span>
            <div className="correspondencia-option__top">
              <span className="correspondencia-option__icon">
                <TipoIcon tipo={tipo.key} size={30} strokeWidth={1.9} />
              </span>
              <span className="correspondencia-option__number">0{index + 1}</span>
            </div>
            <h2>{tipo.label}</h2>
            <p>{tipo.description}</p>
            <div className="correspondencia-option__stats">
              <span>
                <strong>{formatNumber(count)}</strong>
                registros
              </span>
              <span>
                <strong>{formatNumber(careers)}</strong>
                carreras
              </span>
              <span>
                <strong>{latest ? formatDateMedium(latest) : "—"}</strong>
                último registro
              </span>
            </div>
            <span className="correspondencia-option__cta">
              Ingresar a {tipo.label}
              <ArrowRight size={17} />
            </span>
          </Link>
        ))}
      </section>

      <section className="panel">
        <div className="panel__header">
          <div>
            <h2>Últimos documentos recibidos</h2>
            <p>Actividad reciente de correspondencia en la gestión {gestion}.</p>
          </div>
          <span className="panel__tag">
            <CalendarDays size={14} />
            Gestión {gestion}
          </span>
        </div>

        {recentRecords.length > 0 ? (
          <div className="recent-list">
            {recentRecords.map((record) => {
              const tipoMeta = record.tipo ? TIPO_META[record.tipo] : null;
              return (
                <Link to={recordPath(record)} key={record.id} className="recent-item">
                  <span
                    className="recent-item__icon"
                    style={
                      tipoMeta
                        ? { backgroundColor: tipoMeta.soft, color: tipoMeta.accent }
                        : undefined
                    }
                  >
                    {record.tipo ? (
                      <TipoIcon tipo={record.tipo} size={17} />
                    ) : (
                      <Inbox size={17} />
                    )}
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
                    <span
                      className="module-chip"
                      style={
                        tipoMeta
                          ? { color: tipoMeta.accent, backgroundColor: tipoMeta.soft }
                          : undefined
                      }
                    >
                      {tipoMeta?.label ?? "Correspondencia"}
                    </span>
                    <span>{formatDateMedium(record.fechaRegistro)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Sin correspondencia registrada"
            description="Ingresa a Mesa de Exámenes o Cursos de Verano para agregar el primer documento."
          />
        )}
      </section>

      <div className="correspondencia-tip">
        <Building2 size={18} />
        <p>
          Cada registro incluye la carrera o facultad, el número de dictamen o código, la
          descripción y la fecha de registro. Puedes buscar por cualquiera de esos campos.
        </p>
      </div>
    </div>
  );
}
