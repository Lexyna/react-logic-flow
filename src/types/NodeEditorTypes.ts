import { ProtoIO } from "./IOTypes";
import { ProtoNode, selectedNode } from "./NodeTypes";

export interface Connection {
  input: selectedNode;
  output: selectedNode;
}

export interface ConnectionPosTable {
  [nodeId: string]: {
    [ioPortId: string]: ConnectionPosition;
  };
}
export interface ConnectionPosition {
  x: () => number;
  y: () => number;
}
export interface NodeConnectionProps {
  index: number;
  zoom: number;
  d: string;
  color: string;
  dashArray: string | null;
  animated: boolean;
  removeConnection: (index: number) => void;
}

export interface NodeEditorProps {
  id: string;
  config: ProtoNode[];
  root?: ProtoNode;
  liveUpdate: boolean;
}

export interface ProtoIOMapper {
  input: ProtoIO<any, any> | null;
  output: ProtoIO<any, any> | null;
}
