// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useCallback, useEffect, useState, memo } from "react";
// import { graph } from "../../core/DependencyGraph";
// import BaseNode from "./BaseNode/BaseNodes";

// const InputNode = memo(({ id, data }: any) => {
//   const [inputType, setInputType] = useState<string>(data.inputType || "text");
//   const [value, setValue] = useState<number>(data.value || 0);
//   const [nodeName, setNodeName] = useState<string>(
//     data.nodeName || "Input Node"
//   );
//   const [isEditingName, setIsEditingName] = useState<boolean>(false);

//   const handleChange = useCallback(
//     (e: any) => {
//       const newValue = parseFloat(e.target.value) || 0;
//       setValue(newValue);
//       // Update value, inputType, nodeName, and create an output object
//       graph.updateNodeData(id, {
//         value: newValue,
//         inputType,
//         nodeName,
//         // This is what gets passed to connected nodes
//         output: {
//           value: newValue,
//           inputType: inputType,
//           nodeName: nodeName,
//           sourceNodeId: id,
//         },
//       });
//     },
//     [id, inputType, nodeName]
//   );

//   const handleTypeChange = useCallback(
//     (e: any) => {
//       const newType = e.target.value;
//       setInputType(newType);
//       // Update the output with new inputType and nodeName so connected nodes can access it
//       graph.updateNodeData(id, {
//         value,
//         inputType: newType,
//         nodeName,
//         // This is what gets passed to connected nodes
//         output: {
//           value: value,
//           inputType: newType,
//           nodeName: nodeName,
//           sourceNodeId: id,
//         },
//       });
//     },
//     [id, value, nodeName]
//   );

//   const handleNameChange = useCallback(
//     (e: any) => {
//       const newName = e.target.value;
//       setNodeName(newName);
//       // Update the output with new nodeName so connected nodes can access it
//       graph.updateNodeData(id, {
//         value,
//         inputType,
//         nodeName: newName,
//         // This is what gets passed to connected nodes
//         output: {
//           value: value,
//           inputType: inputType,
//           nodeName: newName,
//           sourceNodeId: id,
//         },
//       });
//     },
//     [id, value, inputType]
//   );

//   const handleNameKeyPress = useCallback(
//     (e: React.KeyboardEvent<HTMLInputElement>) => {
//       if (e.key === "Enter") {
//         setIsEditingName(false);
//       }
//     },
//     []
//   );

//   const handleNameBlur = useCallback(() => {
//     setIsEditingName(false);
//   }, []);

//   const handleNameClick = useCallback(() => {
//     setIsEditingName(true);
//   }, []);

//   useEffect(() => {
//     if (data.value !== undefined && data.value !== value) {
//       setValue(data.value);
//     }
//     if (data.inputType !== undefined && data.inputType !== inputType) {
//       setInputType(data.inputType);
//     }
//     if (data.nodeName !== undefined && data.nodeName !== nodeName) {
//       setNodeName(data.nodeName);
//     }
//   }, [data.value, data.inputType, data.nodeName, value, inputType, nodeName]);

//   // Configure BaseNode props - remove label since we're handling it in the content
//   const baseNodeData = {
//     handles: [
//       {
//         type: "source" as const,
//         position: "right" as const,
//         id: "output",
//         className: "bg-blue-500",
//       },
//     ],
//   };

//   return (
//     <BaseNode data={baseNodeData}>
//       <div className="space-y-3">
//         {/* Editable Node Name */}
//         <div className="mb-2">
//           {isEditingName ? (
//             <input
//               type="text"
//               value={nodeName}
//               onChange={handleNameChange}
//               onKeyPress={handleNameKeyPress}
//               onBlur={handleNameBlur}
//               className="w-full px-2 py-1 text-sm font-medium text-center border border-blue-300 rounded focus:outline-none focus:border-blue-500"
//               autoFocus
//             />
//           ) : (
//             <div
//               onClick={handleNameClick}
//               className="w-full px-2 py-1 text-sm font-medium text-center cursor-pointer hover:bg-gray-50 rounded border border-transparent hover:border-gray-200"
//               title="Click to edit node name"
//             >
//               {nodeName}
//             </div>
//           )}
//         </div>

//         <select
//           value={inputType}
//           onChange={handleTypeChange}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg font-semibold"
//         >
//           <option value="text">Text</option>
//           <option value="file">File</option>
//         </select>
//         <div className="text-center text-sm text-gray-600">
//           Type: {inputType}
//         </div>
//       </div>
//     </BaseNode>
//   );
// });

// InputNode.displayName = "InputNode";

// export default InputNode;
