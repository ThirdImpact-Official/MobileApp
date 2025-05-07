import React from "react";

interface Column<T>
{
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}
  
export interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    actions?: (row: T) => React.ReactNode;
}

