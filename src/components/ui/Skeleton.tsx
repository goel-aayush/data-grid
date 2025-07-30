// components/ui/Skeleton.tsx
export function Skeleton({
  width = "100%",
  height = "1.25rem",
}: {
  width?: string;
  height?: string;
}) {
  return (
    <div
      className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
      style={{ width, height }}
    />
  );
}
