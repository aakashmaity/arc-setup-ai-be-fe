"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import { createPaginatedRowModel, rowPaginationFeature, tableFeatures, useTable, type ColumnDef, type RowData } from "@tanstack/react-table";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Pagination } from "./pagination";
import { Input, Label } from "./fields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

const features = tableFeatures({ rowPaginationFeature, paginatedRowModel: createPaginatedRowModel() });
export type DataTableColumn<T> = { id: string; header: string; cell: (row: T) => ReactNode };
export type DataTableProps<T extends RowData> = {
  data: T[];
  columns: DataTableColumn<T>[];
  getRowId: (row: T) => string;
  caption: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  searchText?: (row: T) => string;
  searchLabel?: string;
  loading?: boolean;
  error?: string;
};

/** Client pagination: pass the complete dataset. Filter before paginating. */
export function DataTable<T extends RowData>({ data, columns, getRowId, caption, initialPageSize = 10, pageSizeOptions = [5, 10, 25, 50], searchText, searchLabel = "Search rows", loading = false, error }: DataTableProps<T>) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: Number.isInteger(initialPageSize) && initialPageSize > 0 ? initialPageSize : 10 });
  const filtered = useMemo(() => searchText ? data.filter(row => searchText(row).toLowerCase().includes(query.trim().toLowerCase())) : data, [data, query, searchText]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pagination.pageSize));
  const safePagination = { ...pagination, pageIndex: Math.min(pagination.pageIndex, pageCount - 1) };
  const definitions = useMemo<ColumnDef<typeof features, T>[]>(() => columns.map(column => ({ id: column.id, header: column.header, cell: ({ row }) => column.cell(row.original) })), [columns]);
  const table = useTable({ features, data: filtered, columns: definitions, getRowId, state: { pagination: safePagination }, onPaginationChange: setPagination, autoResetPageIndex: false });
  const options = [...new Set([...pageSizeOptions, pagination.pageSize])].filter(size => Number.isInteger(size) && size > 0).sort((a, b) => a - b);
  const unavailable = loading || !!error;
  const start = filtered.length ? safePagination.pageIndex * pagination.pageSize + 1 : 0;
  const end = Math.min((safePagination.pageIndex + 1) * pagination.pageSize, filtered.length);
  return <div className="grid min-w-0 gap-stack" aria-busy={loading}>
    <div className="flex flex-col gap-stack tablet:flex-row tablet:items-end tablet:justify-between">
      {searchText && <div className="grid w-full gap-control tablet:max-w-preview-wide"><Label htmlFor={`${id}-search`}>{searchLabel}</Label><Input id={`${id}-search`} value={query} disabled={unavailable} placeholder="Filter results…" onChange={event => { setQuery(event.target.value); setPagination(current => ({ ...current, pageIndex: 0 })); }} /></div>}
      <div className="grid gap-control"><Label htmlFor={`${id}-size`}>Rows per page</Label><Select value={String(pagination.pageSize)} disabled={unavailable} onValueChange={value => setPagination({ pageIndex: 0, pageSize: Number(value) })}><SelectTrigger id={`${id}-size`} className="w-auto"><SelectValue /></SelectTrigger><SelectContent>{options.map(size => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select></div>
    </div>
    <div className="sky-border min-w-0 overflow-hidden rounded-surface border-border"><Table><TableCaption>{caption}</TableCaption><TableHeader>{table.getHeaderGroups().map(group => <TableRow key={group.id}>{group.headers.map(header => <TableHead key={header.id}><table.FlexRender header={header} /></TableHead>)}</TableRow>)}</TableHeader><TableBody>
      {unavailable || !filtered.length ? <TableRow><TableCell colSpan={Math.max(1, columns.length)} className="p-panel text-center"><span role={error ? "alert" : "status"}>{loading ? "Loading rows…" : error ?? "No matching rows."}</span></TableCell></TableRow> : table.getRowModel().rows.map(row => <TableRow key={row.id}>{row.getAllCells().map(cell => <TableCell key={cell.id}><table.FlexRender cell={cell} /></TableCell>)}</TableRow>)}
    </TableBody></Table></div>
    {!unavailable && <><p role="status" className="text-caption text-muted-foreground">Showing {start}–{end} of {filtered.length} rows</p><Pagination page={safePagination.pageIndex + 1} pageCount={pageCount} onPageChange={page => setPagination(current => ({ ...current, pageIndex: page - 1 }))} label={`${caption} pagination`} /></>}
  </div>;
}
