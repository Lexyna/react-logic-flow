import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Connection } from "../../types/NodeEditorTypes";
import { RootState } from "../stroe";

export interface NodeEditorsStoreState {
  [k: string]: NodeEditorStore;
}

export interface ReduxNode {
  configId: string; //identifies node type
  nodeId: string; //unique Id of this node
  x: number;
  y: number;
}

export interface NodeEditorStore {
  id: string;
  nodes: ReduxNode[];
  connections: Connection[];
}

export interface UpdateConnectionPayload {
  id: string;
  connetions: Connection[];
}

export interface UpdateNodesPayload {
  id: string;
  nodes: ReduxNode[];
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
    updateNodes: (state, action: PayloadAction<UpdateNodesPayload>) => {
      if (!state[action.payload.id]) return;

      state[action.payload.id].nodes = action.payload.nodes;
    },
  },
});

export const { addNodeEditor, updateConnections, updateNodes } =
  nodeEditorSlice.actions;

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

export const selectNodeEditorNodes =
  (id: string) =>
  (state: RootState): ReduxNode[] => {
    if (!state.nodeEditors[id]) return [];
    if (!state.nodeEditors[id].connections) return [];
    return state.nodeEditors[id].nodes;
  };
