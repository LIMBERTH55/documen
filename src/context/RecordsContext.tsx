import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createSeedRecords } from "../data/seed";
import type { DocumentRecord, RecordInput } from "../types";
import { useToast } from "./ToastContext";

const STORAGE_KEY = "sgd-academico.records.v1";

interface RecordsContextValue {
  records: DocumentRecord[];
  addRecord: (input: RecordInput) => DocumentRecord;
  updateRecord: (id: string, input: RecordInput) => void;
  deleteRecord: (id: string) => void;
  restoreDemoData: () => void;
}

const RecordsContext = createContext<RecordsContextValue | null>(null);

function loadInitialRecords(): DocumentRecord[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === null) {
      return createSeedRecords();
    }
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as DocumentRecord[]) : createSeedRecords();
  } catch {
    return createSeedRecords();
  }
}

function createRecordId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `record-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function sanitizeInput(input: RecordInput): RecordInput {
  return {
    ...input,
    carrera: input.carrera.trim(),
    codigo: input.codigo.trim(),
    descripcion: input.descripcion.trim(),
  };
}

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<DocumentRecord[]>(loadInitialRecords);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      showToast(
        "No se pudo guardar en el almacenamiento local. Verifica el espacio disponible.",
        "error",
      );
    }
  }, [records, showToast]);

  const addRecord = useCallback((input: RecordInput): DocumentRecord => {
    const now = new Date().toISOString();
    const record: DocumentRecord = {
      ...sanitizeInput(input),
      id: createRecordId(),
      createdAt: now,
      updatedAt: now,
    };
    setRecords((current) => [record, ...current]);
    return record;
  }, []);

  const updateRecord = useCallback((id: string, input: RecordInput) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? {
              ...record,
              ...sanitizeInput(input),
              updatedAt: new Date().toISOString(),
            }
          : record,
      ),
    );
  }, []);

  const deleteRecord = useCallback((id: string) => {
    setRecords((current) => current.filter((record) => record.id !== id));
  }, []);

  const restoreDemoData = useCallback(() => {
    setRecords(createSeedRecords());
    showToast("Se restauraron los datos de demostración.", "info");
  }, [showToast]);

  const value = useMemo(
    () => ({ records, addRecord, updateRecord, deleteRecord, restoreDemoData }),
    [records, addRecord, updateRecord, deleteRecord, restoreDemoData],
  );

  return <RecordsContext.Provider value={value}>{children}</RecordsContext.Provider>;
}

export function useRecords(): RecordsContextValue {
  const context = useContext(RecordsContext);
  if (!context) {
    throw new Error("useRecords debe usarse dentro de RecordsProvider.");
  }
  return context;
}
