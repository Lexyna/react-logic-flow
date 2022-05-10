import { Provider } from "react-redux";
import { NodeEditorStage } from "./components/NodeEditorStage";
import { next } from "./logic/NodeProcessing";
import { store } from "./store/stroe";
import { ACTIVATION, CONTYPE, ExtraProps, ProtoIO } from "./types/IOTypes";
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

const ioActivationIn: ProtoIO<null, null> = {
  name: "<=",
  type: ACTIVATION,
  conMapping: CONTYPE.MULTI,
  color: "rgb(0, 100, 200)",
  data: null,
  extra: null,
  value: null,
};

const ioActivationOut: ProtoIO<null, null> = {
  name: "=>",
  type: ACTIVATION,
  conMapping: CONTYPE.SINGLE,
  color: "rgb(0, 100, 200)",
  data: null,
  extra: null,
  value: null,
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
  inputs: [ioActivationIn],
  outputs: [ioActivationOut, ioNumberOUT],
  autoUpdate: false,
  forward: (
    activate: ProtoIO<null, null>,
    nextNode: ProtoIO<null, null>,
    iteratorValue: ProtoIO<number, any>
  ) => {
    for (let i = 0; i < 100; i++) {
      iteratorValue.value = i;
      next(nextNode);
    }
  },
};

let listener: any = null;

const keyListenerNode: ProtoNode = {
  id: "keyListenerNode",
  name: "keyListener",
  description: "A node that fires when a kay is pressed",
  inputs: [ioActivationIn],
  outputs: [ioActivationOut],
  forward: (io: ProtoIO<null, null>, nextNode: ProtoIO<null, null>) => {
    console.log("Process forward node");
  },
  setup: (io: ProtoIO<null, null>, nextNode: ProtoIO<null, null>) => {
    listener = (e: KeyboardEvent) => {
      console.log("detected Key event");
      next(nextNode);
    };
    window.addEventListener("keydown", listener);
  },
  cleanup: (io: ProtoIO<null, null>, nextNode: ProtoIO<null, null>) => {
    if (listener) window.removeEventListener("keydown", listener);
  },
};

const printNode: ProtoNode = {
  id: "printNode",
  name: "Print",
  description: "A node that outputs a number",
  inputs: [ioActivationIn, ioNumberIN],
  outputs: [],
  forward: (io: ProtoIO<null, null>, io2: ProtoIO<number, inputData>) => {
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
  keyListenerNode,
  printNode,
  operationNode,
];

const root: ProtoNode = {
  id: "root",
  name: "Const",
  description: "A root Node",
  autoUpdate: false,
  inputs: [ioNumberInput],
  outputs: [ioActivationOut, ioNumberOUT],
  forward: (
    io: ProtoIO<number, any>,
    nextNode: ProtoIO<null, null>,
    out: ProtoIO<number, any>
  ) => {
    console.log("root: " + io.value);
    out.value = io.value;
    next(nextNode);
  },
};

function NodeEditor() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        position: "absolute",
        left: "0px",
        top: "0px",
      }}>
      <Provider store={store}>
        <NodeEditorStage
          id={"#myInitialID"}
          config={config}
          root={root}
          liveUpdate={false}
        />
      </Provider>
    </div>
  );
}

export default NodeEditor;
