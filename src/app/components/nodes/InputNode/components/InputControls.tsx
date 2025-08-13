import React from "react";
import { InputControlsProps } from "../types";

const InputControls: React.FC<InputControlsProps> = ({
  inputType,
  value,
  onTypeChange,
  onValueChange,
}) => {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    onValueChange(newValue);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onTypeChange(e.target.value);
  };

  return (
    <div className="space-y-3">
      {/* Input Type Selector */}
      <select
        value={inputType}
        onChange={handleTypeChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-semibold focus:outline-none focus:border-blue-500"
      >
        <option value="text">Text</option>
        <option value="file">File</option>
        <option value="number">Number</option>
      </select>

      {/* Value Input - only show for number type */}
      {inputType === "number" && (
        <input
          type="number"
          value={value}
          onChange={handleValueChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-center focus:outline-none focus:border-blue-500"
          placeholder="Enter a number..."
        />
      )}

      {/* Text Input - show for text type */}
      {inputType === "text" && (
        <textarea
          value={value.toString()}
          onChange={(e) => onValueChange(parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md resize-vertical min-h-[80px] focus:outline-none focus:border-blue-500"
          placeholder="Enter text..."
          rows={3}
        />
      )}

      {/* File Input - show for file type */}
      {inputType === "file" && (
        <input
          type="file"
          onChange={(e) => {
            // Handle file input - you might want to process the file
            console.log("File selected:", e.target.files?.[0]);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
        />
      )}

      {/* Type Display */}
      <div className="text-center text-sm text-gray-600">
        Type: <span className="font-medium">{inputType}</span>
        {inputType === "number" && (
          <span className="ml-2 text-blue-600">Value: {value}</span>
        )}
      </div>
    </div>
  );
};

export default InputControls;
