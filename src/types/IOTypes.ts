import { ConnectionPosition } from "./NodeEditorTypes";
import { selectedNode } from "./NodeTypes";

export const ACTIVATION: string = "ACTIVATION";

export enum CONTYPE {
  SINGLE = "SINGLE",
  MULTI = "MULTII",
}
export interface ProtoIO<T, K> {
  name: string;
  type: string;
  conMapping: CONTYPE;
  color: string;
  data: K;
  extra: React.FC<ExtraProps<T, K>> | null;
  value: T;
}

export interface LogicIO<T, K> {
  name: string;
  type: string;
  conMapping: CONTYPE;
  color: string;
  data: K;
  extra: React.FC<ExtraProps<T, K>> | null;
  value: T;
  graphId: string;
  nodeId: string;
  index: number;
}

export interface NodeIOProps<T, K> {
  nodeId: string;
  index: number;
  isInput: boolean;
  type: string;
  conMapping: CONTYPE;
  label: string;
  color: string;
  value: T;
  extra: React.FC<ExtraProps<T, K>> | null;
  data: any;
  onClick: (node: selectedNode) => void;
  onRightClick: ((nodeId: string, index: number) => void) | null;
  updateData: (nodeId: string, input: boolean, index: number, data: any) => any;
  updateIOPosition: (
    nodeId: string,
    id: string,
    conPos: ConnectionPosition
  ) => void;
}

export interface ExtraProps<T, K> {
  setData: (data: K) => void;
  data: K;
  value: T;
}
