import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { DocumentRecord } from "../types";
import { formatDate, getInitials } from "../lib/format";
import type { RecordExplorer, SortKey } from "../hooks/useRecordExplorer";
import { EmptyState } from "./EmptyState";

interface RecordsTableProps {
  explorer: RecordExplorer;
  onEdit: (record: DocumentRecord) => void;
  onDelete: (record: DocumentRecord) => void;
  onAdd: () => void;
}

function getTone(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash % 5;
}

function getPaginationItems(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  if (current > 4) items.push("ellipsis");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (current < total - 3) items.push("ellipsis");
  items.push(total);
  return items;
}

function SortIndicator({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  if (!active) {
    return <ArrowUpDown size={14} className="sort-indicator" />;
  }
  return direction === "asc" ? (
    <ArrowUp size={14} className="sort-indicator sort-indicator--active" />
  ) : (
    <ArrowDown size={14} className="sort-indicator sort-indicator--active" />
  );
}

function ActionButtons({
  record,
  onEdit,
  onDelete,
}: {
  record: DocumentRecord;
  onEdit: (record: DocumentRecord) => void;
  onDelete: (record: DocumentRecord) => void;
}) {
  return (
    <div className="row-actions">
      <button
        type="button"
        className="icon-button icon-button--sm"
        onClick={() => onEdit(record)}
        title="Editar registro"
        aria-label={`Editar registro ${record.codigo}`}
      >
        <Pencil size={15} />
      </button>
      <button
        type="button"
        className="icon-button icon-button--sm icon-button--danger"
        onClick={() => onDelete(record)}
        title="Eliminar registro"
        aria-label={`Eliminar registro ${record.codigo}`}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function CareerBadge({ carrera }: { carrera: string }) {
  return (
    <div className="career-cell">
      <span className={`career-avatar career-avatar--${getTone(carrera)}`}>
        {getInitials(carrera)}
      </span>
      <span className="career-cell__name">{carrera}</span>
    </div>
  );
}

export function RecordsTable({ explorer, onEdit, onDelete, onAdd }: RecordsTableProps) {
  const {
    filters,
    setFilter,
    clearFilters,
    hasFilters,
    sort,
    toggleSort,
    totalFiltered,
    totalRecords,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    pageRecords,
    rangeStart,
    rangeEnd,
  } = explorer;

  const sortableHeader = (key: SortKey, label: string) => (
    <th scope="col">
      <button type="button" className="sort-button" onClick={() => toggleSort(key)}>
        <span>{label}</span>
        <SortIndicator active={sort.key === key} direction={sort.direction} />
      </button>
    </th>
  );

  const paginationItems = getPaginationItems(page, totalPages);

  return (
    <section className="records-card" aria-label="Listado de registros">
      <div className="records-toolbar">
        <div className="records-toolbar__heading">
          <div>
            <div className="records-toolbar__title-row">
              <h2>Registros</h2>
              <span className="count-badge">{totalFiltered}</span>
            </div>
            <p>
              {hasFilters
                ? `${totalFiltered} de ${totalRecords} registros coinciden con la búsqueda.`
                : `${totalRecords} registros disponibles en esta sección.`}
            </p>
          </div>
          {hasFilters ? (
            <button type="button" className="btn btn--ghost btn--sm" onClick={clearFilters}>
              <X size={15} />
              Limpiar filtros
            </button>
          ) : null}
        </div>

        <div className="filter-grid">
          <label className="search-field">
            <span className="search-field__label">Buscar por carrera</span>
            <span className="search-field__control">
              <Search size={16} className="search-field__icon" aria-hidden="true" />
              <input
                type="search"
                value={filters.carrera}
                onChange={(event) => setFilter("carrera", event.target.value)}
                placeholder="Ej. Ingeniería de Sistemas"
                autoComplete="off"
              />
              {filters.carrera ? (
                <button
                  type="button"
                  className="search-field__clear"
                  onClick={() => setFilter("carrera", "")}
                  aria-label="Limpiar búsqueda por carrera"
                >
                  <X size={14} />
                </button>
              ) : null}
            </span>
          </label>

          <label className="search-field">
            <span className="search-field__label">Buscar por Nro. de dictamen o código</span>
            <span className="search-field__control">
              <Search size={16} className="search-field__icon" aria-hidden="true" />
              <input
                type="search"
                value={filters.codigo}
                onChange={(event) => setFilter("codigo", event.target.value)}
                placeholder="Ej. MEX-2025-041"
                autoComplete="off"
              />
              {filters.codigo ? (
                <button
                  type="button"
                  className="search-field__clear"
                  onClick={() => setFilter("codigo", "")}
                  aria-label="Limpiar búsqueda por código"
                >
                  <X size={14} />
                </button>
              ) : null}
            </span>
          </label>

          <label className="search-field">
            <span className="search-field__label">Buscar por descripción</span>
            <span className="search-field__control">
              <Search size={16} className="search-field__icon" aria-hidden="true" />
              <input
                type="search"
                value={filters.descripcion}
                onChange={(event) => setFilter("descripcion", event.target.value)}
                placeholder="Palabras clave del documento"
                autoComplete="off"
              />
              {filters.descripcion ? (
                <button
                  type="button"
                  className="search-field__clear"
                  onClick={() => setFilter("descripcion", "")}
                  aria-label="Limpiar búsqueda por descripción"
                >
                  <X size={14} />
                </button>
              ) : null}
            </span>
          </label>
        </div>
      </div>

      {totalFiltered === 0 ? (
        <EmptyState
          title={hasFilters ? "Sin resultados" : "Aún no hay registros"}
          description={
            hasFilters
              ? "No encontramos coincidencias. Prueba con otros términos o limpia los filtros."
              : "Agrega el primer registro para comenzar a organizar la información de esta sección."
          }
          action={
            hasFilters ? (
              <button type="button" className="btn btn--secondary" onClick={clearFilters}>
                <X size={16} />
                Limpiar filtros
              </button>
            ) : (
              <button type="button" className="btn btn--primary" onClick={onAdd}>
                <Plus size={16} />
                Agregar registro
              </button>
            )
          }
        />
      ) : (
        <>
          <div className="table-scroll">
            <table className="records-table">
              <thead>
                <tr>
                  {sortableHeader("carrera", "Carrera")}
                  {sortableHeader("codigo", "Nro. de Dictamen o Código")}
                  {sortableHeader("descripcion", "Descripción")}
                  {sortableHeader("fechaRegistro", "Fecha de registro")}
                  <th scope="col" className="actions-header">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <CareerBadge carrera={record.carrera} />
                    </td>
                    <td>
                      <span className="code-badge">{record.codigo}</span>
                    </td>
                    <td>
                      <p className="description-cell" title={record.descripcion}>
                        {record.descripcion}
                      </p>
                    </td>
                    <td>
                      <span className="date-cell">
                        <CalendarDays size={14} aria-hidden="true" />
                        {formatDate(record.fechaRegistro)}
                      </span>
                    </td>
                    <td>
                      <ActionButtons record={record} onEdit={onEdit} onDelete={onDelete} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="records-mobile-list">
            {pageRecords.map((record) => (
              <article className="record-card" key={record.id}>
                <div className="record-card__top">
                  <CareerBadge carrera={record.carrera} />
                  <span className="code-badge">{record.codigo}</span>
                </div>
                <p className="record-card__description">{record.descripcion}</p>
                <div className="record-card__footer">
                  <span className="date-cell">
                    <CalendarDays size={14} aria-hidden="true" />
                    {formatDate(record.fechaRegistro)}
                  </span>
                  <ActionButtons record={record} onEdit={onEdit} onDelete={onDelete} />
                </div>
              </article>
            ))}
          </div>

          <div className="table-footer">
            <p className="table-footer__info">
              Mostrando <strong>{rangeStart}–{rangeEnd}</strong> de <strong>{totalFiltered}</strong>{" "}
              registros
            </p>
            <div className="table-footer__controls">
              <label className="page-size">
                <span>Filas</span>
                <select
                  value={pageSize}
                  onChange={(event) => setPageSize(Number(event.target.value))}
                  aria-label="Registros por página"
                >
                  <option value={5}>5</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={20}>20</option>
                </select>
              </label>

              <nav className="pagination" aria-label="Paginación de registros">
                <button
                  type="button"
                  className="pagination__arrow"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={17} />
                </button>
                <div className="pagination__pages">
                  {paginationItems.map((item, index) =>
                    item === "ellipsis" ? (
                      <span key={`ellipsis-${index}`} className="pagination__ellipsis">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        className={`pagination__page ${item === page ? "is-active" : ""}`}
                        onClick={() => setPage(item)}
                        aria-label={`Ir a la página ${item}`}
                        aria-current={item === page ? "page" : undefined}
                      >
                        {item}
                      </button>
                    ),
                  )}
                </div>
                <button
                  type="button"
                  className="pagination__arrow"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Página siguiente"
                >
                  <ChevronRight size={17} />
                </button>
              </nav>
              <span className="pagination__mobile-label">
                Página {page} de {totalPages}
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
