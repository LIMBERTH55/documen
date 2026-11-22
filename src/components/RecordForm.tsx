import { useState, type FormEvent } from "react";
import { AlertCircle, CalendarDays, Hash, Landmark } from "lucide-react";
import {
  CAREERS,
  GESTIONES,
  TIPO_META,
  type DocumentRecord,
  type Gestion,
  type ModuleKey,
  type RecordInput,
  type TipoCorrespondencia,
} from "../types";
import { getTodayInputValue } from "../lib/format";

interface RecordFormProps {
  formId: string;
  module: ModuleKey;
  initialRecord?: DocumentRecord | null;
  defaultGestion: Gestion;
  defaultTipo?: TipoCorrespondencia;
  onSubmit: (input: RecordInput) => void;
}

interface FormState {
  gestion: Gestion;
  tipo: TipoCorrespondencia;
  carrera: string;
  codigo: string;
  descripcion: string;
  fechaRegistro: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export function RecordForm({
  formId,
  module,
  initialRecord,
  defaultGestion,
  defaultTipo,
  onSubmit,
}: RecordFormProps) {
  const isCorrespondencia = module === "correspondencia";
  const [values, setValues] = useState<FormState>({
    gestion: initialRecord?.gestion ?? defaultGestion,
    tipo: initialRecord?.tipo ?? defaultTipo ?? "examenes",
    carrera: initialRecord?.carrera ?? "",
    codigo: initialRecord?.codigo ?? "",
    descripcion: initialRecord?.descripcion ?? "",
    fechaRegistro: initialRecord?.fechaRegistro ?? getTodayInputValue(),
  });
  const [errors, setErrors] = useState<FormErrors>({});

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (!values.gestion) nextErrors.gestion = "Selecciona una gestión.";
    if (values.carrera.trim().length < 2) {
      nextErrors.carrera = "Ingresa la carrera o facultad.";
    }
    if (values.codigo.trim().length < 2) {
      nextErrors.codigo = "Ingresa el número de dictamen o código.";
    }
    if (values.descripcion.trim().length < 5) {
      nextErrors.descripcion = "Describe el documento con al menos 5 caracteres.";
    }
    if (!values.fechaRegistro) {
      nextErrors.fechaRegistro = "Selecciona la fecha de registro.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      gestion: values.gestion,
      module,
      ...(isCorrespondencia ? { tipo: values.tipo } : {}),
      carrera: values.carrera,
      codigo: values.codigo,
      descripcion: values.descripcion,
      fechaRegistro: values.fechaRegistro,
    });
  }

  const gestionField = (
    <label className="form-field" htmlFor={`${formId}-gestion`}>
      <span className="form-label">
        Gestión <em>*</em>
      </span>
      <span className="form-control">
        <CalendarDays size={16} className="form-control__icon" aria-hidden="true" />
        <select
          id={`${formId}-gestion`}
          value={values.gestion}
          onChange={(event) => updateField("gestion", Number(event.target.value) as Gestion)}
          autoFocus
        >
          {GESTIONES.map((gestion) => (
            <option key={gestion} value={gestion}>
              Gestión {gestion}
            </option>
          ))}
        </select>
      </span>
      {errors.gestion ? <span className="form-error">{errors.gestion}</span> : null}
    </label>
  );

  const tipoField = (
    <label className="form-field" htmlFor={`${formId}-tipo`}>
      <span className="form-label">
        Tipo <em>*</em>
      </span>
      <span className="form-control">
        <select
          id={`${formId}-tipo`}
          value={values.tipo}
          onChange={(event) => updateField("tipo", event.target.value as TipoCorrespondencia)}
        >
          {Object.values(TIPO_META).map((tipo) => (
            <option key={tipo.key} value={tipo.key}>
              {tipo.singular}
            </option>
          ))}
        </select>
      </span>
      {errors.tipo ? <span className="form-error">{errors.tipo}</span> : null}
    </label>
  );

  const fechaField = (
    <label className="form-field" htmlFor={`${formId}-fecha`}>
      <span className="form-label">
        Fecha de registro <em>*</em>
      </span>
      <span className="form-control">
        <CalendarDays size={16} className="form-control__icon" aria-hidden="true" />
        <input
          id={`${formId}-fecha`}
          type="date"
          value={values.fechaRegistro}
          onChange={(event) => updateField("fechaRegistro", event.target.value)}
        />
      </span>
      {errors.fechaRegistro ? <span className="form-error">{errors.fechaRegistro}</span> : null}
    </label>
  );

  return (
    <form id={formId} className="record-form" onSubmit={handleSubmit} noValidate>
      <div className="form-note">
        <span>
          Los campos marcados con <strong>*</strong> son obligatorios.
        </span>
        {isCorrespondencia ? (
          <span>
            Tipo seleccionado: <strong>{TIPO_META[values.tipo].label}</strong>
          </span>
        ) : null}
      </div>

      <div className="form-grid">
        {gestionField}
        {isCorrespondencia ? tipoField : fechaField}

        <label className="form-field form-field--full" htmlFor={`${formId}-carrera`}>
          <span className="form-label">
            Carrera o facultad <em>*</em>
          </span>
          <span className="form-control">
            <Landmark size={16} className="form-control__icon" aria-hidden="true" />
            <input
              id={`${formId}-carrera`}
              type="text"
              value={values.carrera}
              onChange={(event) => updateField("carrera", event.target.value)}
              placeholder="Ej. Ingeniería de Sistemas"
              list={`${formId}-carreras`}
              autoComplete="off"
            />
          </span>
          <datalist id={`${formId}-carreras`}>
            {CAREERS.map((career) => (
              <option key={career} value={career} />
            ))}
          </datalist>
          {errors.carrera ? (
            <span className="form-error">
              <AlertCircle size={13} />
              {errors.carrera}
            </span>
          ) : null}
        </label>

        <label
          className={`form-field ${isCorrespondencia ? "" : "form-field--full"}`}
          htmlFor={`${formId}-codigo`}
        >
          <span className="form-label">
            Nro. de dictamen o código <em>*</em>
          </span>
          <span className="form-control">
            <Hash size={16} className="form-control__icon" aria-hidden="true" />
            <input
              id={`${formId}-codigo`}
              type="text"
              value={values.codigo}
              onChange={(event) => updateField("codigo", event.target.value)}
              placeholder="Ej. MEX-2025-041"
              autoComplete="off"
            />
          </span>
          {errors.codigo ? (
            <span className="form-error">
              <AlertCircle size={13} />
              {errors.codigo}
            </span>
          ) : (
            <span className="form-hint">
              Puede ser el número de dictamen, expediente o código interno.
            </span>
          )}
        </label>

        {isCorrespondencia ? fechaField : null}

        <label className="form-field form-field--full" htmlFor={`${formId}-descripcion`}>
          <span className="form-label">
            Descripción <em>*</em>
          </span>
          <span className="form-control form-control--textarea">
            <textarea
              id={`${formId}-descripcion`}
              value={values.descripcion}
              onChange={(event) => updateField("descripcion", event.target.value)}
              placeholder="Describe brevemente el contenido o asunto del documento..."
              rows={4}
              maxLength={600}
            />
          </span>
          <span className="form-meta-row">
            {errors.descripcion ? (
              <span className="form-error">
                <AlertCircle size={13} />
                {errors.descripcion}
              </span>
            ) : (
              <span className="form-hint">Sé claro y preciso para facilitar futuras búsquedas.</span>
            )}
            <span className="char-count">{values.descripcion.length}/600</span>
          </span>
        </label>
      </div>
    </form>
  );
}
