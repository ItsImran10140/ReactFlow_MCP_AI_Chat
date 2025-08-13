import { useState, useCallback } from "react";

export const useNodeName = (id: string, initialName: string) => {
  const [nodeName, setNodeName] = useState<string>(initialName);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  const handleNameChange = useCallback((newName: string) => {
    setNodeName(newName);
    // This will be called by parent with additional data
  }, []);

  const handleNameKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        setIsEditingName(false);
      }
    },
    []
  );

  const handleNameBlur = useCallback(() => {
    setIsEditingName(false);
  }, []);

  const handleNameClick = useCallback(() => {
    setIsEditingName(true);
  }, []);

  return {
    nodeName,
    isEditingName,
    handleNameChange,
    handleNameKeyPress,
    handleNameBlur,
    handleNameClick,
    setNodeName,
  };
};
