import { DragOffset } from "../components/NodeEditor";
import { LogicNode, ProtoNode } from "./NodeTypes";

export interface ContextMenuProps {
  config: ProtoNode[];
  show: boolean;
  x: number;
  y: number;
  panning: DragOffset;
  zoom: number;
  addNode: (node: LogicNode) => void;
}
