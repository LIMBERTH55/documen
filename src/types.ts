export const GESTIONES = [2023, 2024, 2025] as const;

export type Gestion = (typeof GESTIONES)[number];

export const MODULE_KEYS = [
  "dictamenes",
  "programaciones",
  "correspondencia",
  "auxiliatura",
] as const;

export type ModuleKey = (typeof MODULE_KEYS)[number];

export type TipoCorrespondencia = "examenes" | "cursos-verano";

export interface DocumentRecord {
  id: string;
  gestion: Gestion;
  module: ModuleKey;
  tipo?: TipoCorrespondencia;
  carrera: string;
  codigo: string;
  descripcion: string;
  fechaRegistro: string;
  createdAt: string;
  updatedAt: string;
}

export type RecordInput = Omit<DocumentRecord, "id" | "createdAt" | "updatedAt">;

export interface ModuleMeta {
  key: ModuleKey;
  label: string;
  shortLabel: string;
  description: string;
  accent: string;
  soft: string;
}

export interface TipoMeta {
  key: TipoCorrespondencia;
  label: string;
  singular: string;
  description: string;
  accent: string;
  soft: string;
}

export const MODULE_META: Record<ModuleKey, ModuleMeta> = {
  dictamenes: {
    key: "dictamenes",
    label: "Dictámenes",
    shortLabel: "Dictámenes",
    description: "Resoluciones, opiniones y actos académicos emitidos por la institución.",
    accent: "#2563eb",
    soft: "#eaf1ff",
  },
  programaciones: {
    key: "programaciones",
    label: "Programaciones Especiales",
    shortLabel: "Programaciones",
    description: "Cronogramas y programaciones académicas de carácter extraordinario.",
    accent: "#0891b2",
    soft: "#e7f8fb",
  },
  correspondencia: {
    key: "correspondencia",
    label: "Correspondencia Recibida",
    shortLabel: "Correspondencia",
    description: "Documentos recibidos de mesa de exámenes y cursos de verano.",
    accent: "#4f46e5",
    soft: "#eeedff",
  },
  auxiliatura: {
    key: "auxiliatura",
    label: "Auxiliatura",
    shortLabel: "Auxiliatura",
    description: "Designaciones, renovaciones y seguimiento de auxiliares de cátedra.",
    accent: "#0d9488",
    soft: "#e6f8f5",
  },
};

export const TIPO_META: Record<TipoCorrespondencia, TipoMeta> = {
  examenes: {
    key: "examenes",
    label: "Mesa de Exámenes",
    singular: "Exámenes",
    description:
      "Solicitudes, actas e informes vinculados a evaluaciones y exámenes académicos.",
    accent: "#2563eb",
    soft: "#eaf1ff",
  },
  "cursos-verano": {
    key: "cursos-verano",
    label: "Cursos de Verano",
    singular: "Cursos de Verano",
    description:
      "Inscripciones, aperturas y convalidaciones de cursos desarrollados en verano.",
    accent: "#d97706",
    soft: "#fff5e5",
  },
};

export const CAREERS = [
  "Administración de Empresas",
  "Arquitectura",
  "Comunicación Social",
  "Contabilidad",
  "Derecho",
  "Economía",
  "Educación Primaria",
  "Enfermería",
  "Ingeniería Civil",
  "Ingeniería de Sistemas",
  "Medicina Humana",
  "Psicología",
];

export const INSTITUTION = {
  name: "Universidad Nacional",
  area: "Vicerrectorado Académico",
  office: "Oficina de Gestión Documental",
  system: "Sistema de Gestión Documental Académica",
  location: "Lima, Perú",
};

export function isGestion(value: string | undefined): value is `${Gestion}` {
  return GESTIONES.some((gestion) => String(gestion) === value);
}

export function isModuleKey(value: string | undefined): value is ModuleKey {
  return MODULE_KEYS.some((moduleKey) => moduleKey === value);
}

export function isTipoCorrespondencia(
  value: string | undefined,
): value is TipoCorrespondencia {
  return value === "examenes" || value === "cursos-verano";
}

export function getGestionNumber(gestion: Gestion | number): Gestion {
  return Number(gestion) as Gestion;
}

export function modulePath(gestion: Gestion | number, module: ModuleKey): string {
  return `/gestion/${gestion}/${module}`;
}

export function correspondenciaPath(
  gestion: Gestion | number,
  tipo?: TipoCorrespondencia,
): string {
  const base = `/gestion/${gestion}/correspondencia`;
  return tipo ? `${base}/${tipo}` : base;
}

export function recordPath(record: DocumentRecord): string {
  if (record.module === "correspondencia" && record.tipo) {
    return correspondenciaPath(record.gestion, record.tipo);
  }
  return modulePath(record.gestion, record.module);
}

export function getModuleLabel(
  module: ModuleKey,
  tipo?: TipoCorrespondencia,
): string {
  if (module === "correspondencia" && tipo) {
    return TIPO_META[tipo].label;
  }
  return MODULE_META[module].label;
}
