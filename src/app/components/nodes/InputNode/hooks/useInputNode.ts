import { useState, useCallback } from "react";
import { graph } from "../../../../../core/DependencyGraph";

export const useInputNode = (
  id: string,
  initialType: string,
  initialValue: number,
  nodeName: string
) => {
  const [inputType, setInputType] = useState<string>(initialType);
  const [value, setValue] = useState<number>(initialValue);

  const updateNodeOutput = useCallback(
    (newValue: number, newType: string, currentNodeName: string) => {
      const output = {
        value: newValue,
        inputType: newType,
        nodeName: currentNodeName,
        sourceNodeId: id,
      };

      graph.updateNodeData(id, {
        value: newValue,
        inputType: newType,
        nodeName: currentNodeName,
        output,
      });
    },
    [id]
  );

  const handleValueChange = useCallback(
    (newValue: number) => {
      setValue(newValue);
      updateNodeOutput(newValue, inputType, nodeName);
    },
    [inputType, nodeName, updateNodeOutput]
  );

  const handleTypeChange = useCallback(
    (newType: string) => {
      setInputType(newType);
      updateNodeOutput(value, newType, nodeName);
    },
    [value, nodeName, updateNodeOutput]
  );

  const updateWithNewNodeName = useCallback(
    (newNodeName: string) => {
      updateNodeOutput(value, inputType, newNodeName);
    },
    [value, inputType, updateNodeOutput]
  );

  return {
    inputType,
    value,
    handleValueChange,
    handleTypeChange,
    updateWithNewNodeName,
    setInputType,
    setValue,
  };
};
