import React from "react";
import { NodeEditor } from "./components/NodeEditor";
import { ProtoIO } from "./types/IOTypes";
import { ProtoNode } from "./types/NodeTypes";

const ioNumber: ProtoIO<number> = {
  name: "const",
  type: "number",
  color: "blue",
  data: {},
  extra: null,
  value: 7,
};

const ioText: ProtoIO<string> = {
  name: "Text",
  type: "text",
  color: "blue",
  data: {},
  extra: null,
  value: "",
};

const addNode: ProtoNode = {
  name: "Add",
  description: "Adds two numnbers",
  inputs: [ioNumber, ioNumber],
  outputs: [ioNumber],
  forward: (
    in1: ProtoIO<number>,
    in2: ProtoIO<number>,
    out: ProtoIO<number>
  ) => {
    out.value = in1.value + in2.value;
    console.log("add: " + out.value);
  },
};

const subNode: ProtoNode = {
  name: "Sub",
  description: "Subs two numnbers",
  inputs: [ioNumber, ioNumber],
  outputs: [ioNumber],
  forward: (
    in1: ProtoIO<number>,
    in2: ProtoIO<number>,
    out: ProtoIO<number>
  ) => {
    out.value = in1.value - in2.value;
    console.log("sub: " + out.value);
  },
};

const mulNode: ProtoNode = {
  name: "Mul",
  description: "Multiplicates two numnbers",
  inputs: [ioNumber, ioNumber],
  outputs: [ioNumber],
  forward: (
    in1: ProtoIO<number>,
    in2: ProtoIO<number>,
    out: ProtoIO<number>
  ) => {
    out.value = in1.value * in2.value;
    console.log("Mul: " + out.value);
  },
};

const constNode: ProtoNode = {
  name: "Const",
  description: "A node that outputs a number",
  inputs: [],
  outputs: [ioNumber],
  forward: (io: ProtoIO<number>) => {
    console.log("out: " + io.value);
  },
};

const config: ProtoNode[] = [constNode, addNode, subNode, mulNode];

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
