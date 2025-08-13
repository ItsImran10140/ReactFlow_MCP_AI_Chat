import React from "react";

interface EditableNodeNameProps {
  nodeName: string;
  isEditing: boolean;
  onChange: (name: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onClick: () => void;
  className?: string;
}

const EditableNodeName: React.FC<EditableNodeNameProps> = ({
  nodeName,
  isEditing,
  onChange,
  onKeyPress,
  onBlur,
  onClick,
  className = "border-blue-300 focus:border-blue-500",
}) => {
  return (
    <div className="mb-2">
      {isEditing ? (
        <input
          type="text"
          value={nodeName}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          onBlur={onBlur}
          className={`w-full px-2 py-1 text-sm font-medium text-center border rounded focus:outline-none ${className}`}
          autoFocus
        />
      ) : (
        <div
          onClick={onClick}
          className="w-full px-2 py-1 text-sm font-medium text-center cursor-pointer hover:bg-gray-50 rounded border border-transparent hover:border-gray-200"
          title="Click to edit node name"
        >
          {nodeName}
        </div>
      )}
    </div>
  );
};

export default EditableNodeName;
