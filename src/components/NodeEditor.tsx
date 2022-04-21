import { MouseEvent, useState } from "react";
import "../css/NodeEditor.css";
import { computeBezierCurve } from "../logic/Utils";
import {
  Connection,
  ContextMenuOptions,
  NodeEditorProps,
} from "../types/NodeEditorTypes";
import { LogicNode, selectedNode } from "../types/NodeTypes";
import { NodeConnection } from "./NodeConnection";
import { NodeContextMenu } from "./NodeContextMenu";
import { ReactEditorNode } from "./ReactEditorNode";

let selectedOutput: selectedNode | null = null;
let isSelected: boolean = false;

export const NodeEditor = (props: NodeEditorProps) => {
  const [nodes, setNodes] = useState<LogicNode[]>([
    {
      ...props.root,
      name: props.root.name + "(Root)",
      id: props.id, // useNanoId here to create the unqiue Id
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

    const newNodes: LogicNode[] = nodes.map((n) => {
      return { ...n };
    });
    newNodes.forEach((node, index) => {
      if (node.id === dragNodeId) {
        newNodes[index].x += e.movementX;
        newNodes[index].y += e.movementY;
      }
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
        } else cons.splice(index, 1);
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

  const onRemoveConnecton = (index: number) => {
    const cons = connections.map((con) => {
      return { ...con };
    });
    cons.splice(index, 1);

    setConnections(cons);
  };

  //Right click on an output node, to remove all connected nodes
  const onRemoveAllConnections = (nodeId: string, index: number) => {
    const cons = connections.map((n) => {
      return { ...n };
    });
    for (let i = cons.length - 1; i >= 0; i--)
      if (cons[i].output.id === nodeId) cons.splice(i, 1);
    setConnections(cons);
  };

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

  const reorderNode = (index: number) => {
    const reorderedNodes = nodes.map((n) => {
      return { ...n };
    });
    const activeNode = reorderedNodes[index];

    reorderedNodes.splice(index, 1);
    reorderedNodes.push(activeNode);
    setNodes(reorderedNodes);
  };

  //Move the curently hovered-over connetion to the end of the list =>
  //it wil be renderd on top all other connections
  const setConnectionHover = (index: number) => {
    const cons = connections.map((con) => {
      return { ...con };
    });
    const hover = cons[index];

    cons.splice(index, 1);
    cons.push(hover);
    setConnections(cons);
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
        {connections.map((con, index) => {
          const str = computeBezierCurve(
            con.output.x(),
            con.output.y(),
            con.input.x(),
            con.input.y()
          );
          pathId++;
          return (
            <NodeConnection
              key={pathId}
              index={index}
              color={con.input.color}
              d={str}
              setHover={setConnectionHover}
              removeConnection={onRemoveConnecton}
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
      {nodes.map((node: LogicNode, index: number) => {
        return (
          <ReactEditorNode
            index={index}
            x={node.x}
            y={node.y}
            name={node.name}
            inputs={node.inputs}
            outputs={node.outputs}
            dragHandler={selecteNodeToDrag}
            reorderNode={reorderNode}
            onInputClicked={onConnect}
            onOutputClicked={onOutputClicked}
            onOutputRightClikced={onRemoveAllConnections}
            updateExtraData={updateExtraData}
            id={node.id}
            key={node.id}
          />
        );
      })}
    </div>
  );
};
