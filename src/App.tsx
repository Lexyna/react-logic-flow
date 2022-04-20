import React from "react";
import { NodeEditor } from "./components/NodeEditor";
import { ProtoNode } from "./types/NodeTypes";

const config: ProtoNode[] = [];

const root: ProtoNode = {
  name: "My ProtoNode",
  description: "A root Node",
  inputs: [],
  outputs: [],
  forward: () => {
    /*this node does nothing*/
  },
};

function App() {
  return (
    <div>
      <NodeEditor
        id={"#myInitialID"}
        config={config}
        root={root}
        liveUpdate={false}
      />
    </div>
  );
}

export default App;
