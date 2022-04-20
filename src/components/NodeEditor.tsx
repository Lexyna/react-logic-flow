import { MouseEvent, useState } from "react";
import "../css/NodeEditor.css";
import {
  Connection,
  ContextMenuOptions,
  NodeEditorProps,
} from "../types/NodeEditorTypes";
import { LogicNode, selectedNode } from "../types/NodeTypes";
import { ReactEditorNode } from "./ReactEditorNode";

let selectedOutput: selectedNode | null = null;
let isSelected: boolean = false;

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

  const [dragNodeId, setDragNodeId] = useState<string | null>(""); //Identify the node to be dragged
  const [mousePath, setMousePath] = useState<string>(""); //stroke path for output to mouse bezier curve - if any
  const [connections, setConnections] = useState<Connection[]>([]);
  const [contextMenuOptions, setContextMenuOptions] =
    useState<ContextMenuOptions>({
      showContextMenu: false,
      x: 0,
      y: 0,
    });

  const selecteNodeToDrag = (id: string) => {
    setDragNodeId(id);
  };

  const resetNodeToDrag = () => {
    setDragNodeId(null);
  };

  const updateNodePosition = (e: MouseEvent) => {
    if (!dragNodeId) return;

    const newNodes: LogicNode[] = nodes.slice();
    newNodes.forEach((node, index) => {
      if (node.id !== dragNodeId) return;
      newNodes[index].x += e.movementX;
      newNodes[index].y += e.movementY;
    });

    setNodes(newNodes);
  };

  const onMove = (e: MouseEvent) => {
    updateNodePosition(e);
  };

  const updateExtraData = (
    nodeID: string,
    input: boolean,
    index: number,
    data: any
  ) => {};

  const onConnect = (node: selectedNode) => {};

  const onDisconnect = () => {};

  return (
    <div
      id={props.id}
      className="NodeEditor"
      onMouseUp={resetNodeToDrag}
      onMouseMove={onMove}>
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
            dragHandler={selecteNodeToDrag}
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
