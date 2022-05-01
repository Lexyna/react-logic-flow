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
        defaultValue={props.data.val}
        step={1}
        onChange={(e) => update(parseFloat(e.target.value))}
      />
    </div>
  );
};

enum OPS {
  ADD = "ADD",
  SUB = "SUB",
  MULS = "MUL",
  DIV = "DIV",
}

interface Operations {
  type: OPS;
}

export const OperationSelect = (props: ExtraProps<number, Operations>) => {
  const options: string[] = ["ADD", "SUB", "MUL", "DIV"];

  const updateType = (val: string) => {
    switch (val) {
      case "ADD":
        props.setData({ type: OPS.ADD });
        break;
      case "SUB":
        props.setData({ type: OPS.SUB });
        break;
      case "MUL":
        props.setData({ type: OPS.MULS });
        break;
      case "DIV":
        props.setData({ type: OPS.DIV });
        break;
    }
  };

  let id = 0;

  return (
    <div>
      <select
        onChange={(e) => updateType(e.target.value)}
        defaultValue={props.data.type}>
        {options.map((val) => {
          id++;
          return (
            <option key={id} value={val}>
              {val}
            </option>
          );
        })}
      </select>
    </div>
  );
};

const ioNumber: ProtoIO<number, any> = {
  name: "const",
  type: "number",
  color: "rgba(0, 200, 100)",
  data: {},
  extra: null,
  value: 0,
};

const ioNumberInput: ProtoIO<number, inputData> = {
  name: "const",
  type: "number",
  color: "rgb(0, 200, 100)",
  data: { val: 0 },
  extra: InputForm,
  value: 0,
};

const ioNumberSelect: ProtoIO<number, Operations> = {
  name: "Out",
  type: "number",
  color: "rgb(0, 200, 100)",
  data: { type: OPS.ADD },
  extra: OperationSelect,
  value: 0,
};

const operationNode: ProtoNode = {
  id: "OperationalNode",
  name: "Operation",
  description: "use a operation",
  inputs: [ioNumber, ioNumber],
  outputs: [ioNumberSelect],
  forward: (
    io1: ProtoIO<number, any>,
    io2: ProtoIO<number, any>,
    out: ProtoIO<number, Operations>
  ) => {
    switch (out.data.type) {
      case OPS.ADD:
        out.value = io1.value + io2.value;
        break;
      case OPS.SUB:
        out.value = io1.value - io2.value;
        break;
      case OPS.MULS:
        out.value = io1.value * io2.value;
        break;
      case OPS.DIV:
        out.value = io1.value / io2.value;
        break;
    }
  },
};

const addNode: ProtoNode = {
  id: "addNode",
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
  id: "subNode",
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
  id: "MulNode",
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
  id: "DivNode",
  name: "Div",
  description: "Divides two numnbers",
  inputs: [ioNumber, ioNumber],
  outputs: [ioNumber],
  forward: (
    in1: ProtoIO<number, any>,
    in2: ProtoIO<number, any>,
    out: ProtoIO<number, any>
  ) => {
    out.value = in1.value / in2.value;
    console.log("Div: " + out.value);
  },
};

const constNode: ProtoNode = {
  id: "constNode",
  name: "Const",
  description: "A node that outputs a number",
  inputs: [],
  outputs: [ioNumberInput],
  forward: (io: ProtoIO<number, inputData>) => {
    io.value = io.data.val;
    console.log("out: " + io.value);
  },
};

const config: ProtoNode[] = [
  constNode,
  addNode,
  subNode,
  mulNode,
  divNode,
  operationNode,
];

const root: ProtoNode = {
  id: "root",
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
    <div
      style={{
        height: "400px",
        width: "600px",
        position: "absolute",
        left: "100px",
        top: "100px",
      }}>
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
