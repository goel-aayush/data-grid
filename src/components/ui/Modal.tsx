import React, { useEffect, useRef } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaEyeSlash,
  FaThumbtack,
  FaColumns,
} from "react-icons/fa";

type Props = {
  open: boolean;
  onClose: () => void;
  columnLabel: string;
  position: { x: number; y: number };
  onSortAsc: () => void;
  onSortDesc: () => void;
  onPinLeft: () => void;
  onPinRight: () => void;
  onHide: () => void;
  onManageColumns: () => void;
};

export default function ColumnActionModal({
  open,
  onClose,
  columnLabel,
  position,
  onSortAsc,
  onSortDesc,
  onPinLeft,
  onPinRight,

  onHide,
  onManageColumns,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;
  console.log("close", onClose);

  return (
    <div
      className="absolute z-50 bg-gray-900 text-white rounded-lg shadow-lg w-64"
      ref={ref}
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <div className="p-3">
        <h2 className="text-sm font-semibold mb-2">{columnLabel} Options</h2>
        <ul className="space-y-1 text-sm">
          <li
            className="cursor-pointer hover:bg-gray-700 px-3 py-2 rounded"
            onClick={onSortAsc}
          >
            <FaArrowUp className="inline mr-2" /> Sort by ASC
          </li>
          <li
            className="cursor-pointer hover:bg-gray-700 px-3 py-2 rounded"
            onClick={onSortDesc}
          >
            <FaArrowDown className="inline mr-2" /> Sort by DESC
          </li>
          <li
            className="cursor-pointer hover:bg-gray-700 px-3 py-2 rounded"
            onClick={onPinLeft}
          >
            <FaThumbtack className="inline mr-2 rotate-45" /> Pin to left
          </li>
          <li
            className="cursor-pointer hover:bg-gray-700 px-3 py-2 rounded"
            onClick={onPinRight}
          >
            <FaThumbtack className="inline mr-2 -rotate-45" /> Pin to right
          </li>

          <li
            className="cursor-pointer hover:bg-gray-700 px-3 py-2 rounded"
            onClick={onHide}
          >
            <FaEyeSlash className="inline mr-2" /> Hide column
          </li>
          <li
            className="cursor-pointer hover:bg-gray-700 px-3 py-2 rounded"
            onClick={onManageColumns}
          >
            <FaColumns className="inline mr-2" /> Manage columns
          </li>
        </ul>
      </div>
    </div>
  );
}
