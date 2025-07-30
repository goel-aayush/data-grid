// components/ui/Select.tsx
import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ className = "", ...props }: SelectProps) => {
  return (
    <select
      {...props}
      className={`bg-gray-100 dark:bg-gray-800 ${className}`}
    />
  );
};
