/* eslint-disable @typescript-eslint/no-explicit-any */
// Type definitions
interface NodeData {
  [key: string]: any;
}

interface Node {
  data: NodeData;
  dependencies: Set<string>;
  dependents: Set<string>;
}

interface Edge {
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
}

interface State {
  nodes: Map<string, Node>;
  edges: Map<string, Edge>;
  subscribers: Set<StateSubscriber>;
}

type StateSubscriber = (data: Record<string, NodeData>) => void;

type UnsubscribeFunction = () => void;

// Internal state
const state: State = {
  nodes: new Map<string, Node>(),
  edges: new Map<string, Edge>(),
  subscribers: new Set<StateSubscriber>(),
};

function addNode(nodeId: string, data: NodeData = {}): void {
  if (!state.nodes.has(nodeId)) {
    state.nodes.set(nodeId, {
      data: { ...data },
      dependencies: new Set<string>(),
      dependents: new Set<string>(),
    });
  }
}

function removeNode(nodeId: string): void {
  const node = state.nodes.get(nodeId);
  if (node) {
    // Clean up all edges
    node.dependencies.forEach((depId: string) => {
      const depNode = state.nodes.get(depId);
      if (depNode) depNode.dependents.delete(nodeId);
    });

    node.dependents.forEach((depId: string) => {
      const depNode = state.nodes.get(depId);
      if (depNode) depNode.dependencies.delete(nodeId);
    });

    state.nodes.delete(nodeId);
  }
}

function updateNodeData(nodeId: string, updates: NodeData): void {
  const node = state.nodes.get(nodeId);
  if (node) {
    const hasChanges = Object.keys(updates).some(
      (key: string) => node.data[key] !== updates[key]
    );

    if (hasChanges) {
      node.data = { ...node.data, ...updates };
      processUpdates(nodeId);
    }
  }
}

function addEdge(
  edgeId: string,
  source: string,
  target: string,
  sourceHandle: string,
  targetHandle: string
): boolean {
  // Prevent self-loops and duplicate edges
  if (source === target) return false;
  if (state.edges.has(edgeId)) return false;

  // Check for cycles before adding
  if (wouldCreateCycle(source, target)) {
    return false;
  }

  state.edges.set(edgeId, { source, target, sourceHandle, targetHandle });

  const sourceNode = state.nodes.get(source);
  const targetNode = state.nodes.get(target);

  if (sourceNode && targetNode) {
    sourceNode.dependents.add(target);
    targetNode.dependencies.add(source);

    propagateData(source, target, sourceHandle, targetHandle);
    processUpdates(target);
    return true;
  }
  return false;
}

function removeEdge(edgeId: string): void {
  const edge = state.edges.get(edgeId);
  if (edge) {
    const sourceNode = state.nodes.get(edge.source);
    const targetNode = state.nodes.get(edge.target);

    if (sourceNode) sourceNode.dependents.delete(edge.target);
    if (targetNode) {
      targetNode.dependencies.delete(edge.source);
      // Clear the input when edge is removed
      targetNode.data[edge.targetHandle] = undefined;
    }

    state.edges.delete(edgeId);
    processUpdates(edge.target);
  }
}

function wouldCreateCycle(source: string, target: string): boolean {
  // DFS to check if target can reach source
  const visited = new Set<string>();
  const stack: string[] = [target];

  while (stack.length > 0) {
    const current = stack.pop();
    if (current === source) return true;
    if (!current || visited.has(current)) continue;

    visited.add(current);
    const node = state.nodes.get(current);
    if (node) {
      node.dependents.forEach((dep: string) => stack.push(dep));
    }
  }
  return false;
}

function processUpdates(startNodeId: string): void {
  const affectedNodes = getAffectedNodes([startNodeId]);
  const sortedNodes = topologicalSort(affectedNodes);

  sortedNodes.forEach((nodeId: string) => {
    processNodeUpdate(nodeId);
  });

  notifySubscribers();
}

function getAffectedNodes(startNodes: string[]): string[] {
  const affected = new Set<string>(startNodes);
  const queue: string[] = [...startNodes];

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId) continue;

    const node = state.nodes.get(nodeId);

    if (node) {
      node.dependents.forEach((dependentId: string) => {
        if (!affected.has(dependentId)) {
          affected.add(dependentId);
          queue.push(dependentId);
        }
      });
    }
  }

  return Array.from(affected);
}

function topologicalSort(nodeIds: string[]): string[] {
  const visited = new Set<string>();
  const result: string[] = [];
  const visiting = new Set<string>();

  const visit = (nodeId: string): void => {
    if (visiting.has(nodeId) || visited.has(nodeId)) return;

    visiting.add(nodeId);

    const node = state.nodes.get(nodeId);
    if (node) {
      node.dependencies.forEach((depId: string) => {
        if (nodeIds.includes(depId)) {
          visit(depId);
        }
      });
    }

    visiting.delete(nodeId);
    visited.add(nodeId);
    result.push(nodeId);
  };

  nodeIds.forEach((nodeId: string) => visit(nodeId));
  return result;
}

function processNodeUpdate(nodeId: string): void {
  const node = state.nodes.get(nodeId);
  if (!node) return;

  state.edges.forEach((edge: Edge) => {
    if (edge.target === nodeId) {
      const sourceNode = state.nodes.get(edge.source);
      if (sourceNode && sourceNode.data[edge.sourceHandle] !== undefined) {
        node.data[edge.targetHandle] = sourceNode.data[edge.sourceHandle];
      }
    }
  });
}

function propagateData(
  source: string,
  target: string,
  sourceHandle: string,
  targetHandle: string
): void {
  const sourceNode = state.nodes.get(source);
  const targetNode = state.nodes.get(target);

  if (sourceNode && targetNode && sourceNode.data[sourceHandle] !== undefined) {
    targetNode.data[targetHandle] = sourceNode.data[sourceHandle];
  }
}

function subscribe(callback: StateSubscriber): UnsubscribeFunction {
  state.subscribers.add(callback);
  return (): void => {
    state.subscribers.delete(callback);
  };
}

function notifySubscribers(): void {
  const allData = getAllData();
  state.subscribers.forEach((callback: StateSubscriber) => {
    callback(allData);
  });
}

function getNodeData(nodeId: string): NodeData {
  return state.nodes.get(nodeId)?.data || {};
}

function getAllData(): Record<string, NodeData> {
  const result: Record<string, NodeData> = {};
  state.nodes.forEach((node: Node, nodeId: string) => {
    result[nodeId] = { ...node.data };
  });
  return result;
}

// Graph interface type
interface GraphInterface {
  addNode: (nodeId: string, data?: NodeData) => void;
  removeNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, updates: NodeData) => void;
  addEdge: (
    edgeId: string,
    source: string,
    target: string,
    sourceHandle: string,
    targetHandle: string
  ) => boolean;
  removeEdge: (edgeId: string) => void;
  wouldCreateCycle: (source: string, target: string) => boolean;
  processUpdates: (startNodeId: string) => void;
  getAffectedNodes: (startNodes: string[]) => string[];
  topologicalSort: (nodeIds: string[]) => string[];
  processNodeUpdate: (nodeId: string) => void;
  propagateData: (
    source: string,
    target: string,
    sourceHandle: string,
    targetHandle: string
  ) => void;
  subscribe: (callback: StateSubscriber) => UnsubscribeFunction;
  notifySubscribers: () => void;
  getNodeData: (nodeId: string) => NodeData;
  getAllData: () => Record<string, NodeData>;
}

// Export singleton-like interface
export const graph: GraphInterface = {
  addNode,
  removeNode,
  updateNodeData,
  addEdge,
  removeEdge,
  wouldCreateCycle,
  processUpdates,
  getAffectedNodes,
  topologicalSort,
  processNodeUpdate,
  propagateData,
  subscribe,
  notifySubscribers,
  getNodeData,
  getAllData,
};
