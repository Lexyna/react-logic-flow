import { Provider } from "react-redux";
import { store } from "../../store/stroe";
import { NodeEditorProps } from "../../types/NodeEditorTypes";
import { NodeEditorStage } from "./NodeEditorStage";

function NodeEditor(props: NodeEditorProps) {
  return (
    <Provider store={store}>
      <NodeEditorStage
        id={props.id}
        config={props.config}
        root={props.root ? props.root : undefined}
        liveUpdate={props.liveUpdate}
      />
    </Provider>
  );
}

export default NodeEditor;
