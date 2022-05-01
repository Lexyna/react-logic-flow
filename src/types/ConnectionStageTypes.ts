import { MouseEvent } from "react";
import { Connection, ConnectionPosTable } from "./NodeEditorTypes";
import { DragOffset } from "./utilTypes";

export interface ConnectionStageProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  setConnections: (cons: Connection[]) => void;
  nodeEditorOffset: { x: number; y: number };
  updateMousePath: (e: MouseEvent) => void;
  panningOffset: DragOffset;
  connections: Connection[];
  conPosTable: ConnectionPosTable;
  mousePath: string;
  showEditorContexMenu: (e: MouseEvent) => void;
  hideNodeContextMenu: () => void;
}