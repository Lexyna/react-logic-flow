import React from "react";
import { NodeEditor } from "./components/NodeEditor";
import { ProtoIO } from "./types/IOTypes";
import { ProtoNode } from "./types/NodeTypes";

const ioNumber: ProtoIO<number> = {
  name: "const",
  type: "number",
  color: "white",
  data: {},
  extra: null,
  value: 0,
};

const numberInput: ProtoNode = {
  name: "Number",
  description: "A node that takes a number",
  inputs: [ioNumber],
  outputs: [],
  forward: (io: ProtoIO<number>) => {
    console.log(io.value);
  },
};

const config: ProtoNode[] = [numberInput];

const root: ProtoNode = {
  name: "Const",
  description: "A root Node",
  inputs: [],
  outputs: [ioNumber],
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
