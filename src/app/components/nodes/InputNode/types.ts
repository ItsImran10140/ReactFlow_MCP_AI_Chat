export interface InputNodeData {
  nodeName?: string;
  inputType?: string;
  value?: number;
  output?: {
    value: number;
    inputType: string;
    nodeName: string;
    sourceNodeId: string;
  };
}

export interface InputControlsProps {
  inputType: string;
  value: number;
  onTypeChange: (type: string) => void;
  onValueChange: (value: number) => void;
}
