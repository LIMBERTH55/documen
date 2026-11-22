import { useMemo, useState } from "react";
import { Link, Navigate, NavLink, useParams } from "react-router-dom";
import {
  Building2,
  CalendarDays,
  Clock,
  Download,
  Loader2,
  Plus,
} from "lucide-react";
import {
  MODULE_META,
  TIPO_META,
  correspondenciaPath,
  getModuleLabel,
  isGestion,
  isModuleKey,
  isTipoCorrespondencia,
  modulePath,
  type Gestion,
  type ModuleKey,
  type RecordInput,
  type TipoCorrespondencia,
  type DocumentRecord,
} from "../types";
import { useRecords } from "../context/RecordsContext";
import { useToast } from "../context/ToastContext";
import { formatDateTime, formatNumber } from "../lib/format";
import { useRecordExplorer } from "../hooks/useRecordExplorer";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageHeading } from "../components/PageHeading";
import { ModuleIcon, TipoIcon } from "../components/ModuleIcon";
import { RecordsTable } from "../components/RecordsTable";
import { Modal } from "../components/Modal";
import { RecordForm } from "../components/RecordForm";
import { ConfirmDialog } from "../components/ConfirmDialog";

const FORM_ID = "record-form";

export function ModulePage() {
  const { gestion: gestionParam, moduleKey, tipo: tipoParam } = useParams();
  const { records } = useRecords();

  const resolvedModule = moduleKey ?? (tipoParam ? "correspondencia" : undefined);

  if (!isGestion(gestionParam) || !isModuleKey(resolvedModule)) {
    return <Navigate to="/" replace />;
  }

  const gestion = Number(gestionParam) as Gestion;
  const module = resolvedModule;

  if (module === "correspondencia") {
    if (!isTipoCorrespondencia(tipoParam)) {
      return <Navigate to={correspondenciaPath(gestion)} replace />;
    }
  } else if (tipoParam) {
    return <Navigate to={modulePath(gestion, module)} replace />;
  }

  const tipo = module === "correspondencia" && isTipoCorrespondencia(tipoParam)
    ? tipoParam
    : undefined;

  return (
    <ModuleContent
      gestion={gestion}
      module={module}
      tipo={tipo}
      records={records}
    />
  );
}

function ModuleContent({
  gestion,
  module,
  tipo,
  records,
}: {
  gestion: Gestion;
  module: ModuleKey;
  tipo?: TipoCorrespondencia;
  records: DocumentRecord[];
}) {
  const { addRecord, updateRecord, deleteRecord } = useRecords();
  const { showToast } = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DocumentRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DocumentRecord | null>(null);
  const [exporting, setExporting] = useState(false);

  const isCorrespondencia = module === "correspondencia";
  const moduleMeta = MODULE_META[module];
  const tipoMeta = tipo ? TIPO_META[tipo] : null;
  const title = isCorrespondencia && tipoMeta ? tipoMeta.label : moduleMeta.label;
  const description =
    isCorrespondencia && tipoMeta ? tipoMeta.description : moduleMeta.description;

  const moduleRecords = useMemo(
    () =>
      records.filter((record) => {
        if (record.gestion !== gestion || record.module !== module) return false;
        if (isCorrespondencia) return record.tipo === tipo;
        return true;
      }),
    [records, gestion, module, tipo, isCorrespondencia],
  );

  const explorer = useRecordExplorer(moduleRecords);

  const careerCount = new Set(moduleRecords.map((record) => record.carrera)).size;
  const lastUpdate = moduleRecords.reduce<string | null>((current, record) => {
    if (!current) return record.updatedAt;
    return record.updatedAt > current ? record.updatedAt : current;
  }, null);

  const typeCounts = useMemo(() => {
    if (!isCorrespondencia) return [];
    return Object.values(TIPO_META).map((item) => ({
      tipo: item,
      count: records.filter(
        (record) =>
          record.gestion === gestion &&
          record.module === "correspondencia" &&
          record.tipo === item.key,
      ).length,
    }));
  }, [records, gestion, isCorrespondencia]);

  function openCreate() {
    setEditingRecord(null);
    setFormOpen(true);
  }

  function openEdit(record: DocumentRecord) {
    setEditingRecord(record);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingRecord(null);
  }

  function handleSubmit(input: RecordInput) {
    if (editingRecord) {
      updateRecord(editingRecord.id, input);
      showToast("El registro se actualizó correctamente.");
    } else {
      addRecord(input);
      showToast("El registro se agregó correctamente.");
    }
    closeForm();
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteRecord(deleteTarget.id);
    showToast("El registro se eliminó correctamente.", "info");
    setDeleteTarget(null);
  }

  async function handleExport() {
    setExporting(true);
    try {
      const { exportRecordsToWord } = await import("../lib/wordExport");
      await exportRecordsToWord({
        gestion,
        module,
        tipo,
        records: explorer.filteredRecords,
        totalRecords: explorer.totalRecords,
        filtersApplied: explorer.hasFilters,
      });
      showToast(
        `Documento Word generado con ${explorer.filteredRecords.length} ${
          explorer.filteredRecords.length === 1 ? "registro" : "registros"
        }.`,
      );
    } catch {
      showToast("No se pudo generar el documento Word. Inténtalo nuevamente.", "error");
    } finally {
      setExporting(false);
    }
  }

  const icon = isCorrespondencia && tipo ? (
    <TipoIcon tipo={tipo} size={24} />
  ) : (
    <ModuleIcon module={module} size={24} />
  );

  const breadcrumbItems = [
    { label: `Gestión ${gestion}`, to: `/gestion/${gestion}` },
    ...(isCorrespondencia
      ? [
          { label: "Correspondencia Recibida", to: correspondenciaPath(gestion) },
          { label: title },
        ]
      : [{ label: title }]),
  ];

  return (
    <div className="page module-page">
      <Breadcrumbs items={breadcrumbItems} />

      <PageHeading
        icon={icon}
        eyebrow={
          <span className="page-heading__pills">
            <span className="pill pill--blue">Gestión {gestion}</span>
            {isCorrespondencia && tipoMeta ? (
              <span
                className="pill"
                style={{ color: tipoMeta.accent, backgroundColor: tipoMeta.soft }}
              >
                {tipoMeta.singular}
              </span>
            ) : null}
          </span>
        }
        title={title}
        description={description}
        actions={
          <>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 size={17} className="spin" />
              ) : (
                <Download size={17} />
              )}
              {exporting ? "Generando..." : "Exportar Word"}
            </button>
            <button type="button" className="btn btn--primary" onClick={openCreate}>
              <Plus size={17} />
              Nuevo registro
            </button>
          </>
        }
      />

      {isCorrespondencia ? (
        <nav className="segment-tabs" aria-label="Tipos de correspondencia">
          {typeCounts.map(({ tipo: item, count }) => (
            <NavLink
              key={item.key}
              to={correspondenciaPath(gestion, item.key)}
              className={({ isActive }) => `segment-tab ${isActive ? "is-active" : ""}`}
              style={
                item.key === tipo
                  ? { borderColor: item.accent, color: item.accent }
                  : undefined
              }
            >
              <TipoIcon tipo={item.key} size={16} />
              {item.label}
              <span className="segment-tab__count">{count}</span>
            </NavLink>
          ))}
        </nav>
      ) : null}

      <section className="module-summary" aria-label="Resumen del módulo">
        <article className="module-summary__item">
          <span className="module-summary__icon module-summary__icon--blue">
            <CalendarDays size={18} />
          </span>
          <div>
            <span>Registros totales</span>
            <strong>{formatNumber(moduleRecords.length)}</strong>
          </div>
        </article>
        <article className="module-summary__item">
          <span className="module-summary__icon module-summary__icon--teal">
            <Building2 size={18} />
          </span>
          <div>
            <span>Carreras o facultades</span>
            <strong>{formatNumber(careerCount)}</strong>
          </div>
        </article>
        <article className="module-summary__item module-summary__item--wide">
          <span className="module-summary__icon module-summary__icon--amber">
            <Clock size={18} />
          </span>
          <div>
            <span>Última actualización</span>
            <strong className="module-summary__date">
              {lastUpdate ? formatDateTime(lastUpdate) : "Sin registros"}
            </strong>
          </div>
        </article>
        {isCorrespondencia && tipoMeta ? (
          <Link to={correspondenciaPath(gestion)} className="module-summary__back">
            Ver ambas opciones
          </Link>
        ) : (
          <Link to={`/gestion/${gestion}`} className="module-summary__back">
            Volver a la gestión
          </Link>
        )}
      </section>

      <RecordsTable
        explorer={explorer}
        onAdd={openCreate}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editingRecord ? "Editar registro" : "Nuevo registro"}
        description={
          editingRecord
            ? `Actualiza la información del registro ${editingRecord.codigo}.`
            : `Completa los datos para incorporar un documento a ${getModuleLabel(module, tipo)} de la gestión ${gestion}.`
        }
        size="lg"
        footer={
          <>
            <button type="button" className="btn btn--secondary" onClick={closeForm}>
              Cancelar
            </button>
            <button type="submit" form={FORM_ID} className="btn btn--primary">
              {editingRecord ? "Guardar cambios" : "Registrar documento"}
            </button>
          </>
        }
      >
        <RecordForm
          key={editingRecord?.id ?? "new"}
          formId={FORM_ID}
          module={module}
          initialRecord={editingRecord}
          defaultGestion={gestion}
          defaultTipo={tipo}
          onSubmit={handleSubmit}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar registro"
        message={
          deleteTarget
            ? `¿Estás seguro de eliminar el registro "${deleteTarget.codigo}" de ${deleteTarget.carrera}? Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Sí, eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
