// components/ui/Button.tsx
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

const variantStyles = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export const Button = ({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={`px-4 py-2 text-sm rounded transition ${variantStyles[variant]} ${className}`}
    />
  );
};
