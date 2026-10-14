"use client";
import { GridProps } from "./models/grid";

export default function GridComponent<T>({
  rows,
  columns,
  getRowId,
}: Readonly<GridProps<T>>) {
  return (
    <div>
      <h2>Grid Component</h2>
      <table>
        <thead>
          <tr>
            {columns.map((col) => {
              return <th key={col.id}>{col.header}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            return (
              <tr key={getRowId(row)}>
                {columns.map((column) => {
                  return <td key={column.id}>{column.accessor(row)}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
