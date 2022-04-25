import { ProtoIO } from "./IOTypes";

//Passed type to identify the currently selected Node in the Editor
export interface selectedNode {
  x: () => number;
  y: () => number;
  type: string;
  color: string;
  index: number;
  id: string;
}

//Type for the renderd node in the NodeEditor
export interface NodeProps {
  id: string;
  index: number;
  name: string;
  x: number;
  y: number;
  inputs: ProtoIO<any, any>[];
  outputs: ProtoIO<any, any>[];
  dragHandler: (id: string, x: number, y: number) => void | null;
  reorderNode: (index: number) => void;
  onInputClicked: (node: selectedNode) => void;
  onOutputClicked: (node: selectedNode) => void;
  onOutputRightClikced: (nodeId: string, index: number) => void;
  updateExtraData: (
    nodeId: string,
    input: boolean,
    index: number,
    data: any
  ) => void;
}

//Logic Node used to compute the graph
export interface LogicNode {
  id: string;
  name: string;
  x: number;
  y: number;
  inputs: ProtoIO<any, any>[];
  outputs: ProtoIO<any, any>[];
  forward: (...io: any[]) => void;
}

export interface ProtoNode {
  name: string;
  description: string;
  inputs: ProtoIO<any, any>[];
  outputs: ProtoIO<any, any>[];
  forward: (...io: any[]) => void;
}
