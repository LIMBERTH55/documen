import { useCallback, useEffect, useMemo, useState } from "react";
import type { DocumentRecord } from "../types";
import { normalizeText } from "../lib/format";

export type SortKey = "carrera" | "codigo" | "descripcion" | "fechaRegistro";
export type SortDirection = "asc" | "desc";

export interface ExplorerFilters {
  carrera: string;
  codigo: string;
  descripcion: string;
}

export interface RecordExplorer {
  filters: ExplorerFilters;
  setFilter: (key: keyof ExplorerFilters, value: string) => void;
  clearFilters: () => void;
  hasFilters: boolean;
  sort: { key: SortKey; direction: SortDirection };
  toggleSort: (key: SortKey) => void;
  filteredRecords: DocumentRecord[];
  totalFiltered: number;
  totalRecords: number;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  totalPages: number;
  pageRecords: DocumentRecord[];
  rangeStart: number;
  rangeEnd: number;
}

const EMPTY_FILTERS: ExplorerFilters = {
  carrera: "",
  codigo: "",
  descripcion: "",
};

export function useRecordExplorer(
  records: DocumentRecord[],
  initialPageSize = 8,
): RecordExplorer {
  const [filters, setFilters] = useState<ExplorerFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<{ key: SortKey; direction: SortDirection }>({
    key: "fechaRegistro",
    direction: "desc",
  });
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const setFilter = useCallback((key: keyof ExplorerFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPageState(1);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setPageState(1);
  }, []);

  const toggleSort = useCallback((key: SortKey) => {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );
    setPageState(1);
  }, []);

  const setPage = useCallback((nextPage: number) => {
    setPageState(Math.max(1, nextPage));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPageState(1);
  }, []);

  const filteredRecords = useMemo(() => {
    const carreraTerm = normalizeText(filters.carrera);
    const codigoTerm = normalizeText(filters.codigo);
    const descripcionTerm = normalizeText(filters.descripcion);

    const filtered = records.filter((record) => {
      if (carreraTerm && !normalizeText(record.carrera).includes(carreraTerm)) return false;
      if (codigoTerm && !normalizeText(record.codigo).includes(codigoTerm)) return false;
      if (descripcionTerm && !normalizeText(record.descripcion).includes(descripcionTerm)) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      const direction = sort.direction === "asc" ? 1 : -1;
      const aValue = a[sort.key];
      const bValue = b[sort.key];

      if (sort.key === "fechaRegistro") {
        return aValue.localeCompare(bValue) * direction;
      }

      return aValue.localeCompare(bValue, "es", { sensitivity: "base" }) * direction;
    });
  }, [records, filters, sort]);

  const totalFiltered = filteredRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPageState(totalPages);
    }
  }, [page, totalPages]);

  const safePage = Math.min(page, totalPages);
  const pageRecords = useMemo(
    () => filteredRecords.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filteredRecords, safePage, pageSize],
  );

  const rangeStart = totalFiltered === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, totalFiltered);
  const hasFilters = Boolean(filters.carrera || filters.codigo || filters.descripcion);

  return {
    filters,
    setFilter,
    clearFilters,
    hasFilters,
    sort,
    toggleSort,
    filteredRecords,
    totalFiltered,
    totalRecords: records.length,
    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    pageRecords,
    rangeStart,
    rangeEnd,
  };
}
