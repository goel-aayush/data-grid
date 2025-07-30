// components/ui/Input.tsx
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className = "", ...props }: InputProps) => {
  return (
    <input
      {...props}
      className={`px-3 py-2 border rounded text-sm w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};
