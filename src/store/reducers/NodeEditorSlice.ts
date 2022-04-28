import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Connection } from "../../types/NodeEditorTypes";
import { LogicNode } from "../../types/NodeTypes";

export interface NodeEditorsStore {
  [k: string]: NodeEditorStore;
}
export interface NodeEditorStore {
  offsetX: number;
  offsetY: number;
  id: string;
  nodes: LogicNode[];
  connections: Connection[];
}

export const nodeEditorSlice = createSlice({
  name: "nodeEditors",
  initialState: {} as NodeEditorsStore,
  reducers: {
    addNodeEditor: (state, action: PayloadAction<NodeEditorStore>) => {
      if (state[action.payload.id]) return;

      state[action.payload.id] = action.payload;
    },
  },
});

export default nodeEditorSlice.reducer;
