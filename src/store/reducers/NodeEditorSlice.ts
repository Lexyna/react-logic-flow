import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Connection } from "../../types/NodeEditorTypes";
import { LogicNode } from "../../types/NodeTypes";
import { RootState } from "../stroe";

export interface NodeEditorsStoreState {
  [k: string]: NodeEditorStore;
}
export interface NodeEditorStore {
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
  },
});

export const { addNodeEditor, updateConnections } = nodeEditorSlice.actions;

export default nodeEditorSlice.reducer;

export const selectNodeEditor =
  (id: string) =>
  (state: RootState): NodeEditorStore => {
    return state.nodeEditors[id];
  };

export const selectNodeEditorConnections =
  (id: string) =>
  (state: RootState): Connection[] => {
    if (!state.nodeEditors[id]) return [];
    if (!state.nodeEditors[id].connections) return [];
    return state.nodeEditors[id].connections;
  };
