/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AppSidebar } from "@/UI/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/UI/ui/breadcrumb";
import { Separator } from "@/UI/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/UI/ui/sidebar";
import { Button } from "@/UI/ui/button";
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "@/app/components/nodes/index";
import { graph } from "@/core/DependencyGraph";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DropdownMenuDemo } from "@/UI/DropdownMenu/DropDownMenu";
import { CiSettings } from "react-icons/ci";
import { CheckCircle2, Download, Play, RotateCcw } from "lucide-react";

// Define types for better type safety
interface NodeData {
  [key: string]: any;
}

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [nodeData, setNodeData] = useState<NodeData>({});
  const [nodeIdCounter, setNodeIdCounter] = useState<number>(1);

  useEffect(() => {
    const unsubscribe = graph.subscribe((data: NodeData) => {
      setNodeData(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const syncedNodes = useMemo((): any => {
    return nodes.map((node: any) => ({
      ...node,
      data: { ...node.data, ...(nodeData[node.id] || {}) },
    }));
  }, [nodes, nodeData]);

  const clearAllNodes = useCallback(() => {
    setNodes([]);
    setEdges([]);
    // Clear the graph data as well
    nodes.forEach((node: any) => {
      graph.removeNode(node.id);
    });
    setNodeIdCounter(1); // Reset counter
  }, [setNodes, setEdges, nodes, setNodeIdCounter]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Type guard to ensure required properties exist
      if (
        !params.source ||
        !params.target ||
        !params.sourceHandle ||
        !params.targetHandle
      ) {
        return;
      }

      const edgeId: string = `${params.source}-${params.target}-${params.sourceHandle}-${params.targetHandle}`;

      const success: boolean = graph.addEdge(
        edgeId,
        params.source,
        params.target,
        params.sourceHandle,
        params.targetHandle
      );

      if (success) {
        setEdges((eds: any) =>
          addEdge({ ...params, id: edgeId, animated: true }, eds)
        );
      }
    },
    [setEdges]
  );

  const onEdgesDelete = useCallback((edgesToDelete: any): void => {
    edgesToDelete.forEach((edge: any) => {
      graph.removeEdge(edge.id);
    });
  }, []);

  const onNodesDelete = useCallback((nodesToDelete: any): void => {
    nodesToDelete.forEach((node: any) => {
      graph.removeNode(node.id);
    });
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="border border-zinc-200 rounded-md mt-2 ml-2 mr-2">
        <header className="flex h-10 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 shadow-md justify-between">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Pipelines</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>LLM Chat Pipeline</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-2">
            <Button variant="default" className="">
              View Traces
            </Button>
            <Button variant="default" className="mx-1">
              <span>
                <RotateCcw />
              </span>
              Version history
            </Button>
            <Button variant="secondary" className=" cursor-pointer">
              <span>
                <CheckCircle2 />
              </span>
              Change Deployment
            </Button>
            <Button
              onClick={clearAllNodes}
              variant="destructive"
              className="mx-1 cursor-pointer"
            >
              Clear All
            </Button>
            <Button variant="secondary" className=" cursor-pointer">
              <span>
                <Play />
              </span>
              Run
            </Button>
            <Button
              variant="secondary"
              className="bg-white flex items-center text-zinc-500 border border-zinc-200 cursor-pointer"
            >
              <span>
                <Download />
              </span>
              Export
            </Button>
          </div>
          <div>
            <div className="bg-white text-zinc-500 border border-zinc-200 w-8 h-8 mr-1 rounded-lg flex items-center justify-center cursor-pointer">
              <CiSettings size={26} />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ReactFlow
            nodes={syncedNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            onEdgesChange={onEdgesChange}
            onEdgesDelete={onEdgesDelete}
            onNodesDelete={onNodesDelete}
            className="bg-gray-50"
            deleteKeyCode={["Backspace", "Delete"]}
          >
            <Panel position="top-left">
              <div>
                <DropdownMenuDemo
                  nodes={nodes}
                  setNodes={setNodes}
                  nodeIdCounter={nodeIdCounter}
                  setNodeIdCounter={setNodeIdCounter}
                />
              </div>
            </Panel>
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
