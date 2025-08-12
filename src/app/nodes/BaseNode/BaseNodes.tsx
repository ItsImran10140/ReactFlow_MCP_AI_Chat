/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { twMerge } from "tailwind-merge";

// Define valid handle positions
type HandlePosition = "top" | "bottom" | "left" | "right";

// Configuration for each handle
export type HandleConfig = {
  type: "source" | "target";
  position: HandlePosition;
  id?: string;
  className?: string;
};

// Props for BaseNode
export type BaseNodeProps = {
  data: {
    label?: string;
    handles?: HandleConfig[];
    className?: string;
  };
  children?: React.ReactNode;
  isConnectable?: boolean;
  className?: string;
};

// Map Position type from reactflow
const positionMap: Record<HandlePosition, Position> = {
  top: Position.Top,
  bottom: Position.Bottom,
  left: Position.Left,
  right: Position.Right,
};

const BaseNode: React.FC<BaseNodeProps> = ({
  data,
  children,
  isConnectable = true,
  className = "",
}) => {
  const { handles = [] } = data;

  return (
    <div
      className={twMerge(
        "bg-white border-2 border-gray-300 rounded-lg shadow-md w-64 transition-all duration-200 hover:shadow-lg",
        className
      )}
    >
      {/* Render all handles */}
      {handles.map((handle: HandleConfig, index: number) => {
        const { type, position, id, className: handleClass } = handle;
        const reactFlowPosition = positionMap[position as HandlePosition];

        return (
          <Handle
            key={id || `${type}-${position}-${index}`}
            type={type}
            position={reactFlowPosition}
            id={id}
            isConnectable={isConnectable}
            className={twMerge(
              `w-3 h-3 rounded-sm border-2 ${
                type === "target" ? "bg-blue-500" : "bg-green-500"
              }`,
              handleClass || ""
            )}
          />
        );
      })}

      {/* Content */}
      <div className="p-4 space-y-3">
        {data.label && (
          <div className="text-sm font-semibold text-gray-700">
            {data.label}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default BaseNode;
