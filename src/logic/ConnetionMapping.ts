import { CONTYPE } from "../types/IOTypes";
import { Connection } from "../types/NodeEditorTypes";
import { selectedNode } from "../types/NodeTypes";

export const createNewConnection = (
  output: selectedNode,
  input: selectedNode,
  connections: Connection[]
): Connection[] => {
  const cons = connections.map((con: Connection) => {
    return { ...con };
  });

  switch (input.conMapping) {
    case CONTYPE.SINGLE:
      deleteAllConntections(input, cons, true);
      break;
    case CONTYPE.MULTI:
      break;
    default:
      break;
  }

  switch (output.conMapping) {
    case CONTYPE.SINGLE:
      deleteAllConntections(output, cons, false);
      break;
    case CONTYPE.MULTI:
      break;
    default:
      break;
  }

  cons.push({ input: input, output: output });

  return cons;
};

const deleteAllConntections = (
  io: selectedNode,
  connections: Connection[],
  isInput: boolean
) => {
  connections.forEach((con: Connection, index: number) => {
    if (con.input.id === io.id && con.input.index === io.index && isInput)
      connections.splice(index, 1);
    if (con.output.id === io.id && con.output.index === io.index && !isInput)
      connections.splice(index, 1);
  });
  return connections;
};
