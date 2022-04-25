import { configureStore } from "@reduxjs/toolkit";
import nodeEditorReducer from "./reducers/NodeEditorReducer";

export const store = configureStore({
  reducer: {
    nodeEditr: nodeEditorReducer,
  },
});
