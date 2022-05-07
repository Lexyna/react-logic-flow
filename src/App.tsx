import { NodeEditor } from "./components/NodeEditor";
import { next } from "./logic/NodeProcessing";
import { CONTYPE, ExtraProps, ProtoIO } from "./types/IOTypes";
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

const ioNumberIN: ProtoIO<number, any> = {
  name: "const",
  type: "number",
  conMapping: CONTYPE.SINGLE,
  color: "rgba(0, 200, 100)",
  data: {},
  extra: null,
  value: 0,
};

const ioNumberOUT: ProtoIO<number, any> = {
  name: "const",
  type: "number",
  conMapping: CONTYPE.MULTI,
  color: "rgba(0, 200, 100)",
  data: {},
  extra: null,
  value: 0,
};

const ioNumberInput: ProtoIO<number, inputData> = {
  name: "const",
  conMapping: CONTYPE.MULTI,
  type: "number",
  color: "rgb(0, 200, 100)",
  data: { val: 0 },
  extra: InputForm,
  value: 0,
};

const ioNumberSelect: ProtoIO<number, Operations> = {
  name: "Out",
  type: "number",
  conMapping: CONTYPE.MULTI,
  color: "rgb(0, 200, 100)",
  data: { type: OPS.ADD },
  extra: OperationSelect,
  value: 0,
};

const operationNode: ProtoNode = {
  id: "OperationalNode",
  name: "Operation",
  description: "use a operation",
  inputs: [ioNumberIN, ioNumberIN],
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
  inputs: [ioNumberIN, ioNumberIN],
  outputs: [ioNumberOUT],
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
  inputs: [ioNumberIN, ioNumberIN],
  outputs: [ioNumberOUT],
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
  inputs: [ioNumberIN, ioNumberIN],
  outputs: [ioNumberOUT],
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
  inputs: [ioNumberIN, ioNumberIN],
  outputs: [ioNumberOUT],
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

const forNode: ProtoNode = {
  id: "forNode100",
  name: "for loop",
  description: "A node that fire a 100 times",
  inputs: [ioNumberIN],
  outputs: [ioNumberInput, ioNumberOUT],
  autoUpdate: false,
  forward: (
    activate: ProtoIO<number, any>,
    nextNode: ProtoIO<number, inputData>,
    iteratorValue: ProtoIO<number, any>
  ) => {
    for (let i = 0; i < nextNode.data.val; i++) {
      iteratorValue.value = i;
      next(nextNode);
    }
  },
};

const printNode: ProtoNode = {
  id: "printNode",
  name: "Print",
  description: "A node that outputs a number",
  inputs: [ioNumberIN, ioNumberIN],
  outputs: [],
  forward: (
    io: ProtoIO<number, inputData>,
    io2: ProtoIO<number, inputData>
  ) => {
    console.log("print: " + io2.value);
  },
};

const config: ProtoNode[] = [
  constNode,
  addNode,
  subNode,
  mulNode,
  divNode,
  forNode,
  printNode,
  operationNode,
];

const root: ProtoNode = {
  id: "root",
  name: "Const",
  description: "A root Node",
  autoUpdate: false,
  inputs: [ioNumberIN],
  outputs: [ioNumberOUT],
  forward: (io: ProtoIO<number, any>, out: ProtoIO<number, any>) => {
    console.log("root: " + io.value);
    out.value = io.value;
    next(out);
  },
};

function App() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        position: "absolute",
        left: "0px",
        top: "0px",
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
