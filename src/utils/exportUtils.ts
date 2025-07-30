// utils/exportToCsv.ts
import Papa from "papaparse"
import { User } from "@/types/api.types";
import { Column } from "@/types/grid.types";

export function exportToCsv(data: User[], columns: Column[], visibleKeys: string[], fileName = "data.csv") {
  const visibleCols = columns.filter((col) => visibleKeys.includes(col.key));

  const csvData = data.map((row) =>
    Object.fromEntries(
      visibleCols.map((col) => [col.label, row[col.key as keyof User]])
    )
  );

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.click();
}
