import { MouseEvent, useState } from "react";
import "../css/NodeEditor.css";
import { computeBezierCurve } from "../logic/Utils";
import {
  Connection,
  ContextMenuOptions,
  NodeEditorProps,
} from "../types/NodeEditorTypes";
import { LogicNode, selectedNode } from "../types/NodeTypes";
import { NodeContextMenu } from "./NodeContextMenu";
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

  const onOutputClicked = (node: selectedNode) => {
    selectedOutput = node;
  };

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
    updateMousePath(e);
  };

  const resetSelectedOutput = () => {
    if (selectedOutput && isSelected) {
      selectedOutput = null;
      isSelected = false;
      setMousePath("");
    }
    if (selectedOutput) isSelected = true;
  };

  const updateMousePath = (e: MouseEvent) => {
    if (!selectedOutput) return;
    const x2 = e.clientX;
    const y2 = e.clientY;

    const str = computeBezierCurve(
      selectedOutput.x(),
      selectedOutput.y(),
      x2,
      y2
    );
    setMousePath(str);
  };

  const updateExtraData = (
    nodeID: string,
    input: boolean,
    index: number,
    data: any
  ) => {};

  const onConnect = (node: selectedNode) => {
    const cons = connections.slice();
    let connectionExists = false;

    cons.forEach((con, index) => {
      if (con.input.id === node.id && con.input.index === node.index) {
        connectionExists = true;
        if (selectedOutput) {
          if (con.input.type !== con.output.type) return;
          cons[index].output = selectedOutput;
        } else cons.slice(index, 1);
      }
    });

    if (
      !connectionExists &&
      selectedOutput &&
      node.type === selectedOutput.type
    )
      cons.push({ input: node, output: selectedOutput });

    setConnections(cons);
  };

  const onDisconnect = () => {};

  const addNodeToEditor = (node: LogicNode) => {
    setNodes(nodes.concat(node));
    hideContextMenu();
  };

  const showContextMenu = (e: MouseEvent) => {
    setContextMenuOptions({
      showContextMenu: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const hideContextMenu = () => {
    setContextMenuOptions({
      ...contextMenuOptions,
      showContextMenu: false,
    });
  };

  let pathId: number = 0;

  return (
    <div
      id={props.id}
      className="NodeEditor"
      onMouseUp={resetNodeToDrag}
      onClick={resetSelectedOutput}
      onMouseMove={onMove}>
      <NodeContextMenu
        config={props.config}
        show={contextMenuOptions.showContextMenu}
        x={contextMenuOptions.x}
        y={contextMenuOptions.y}
        addNode={addNodeToEditor}
      />
      <svg
        className="NodeEditorSVG"
        onClick={hideContextMenu}
        onContextMenu={(e) => {
          e.preventDefault();
          showContextMenu(e);
        }}>
        {connections.map((con) => {
          const str = computeBezierCurve(
            con.output.x(),
            con.output.y(),
            con.input.x(),
            con.input.y()
          );
          pathId++;
          return (
            <path
              key={pathId}
              fill="none"
              stroke={con.output.color}
              strokeWidth={2}
              d={str}
            />
          );
        })}

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
            outputs={node.outputs}
            dragHandler={selecteNodeToDrag}
            onInputClicked={onConnect}
            onOutputClicked={onOutputClicked}
            updateExtraData={updateExtraData}
            id={node.id}
            key={node.id}
          />
        );
      })}
    </div>
  );
};
