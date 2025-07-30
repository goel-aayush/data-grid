"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";
import { GridAction, GridState } from "@/types/grid.types";

const initialState: GridState = {
  data: [],
  columns: [],
  visibleColumns: [],
  sortModel: [],
  pageSize: 10,
  pagination: {
    page: 1,
    pageSize: 10,
  },
  filterModel: {
    global: "",
    columns: {},
  },
  paginationMode: "client",
  editingCell: null,
  loading: false,
  error: null,
  selectedRows: [],
};

function dataGridReducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, data: action.payload };
    case "SET_COLUMNS":
      return {
        ...state,
        columns: action.payload,
        visibleColumns:
          state.visibleColumns.length > 0
            ? state.visibleColumns
            : action.payload.map((col) => col.key),
      };

    case "SET_PAGE":
      return {
        ...state,
        pagination: { ...state.pagination, page: action.payload },
      };
    case "SET_PAGE_SIZE":
      return {
        ...state,
        pagination: { ...state.pagination, pageSize: action.payload },
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SORT_MODEL":
      return { ...state, sortModel: action.payload };
    case "SET_GLOBAL_FILTER":
      return {
        ...state,
        filterModel: {
          ...state.filterModel,
          global: action.payload,
        },
      };

    // case "SET_COLUMN_FILTER":
    //   return {
    //     ...state,
    //     filterModel: {
    //       ...state.filterModel,
    //       columns: {
    //         ...state.filterModel.columns,
    //         [action.payload.key]: action.payload.value,
    //       },
    //     },
    //   };

    case "SET_COLUMN_FILTER": {
      const { key, value } = action.payload;
      return {
        ...state,
        filterModel: {
          ...state.filterModel,
          columns: {
            ...state.filterModel.columns,
            [key]: value,
          },
        },
      };
    }

    case "SET_COLUMNS":
      return {
        ...state,
        columns: action.payload,
        visibleColumns: action.payload.map((col) => col.key),
      };
    case "TOGGLE_COLUMN_VISIBILITY":
      const key = action.payload;
      const isVisible = state.visibleColumns.includes(key);
      return {
        ...state,
        visibleColumns: isVisible
          ? state.visibleColumns.filter((col) => col !== key)
          : [...state.visibleColumns, key],
      };
    case "SET_PAGINATION_MODE":
      return {
        ...state,
        paginationMode: action.payload,
      };
    case "UPDATE_COLUMN_WIDTH":
      return {
        ...state,
        columns: state.columns.map((col) =>
          col.key === action.payload.key
            ? { ...col, width: action.payload.width }
            : col
        ),
      };
    case "TOGGLE_ROW_SELECTION":
      return {
        ...state,
        selectedRows: action.payload.checked
          ? [...state.selectedRows, action.payload.id]
          : state.selectedRows.filter((id) => id !== action.payload.id),
      };

    case "TOGGLE_SELECT_ALL":
      return {
        ...state,
        selectedRows: action.payload.checked ? action.payload.ids : [],
      };
    case "START_EDITING":
      return {
        ...state,
        editingCell: { rowId: action.payload.rowId, key: action.payload.key },
      };

    case "STOP_EDITING":
      return { ...state, editingCell: null };

    case "UPDATE_CELL_VALUE":
      return {
        ...state,
        data: state.data.map((row) =>
          row.id === action.payload.rowId
            ? { ...row, [action.payload.key]: action.payload.value }
            : row
        ),
      };
    case "TOGGLE_PAGE_ROWS": {
      const { checked, rows } = action.payload;
      return {
        ...state,
        selectedRows: checked
          ? [...new Set([...state.selectedRows, ...rows])]
          : state.selectedRows.filter((id) => !rows.includes(id)),
      };
    }
    case "DELETE_SELECTED_ROWS": {
      const selectedIds = new Set(state.selectedRows);
      return {
        ...state,
        data: state.data.filter((row) => !selectedIds.has(row.id)),
        selectedRows: [], // Clear selection
      };
    }
    case "TOGGLE_ALL_ROWS": {
      const { checked, rows } = action.payload;
      return {
        ...state,
        selectedRows: checked
          ? [...new Set([...state.selectedRows, ...rows])]
          : state.selectedRows.filter((id) => !rows.includes(id)),
      };
    }
    case "SET_VISIBLE_COLUMNS":
      return {
        ...state,
        visibleColumns: action.payload,
      };

    // case "SET_COLUMN_PINNING": {
    //   const { key, pinned } = action.payload;
    //   return {
    //     ...state,
    //     columns: state.columns.map((col) =>
    //       col.key === key ? { ...col, pinned } : col
    //     ),
    //   };
    // }
    case "SET_COLUMN_PINNING": {
      const { key, pinned } = action.payload;
      let newColumns = state.columns.map((col) =>
        col.key === key
          ? { ...col, pinned }
          : col.pinned === pinned && pinned !== undefined
          ? { ...col, pinned: undefined }
          : col
      );
      // Reorder: left, center, right
      newColumns = [
        ...newColumns.filter((c) => c.pinned === "left"),
        ...newColumns.filter((c) => !c.pinned),
        ...newColumns.filter((c) => c.pinned === "right"),
      ];
      return { ...state, columns: newColumns };
    }
    case "SET_FILTER_MODEL":
      return {
        ...state,
        filterModel: action.payload,
      };

    default:
      return state;
  }
}

const DataGridContext = createContext<{
  state: GridState;
  dispatch: Dispatch<GridAction>;
} | null>(null);

export function DataGridProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataGridReducer, initialState);

  return (
    <DataGridContext.Provider value={{ state, dispatch }}>
      {children}
    </DataGridContext.Provider>
  );
}

export function useDataGridContext() {
  const context = useContext(DataGridContext);
  if (!context)
    throw new Error("useDataGridContext must be used inside DataGridProvider");
  return context;
}
