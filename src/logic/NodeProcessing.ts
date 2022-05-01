import { ReduxNode } from "../store/reducers/NodeEditorSlice";
import { store } from "../store/stroe";
import {
  AbstractInput,
  AbstractNode,
  AbstractOutput,
} from "../types/NodeComputationalTypes";
import { Connection } from "../types/NodeEditorTypes";
import { LogicNode, ProtoNode } from "../types/NodeTypes";
import { createLogicNodeArray } from "./Utils";

let cycleGraph: boolean = false;

export const executeNodeGraph = (
  id: string,
  config: ProtoNode[],
  root: ProtoNode
) => {
  const state = store.getState();

  if (!state.nodeEditors[id]) throw new Error("Id not found");

  const editorState = state.nodeEditors[id];

  const nodes: ReduxNode[] = editorState.nodes;
  const connections: Connection[] = editorState.connections;

  //check if the passed config is valid
  nodes.forEach((node) => {
    let isValid: boolean = false;
    config.forEach((con) => {
      if (node.configId === con.id) isValid = true;
    });
    if (!isValid) throw new Error("Invalid configuration provided");
  });

  const logicNode = createLogicNodeArray(config, nodes).concat({
    ...root,
    name: root.name + "(Root)",
    id: id,
    configId: root.id,
    x: 0,
    y: 0,
  });

  proccesstNodes(logicNode, connections, id);
};

export const proccesstNodes = (
  nodes: LogicNode[],
  cons: Connection[],
  rootId: string
) => {
  const abstractNodes = convertNodes(nodes, cons);
  const rootNode = getRootNode(abstractNodes, rootId) as AbstractNode;
  executeNode(rootNode, nodes);
  cycleGraph = false;
};

//Helper function returns the two connected Nodes from a Connection Object
export const getInputOutputNodes = (
  nodes: AbstractNode[],
  connection: Connection
): [AbstractNode | undefined, AbstractNode | undefined] => {
  let inputeNode, outputNode;
  nodes.forEach((node) => {
    if (node.id === connection.input.id) inputeNode = node;
    if (node.id === connection.output.id) outputNode = node;
  });
  return [inputeNode, outputNode];
};

const getRootNode = (nodes: AbstractNode[], rootId: string) => {
  for (let i = 0; i < nodes.length; i++)
    if (nodes[i].id === rootId) return nodes[i];
};

const getNode = (nodes: LogicNode[], id: string) => {
  for (let i = 0; i < nodes.length; i++)
    if (nodes[i].id === id) return nodes[i];
};

export const convertNodes = (
  nodes: LogicNode[],
  connections: Connection[]
): AbstractNode[] => {
  const abstractNodes: AbstractNode[] = [];

  nodes.forEach((node) => {
    const abstractInputs: AbstractInput[] = [];
    const abstractOutput: AbstractOutput[] = [];

    const abstractNode: AbstractNode = {
      id: node.id,
      loopCount: 0,
      isComputed: false,
      visited: false,
      inputs: [],
      outputs: [],
    };

    node.inputs.forEach((io, index) =>
      abstractInputs.push({ output: null, node: abstractNode, index: index })
    );
    node.outputs.forEach((io, index) =>
      abstractOutput.push({ paths: [], node: abstractNode, index: index })
    );

    abstractNode.inputs = abstractInputs;
    abstractNode.outputs = abstractOutput;

    abstractNodes.push(abstractNode);
  });

  connections.forEach((con) => {
    const [inNode, outNode] = getInputOutputNodes(abstractNodes, con);
    if (!inNode || !outNode) return;

    inNode.inputs[con.input.index].output = outNode.outputs[con.output.index];
    outNode.outputs[con.output.index].paths.push(
      inNode.inputs[con.input.index]
    );
  });

  return abstractNodes;
};

export const executeNode = (
  abstractNode: AbstractNode,
  logicNodes: LogicNode[]
) => {
  abstractNode.visited = true;
  abstractNode.loopCount++;
  if (abstractNode.loopCount > 2) cycleGraph = true;

  if (cycleGraph) {
    throw new Error("Inavlid Graph configuration, graph cannot be cyclic!");
  }

  const nodeId: string = abstractNode.id;
  const logicNode = getNode(logicNodes, nodeId) as LogicNode;

  //resolve all node dependencies (all input nodes)
  const dependencies: AbstractNode[] = [];
  abstractNode.inputs.forEach((io) => {
    if (io.output) dependencies.push(io.output.node);
  });
  dependencies.forEach((dep) => {
    if (!dep.isComputed) executeNode(dep, logicNodes);
  });

  if (abstractNode.isComputed) return;

  //set input values
  abstractNode.inputs.forEach((input, index) => {
    if (!input.output) return;
    const connectorNode: LogicNode = getNode(
      logicNodes,
      input.output.node.id
    ) as LogicNode;
    logicNode.inputs[index].value =
      connectorNode.outputs[input.output.index].value;
  });

  logicNode.forward(...logicNode.inputs, ...logicNode.outputs);
  abstractNode.isComputed = true;

  const next: AbstractNode[] = [];
  abstractNode.outputs.forEach((io) => {
    io.paths.forEach((path) => {
      if (path.output && !path.node.isComputed && !path.node.visited)
        next.push(path.node);
    });
  });
  next.forEach((nextNode) => executeNode(nextNode, logicNodes));
};
