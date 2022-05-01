import { MouseEvent } from "react";
import { Connection, ConnectionPosTable } from "./NodeEditorTypes";
import { clientDimensions, DragOffset } from "./utilTypes";

export interface ConnectionStageProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  setConnections: (cons: Connection[]) => void;
  editorDimensions: clientDimensions;
  nodeEditorOffset: { x: number; y: number };
  updateMousePath: (e: MouseEvent) => void;
  panningOffset: DragOffset;
  connections: Connection[];
  conPosTable: ConnectionPosTable;
  mousePath: string;
}
