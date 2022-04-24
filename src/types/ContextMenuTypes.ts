import { LogicNode, ProtoNode } from "./NodeTypes";

export interface ContextMenuProps {
  config: ProtoNode[];
  show: boolean;
  x: number;
  y: number;
  zoom: number;
  addNode: (node: LogicNode) => void;
}
