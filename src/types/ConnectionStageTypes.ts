import { MouseEvent } from "react";
import { Connection, ConnectionPosTable } from "./NodeEditorTypes";
import { DragOffset } from "./utilTypes";

export interface ConnectionStageProps {
  zoom: number;
  connections: Connection[];
  conPosTable: ConnectionPosTable;
  nodeEditorOffset: { x: number; y: number };
  panningOffset: DragOffset;
  mousePath: string;
  setZoom: (zoom: number) => void;
  setConnections: (cons: Connection[]) => void;
  updatePreviewConnectionPath: (e: MouseEvent) => void;
  showEditorContexMenu: (e: MouseEvent) => void;
  hideNodeContextMenu: () => void;
}
