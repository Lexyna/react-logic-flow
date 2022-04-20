import { useState } from "react";
import {
  Connection,
  ContextMenuOptions,
  NodeEditorProps,
} from "../types/NodeEditorTypes";
import { LogicNode, selectedNode } from "../types/NodeTypes";
import { ReactEditorNode } from "./ReactEditorNode";

export const NodeEditor = (props: NodeEditorProps) => {
  const [nodes, setNodes] = useState<LogicNode[]>([
    {
      ...props.root,
      name: props.root.name + "(Root)",
      id: props.id,
      x: 50,
      y: 50,
    },
  ]);

  const [dragNode, setDragNode] = useState<string>(""); //Identify the node to be dragged
  const [mousePath, setMousePath] = useState<string>(""); //stroke path for output to mouse bezier curve - if any
  const [connections, setConnections] = useState<Connection[]>([]);
  const [contextMenuOptions, setContextMenuOptions] =
    useState<ContextMenuOptions>({
      showContextMenu: false,
      x: 0,
      y: 0,
    });

  const updateExtraData = (
    nodeID: string,
    input: boolean,
    index: number,
    data: any
  ) => {};

  const onConnect = (node: selectedNode) => {};

  const onDisconnect = () => {};

  return (
    <div id={props.id} className="NodeEditor">
      <svg>
        <path
          fill="none"
          stroke="gray"
          strokeWidth={2}
          strokeDasharray="20,5,5,10,5,5"
          d={mousePath}
        />
      </svg>
      {nodes.map((node: LogicNode) => {
        return (
          <ReactEditorNode
            x={node.x}
            y={node.y}
            name={node.name}
            inputs={node.inputs}
            outpiuts={node.outputs}
            dragHandler={setDragNode}
            onInputClicked={onConnect}
            onoutputClicked={onDisconnect}
            updateExtraData={updateExtraData}
            id={node.id}
            key={node.id}
          />
        );
      })}
    </div>
  );
};
