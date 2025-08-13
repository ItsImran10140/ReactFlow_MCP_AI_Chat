import InputNodes from "../nodes/InputNode";
import OutPutNode from "../nodes/OutPutNode";
import KnowledgeBasedNode from "../nodes/KnowledgeBaseNode";
import LLMNode from "../nodes/LLMNode";

export const nodeTypes = {
  inputNode: InputNodes,
  llmNode: LLMNode,
  knowledgeBasedNode: KnowledgeBasedNode,
  outPutNode: OutPutNode,
};

export { InputNodes, LLMNode, OutPutNode };
