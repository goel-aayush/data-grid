"use client";

import React from "react";
import Image from "next/image";
import { Input } from "../ui/Input";
import {
  Column,
  DataGridState,
  GridAction,
  RowData,
} from "../../types/grid.types";

interface DataGridCellProps {
  row: RowData;
  column: Column;
  state: DataGridState;
  dispatch: React.Dispatch<GridAction>;
  pinnedOffset?: number;
}

export default function DataGridCell({
  row,
  column,
  state,
  dispatch,
  pinnedOffset,
}: DataGridCellProps) {
  const isPinnedLeft = column.pinned === "left";
  const isPinnedRight = column.pinned === "right";
  const isEditing =
    state.editingCell?.rowId === row.id &&
    state.editingCell?.key === column.key;

  const baseStyle: React.CSSProperties = {
    position: isPinnedLeft ? "sticky" : isPinnedRight ? "sticky" : "static",
    width: column.width ?? 150,
    left: isPinnedLeft ? pinnedOffset : undefined,
    right: isPinnedRight ? pinnedOffset : undefined,
    zIndex: isPinnedLeft || isPinnedRight ? 10 : undefined,
    // for overlap
  };

  const stickyClass = isPinnedLeft
    ? "sticky left-0 z-10 bg-white dark:bg-gray-900"
    : isPinnedRight
    ? "sticky right-0 z-10 bg-white dark:bg-gray-900"
    : "";

  const classNames = `
    border-b text-sm text-gray-700 dark:text-gray-200
    px-4 py-2 truncate ${stickyClass}
    
  `;

  //  checkbox column
  if (column.key === "__select__") {
    return (
      <td className={`border-b px-2 ${stickyClass}`} style={baseStyle}>
        <Input
          type="checkbox"
          checked={state.selectedRows.includes(row.id)}
          onChange={(e) =>
            dispatch({
              type: "TOGGLE_ROW_SELECTION",
              payload: {
                id: row.id,
                checked: e.target.checked,
              },
            })
          }
        />
      </td>
    );
  }

  //  actions column
  if (column.key === "__actions__") {
    return (
      <td className={`border-b px-2 ${stickyClass}`} style={baseStyle}></td>
    );
  }

  // Add this function inside the component
  const handleUpdate = async (newValue: string) => {
    dispatch({
      type: "UPDATE_CELL_VALUE",
      payload: {
        rowId: row.id,
        key: column.key,
        value: newValue,
      },
    });

    dispatch({ type: "STOP_EDITING" });

    try {
      await fetch(`https://backend-datagrid.onrender.com/api/users/${row.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [column.key]: newValue }),
      });
    } catch (error) {
      console.error("Failed to update cell:", error);
    }
  };

  return (
    <td
      className={classNames}
      style={baseStyle}
      onDoubleClick={() =>
        dispatch({
          type: "START_EDITING",
          payload: { rowId: row.id, key: column.key },
        })
      }
    >
      {isEditing ? (
        <Input
          type="text"
          autoFocus
          defaultValue={row[column.key]}
          className="w-full px-1 py-0.5 border rounded text-sm"
          onBlur={(e) => handleUpdate(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleUpdate((e.target as HTMLInputElement).value);
            }
            if (e.key === "Escape") {
              dispatch({ type: "STOP_EDITING" });
            }
          }}
        />
      ) : column.key === "avatar" && typeof row[column.key] === "string" ? (
        <div className="w-8 h-8 relative">
          <Image
            src={String(row[column.key] || "")}
            alt="Avatar"
            fill
            sizes="32px"
            className="rounded-full object-cover"
          />
        </div>
      ) : (
        row[column.key]
      )}
    </td>
  );
}
