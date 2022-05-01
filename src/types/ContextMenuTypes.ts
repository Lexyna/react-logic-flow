import { LogicNode, ProtoNode } from "./NodeTypes";
import { DragOffset } from "./utilTypes";

export interface EditorContextMenuProps {
  config: ProtoNode[];
  show: boolean;
  x: number;
  y: number;
  panning: DragOffset;
  zoom: number;
  addNode: (node: LogicNode) => void;
}

export interface NodeContextMenuProps {
  show: boolean;
  x: number;
  y: number;
  delete: () => void;
}

export interface ContextMenuOptions {
  showContextMenu: boolean;
  x: number;
  y: number;
}

export interface NodeContextMenuOptions {
  showContextMenu: boolean;
  x: number;
  y: number;
  delete: () => void;
}
