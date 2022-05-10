# React-logic-flow  (WIP)
---
## How to use
---
Create a new react component like this  
```jsx
<NodeEditor id="#id" config={YOUR_CONFIG} root={YOUR_ROOT} liveUpdate={true}>
```

`id`: The id of this NodeEditor. Will either create a new (empty) NodeEditor or load the ast known state of the nodeEditor with the given id  

`config`: An array of `ProtoNodes`  

`root`: A `ProtoNode` defined as root (optional)

`liveUpdate`: `boolean` value, will be false when no root is passed. Otherwise executes nodeEditor with each data change to the nodeEditor

To execute a graph, you have two options:

Calling `createOneTimeGraph(id, config, root)` will execute the Grapg once starting from the root and delete it after.

Calling `createLivingGraph(id, config)` will create a Graph that lives in Memory. A Garph created liek this can only be executed from inside. For example, by a eventListener.

To delete a living graph, call `deleteLivingGraph(id)`


***

## Types

***

`ProtoNode`: A prototype node used to descripe the behaviour and layout of the node

```ts
  ProtoNode: {
    id: string; //The id for this node, used to identify the type of node in the nodeEditor
    name: string; //Name displayed for this node
    headerColor?: string; //header color of the node <CSSColor>
    color?: string; //body color of the node <CSSColor>
    description: string; //description of the node displayed in the contextMenu
    autoUpdate?: boolean; //defines if the the node should update when dependencies are requeted. Default <true>
    inputs: ProtoIO<any, any>[]; // Array of ProtoIO used as input
    outpust ProtoIO<any,any>[]; // Array of ProtoIO used as output
    forward: (...io:ProtoIO<any,any>[]) => void; // function executed when this node triggers
    setup?: (...io:ProtoIO<any,any>[]) => void; //function that is called once before the nodes are excuted
    cleanup?: (...io:ProtoIO<any,any>[]) => void;  // function called once before the nodeEditor is deleted
  }
```

`ProtoIO`: IO type use to transfer date between nodes and detrmine valid connections

```ts
ProtoIO<T,K> {
name: string; // display name of this connection
type: string; // 'Type' of this connection. only connection of the same type can be connection (caseinsensitve)
conMapping: CONTYPE; //The Connection Type, used to dermine how many connetion this io port can have
color: string; //color of this connection (detrmined by output)
dashArray?: string; //Converts the connection to the specified dsh array E.g "15,5,5,5,5"
animated?: boolean; // Animates the dashArray
data: K; // extra data useable by a reactComponent inside the ProtoIO
extra: React.FC<ExtraProps<T,K>> | null; //Potential extra react component inside ProtoIO
value: T; //The transferd data value to other nodes
}
```

`ExraProps`: Props passed down to a ProtoIO, used to store additional data inside ProtoIOs.

```ts
ExtraProps<T,k> {
  setData: (data:K) => void; //function to manipulate extraData
  data: K; //Extra data
  value: T; //Value of the ProtoIO
}
```

`CONTYPE`: connection type, defines how many outgoing/ingoing connecions are possible

```jsx
enum CONTYPE: {
  SINGLE, //Allows one ingoing/outgoing connection
  MULTI //Allows unlimited ingoing/outgoing connetions
}
```

`Note:` `T` & `K` need to be serializable!

***

## Calculator example
***

The following (typescript) code shows a implementation of a simple math application:

```jsx

interface inputData {
  val: number;
}

//Out extra React component to change the output value
const inputForm = (props: Extraprops<number, inputData>) => {
  const update = (val: number) => {
    props.setData({val: val})
  }
  return (
    <div>
      <label>value:</label>
      <input 
        type="number"
        style={{width: "25px}}
        defaultValue={props.data.val}
        step={1}
        onChange={(e) => update(parseFloat(e.target.value))}
      />
    </div>
  )
}

//Creating our ProtoIO with inputForm
const ioNumberInput: protoIO<number, inputData> = {
  name: "Const",
  type: "number",
  conMapping: CONTYPE.MULTI,
  color: "rgba(0,0,255)",
  data: { val: 0 },
  extra: InputForm,
  value: 0
}

//Create some input IO without an input form
const ioNumberIN: ProtoIO<number, any> = {
  name: "const",
  type: "number",
  conMapping: CONTYPE.SINGLE,
  color: "rgba(0, 0, 255)",
  data: {},
  extra: null,
  value: 0,
}

const ioNumberOut: ProtoIO<number, any> = {
  name: "const",
  type: "number",
  conMapping: CONTYPE.MULTI,
  color: "rgba(0, 0, 255)",
  data: {},
  extra: null,
  value: 0,
}

//Now it's time to create our nodes

//First, we'll create number output node
const constNode: ProtoNode = {
  id: "constNode",
  name: "Const",
  description: "A node that outputs a number",
  inputs: [],
  outputs: [ioNumberInput],
  forward: (io: ProtoIO<number, inputData>) => {
    io.value = io.data.val;
  },
};

//And finally we can create a node that will do some math
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
  },
};

//All thats missing now is a root node to receive our connections and calculate the result
const root: ProtoNode = {
  id: "root",
  name: "Const",
  description: "A root Node",
  autoUpdate: false,
  inputs: [ioNumberIN],
  outputs: [],
  forward: (
    io: ProtoIO<number, any>
  ) => {
    console.log("calculated: " + io.value);
  },
};

//Simply create the config and we can pass it to the nodeEditor
const config: ProtoNoe[] = [
  constNode,
  addNode
]

<...>
  <NodeEditor
    id="MY_ID"
    config={config}
    root={root}
    liveUpdate={true}>
</...>

```


