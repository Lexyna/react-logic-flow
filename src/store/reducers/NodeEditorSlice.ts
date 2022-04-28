import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Connection } from "../../types/NodeEditorTypes";
import { LogicNode } from "../../types/NodeTypes";

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

export const nodeEditorSlice = createSlice({
  name: "nodeEditors",
  initialState: {} as NodeEditorsStoreState,
  reducers: {
    addNodeEditor: (state, action: PayloadAction<NodeEditorStore>) => {
      if (state[action.payload.id]) return;

      state[action.payload.id] = action.payload;
    },
  },
});

export const { addNodeEditor } = nodeEditorSlice.actions;

export default nodeEditorSlice.reducer;

export const selectNodeEditor = (id: string) => (state: NodeEditorsStoreState): NodeEditorStore => state[id];

}