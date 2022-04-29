import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DragOffset } from "../../components/NodeEditor";
import { Connection } from "../../types/NodeEditorTypes";
import { LogicNode } from "../../types/NodeTypes";
import { RootState } from "../stroe";

export interface NodeEditorsStoreState {
  [k: string]: NodeEditorStore;
}
export interface NodeEditorStore {
  offsetX: number;
  offsetY: number;
  id: string;
  nodes: LogicNode[];
  connections: Connection[];
}

export interface UpdateConnectionPayload {
  id: string;
  connetions: Connection[];
}

export interface UpdateDragOffset {
  id: string;
  offsetX: number;
  offsetY: number;
}

export const nodeEditorSlice = createSlice({
  name: "nodeEditors",
  initialState: {} as NodeEditorsStoreState,
  reducers: {
    addNodeEditor: (state, action: PayloadAction<NodeEditorStore>) => {
      if (state[action.payload.id]) return;

      state[action.payload.id] = action.payload;
    },
    updateConnections: (
      state,
      action: PayloadAction<UpdateConnectionPayload>
    ) => {
      if (!state[action.payload.id]) return;

      state[action.payload.id].connections = action.payload.connetions;
    },
    updateOffset: (state, action: PayloadAction<UpdateDragOffset>) => {
      if (!state[action.payload.id]) return;

      state[action.payload.id].offsetX = action.payload.offsetX;
      state[action.payload.id].offsetY = action.payload.offsetY;
    },
  },
});

export const { addNodeEditor, updateConnections, updateOffset } =
  nodeEditorSlice.actions;

export default nodeEditorSlice.reducer;

export const selectNodeEditor =
  (id: string) =>
  (state: RootState): NodeEditorStore => {
    return state.nodeEditors[id];
  };

export const selectNodeEditorOffset =
  (id: string) =>
  (state: RootState): DragOffset => {
    if (!state.nodeEditors[id]) return { offsetX: 0, offsetY: 0 };
    return {
      offsetY: state.nodeEditors[id].offsetY,
      offsetX: state.nodeEditors[id].offsetX,
    };
  };

export const selectNodeEditorConnections =
  (id: string) =>
  (state: RootState): Connection[] => {
    if (!state.nodeEditors[id]) return [];
    if (!state.nodeEditors[id].connections) return [];
    return state.nodeEditors[id].connections;
  };
