// "use client";

// import { Input } from "../ui/Input";
// import { Button } from "../ui/Button";
// import { Skeleton } from "../ui/Skeleton";
// import { DataGridRowProps } from "../../types/grid.types";
// import Image from "next/image";

// export default function DataGridRow({
//   row,
//   columns,
//   state,
//   dispatch,
//   pinnedOffsets,
//   handleEdit,
//   handleDelete,
//   loading = false,
// }: DataGridRowProps) {
//   return (
//     <>
//       {columns
//         .filter((col) => state.visibleColumns.includes(col.key))
//         .map((col) => {
//           const baseStyle: React.CSSProperties = {
//             width: col.width,
//           };

//           if (col.pinned === "left") {
//             baseStyle.left = pinnedOffsets.left[col.key];
//           } else if (col.pinned === "right") {
//             baseStyle.right = pinnedOffsets.right[col.key];
//           }

//           const stickyClass =
//             col.pinned === "left"
//               ? "sticky left-0 z-20 bg-white dark:bg-gray-900"
//               : col.pinned === "right"
//               ? "sticky right-0 z-20 bg-white dark:bg-gray-900"
//               : "";

//           const isEditing =
//             state.editingCell?.rowId === row.id &&
//             state.editingCell?.key === col.key;

//           if (col.key === "__select__") {
//             return (
//               <td
//                 key={col.key}
//                 className={`border-b ${stickyClass} px-2 sm:px-4 py-1 sm:py-2 truncate text-xs sm:text-sm`}
//                 style={baseStyle}
//               >
//                 {loading ? (
//                   <Skeleton width="1.25rem" height="1.25rem" />
//                 ) : (
//                   <Input
//                     type="checkbox"
//                     checked={state.selectedRows.includes(row.id)}
//                     onChange={() =>
//                       dispatch({
//                         type: "TOGGLE_ROW_SELECTION",
//                         payload: {
//                           id: row.id,
//                           checked: !state.selectedRows.includes(row.id),
//                         },
//                       })
//                     }
//                   />
//                 )}
//               </td>
//             );
//           }

//           if (col.key === "__actions__") {
//             return (
//               <td
//                 key={col.key}
//                 className={`border-b ${stickyClass}`}
//                 style={baseStyle}
//               >
//                 {loading ? (
//                   <Skeleton width="4rem" height="1.25rem" />
//                 ) : (
//                   <div className="flex gap-1">
//                     <Button
//                       onClick={() => handleEdit(row)}
//                       className="text-blue-500 hover:underline text-xs"
//                     >
//                       ✏️
//                     </Button>
//                     <Button
//                       onClick={() => handleDelete(row.id)}
//                       className="text-red-500 hover:underline text-xs"
//                     >
//                       🗑️
//                     </Button>
//                   </div>
//                 )}
//               </td>
//             );
//           }

//           return (
//             <td
//               key={col.key}
//               className={`border-b px-4 py-2 truncate ${stickyClass}`}
//               style={baseStyle}
//               onDoubleClick={() =>
//                 !loading &&
//                 dispatch({
//                   type: "START_EDITING",
//                   payload: { rowId: row.id, key: col.key },
//                 })
//               }
//             >
//               {loading ? (
//                 <Skeleton />
//               ) : isEditing ? (
//                 <Input
//                   type="text"
//                   autoFocus
//                   className="w-full px-1 py-0.5 border rounded text-sm"
//                   defaultValue={row[col.key]}
//                   onBlur={(e) => {
//                     dispatch({
//                       type: "UPDATE_CELL_VALUE",
//                       payload: {
//                         rowId: row.id,
//                         key: col.key,
//                         value: e.target.value,
//                       },
//                     });
//                     dispatch({ type: "STOP_EDITING" });
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       dispatch({
//                         type: "UPDATE_CELL_VALUE",
//                         payload: {
//                           rowId: row.id,
//                           key: col.key,
//                           value: (e.target as HTMLInputElement).value,
//                         },
//                       });
//                       dispatch({ type: "STOP_EDITING" });
//                     }
//                     if (e.key === "Escape") {
//                       dispatch({ type: "STOP_EDITING" });
//                     }
//                   }}
//                 />
//               ) : col.key === "avatar" && typeof row[col.key] === "string" ? (
//                 <div className="w-8 h-8 relative">
//                   <Image
//                     src={row[col.key]}
//                     alt="Avatar"
//                     fill
//                     sizes="32px"
//                     className="rounded-full object-cover"
//                     onError={(e) => {
//                       // fallback mechanism (optional — <Image> doesn't support onError directly)
//                       console.warn("Failed to load avatar:", row[col.key]);
//                     }}
//                   />
//                 </div>
//               ) : (
//                 row[col.key]
//               )}
//             </td>
//           );
//         })}
//     </>
//   );
// }

"use client";

import { Skeleton } from "../ui/Skeleton";
import { Button } from "../ui/Button";
import { DataGridRowProps } from "../../types/grid.types";
import DataGridCell from "./DataGridCell";

export default function DataGridRow({
  row,
  columns,
  state,
  dispatch,
  pinnedOffsets,
  handleEdit,
  handleDelete,
  loading = false,
}: DataGridRowProps) {
  return (
    <>
      {columns
        .filter((col) => state.visibleColumns.includes(col.key))
        .map((col) => {
          if (col.key === "__actions__") {
            // const baseStyle: React.CSSProperties = {
            //   width: col.width,
            //   left:
            //     col.pinned === "left" ? pinnedOffsets.left[col.key] : undefined,
            //   right:
            //     col.pinned === "right"
            //       ? pinnedOffsets.right[col.key]
            //       : undefined,
            // };
            const isSpecial =
              col.key === "__actions__" || col.key === "__select__";
            const stickyClass =
              !isSpecial && col.pinned === "left"
                ? "sticky left-0 z-20 bg-white dark:bg-gray-900"
                : col.pinned === "right"
                ? "sticky right-0 z-20 bg-white dark:bg-gray-900"
                : "";

            const baseStyle: React.CSSProperties = {
              width: col.width,
              left:
                !isSpecial && col.pinned === "left"
                  ? pinnedOffsets.left[col.key]
                  : undefined,
              right:
                !isSpecial && col.pinned === "right"
                  ? pinnedOffsets.right[col.key]
                  : undefined,
            };

            return (
              <td
                key={col.key}
                className={`border-b ${stickyClass}`}
                style={baseStyle}
              >
                {loading ? (
                  <Skeleton width="4rem" height="1.25rem" />
                ) : (
                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleEdit(row)}
                      className="text-blue-500 hover:underline text-xs"
                    >
                      ✏️
                    </Button>
                    <Button
                      onClick={() => handleDelete(row.id)}
                      className="text-red-500 hover:underline text-xs"
                    >
                      🗑️
                    </Button>
                  </div>
                )}
              </td>
            );
          }

          return (
            <DataGridCell
              key={col.key}
              row={row}
              column={col}
              state={state}
              dispatch={dispatch}
              pinnedOffset={
                col.pinned === "left"
                  ? pinnedOffsets.left[col.key]
                  : col.pinned === "right"
                  ? pinnedOffsets.right[col.key]
                  : undefined
              }
            />
          );
        })}
    </>
  );
}
