import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "blue" | "white" | "gray";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  color = "blue"
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };

  const colorClasses = {
    blue: "text-blue-600",
    white: "text-white",
    gray: "text-gray-600"
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          animate-spin rounded-full border-2 border-t-transparent
          ${sizeClasses[size]}
          ${colorClasses[color]}
          border-current
        `}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};