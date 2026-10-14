import { ReactNode } from "react";

export interface ColumnDef<T> {
  id: string;
  header: string;
  accessor: (row: T) => ReactNode;
}

export interface GridProps<T> {
  rows: T[];
  columns: ColumnDef<T>[];
  getRowId: (row: T) => string | number;
}
