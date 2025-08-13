import React from "react";

interface StatusIndicatorProps {
  isLoading?: boolean;
  isActive?: boolean;
  messageCount?: number;
  loadingText?: string;
  activeText?: string;
  inactiveText?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  isLoading = false,
  isActive = false,
  messageCount = 0,
  loadingText = "Processing...",
  activeText = "Active",
  inactiveText = "Inactive",
}) => {
  const getStatusText = () => {
    if (isLoading) return loadingText;
    if (messageCount > 0) return `${messageCount} Messages`;
    return isActive ? activeText : inactiveText;
  };

  const getStatusColor = () => {
    if (isLoading) return "bg-yellow-100 text-yellow-800";
    if (isActive || messageCount > 0) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-600";
  };

  const getDotColor = () => {
    if (isLoading) return "bg-yellow-500 animate-pulse";
    if (isActive || messageCount > 0) return "bg-green-500";
    return "bg-gray-400";
  };

  return (
    <div className="text-center">
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor()}`}
      >
        <div className={`w-2 h-2 rounded-full mr-1 ${getDotColor()}`} />
        {getStatusText()}
      </div>
    </div>
  );
};

export default StatusIndicator;
