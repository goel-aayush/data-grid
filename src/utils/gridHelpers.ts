import { Column, RowData } from '@/types/grid.types';
import { SortModel } from '@/types/grid.types';
import { FilterModel } from '@/types/grid.types';

export function generateColumns(data: RowData[]): Column[] {
  if (!data.length) return [];

  const sample = data[0];

  const baseCols = Object.keys(sample).map((key) => ({
    key,
    label: key[0].toUpperCase() + key.slice(1),
    width: 150,
    pinned: undefined,
  }));

  return baseCols;
}


export const sortData = (data: RowData[], sortModel: SortModel[]): RowData[] => {
  if (sortModel.length === 0) return data;

  return [...data].sort((a, b) => {
    for (const sort of sortModel) {
      const valA = a[sort.key];
      const valB = b[sort.key];

      if (valA === undefined || valB === undefined) return 0;
      if (valA < valB) return sort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sort.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};


export const filterData = (data: RowData[], filterModel: FilterModel): RowData[] => {
  const { global = "", columns = {} } = filterModel || {};

  return data.filter((row) => {
    // Global filter (optional)
    const matchesGlobal = global
      ? Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(global.toLowerCase())
      : true;

    // Column filters
    const matchesColumns = Object.entries(columns).every(([key, value]) => {
      if (!value) return true;
      const cellValue = row[key]?.toString().toLowerCase() || "";
      return cellValue.includes(value.toLowerCase());
    });

    return matchesGlobal && matchesColumns;
  });
};

