import React from "react";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  pageSizeOptions: number[];
  paginationMode: "client" | "server";
  rowCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

export default function Pagination({
  page,
  total,
  pageSize,
  pageSizeOptions,
  paginationMode,
  rowCount,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const maxPage =
    paginationMode === "server"
      ? Math.ceil(total / pageSize)
      : Math.ceil(rowCount / pageSize);

  return (
    <div className="sticky bottom-0 z-30 bg-white dark:bg-gray-900 border-t px-4 py-2 text-sm flex flex-wrap justify-end items-center gap-2">
      <Button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-2 py-1 border rounded"
      >
        Prev
      </Button>

      <span>
        Page {page} of {maxPage}
      </span>

      <Button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= maxPage}
        className="px-2 py-1 border rounded"
      >
        Next
      </Button>

      <Select
        value={pageSize}
        onChange={(e) => {
          onPageSizeChange(+e.target.value);
          onPageChange(1);
        }}
        className="border px-2 py-1 rounded"
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size} rows
          </option>
        ))}
      </Select>
    </div>
  );
}
