import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

type Props = {
  open: boolean;
  onClose: () => void;
  columns: { key: string; label: string }[];
  visibleColumns: string[];
  setVisibleColumns: (keys: string[]) => void;
  defaultVisibleColumns: string[];
};

export default function ColumnManager({
  open,
  onClose,
  columns,
  visibleColumns,
  setVisibleColumns,
  defaultVisibleColumns,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [open, onClose]);

  const filtered = columns.filter((col) =>
    col.label.toLowerCase().includes(search.toLowerCase())
  );

  const isAllChecked = visibleColumns.length === columns.length;
  const toggleAll = () => {
    if (isAllChecked) {
      setVisibleColumns([]);
    } else {
      setVisibleColumns(columns.map((c) => c.key));
    }
  };

  const toggleOne = (key: string) => {
    if (visibleColumns.includes(key)) {
      setVisibleColumns(visibleColumns.filter((k) => k !== key));
    } else {
      setVisibleColumns([...visibleColumns, key]);
    }
  };

  const reset = () => {
    setVisibleColumns(defaultVisibleColumns);
  };

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute z-50 w-72 bg-gray-900 text-white rounded shadow-lg p-3"
    >
      {/* Search */}
      <div className="flex items-center bg-gray-800 px-2 py-1 rounded mb-3">
        <FaSearch className="text-sm mr-2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/* Column Checkboxes */}
      <ul className="max-h-64 overflow-y-auto text-sm space-y-1 mb-2">
        {filtered.map((col) => (
          <li key={col.key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={visibleColumns.includes(col.key)}
              onChange={() => toggleOne(col.key)}
              className="accent-blue-400"
            />
            <label>{col.label}</label>
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-700 pt-2 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isAllChecked}
            onChange={toggleAll}
            className="accent-blue-400"
          />
          <label>Show/Hide All</label>
        </div>
        <button
          onClick={reset}
          className="text-gray-400 hover:text-white font-semibold"
        >
          RESET
        </button>
      </div>
    </div>
  );
}
