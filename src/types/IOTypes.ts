import { selectedNode } from "./NodeTypes";

export interface ProtoIO<T, K> {
  name: string;
  type: string;
  color: string;
  data: K;
  extra: React.FC<ExtraProps<T, K>> | null;
  value: T;
}

export interface NodeIOProps<T, K> {
  nodeId: string;
  index: number;
  isInput: boolean;
  type: string;
  label: string;
  color: string;
  value: T;
  extra: React.FC<ExtraProps<T, K>> | null;
  data: any;
  onClick: (node: selectedNode) => void;
  onRightClick: ((nodeId: string, index: number) => void) | null;
  updateData: (nodeId: string, input: boolean, index: number, data: any) => any;
}

export interface ExtraProps<T, K> {
  setData: (data: K) => void;
  value: T;
}
