import React from "react";

interface ErrorDisplayProps {
  error: string;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  className = "text-red-600 bg-red-50 border-red-200",
}) => {
  if (!error) return null;

  return (
    <div className={`p-2 text-xs border rounded ${className}`}>{error}</div>
  );
};

export default ErrorDisplay;
