"use client";
import React, { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { Input } from "../ui/Input";

interface FilterPanelProps {
  search: string;
  onSearchChange: (val: string) => void;
  onExport: () => void;
}

export default function FilterPanel({
  search,
  onSearchChange,
  onExport,
}: FilterPanelProps) {
  const [inputValue, setInputValue] = useState(search);

  const debouncedSearch = useMemo(
    () =>
      debounce((val: string) => {
        onSearchChange(val);
      }, 300),
    [onSearchChange]
  );

  useEffect(() => {
    debouncedSearch(inputValue);
    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue, debouncedSearch]);

  return (
    <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 px-4 py-2 ">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search..."
        className="mb-2 px-3 py-2 border rounded text-sm w-full max-w-md"
      />

      <div className="flex justify-between items-center gap-2 text-sm">
        <button
          onClick={onExport}
          className="px-3 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import debounce from "lodash.debounce";
// import { Input } from "../ui/Input";

// const OPERATORS = {
//   string: ["contains", "=", "!="],
//   number: ["=", "!=", "<", ">", "<=", ">="],
// };

// interface ColumnOption {
//   label: string;
//   value: string;
//   type: "string" | "number";
// }

// interface FilterRule {
//   id: number;
//   column: string;
//   operator: string;
//   value: string;
//   type: "string" | "number";
//   logic?: "and" | "or";
// }

// interface FilterPanelProps {
//   open: boolean;
//   columns: ColumnOption[];
//   onClose: () => void;
//   onSearchChange: (filters: FilterRule[]) => void;
//   onExport: () => void;
//   activeColumnKey?: string | null;
// }

// export default function FilterPanel({
//   open,
//   onClose,
//   columns,
//   onSearchChange,
//   activeColumnKey,
//   onExport,
// }: FilterPanelProps) {
//   const [filters, setFilters] = useState<FilterRule[]>([]);
//   const panelRef = useRef<HTMLDivElement>(null);

//   // Handle outside click to close panel
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         panelRef.current &&
//         !panelRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     };

//     if (open) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [open, onClose]);

//   // Debounced onSearchChange
//   const debouncedFilterChange = useMemo(
//     () =>
//       debounce((filters) => {
//         onSearchChange?.(filters); // only call if function exists
//       }, 300),
//     [onSearchChange] // very important
//   );

//   useEffect(() => {
//     if (filters && Object.keys(filters).length > 0) {
//       debouncedFilterChange(filters);
//     }
//   }, [filters, debouncedFilterChange]); // ✅ correct deps
//   // Flush filters on close to ensure latest change is applied
//   useEffect(() => {
//     if (!open) {
//       debouncedFilterChange.flush();
//     }
//   }, [open, debouncedFilterChange]);

//   const handleAddFilter = () => {
//     if (!columns.length) return;

//     const defaultCol =
//       columns.find((c) => c.value === activeColumnKey) || columns[0];

//     setFilters((prev) => [
//       ...prev,
//       {
//         id: Date.now(),
//         column: defaultCol.value,
//         operator: OPERATORS[defaultCol.type][0],
//         value: "",
//         type: defaultCol.type,
//       },
//     ]);
//   };

//   const sortedColumns = useMemo(() => {
//     if (!activeColumnKey) return columns;
//     const active = columns.find((c) => c.value === activeColumnKey);
//     const rest = columns.filter((c) => c.value !== activeColumnKey);
//     return active ? [active, ...rest] : columns;
//   }, [columns, activeColumnKey]);

//   const handleRemoveFilter = (id: number) => {
//     setFilters((prev) => prev.filter((f) => f.id !== id));
//   };

//   const handleChange = (id: number, key: keyof FilterRule, value: any) => {
//     setFilters((prev) =>
//       prev.map((f) =>
//         f.id === id
//           ? {
//               ...f,
//               [key]: value,
//               ...(key === "column"
//                 ? {
//                     type:
//                       columns.find((c) => c.value === value)?.type ?? "string",
//                     operator:
//                       OPERATORS[
//                         columns.find((c) => c.value === value)?.type ?? "string"
//                       ][0],
//                   }
//                 : {}),
//             }
//           : f
//       )
//     );
//   };

//   const handleClearAll = () => {
//     setFilters([]);
//   };

//   if (!open) return null;

//   return (
//     <div
//       ref={panelRef}
//       className="absolute z-50 w-[420px] bg-gray-900 text-white rounded shadow-lg p-4 text-sm"
//     >
//       {filters.map((f, idx) => {
//         const availableOperators = OPERATORS[f.type];

//         return (
//           <div key={f.id} className="flex flex-wrap gap-2 items-center mb-2">
//             {idx > 0 && (
//               <select
//                 className="border rounded px-2 py-1 bg-gray-800"
//                 value={f.logic || "and"}
//                 onChange={(e) => handleChange(f.id, "logic", e.target.value)}
//               >
//                 <option value="and">And</option>
//                 <option value="or">Or</option>
//               </select>
//             )}

//             <select
//               className="border rounded px-2 py-1 bg-gray-800"
//               value={f.column}
//               onChange={(e) => handleChange(f.id, "column", e.target.value)}
//             >
//               {sortedColumns.map((col) => (
//                 <option key={col.value} value={col.value}>
//                   {col.label}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="border rounded px-2 py-1 bg-gray-800"
//               value={f.operator}
//               onChange={(e) => handleChange(f.id, "operator", e.target.value)}
//             >
//               {availableOperators.map((op) => (
//                 <option key={op} value={op}>
//                   {op}
//                 </option>
//               ))}
//             </select>

//             <Input
//               className="px-2 py-1 w-[160px] bg-gray-800"
//               type={f.type === "number" ? "number" : "text"}
//               value={f.value}
//               onChange={(e) => handleChange(f.id, "value", e.target.value)}
//               placeholder="Filter value"
//             />

//             <button
//               className="text-red-500 hover:text-red-700"
//               onClick={() => handleRemoveFilter(f.id)}
//             >
//               ✕
//             </button>
//           </div>
//         );
//       })}

//       <div className="flex gap-2 mt-2">
//         <button
//           onClick={handleAddFilter}
//           className="px-3 py-1 border rounded bg-blue-500 text-white hover:bg-blue-600"
//         >
//           + Add Filter
//         </button>
//         {filters.length > 0 && (
//           <button
//             onClick={handleClearAll}
//             className="text-sm text-red-500 hover:text-red-700"
//           >
//             🗑 Remove All
//           </button>
//         )}
//         <button
//           onClick={onExport}
//           className="ml-auto px-3 py-1 border rounded bg-green-500 text-white hover:bg-green-600"
//         >
//           Export CSV
//         </button>
//       </div>
//     </div>
//   );
// }
