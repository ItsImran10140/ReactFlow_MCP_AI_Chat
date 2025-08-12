import InputNodes from "./InputNode";
import OutPutNode from "./OutPutNode";
import KnowledgeBasedNode from "./KnowledgeBasedNode";
import LLMNode from "./LLMNode";

export const nodeTypes = {
  inputNode: InputNodes,
  llmNode: LLMNode,
  knowledgeBasedNode: KnowledgeBasedNode,
  outPutNode: OutPutNode,
};

export { InputNodes, LLMNode, OutPutNode };
