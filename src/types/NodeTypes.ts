import { MouseEvent } from "react";
import { CONTYPE, ProtoIO } from "./IOTypes";
import { ConnectionPosition } from "./NodeEditorTypes";

//Passed type to identify the currently selected Node in the Editor
export interface selectedNode {
  type: string;
  conMapping: CONTYPE;
  color: string;
  index: number;
  id: string;
}

//Type for the renderd node in the NodeEditor
export interface NodeProps {
  id: string;
  index: number;
  editorOffset: { x: number; y: number };
  name: string;
  headerColor: string;
  color: string;
  x: number;
  y: number;
  zoom: number;
  inputs: ProtoIO<any, any>[];
  outputs: ProtoIO<any, any>[];
  dragHandler: (id: string, x: number, y: number) => void | null;
  showContextMenu: (e: MouseEvent, func: () => void) => void;
  hideContextMenu: () => void;
  deleteNode: (id: string) => void;
  reorderNode: (index: number) => void;
  onInputClicked: (node: selectedNode) => void;
  onOutputClicked: (node: selectedNode) => void;
  onOutputRightClikced: (nodeId: string, index: number) => void;
  updateIOPosition: (
    nodeId: string,
    id: string,
    conPos: ConnectionPosition
  ) => void;
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
  configId: string;
  graphId?: string;
  name: string;
  headerColor?: string;
  color?: string;
  x: number;
  y: number;
  autoUpdate: boolean;
  inputs: ProtoIO<any, any>[];
  outputs: ProtoIO<any, any>[];
  forward: (...io: ProtoIO<any, any>[]) => void;
  setup?: (...io: ProtoIO<any, any>[]) => void;
  cleanup?: (...io: ProtoIO<any, any>[]) => void;
}

export interface ProtoNode {
  id: string;
  name: string;
  headerColor?: string;
  color?: string;
  description: string;
  autoUpdate?: boolean;
  inputs: ProtoIO<any, any>[];
  outputs: ProtoIO<any, any>[];
  forward: (...io: ProtoIO<any, any>[]) => void;
  setup?: (...io: ProtoIO<any, any>[]) => void;
  cleanup?: (...io: ProtoIO<any, any>[]) => void;
}
