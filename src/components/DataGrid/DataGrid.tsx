"use client";

import { useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useDataGrid } from "@/hooks/useDataGrid";
import { useVirtualScroll } from "@/hooks/useVirtualScroll";
import { exportToCsv } from "@/utils/exportUtils";
import DataGridHeader from "./DataGridHeader";
import DataGridRow from "./DataGridRow";
import Pagination from "./Pagination";
import { Button } from "../ui/Button";
import { RowData } from "@/types/grid.types";
import { usePersistGridState } from "@/hooks/useLocalStorage";
import FilterPanel from "./FilterPanel";

export default function DataGrid() {
  usePersistGridState();
  const {
    state,
    dispatch,
    search,
    setSearch,
    draggedCol,
    setDraggedCol,
    dragOverCol,
    setDragOverCol,
    isResizing,
    gridData,
    total,
    loading,
  } = useDataGrid();

  const { theme, toggleTheme } = useTheme();
  const { page, pageSize } = state.pagination;
  const { sortModel, columns } = state;

  const pinnedOffsets = {
    left: {} as Record<string, number>,
    right: {} as Record<string, number>,
  };

  let leftOffset = 0;
  let rightOffset = 0;

  columns.forEach((col) => {
    if (col.pinned === "left") {
      pinnedOffsets.left[col.key] = leftOffset;
      leftOffset += col.width ?? 150;
    }
  });

  [...columns].reverse().forEach((col) => {
    if (col.pinned === "right") {
      pinnedOffsets.right[col.key] = rightOffset;
      rightOffset += col.width ?? 150;
    }
  });

  const handleSort = (key: string, shiftKey: boolean) => {
    const existing = sortModel.find((s) => s.key === key);
    let newSortModel;

    if (existing) {
      const next =
        existing.direction === "asc"
          ? "desc"
          : existing.direction === "desc"
          ? null
          : "asc";

      if (next) {
        newSortModel = shiftKey
          ? sortModel.map((s) =>
              s.key === key ? { ...s, direction: next } : s
            )
          : [{ key, direction: next }];
      } else {
        newSortModel = shiftKey ? sortModel.filter((s) => s.key !== key) : [];
      }
    } else {
      newSortModel = shiftKey
        ? [...sortModel, { key, direction: "asc" }]
        : [{ key, direction: "asc" }];
    }

    dispatch({ type: "SET_SORT_MODEL", payload: newSortModel });
  };

  const resizingCol = useRef<string | null>(null);

  const startResizing = (e: React.MouseEvent, key: string) => {
    isResizing.current = true;
    resizingCol.current = key;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizingCol.current) return;
    const th = document.querySelector(`th[data-key="${resizingCol.current}"]`);
    if (!th) return;

    const newWidth = e.clientX - th.getBoundingClientRect().left;
    dispatch({
      type: "UPDATE_COLUMN_WIDTH",
      payload: {
        key: resizingCol.current,
        width: Math.max(newWidth, 50),
      },
    });
  };

  const stopResizing = () => {
    isResizing.current = false;
    resizingCol.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
  };

  const handleColumnDrop = () => {
    if (!draggedCol || !dragOverCol || draggedCol === dragOverCol) return;

    const draggedIndex = columns.findIndex((c) => c.key === draggedCol);
    const overIndex = columns.findIndex((c) => c.key === dragOverCol);

    const reordered = [...columns];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(overIndex, 0, moved);

    dispatch({ type: "SET_COLUMNS", payload: reordered });
    setDraggedCol(null);
    setDragOverCol(null);
  };

  const handleExport = () => {
    if (state.selectedRows.length === 0) {
      alert("Please select at least one row to export.");
      return;
    }

    const selectedData = gridData.filter((row) =>
      state.selectedRows.includes(row.id)
    );

    exportToCsv(
      selectedData,
      state.columns,
      state.visibleColumns,
      "selected_rows.csv"
    );
  };

  const handleBulkDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete selected rows?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        "https://backend-datagrid.onrender.com/api/users",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: state.selectedRows }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete rows");
      }

      const result = await response.json();
      console.log(result.message); // Optional: show a toast or alert

      // Remove deleted rows from local state
      const remaining = gridData.filter(
        (row) => !state.selectedRows.includes(row.id)
      );

      dispatch({ type: "SET_DATA", payload: remaining });
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete selected rows.");
    }
  };

  const handleEdit = (row: RowData) => {
    console.log("Edit", row);
  };

  const handleDelete = (id: string | number) => {
    dispatch({
      type: "SET_DATA",
      payload: gridData.filter((r) => r.id !== id),
    });
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    dispatch({ type: "SET_GLOBAL_FILTER", payload: val });
  };

  const rowHeight = 42;
  const containerHeight = 420;

  const { containerRef, totalHeight, startIndex, endIndex } = useVirtualScroll({
    rowHeight,
    containerHeight,
    totalCount: gridData.length,
  });

  const visibleRows = gridData.slice(startIndex, endIndex);

  return (
    <div className="relative border rounded overflow-hidden w-full">
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 px-3 py-2 border-b space-y-3">
        {/* 🔍 Filter Panel & Theme Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <FilterPanel
            search={search}
            onSearchChange={handleSearchChange}
            onExport={handleExport}
          />

          <Button variant="primary" onClick={toggleTheme}>
            {theme === "dark" ? " Dark Mode" : "Light Mode"}
          </Button>
        </div>
      </div>

      {state.selectedRows.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 border-b">
          <span>{state.selectedRows.length} selected</span>
          <Button onClick={handleBulkDelete} className="bg-red-500 text-white">
            Delete Selected
          </Button>
          <Button onClick={handleExport} className="bg-blue-500 text-white">
            Export Selected
          </Button>
        </div>
      )}

      <div
        className="w-full overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <div style={{ minWidth: "max-content" }}>
          <table className="min-w-full text-sm sm:text-sm">
            <DataGridHeader
              columns={columns}
              state={state}
              dispatch={dispatch}
              gridData={gridData}
              sortModel={sortModel}
              pinnedOffsets={pinnedOffsets}
              dragOverCol={dragOverCol}
              setDragOverCol={setDragOverCol}
              setDraggedCol={setDraggedCol}
              startResizing={startResizing}
              isResizing={isResizing}
              handleSort={handleSort}
              handleColumnDrop={handleColumnDrop}
            />
          </table>

          <div
            ref={containerRef}
            className="overflow-y-auto h-[420px] relative "
            style={{ width: "100%", scrollbarWidth: "none" }}
          >
            <div style={{ height: totalHeight, position: "relative" }}>
              <table className="min-w-full table-fixed relative border-separate">
                <tbody>
                  {visibleRows.map((row, i) => (
                    <tr
                      key={row.id}
                      style={{
                        position: "absolute",
                        top: (startIndex + i) * rowHeight,
                        height: rowHeight,
                        width: "100%",
                        display: "table",
                        tableLayout: "fixed",
                      }}
                    >
                      <DataGridRow
                        row={row}
                        columns={columns}
                        state={state}
                        dispatch={dispatch}
                        pinnedOffsets={pinnedOffsets}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        loading={loading}
                      />
                    </tr>
                  ))}

                  {loading &&
                    [...Array(pageSize)].map((_, i) => (
                      <tr key={`skeleton-${i}`}>
                        <td colSpan={columns.length}>
                          <div className="p-3 animate-pulse">
                            <div className="h-4 bg-gray-300 rounded w-2/3 mb-2" />
                            <div className="h-4 bg-gray-300 rounded w-1/2" />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Pagination
        page={page}
        total={total}
        pageSize={pageSize}
        pageSizeOptions={[5, 10, 25, 50, 100, total]}
        paginationMode={state.paginationMode}
        rowCount={total}
        onPageChange={(newPage) =>
          dispatch({ type: "SET_PAGE", payload: newPage })
        }
        onPageSizeChange={(newSize) =>
          dispatch({ type: "SET_PAGE_SIZE", payload: newSize })
        }
      />
    </div>
  );
}
