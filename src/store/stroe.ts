import { configureStore } from "@reduxjs/toolkit";
import nodeEditor from "./reducers/NodeEditorSlice";

export const store = configureStore({
  reducer: {
    nodeEditors: nodeEditor,
  },
});
