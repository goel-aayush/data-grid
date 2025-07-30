import { useEffect } from "react";
import { useDataGridContext } from "@/contexts/DataGridContext";

const STORAGE_KEY = "dataGridState";

export function usePersistGridState() {
  const { state, dispatch } = useDataGridContext();

  // ✅ Load from localStorage on first mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (parsed.columns) {
          dispatch({ type: "SET_COLUMNS", payload: parsed.columns });
        }

        if (parsed.visibleColumns) {
  dispatch({ type: "SET_VISIBLE_COLUMNS", payload: parsed.visibleColumns });
}


        if (parsed.sortModel) {
          dispatch({ type: "SET_SORT_MODEL", payload: parsed.sortModel });
        }

        if (parsed.filterModel) {
          dispatch({ type: "SET_FILTER_MODEL", payload: parsed.filterModel });
        }

        if (parsed.pagination) {
          dispatch({ type: "SET_PAGE", payload: parsed.pagination.page });
          dispatch({ type: "SET_PAGE_SIZE", payload: parsed.pagination.pageSize });
        }
      } catch (err) {
        console.warn("Failed to load saved grid state", err);
      }
    }
  }, [dispatch]);

  
  useEffect(() => {
    const toPersist = {
      columns: state.columns,                  
      visibleColumns: state.visibleColumns,    
      sortModel: state.sortModel,              
      filterModel: state.filterModel,
      pagination: state.pagination,            
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
  }, [
    state.columns,
    state.visibleColumns,
    state.sortModel,
    state.filterModel,
    state.pagination,
  ]);
}
