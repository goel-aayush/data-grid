import { Dispatch } from "react";

// 1. Column definition
export interface Column {
  key: string;
  label: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  visible?: boolean;
  pinned?: "left" | "right";
}

// 2. Row data (generic object with ID)
export interface RowData {
  id: string | number;
  [key: string]: string | number | undefined;
}

// 3. Pagination
export interface PaginationState {
  page: number;
  pageSize: number;
}

// 4. Sorting
export interface SortModel {
  key: string | number;
  direction: "asc" | "desc";
}

// 5. Filtering
export interface FilterModel {
  global: string;
  columns: Record<string, string>; 
}

// 6. Grid state (main reducer state)
export interface GridState {
  data: RowData[];
  columns: Column[];
  visibleColumns: string[];
  sortModel: SortModel[];
  pagination: PaginationState;
  paginationMode: "client" | "server";
  loading: boolean;
  error: string | null;
  filterModel: FilterModel;
  editingCell: { rowId: string | number; key: string } | null;
  selectedRows: (string | number)[];
  pageSize: number;
}

// 7. Grid actions
export type GridAction =
  | { type: "SET_DATA"; payload: RowData[] }
  | { type: "SET_COLUMNS"; payload: Column[] }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SORT_MODEL"; payload: SortModel[] }
  | { type: "SET_GLOBAL_FILTER"; payload: string }
  | { type: "SET_COLUMN_FILTER"; payload: { key: string; value: string } }
  | { type: "TOGGLE_COLUMN_VISIBILITY"; payload: string }
  | { type: "UPDATE_COLUMN_WIDTH"; payload: { key: string; width: number } }
  | { type: "SET_PAGINATION_MODE"; payload: "client" | "server" }
  | { type: "TOGGLE_ROW_SELECTION"; payload: { id: string | number; checked: boolean } }
  | { type: "TOGGLE_SELECT_ALL"; payload: { ids: (string | number)[]; checked: boolean } }
  | { type: "START_EDITING"; payload: { rowId: string | number; key: string } }
  | { type: "STOP_EDITING" }
  | { type: "TOGGLE_PAGE_ROWS"; payload: { checked: boolean; rows: (string | number)[] } }
  | { type: "UPDATE_CELL_VALUE"; payload: { rowId: string | number; key: string; value: string } }
  | { type: "DELETE_SELECTED_ROWS" }
  | { type: "TOGGLE_ALL_ROWS"; payload: { checked: boolean; rows: (string | number)[] } }
  | { type: "SET_COLUMN_PINNING"; payload: { key: string; pinned?: "left" | "right" } }
  | { type: "SET_VISIBLE_COLUMNS"; payload: string[] }
  | { type: "SET_FILTER_MODEL"; payload: FilterModel }
  | { type: "SET_ERROR"; payload: string | null };

// 8. Pinned offset values
export interface PinnedOffsets {
  left: Record<string, number>;
  right: Record<string, number>;
}

// 9. Slimmed-down state used in row component
export interface DataGridState {
  visibleColumns: string[];
  selectedRows: (string | number)[];
  editingCell: {
    rowId: string | number;
    key: string;
  } | null;
}

// 10. Row props
export interface DataGridRowProps {
  row: RowData;
  columns: Column[];
  state: DataGridState;
  dispatch: Dispatch<GridAction>;
  pinnedOffsets: PinnedOffsets;
  handleEdit: (row: RowData) => void;
  handleDelete: (id: string | number) => void;
  loading?: boolean;
}


