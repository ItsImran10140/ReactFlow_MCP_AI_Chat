/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, memo } from "react";
import BaseNode from "../BaseNode/BaseNodes";
import EditableNodeName from "../shared/components/EditableNodeName";
import StatusIndicator from "../shared/components/StatusIndicator";
import InputControls from "./components/InputControls";
import { useNodeName } from "../shared/hooks/useNodeName";
import { useInputNode } from "./hooks/useInputNode";
import { InputNodeData } from "./types";
import { BaseNodeProps } from "../shared/types";

const InputNode = memo(({ id, data }: BaseNodeProps) => {
  const typedData = data as InputNodeData;

  const nodeNameHook = useNodeName(id, typedData.nodeName || "Input Node");
  const inputHook = useInputNode(
    id,
    typedData.inputType || "text",
    typedData.value || 0,
    nodeNameHook.nodeName
  );

  // Handle node name changes with graph update
  const handleNameChange = (newName: string) => {
    nodeNameHook.handleNameChange(newName);
    inputHook.updateWithNewNodeName(newName);
  };

  // Update state from external data changes
  useEffect(() => {
    if (
      typedData.nodeName !== undefined &&
      typedData.nodeName !== nodeNameHook.nodeName
    ) {
      nodeNameHook.setNodeName(typedData.nodeName);
    }
    if (
      typedData.inputType !== undefined &&
      typedData.inputType !== inputHook.inputType
    ) {
      inputHook.setInputType(typedData.inputType);
    }
    if (typedData.value !== undefined && typedData.value !== inputHook.value) {
      inputHook.setValue(typedData.value);
    }
  }, [typedData, nodeNameHook.nodeName, inputHook.inputType, inputHook.value]);

  const baseNodeData = {
    handles: [
      {
        type: "source" as const,
        position: "right" as const,
        id: "output",
        className: "bg-blue-500",
      },
    ],
  };

  return (
    <BaseNode data={baseNodeData} className="w-72">
      <div className="space-y-3">
        <EditableNodeName
          nodeName={nodeNameHook.nodeName}
          isEditing={nodeNameHook.isEditingName}
          onChange={handleNameChange}
          onKeyPress={nodeNameHook.handleNameKeyPress}
          onBlur={nodeNameHook.handleNameBlur}
          onClick={nodeNameHook.handleNameClick}
        />

        <InputControls
          inputType={inputHook.inputType}
          value={inputHook.value}
          onTypeChange={inputHook.handleTypeChange}
          onValueChange={inputHook.handleValueChange}
        />

        <StatusIndicator
          isActive={true}
          activeText={`${
            inputHook.inputType.charAt(0).toUpperCase() +
            inputHook.inputType.slice(1)
          } Input Ready`}
        />
      </div>
    </BaseNode>
  );
});

InputNode.displayName = "InputNode";
export default InputNode;
