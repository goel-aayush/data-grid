"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useDataGridContext } from "@/contexts/DataGridContext";
import { generateColumns, sortData, filterData } from "@/utils/gridHelpers";
import { useApi } from "@/hooks/useApi";
import { usePersistGridState } from "@/hooks/useLocalStorage";

export function useDataGrid() {
  usePersistGridState();
  const { state, dispatch } = useDataGridContext();
  const { pagination, sortModel, filterModel } = state;
  const { page, pageSize } = pagination;

  const [search, setSearch] = useState("");
  const [draggedCol, setDraggedCol] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const isResizing = useRef(false);

  const {
    data: serverData,
    total,
    loading,
    error,
  } = useApi({
    page,
    pageSize,
    search: filterModel.global,
    sortModel,
  });

  // Set columns on first load
  useEffect(() => {
    if (serverData.length === 0) return;

    const generatedColumns = generateColumns(serverData);
    const withSelectColumn = [
      {
        key: "__select__",
        label: "",
        width: 40,
        pinned: "left" as const,
      },
      ...generatedColumns,
      {
        key: "__actions__",
        label: "Actions",
        width: 120,
        pinned: "right" as const,
      },
    ];

    dispatch({ type: "SET_COLUMNS", payload: withSelectColumn });
    dispatch({ type: "SET_DATA", payload: serverData });
  }, [serverData, dispatch]);

  // 🔥 Correct hook usage
  const filteredData = useMemo(() => {
    return filterData(serverData, filterModel);
  }, [serverData, filterModel]);

  const sortedData = useMemo(() => {
    return sortData(filteredData, sortModel);
  }, [filteredData, sortModel]);

  const visibleRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, page, pageSize]);

  return {
    state,
    dispatch,
    search,
    setSearch,
    draggedCol,
    setDraggedCol,
    dragOverCol,
    setDragOverCol,
    isResizing,
    gridData: sortedData,       
    filteredData,               
    visibleRows,                
    total,
    loading,
    error,
  };
}
