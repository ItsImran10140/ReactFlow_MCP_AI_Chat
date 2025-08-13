/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/UI/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/UI/ui/dropdown-menu";
import { IoMdAdd } from "react-icons/io";
import { useCallback } from "react";
import { graph } from "@/core/DependencyGraph";
import { nodeGroups } from "@/utils/nodesData";

interface NodeButtonConfig {
  type: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownMenuDemoProps {
  nodes: any[];
  setNodes: (nodes: any[] | ((prev: any[]) => any[])) => void;
  nodeIdCounter: number;
  setNodeIdCounter: (counter: number | ((prev: number) => number)) => void;
}

export function DropdownMenuDemo({
  nodes,
  setNodes,
  nodeIdCounter,
  setNodeIdCounter,
}: DropdownMenuDemoProps) {
  const createNode = useCallback(
    (type: string): void => {
      const id: string = nodeIdCounter.toString();
      setNodeIdCounter((prev: number) => prev + 1);

      // Use deterministic positioning based on node count and type
      const getPosition = (nodeType: string, nodeCount: number) => {
        const basePositions: any = {
          inputNode: { x: 50, y: 100 },
          llmNode: { x: 300, y: 150 },
          knowledgeBasedNode: { x: 800, y: 200 },
          outPutNode: { x: 600, y: 200 },
          triggerNode: { x: 100, y: 300 },
          startNode: { x: 50, y: 50 },
          browserExtensionNode: { x: 400, y: 100 },
          noteNode: { x: 200, y: 400 },
          groupNode: { x: 500, y: 300 },
          // apiNode: { x: 700, y: 100 },
          databaseNode: { x: 900, y: 150 },
          transformNode: { x: 400, y: 250 },
          conditionNode: { x: 150, y: 200 },
          loopNode: { x: 350, y: 350 },
        };

        const base = basePositions[nodeType] || { x: 100, y: 100 };

        // Add offset based on existing nodes to avoid overlap
        return {
          x: base.x + ((nodeCount * 30) % 400),
          y: base.y + Math.floor(nodeCount / 10) * 80,
        };
      };

      const nodeDataDefaults: any = {
        dropDownMenu: { value: 0 },
        inputNode: { value: 0 },
        inputNodes: { value: 0 },
        llmNode: {},
        textNode: {},
        outPutNode: {},
        knowledgeBasedNode: {},
        triggerNode: {},
        startNode: {},
        browserExtensionNode: {},
        noteNode: {},
        groupNode: {},
        // apiNode: {},
        databaseNode: {},
        transformNode: {},
        conditionNode: {},
        loopNode: {},
      };

      const newNode: any = {
        id,
        type,
        position: getPosition(type, nodes.length),
        data: nodeDataDefaults[type] || {},
      };

      setNodes((nds: any) => [...nds, newNode]);
      graph.addNode(id, nodeDataDefaults[type] || {});
    },
    [nodeIdCounter, setNodeIdCounter, setNodes, nodes.length]
  );

  const NodeButton = ({ node }: { node: NodeButtonConfig }) => (
    <button
      onClick={() => (node.type === "" ? "" : createNode(node.type))}
      className="text-center flex flex-col justify-center items-center border w-16 h-16 rounded-md text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {node.icon && <span className="mb-1">{node.icon}</span>}
      <span className="text-xs leading-tight">{node.label}</span>
    </button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full w-8 h-8">
          <IoMdAdd />
        </Button>
      </DropdownMenuTrigger>
      {/* max-h-[500px] */}
      <DropdownMenuContent
        className="w-60  max-h-[70vh] overflow-y-auto no-scrollbar"
        align="start"
      >
        <div className="px-1">
          <input
            type="text"
            placeholder="Search"
            className="border w-full h-8 rounded-md pl-2 outline-none my-2 placeholder:text-zinc-600 text-zinc-700"
          />
        </div>
        <DropdownMenuLabel>Add Node</DropdownMenuLabel>

        {nodeGroups.map((group, groupIndex) => (
          <DropdownMenuGroup key={groupIndex}>
            <DropdownMenuItem className="font-medium text-sm">
              {group.title}
            </DropdownMenuItem>
            <div className="grid grid-cols-3 gap-2 p-2">
              {group.nodes.map((node, nodeIndex) => (
                <NodeButton key={nodeIndex} node={node} />
              ))}
            </div>
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
