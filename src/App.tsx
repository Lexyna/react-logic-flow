import React from "react";
import { NodeEditor } from "./components/NodeEditor";
import { ExtraProps, ProtoIO } from "./types/IOTypes";
import { ProtoNode } from "./types/NodeTypes";

interface inputData {
  val: number;
}

export const InputForm = (props: ExtraProps<number, inputData>) => {
  const update = (val: number) => {
    props.setData({ val: val });
  };

  return (
    <div>
      <label>value:</label>
      <input
        type="number"
        style={{ width: "25px" }}
        defaultValue={props.value}
        step={1}
        onChange={(e) => update(parseFloat(e.target.value))}
      />
    </div>
  );
};

const ioNumber: ProtoIO<number, any> = {
  name: "const",
  type: "number",
  color: "blue",
  data: {},
  extra: null,
  value: 0,
};

const ioNumberInput: ProtoIO<number, inputData> = {
  name: "const",
  type: "number",
  color: "blue",
  data: { val: 0 },
  extra: InputForm,
  value: 0,
};

const ioText: ProtoIO<string, any> = {
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
    in1: ProtoIO<number, any>,
    in2: ProtoIO<number, any>,
    out: ProtoIO<number, any>
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
    in1: ProtoIO<number, any>,
    in2: ProtoIO<number, any>,
    out: ProtoIO<number, any>
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
    in1: ProtoIO<number, any>,
    in2: ProtoIO<number, any>,
    out: ProtoIO<number, any>
  ) => {
    out.value = in1.value * in2.value;
    console.log("Mul: " + out.value);
  },
};

const divNode: ProtoNode = {
  name: "Div",
  description: "Divides two numnbers",
  inputs: [ioNumber, ioNumber],
  outputs: [ioNumber],
  forward: (
    in1: ProtoIO<number, any>,
    in2: ProtoIO<number, any>,
    out: ProtoIO<number, any>
  ) => {
    out.value = in1.value * in2.value;
    console.log("Div: " + out.value);
  },
};

const constNode: ProtoNode = {
  name: "Const",
  description: "A node that outputs a number",
  inputs: [],
  outputs: [ioNumberInput],
  forward: (io: ProtoIO<number, inputData>) => {
    io.value = io.data.val;
    console.log("out: " + io.value);
  },
};

const config: ProtoNode[] = [constNode, addNode, subNode, mulNode, divNode];

const root: ProtoNode = {
  name: "Const",
  description: "A root Node",
  inputs: [ioNumber],
  outputs: [],
  forward: (io: ProtoIO<number, any>) => {
    console.log("root: " + io.value);
  },
};

function App() {
  return (
    <div>
      <NodeEditor
        id={"#myInitialID"}
        config={config}
        root={root}
        liveUpdate={true}
      />
    </div>
  );
}

export default App;
