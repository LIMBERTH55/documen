import type {
  DocumentRecord,
  Gestion,
  ModuleKey,
  TipoCorrespondencia,
} from "../types";

type SeedRow = [
  gestion: Gestion,
  module: ModuleKey,
  tipo: TipoCorrespondencia | null,
  carrera: string,
  codigo: string,
  descripcion: string,
  fechaRegistro: string,
];

const seedRows: SeedRow[] = [
  // Gestión 2023 · Dictámenes
  [2023, "dictamenes", null, "Derecho", "DIC-2023-001", "Aprobación del plan de estudios 2023 de la Escuela Profesional de Derecho.", "2023-02-14"],
  [2023, "dictamenes", null, "Ingeniería de Sistemas", "DIC-2023-014", "Dictamen favorable para la actualización curricular de la carrera de Ingeniería de Sistemas.", "2023-04-21"],
  [2023, "dictamenes", null, "Medicina Humana", "DIC-2023-027", "Ratificación del dictamen de convalidación de asignaturas del semestre 2023-I.", "2023-06-08"],
  [2023, "dictamenes", null, "Administración de Empresas", "DIC-2023-039", "Aprobación del informe de evaluación de prácticas preprofesionales.", "2023-09-18"],
  [2023, "dictamenes", null, "Psicología", "DIC-2023-052", "Dictamen sobre la modificación del sílabo del curso de Psicometría.", "2023-11-27"],
  // Gestión 2023 · Programaciones Especiales
  [2023, "programaciones", null, "Ingeniería Civil", "PE-2023-003", "Programación especial de exámenes extraordinarios del semestre 2023-I.", "2023-03-10"],
  [2023, "programaciones", null, "Educación Primaria", "PE-2023-011", "Cronograma de nivelación académica para estudiantes ingresantes.", "2023-05-16"],
  [2023, "programaciones", null, "Contabilidad", "PE-2023-024", "Programación de talleres de actualización profesional para docentes.", "2023-08-22"],
  [2023, "programaciones", null, "Enfermería", "PE-2023-031", "Calendario de prácticas hospitalarias del semestre 2023-II.", "2023-10-05"],
  // Gestión 2023 · Correspondencia · Mesa de Exámenes
  [2023, "correspondencia", "examenes", "Arquitectura", "MEX-2023-004", "Solicitud de revisión del examen final del curso de Taller de Diseño III.", "2023-01-25"],
  [2023, "correspondencia", "examenes", "Derecho", "MEX-2023-018", "Remisión de actas de evaluación del primer periodo académico.", "2023-04-12"],
  [2023, "correspondencia", "examenes", "Ingeniería de Sistemas", "MEX-2023-026", "Solicitud de examen de aplazamiento del curso de Base de Datos.", "2023-07-19"],
  [2023, "correspondencia", "examenes", "Medicina Humana", "MEX-2023-041", "Informe de exámenes de recuperación del semestre 2023-I.", "2023-10-30"],
  [2023, "correspondencia", "examenes", "Contabilidad", "MEX-2023-053", "Solicitud de revisión de calificación del curso de Auditoría Financiera.", "2023-12-11"],
  // Gestión 2023 · Correspondencia · Cursos de Verano
  [2023, "correspondencia", "cursos-verano", "Psicología", "CVR-2023-002", "Inscripción de estudiantes al curso de verano de Estadística para la Investigación.", "2023-01-09"],
  [2023, "correspondencia", "cursos-verano", "Ingeniería Civil", "CVR-2023-010", "Apertura del curso de verano de Topografía Aplicada.", "2023-02-02"],
  [2023, "correspondencia", "cursos-verano", "Educación Primaria", "CVR-2023-017", "Solicitud de convalidación del curso de verano de Didáctica de la Lectura.", "2023-02-20"],
  // Gestión 2023 · Auxiliatura
  [2023, "auxiliatura", null, "Ingeniería de Sistemas", "AUX-2023-006", "Designación de auxiliar de cátedra para el curso de Programación Orientada a Objetos.", "2023-03-01"],
  [2023, "auxiliatura", null, "Contabilidad", "AUX-2023-015", "Renovación de auxiliar de cátedra del curso de Contabilidad General.", "2023-06-14"],
  [2023, "auxiliatura", null, "Derecho", "AUX-2023-022", "Solicitud de apoyo académico para el curso de Derecho Constitucional.", "2023-09-07"],
  [2023, "auxiliatura", null, "Enfermería", "AUX-2023-029", "Evaluación de desempeño de auxiliar de cátedra del curso de Anatomía.", "2023-11-20"],

  // Gestión 2024 · Dictámenes
  [2024, "dictamenes", null, "Medicina Humana", "DIC-2024-003", "Aprobación del expediente de titulación de la Escuela Profesional de Medicina Humana.", "2024-01-18"],
  [2024, "dictamenes", null, "Arquitectura", "DIC-2024-016", "Dictamen favorable para la acreditación de la carrera de Arquitectura.", "2024-03-27"],
  [2024, "dictamenes", null, "Ingeniería de Sistemas", "DIC-2024-028", "Aprobación de la modificación del plan curricular en transformación digital.", "2024-06-11"],
  [2024, "dictamenes", null, "Administración de Empresas", "DIC-2024-044", "Ratificación del dictamen de equivalencia de estudios internacionales.", "2024-09-23"],
  [2024, "dictamenes", null, "Comunicación Social", "DIC-2024-057", "Aprobación del informe de autoevaluación de la carrera.", "2024-11-15"],
  // Gestión 2024 · Programaciones Especiales
  [2024, "programaciones", null, "Derecho", "PE-2024-005", "Programación de seminarios de actualización en derecho procesal.", "2024-02-08"],
  [2024, "programaciones", null, "Ingeniería Civil", "PE-2024-013", "Cronograma de evaluaciones de laboratorio del semestre 2024-I.", "2024-04-17"],
  [2024, "programaciones", null, "Educación Primaria", "PE-2024-026", "Programación especial de recuperación académica para estudiantes.", "2024-08-29"],
  [2024, "programaciones", null, "Psicología", "PE-2024-038", "Calendario de talleres de bienestar universitario.", "2024-10-14"],
  // Gestión 2024 · Correspondencia · Mesa de Exámenes
  [2024, "correspondencia", "examenes", "Ingeniería de Sistemas", "MEX-2024-007", "Solicitud de revisión de examen parcial del curso de Redes de Computadoras.", "2024-01-30"],
  [2024, "correspondencia", "examenes", "Contabilidad", "MEX-2024-019", "Remisión de actas de examen de suficiencia profesional.", "2024-04-05"],
  [2024, "correspondencia", "examenes", "Medicina Humana", "MEX-2024-031", "Informe de evaluación de competencias clínicas.", "2024-07-22"],
  [2024, "correspondencia", "examenes", "Derecho", "MEX-2024-046", "Solicitud de examen extraordinario del curso de Derecho Penal.", "2024-10-09"],
  [2024, "correspondencia", "examenes", "Enfermería", "MEX-2024-059", "Solicitud de revisión de calificación del curso de Salud Pública.", "2024-12-03"],
  // Gestión 2024 · Correspondencia · Cursos de Verano
  [2024, "correspondencia", "cursos-verano", "Arquitectura", "CVR-2024-004", "Inscripción al curso de verano de Modelado BIM.", "2024-01-12"],
  [2024, "correspondencia", "cursos-verano", "Administración de Empresas", "CVR-2024-012", "Apertura del curso de verano de Gestión de Proyectos.", "2024-02-06"],
  [2024, "correspondencia", "cursos-verano", "Ingeniería de Sistemas", "CVR-2024-021", "Solicitud de convalidación del curso de verano de Ciencia de Datos.", "2024-02-23"],
  // Gestión 2024 · Auxiliatura
  [2024, "auxiliatura", null, "Medicina Humana", "AUX-2024-008", "Designación de auxiliar de cátedra del curso de Fisiología Humana.", "2024-03-05"],
  [2024, "auxiliatura", null, "Educación Primaria", "AUX-2024-017", "Renovación de auxiliar de cátedra para el curso de Matemática Básica.", "2024-06-18"],
  [2024, "auxiliatura", null, "Ingeniería Civil", "AUX-2024-025", "Solicitud de auxiliar de laboratorio para el curso de Mecánica de Suelos.", "2024-09-02"],
  [2024, "auxiliatura", null, "Comunicación Social", "AUX-2024-034", "Evaluación de desempeño de auxiliar de cátedra del curso de Redacción Periodística.", "2024-11-25"],

  // Gestión 2025 · Dictámenes
  [2025, "dictamenes", null, "Ingeniería de Sistemas", "DIC-2025-001", "Aprobación del plan de trabajo de transformación digital académica.", "2025-01-15"],
  [2025, "dictamenes", null, "Derecho", "DIC-2025-009", "Dictamen favorable para la creación del consultorio jurídico gratuito.", "2025-03-06"],
  [2025, "dictamenes", null, "Medicina Humana", "DIC-2025-021", "Aprobación del protocolo de prácticas clínicas 2025.", "2025-05-20"],
  [2025, "dictamenes", null, "Administración de Empresas", "DIC-2025-034", "Ratificación del dictamen de convalidación de estudios de posgrado.", "2025-08-12"],
  [2025, "dictamenes", null, "Arquitectura", "DIC-2025-048", "Dictamen sobre la actualización del plan de estudios de Arquitectura.", "2025-10-28"],
  [2025, "dictamenes", null, "Psicología", "DIC-2025-055", "Aprobación del informe de seguimiento al egresado.", "2025-12-02"],
  // Gestión 2025 · Programaciones Especiales
  [2025, "programaciones", null, "Contabilidad", "PE-2025-002", "Programación de exámenes de suficiencia profesional del periodo 2025-I.", "2025-02-11"],
  [2025, "programaciones", null, "Ingeniería de Sistemas", "PE-2025-014", "Cronograma de hackatón académico de innovación tecnológica.", "2025-04-23"],
  [2025, "programaciones", null, "Educación Primaria", "PE-2025-027", "Programación especial de nivelación para estudiantes ingresantes.", "2025-07-15"],
  [2025, "programaciones", null, "Enfermería", "PE-2025-039", "Calendario de simulacros de atención de emergencias.", "2025-09-30"],
  [2025, "programaciones", null, "Comunicación Social", "PE-2025-046", "Programación del festival de comunicación audiovisual.", "2025-11-18"],
  // Gestión 2025 · Correspondencia · Mesa de Exámenes
  [2025, "correspondencia", "examenes", "Derecho", "MEX-2025-003", "Solicitud de revisión de examen final del curso de Derecho Civil.", "2025-01-22"],
  [2025, "correspondencia", "examenes", "Ingeniería Civil", "MEX-2025-016", "Remisión de actas de evaluación del semestre 2025-I.", "2025-04-08"],
  [2025, "correspondencia", "examenes", "Psicología", "MEX-2025-029", "Solicitud de examen de aplazamiento del curso de Evaluación Psicológica.", "2025-07-01"],
  [2025, "correspondencia", "examenes", "Medicina Humana", "MEX-2025-041", "Informe de exámenes de recuperación del semestre 2025-I.", "2025-09-16"],
  [2025, "correspondencia", "examenes", "Contabilidad", "MEX-2025-052", "Solicitud de revisión de calificación del curso de Finanzas Corporativas.", "2025-11-05"],
  [2025, "correspondencia", "examenes", "Arquitectura", "MEX-2025-061", "Solicitud de examen extraordinario del curso de Estructuras.", "2025-12-09"],
  [2025, "correspondencia", "examenes", "Derecho", "MEX-2025-067", "Solicitud de revisión de examen oral del curso de Derechos Humanos.", "2025-12-15"],
  [2025, "correspondencia", "examenes", "Educación Primaria", "MEX-2025-070", "Remisión de actas de evaluación de prácticas preprofesionales.", "2025-12-18"],
  [2025, "correspondencia", "examenes", "Administración de Empresas", "MEX-2025-074", "Solicitud de examen de aplazamiento del curso de Estadística Empresarial.", "2025-12-19"],
  [2025, "correspondencia", "examenes", "Ingeniería de Sistemas", "MEX-2025-079", "Informe de exámenes de recuperación del semestre 2025-II.", "2025-12-20"],
  // Gestión 2025 · Correspondencia · Cursos de Verano
  [2025, "correspondencia", "cursos-verano", "Administración de Empresas", "CVR-2025-005", "Inscripción al curso de verano de Innovación y Emprendimiento.", "2025-01-10"],
  [2025, "correspondencia", "cursos-verano", "Ingeniería de Sistemas", "CVR-2025-013", "Apertura del curso de verano de Desarrollo Web Full Stack.", "2025-01-28"],
  [2025, "correspondencia", "cursos-verano", "Medicina Humana", "CVR-2025-022", "Solicitud de convalidación del curso de verano de Salud Digital.", "2025-02-14"],
  [2025, "correspondencia", "cursos-verano", "Derecho", "CVR-2025-031", "Inscripción de estudiantes al curso de verano de Arbitraje Comercial.", "2025-02-25"],
  // Gestión 2025 · Auxiliatura
  [2025, "auxiliatura", null, "Ingeniería de Sistemas", "AUX-2025-004", "Designación de auxiliar de cátedra para el curso de Inteligencia Artificial.", "2025-03-12"],
  [2025, "auxiliatura", null, "Contabilidad", "AUX-2025-018", "Renovación de auxiliar de cátedra del curso de Costos y Presupuestos.", "2025-06-24"],
  [2025, "auxiliatura", null, "Medicina Humana", "AUX-2025-027", "Solicitud de apoyo académico para el curso de Patología General.", "2025-08-19"],
  [2025, "auxiliatura", null, "Educación Primaria", "AUX-2025-036", "Evaluación de desempeño de auxiliar de cátedra del curso de Comunicación Oral.", "2025-10-07"],
  [2025, "auxiliatura", null, "Arquitectura", "AUX-2025-045", "Designación de auxiliar de taller de maquetas y prototipos.", "2025-11-26"],
];

export function createSeedRecords(): DocumentRecord[] {
  return seedRows.map(
    ([gestion, module, tipo, carrera, codigo, descripcion, fechaRegistro], index) => {
      const createdAt = new Date(`${fechaRegistro}T09:${String(index % 60).padStart(2, "0")}:00`).toISOString();
      const updatedAt = new Date(`${fechaRegistro}T15:${String((index + 15) % 60).padStart(2, "0")}:00`).toISOString();

      return {
        id: `demo-${gestion}-${module}-${tipo ?? "general"}-${String(index + 1).padStart(3, "0")}`,
        gestion,
        module,
        ...(tipo ? { tipo } : {}),
        carrera,
        codigo,
        descripcion,
        fechaRegistro,
        createdAt,
        updatedAt,
      };
    },
  );
}
