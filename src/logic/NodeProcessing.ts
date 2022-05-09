import { nanoid } from "nanoid";
import { ReduxNode } from "../store/reducers/NodeEditorSlice";
import { store } from "../store/stroe";
import { ACTIVATION, LogicIO, ProtoIO } from "../types/IOTypes";
import { Connection } from "../types/NodeEditorTypes";
import { LogicNode, ProtoNode } from "../types/NodeTypes";
import { createLogicNodeArrayWithGraphId } from "./Utils";

interface LogicGraph {
  [k: string]: {
    nodes: LogicNode[];
    connetions: Connection[];
    graphId: string;
  };
}

const logicGraphs: LogicGraph = {};

export const createLivingGarph = (
  editorId: string,
  config: ProtoNode[]
): string => {
  const state = store.getState();
  if (!state.nodeEditors[editorId]) throw new Error("Id not found");

  const graphId = nanoid();

  const editorState = state.nodeEditors[editorId];

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

  const logicNodes: LogicNode[] = createLogicNodeArrayWithGraphId(
    config,
    nodes,
    graphId
  );

  logicGraphs[graphId] = {
    nodes: logicNodes,
    connetions: connections,
    graphId: graphId,
  };

  logicNodes.forEach((node) => {
    resolveDependencies(node);
    if (node.setup) node.setup(...node.inputs, ...node.outputs);
  });

  return graphId;
};

export const deleteLivingGraph = (id: string) => {
  if (!logicGraphs[id]) return;

  logicGraphs[id].nodes.forEach((node) => {
    if (node.cleanup) node.cleanup(...node.inputs, ...node.outputs);
  });

  delete logicGraphs[id];
};

export const createOneTimeGraph = (
  editorId: string,
  config: ProtoNode[],
  root: ProtoNode
) => {
  console.log("Executing");
  const state = store.getState();

  if (!state.nodeEditors[editorId]) throw new Error("Id not found");

  const editorState = state.nodeEditors[editorId];

  const nodes: ReduxNode[] = editorState.nodes;
  const connections: Connection[] = editorState.connections;

  const graphId = nanoid();

  //check if the passed config is valid
  nodes.forEach((node) => {
    let isValid: boolean = false;
    config.forEach((con) => {
      if (node.configId === con.id) isValid = true;
    });
    if (!isValid) throw new Error("Invalid configuration provided");
  });

  const rootInputs: LogicIO<any, any>[] = root.inputs.map((io, index) => {
    return {
      ...io,
      data: root.inputs[index],
      graphId: graphId,
      nodeId: editorId,
      index: index,
    };
  });

  const rootOutputs: LogicIO<any, any>[] = root.outputs.map((io, index) => {
    return {
      ...io,
      data: root.outputs[index],
      graphId: graphId,
      nodeId: editorId,
      index: index,
    };
  });

  const logicRoot: LogicNode = {
    ...root,
    name: root.name + "(Root)",
    id: editorId,
    configId: root.id,
    autoUpdate: !(root.autoUpdate === undefined) ? root.autoUpdate : true,
    inputs: rootInputs,
    outputs: rootOutputs,
    graphId: graphId,
    x: 0,
    y: 0,
  };

  const logicNodes = createLogicNodeArrayWithGraphId(
    config,
    nodes,
    graphId
  ).concat(logicRoot);

  logicGraphs[graphId] = {
    nodes: logicNodes,
    connetions: connections,
    graphId: editorId,
  };

  logicNodes.forEach((node) => {
    resolveDependencies(node);
    if (node.setup) node.setup(...node.inputs, ...node.outputs);
  });

  fireNode(logicRoot, false);

  logicNodes.forEach((node) => {
    if (node.cleanup) node.cleanup(...node.inputs, ...node.outputs);
  });

  delete logicGraphs[graphId];
};

const getConnectedNodeAndIndex = (
  logicNode: LogicNode,
  index: number
): [LogicNode | null, number | null] => {
  if (!logicNode.graphId) return [null, null];
  const graphId = logicNode.graphId;

  if (!logicGraphs[graphId]) return [null, null];

  for (let i = 0; i < logicGraphs[graphId].connetions.length; i++)
    if (
      logicGraphs[graphId].connetions[i].input.id === logicNode.id &&
      logicGraphs[graphId].connetions[i].input.index === index
    ) {
      const connectedNode = searchLogicNode(
        graphId,
        logicGraphs[graphId].connetions[i].output.id
      );
      return [connectedNode, logicGraphs[graphId].connetions[i].output.index];
    }

  return [null, null];
};

const resolveDependencies = (logicNode: LogicNode) => {
  logicNode.inputs.forEach((io, index) => {
    if (io.type === ACTIVATION) return;
    const [dependencyNode, outputIndex] = getConnectedNodeAndIndex(
      logicNode,
      index
    );
    if (dependencyNode && !(outputIndex === null)) {
      fireNode(dependencyNode, true);
      logicNode.inputs[index].value = dependencyNode.outputs[outputIndex].value;
    }
  });
};

const fireNode = (logicNode: LogicNode, isDependancy: boolean) => {
  resolveDependencies(logicNode);
  if (isDependancy && !logicNode.autoUpdate) return;
  logicNode.forward(...logicNode.inputs, ...logicNode.outputs);
};

export const next = (io: ProtoIO<any, any>) => {
  const logicIO: LogicIO<any, any> = io as LogicIO<any, any>;

  if (!logicIO.graphId) return;
  if (!logicGraphs[logicIO.graphId]) return;

  const graph = logicGraphs[logicIO.graphId];

  let targetNode: LogicNode | null = null;

  graph.connetions.forEach((con) => {
    if (
      con.output.id === logicIO.nodeId &&
      con.output.index === logicIO.index
    ) {
      targetNode = searchLogicNode(logicIO.graphId, con.input.id);
      return;
    }
  });

  if (!targetNode) return;

  fireNode(targetNode, false);
};

const searchLogicNode = (graphId: string, nodeId: string): LogicNode | null => {
  if (!logicGraphs[graphId]) return null;

  const graph = logicGraphs[graphId];

  for (let i = 0; i < graph.nodes.length; i++) {
    if (graph.nodes[i].id === nodeId) return graph.nodes[i];
  }

  return null;
};
