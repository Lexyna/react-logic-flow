import { ReduxNode } from "../store/reducers/NodeEditorSlice";
import { LogicIO } from "../types/IOTypes";
import { LogicNode, ProtoNode } from "../types/NodeTypes";

/** returns the stroke path for the Path svg element as Bézier curve */
export const computeBezierCurve = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string => {
  const dif = Math.abs(x1 - x2) / 1.5;
  const str: string =
    "M" +
    x1 +
    "," +
    y1 +
    "C" +
    (x1 + dif) +
    "," +
    y1 +
    ", " +
    (x2 - dif) +
    "," +
    y2 +
    " " +
    x2 +
    "," +
    y2;
  return str;
};

export const getProtoNodeById = (
  protoNodes: ProtoNode[],
  id: string
): ProtoNode | null => {
  for (let i = 0; i < protoNodes.length; i++)
    if (protoNodes[i].id === id) return protoNodes[i];

  return null;
};

export const createLogicNodeArray = (
  configNodes: ProtoNode[],
  nodes: ReduxNode[]
): LogicNode[] => {
  const logicNodes: LogicNode[] = [];

  nodes.forEach((node) => {
    const configNode = getProtoNodeById(configNodes, node.configId);
    if (!configNode) return;

    //Create IOPorts
    const inputs = configNode.inputs.map((io, index) => {
      return { ...io, data: node.inputs[index] };
    });

    const outputs = configNode.outputs.map((io, index) => {
      return { ...io, data: node.outputs[index] };
    });

    logicNodes.push({
      id: node.nodeId,
      configId: configNode.id,
      name: configNode.name,
      x: node.x,
      y: node.y,
      inputs: inputs,
      outputs: outputs,
      forward: configNode.forward,
    });
  });

  return logicNodes;
};

export const createLogicNodeArrayWithGraphId = (
  configNodes: ProtoNode[],
  nodes: ReduxNode[],
  graphId: string
): LogicNode[] => {
  const logicNodes: LogicNode[] = [];

  nodes.forEach((node) => {
    const configNode = getProtoNodeById(configNodes, node.configId);
    if (!configNode) return;

    const inputs: LogicIO<any, any>[] = configNode.inputs.map((io, index) => {
      return {
        ...io,
        data: node.inputs[index],
        graphId: graphId,
        nodeId: node.nodeId,
        index: index,
      };
    });

    const outputs: LogicIO<any, any>[] = configNode.outputs.map((io, index) => {
      return {
        ...io,
        data: node.outputs[index],
        graphId: graphId,
        nodeId: node.nodeId,
        index: index,
      };
    });

    logicNodes.push({
      id: node.nodeId,
      configId: configNode.id,
      graphId: graphId,
      name: configNode.name,
      x: node.x,
      y: node.y,
      inputs: inputs,
      outputs: outputs,
      forward: configNode.forward,
    });
  });

  return logicNodes;
};
