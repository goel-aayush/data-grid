"use client";

import React, { useState } from "react";
import {
  Column,
  ColumnManagerProps,
  RowData,
  SortModel,
} from "@/types/grid.types";
import ColumnActionModal from "@/components/ui/Modal";
import { MoreVertical } from "lucide-react";
import ColumnManager from "./ColumnManager";

function getOrderedColumns(columns: Column[]) {
  const left = columns.filter((c) => c.pinned === "left");
  const right = columns.filter((c) => c.pinned === "right");
  const center = columns.filter((c) => !c.pinned);
  return [...left, ...center, ...right];
}

export default function DataGridHeader({
  columns,
  state,
  dispatch,
  gridData,
  sortModel,
  pinnedOffsets,
  dragOverCol,
  setDraggedCol,
  setDragOverCol,
  startResizing,
  isResizing,
  handleSort,
  handleColumnDrop,
}: ColumnManagerProps) {
  const visibleColumns = getOrderedColumns(
    columns.filter((col: Column) => state.visibleColumns.includes(col.key))
  );

  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [visibilityModalOpen, setVisibilityModalOpen] = useState(false);
  const [modalColumn, setModalColumn] = useState<{
    key: string;
    label: string;
  } | null>(null);

  return (
    <>
      <thead className="top-0 z-10 bg-gray-100 dark:bg-gray-900">
        <tr>
          {visibleColumns.map((col: Column) => {
            const sort = sortModel.find((s: SortModel) => s.key === col.key);
            const baseStyle: React.CSSProperties = {
              width: col.width ?? 150,
              left:
                col.pinned === "left" ? pinnedOffsets.left[col.key] : undefined,
              right:
                col.pinned === "right"
                  ? pinnedOffsets.right[col.key]
                  : undefined,
            };

            const isSpecial =
              col.key === "__actions__" || col.key === "__select__";
            const pinnedClass =
              !isSpecial && col.pinned === "left"
                ? "sticky left-0 z-20"
                : !isSpecial && col.pinned === "right"
                ? "sticky right-0 z-20"
                : "";

            return (
              <th
                key={col.key}
                data-key={col.key}
                className={`relative px-2 py-1 sm:px-3 sm:py-2 bg-gray-100 dark:bg-gray-800 text-left text-xs sm:text-sm font-medium whitespace-nowrap ${pinnedClass} ${
                  dragOverCol === col.key ? "ring-2 ring-blue-500" : ""
                }`}
                style={baseStyle}
                draggable={!isResizing.current}
                onDragStart={(e) => {
                  if (!isResizing.current) {
                    e.dataTransfer.setData("text/plain", col.key);
                    setDraggedCol(col.key);
                  } else {
                    e.preventDefault();
                  }
                }}
                onDragOver={(e) => {
                  if (!isResizing.current) {
                    e.preventDefault();
                    setDragOverCol(col.key);
                  }
                }}
                onDrop={() => {
                  if (!isResizing.current) {
                    setDragOverCol(col.key);
                    handleColumnDrop();
                  }
                }}
                onDragLeave={() => {
                  if (!isResizing.current) {
                    setDragOverCol(null);
                  }
                }}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  {col.key === "__select__" ? (
                    <input
                      type="checkbox"
                      checked={
                        gridData.length > 0 &&
                        gridData.every((row: RowData) =>
                          state.selectedRows.includes(row.id)
                        )
                      }
                      onChange={(e) =>
                        dispatch({
                          type: "TOGGLE_SELECT_ALL",
                          payload: {
                            ids: gridData.map((r: RowData) => r.id),
                            checked: e.target.checked,
                          },
                        })
                      }
                    />
                  ) : col.key === "__actions__" ? (
                    <span>Actions</span>
                  ) : (
                    <>
                      {/* Column Label + Sort */}
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={(e) => handleSort(col.key, e.shiftKey)}
                      >
                        {col.label}
                        {sort && (
                          <span className="text-xs">
                            {sort.direction === "asc" ? "▲" : "▼"}
                          </span>
                        )}
                      </div>

                      {/* Kebab Menu */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = (
                            e.target as HTMLElement
                          ).getBoundingClientRect();
                          setModalColumn({ key: col.key, label: col.label });
                          setMenuPosition({ x: rect.left, y: rect.bottom });
                          setColumnModalOpen(true);
                        }}
                      >
                        <MoreVertical size={16} />
                      </button>
                    </>
                  )}
                </div>

                {/* Resize handle */}
                <div
                  onMouseDown={(e) => startResizing(e, col.key)}
                  className="absolute top-0 right-0 h-full w-1 sm:w-1.5 cursor-col-resize bg-gray-300 hover:bg-blue-400 transition"
                  style={{ zIndex: 10 }}
                />
              </th>
            );
          })}
        </tr>

        <tr>
          {visibleColumns.map((col: Column) => {
            const baseStyle: React.CSSProperties = {
              width: col.width ?? 150,
              left:
                col.pinned === "left" ? pinnedOffsets.left[col.key] : undefined,
              right:
                col.pinned === "right"
                  ? pinnedOffsets.right[col.key]
                  : undefined,
            };

            const pinnedClass =
              col.pinned === "left"
                ? "sticky left-0 z-10"
                : col.pinned === "right"
                ? "sticky right-0 z-10"
                : "";

            const filterValue = state.filterModel?.columns?.[col.key] ?? "";

            return (
              <th
                key={col.key}
                className={`bg-white dark:bg-gray-900 border-b border-r px-2 py-1 ${pinnedClass}`}
                style={baseStyle}
              >
                {col.key !== "__select__" && col.key !== "__actions__" && (
                  <input
                    type="text"
                    value={filterValue}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_COLUMN_FILTER",
                        payload: { key: col.key, value: e.target.value },
                      })
                    }
                    placeholder="Filter..."
                    className="w-full border border-gray-300 rounded px-1 py-0.5 text-sm dark:bg-gray-800 dark:text-white"
                  />
                )}
              </th>
            );
          })}
        </tr>
      </thead>

      {/* Modal for context menu */}
      {modalColumn && (
        <ColumnActionModal
          open={columnModalOpen}
          onClose={() => setColumnModalOpen(false)}
          columnLabel={modalColumn.label}
          position={menuPosition}
          onSortAsc={() => {
            handleSort(modalColumn.key, false);
            setColumnModalOpen(false);
          }}
          onSortDesc={() => {
            handleSort(modalColumn.key, true);
            setColumnModalOpen(false);
          }}
          onPinLeft={() => {
            dispatch({
              type: "SET_COLUMN_PINNING",
              payload: { key: modalColumn.key, pinned: "left" },
            });
            setColumnModalOpen(false);
          }}
          onPinRight={() => {
            dispatch({
              type: "SET_COLUMN_PINNING",
              payload: { key: modalColumn.key, pinned: "right" },
            });
            setColumnModalOpen(false);
          }}
          onHide={() => {
            dispatch({
              type: "TOGGLE_COLUMN_VISIBILITY",
              payload: modalColumn.key,
            });
            setColumnModalOpen(false);
          }}
          onManageColumns={() => {
            setColumnModalOpen(false);
            setVisibilityModalOpen(true);
          }}
        />
      )}

      <ColumnManager
        open={visibilityModalOpen}
        onClose={() => setVisibilityModalOpen(false)}
        columns={columns}
        visibleColumns={state.visibleColumns}
        setVisibleColumns={(newCols) =>
          dispatch({ type: "SET_VISIBLE_COLUMNS", payload: newCols })
        }
        defaultVisibleColumns={columns.map(
          (col: unknown) => (col as Column).key
        )}
      />
    </>
  );
}
