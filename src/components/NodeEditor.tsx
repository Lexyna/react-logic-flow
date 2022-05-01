import { MouseEvent, useEffect, useRef, useState, WheelEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../css/NodeEditor.css";
import { proccesstNodes } from "../logic/NodeProcessing";
import { computeBezierCurve } from "../logic/Utils";
import {
  addNodeEditor,
  NodeEditorStore,
  ReduxNode,
  selectNodeEditor,
  selectNodeEditorConnections,
  selectNodeEditorNodes,
  selectRootNodePos,
  updateConnections,
  updateNodes,
  updateRootNodePos,
} from "../store/reducers/NodeEditorSlice";
import {
  Connection,
  ConnectionPosition,
  ConnectionPosTable,
  ContextMenuOptions,
  NodeContextMenuOptions,
  NodeEditorProps,
} from "../types/NodeEditorTypes";
import { LogicNode, ProtoNode, selectedNode } from "../types/NodeTypes";
import { BackgroundGrid } from "./BackgroundGrid";
import { EditorContextMenu } from "./EditorContextMenu";
import { NodeConnection } from "./NodeConnection";
import { NodeContextMenu } from "./NodeContextMenu";
import { ReactEditorNode } from "./ReactEditorNode";

interface clientDimensions {
  width: number;
  height: number;
}
export interface DragOffset {
  offsetX: number;
  offsetY: number;
}

let selectedOutput: selectedNode | null = null;
let isSelected: boolean = false;

const getProtoNodeById = (
  protoNodes: ProtoNode[],
  id: string
): ProtoNode | null => {
  for (let i = 0; i < protoNodes.length; i++)
    if (protoNodes[i].id === id) return protoNodes[i];

  return null;
};

const createLogicNodeArray = (
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

export const NodeEditor = (props: NodeEditorProps) => {
  const rootId = props.id; // main id for the indetification of this nodeEditor in the store

  const rootPos = useSelector(selectRootNodePos(rootId));

  const savedNode = useSelector(selectNodeEditorNodes(rootId));
  const [nodes, setNodes] = useState<LogicNode[]>(
    createLogicNodeArray(props.config, savedNode).concat({
      ...props.root,
      name: props.root.name + "(Root)",
      id: rootId,
      configId: props.root.id,
      x: rootPos.x,
      y: rootPos.y,
    })
  );

  const nodeEditorStore = useSelector(selectNodeEditor(rootId));
  const connections = useSelector(selectNodeEditorConnections(rootId));

  const setConnections = (connections: Connection[]) => {
    dispatch(
      updateConnections({
        id: props.id,
        connetions: connections,
      })
    );
  };

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [panningOffset, setPanningOffset] = useState<DragOffset>({
    offsetX: 0,
    offsetY: 0,
  });

  //top left positon of the node editor relative to the screen
  const [nodeEditorOffset, setNodeEditorOffset] = useState({ x: 0, y: 0 });

  const dispatch = useDispatch();

  //conPosTable is used to store a function referncing the x,y location of each ioPort. This way, we can serrialize the connection Objects in the store without having to worry about losing the information to draw the svg paths
  const [conPosTable, setConPosTable] = useState<ConnectionPosTable>({});

  const [dragNodeId, setDragNodeId] = useState<string | null>(""); //Identify the node to be dragged
  const [mousePath, setMousePath] = useState<string>(""); //stroke path for output to mouse bezier curve - if any

  //Helper state to draw the contextMenu
  const [contextMenuOptions, setContextMenuOptions] =
    useState<ContextMenuOptions>({
      showContextMenu: false,
      x: 0,
      y: 0,
    });

  const [nodeContextMenuOptions, setNodeContextMenuOptions] =
    useState<NodeContextMenuOptions>({
      showContextMenu: false,
      x: 0,
      y: 0,
      delete: () => {},
    });

  const [zoom, setZoom] = useState(1);
  const [dragOffset, setDragOffset] = useState<DragOffset>({
    offsetX: 0,
    offsetY: 0,
  });

  //width and height of the NodeEditor. Needed to draw the background grid correctly
  const [editorDimensions, setEditorDimensions] = useState<clientDimensions>({
    width: 0,
    height: 0,
  });

  //Create new store Object if this nodeEditor does not already exist
  const createNewNodeEditor = () => {
    const editor: NodeEditorStore = {
      id: props.id,
      rootNodePos: { x: 50, y: 50 },
      nodes: [],
      connections: [],
    };
    dispatch(addNodeEditor(editor));
  };

  const setDragging = (isDragging: boolean) => {
    if (ref.current) {
      if (isDragging) ref.current.classList.add("NodeEditorDrag");
      else ref.current.classList.remove("NodeEditorDrag");
    }

    setIsDragging(isDragging);
  };

  //Whenever a new node is added to the Editor, push the ref function for the io ports into conPosTable
  const updatedNodeIOPosition = (
    nodeId: string,
    id: string, //individual ioPort id => nodeID + [In|Out] + ioPort.index
    updatedPos: ConnectionPosition
  ) => {
    if (conPosTable[nodeId]) if (conPosTable[nodeId][id]) return;

    setConPosTable({
      ...conPosTable,
      [nodeId]: {
        ...conPosTable[nodeId],
        [id]: {
          x: updatedPos.x,
          y: updatedPos.y,
        },
      },
    });
  };

  const onOutputClicked = (node: selectedNode) => {
    selectedOutput = node;
  };

  const selecteNodeToDrag = (id: string, x: number, y: number) => {
    setDragNodeId(id);
    setDragOffset({ offsetX: x, offsetY: y });
  };

  const updateNodePosition = (e: MouseEvent) => {
    if (!dragNodeId) return;

    const newNodes: LogicNode[] = nodes.map((n) => {
      return { ...n };
    });
    newNodes.forEach((node, index) => {
      if (node.id === dragNodeId) {
        newNodes[index].x =
          e.pageX / zoom -
          dragOffset.offsetX / zoom -
          panningOffset.offsetX / zoom;
        newNodes[index].y =
          e.pageY / zoom -
          dragOffset.offsetY / zoom -
          panningOffset.offsetY / zoom;
      }
    });

    setNodes(newNodes);
  };

  const updateEditorOffset = (e: MouseEvent) => {
    if (!isDragging) return;

    setPanningOffset({
      offsetX: panningOffset.offsetX + e.movementX,
      offsetY: panningOffset.offsetY + e.movementY,
    });
  };

  const onMove = (e: MouseEvent) => {
    updateNodePosition(e);
    updateMousePath(e);
    updateEditorOffset(e);
  };

  const onMouseDownHandler = (e: MouseEvent) => {
    if (e.button === 1) setDragging(true);
  };

  const onMouseUpHandler = (e: MouseEvent) => {
    setDragNodeId(null);
    setDragging(false);
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

    const outId = selectedOutput.id + "Out" + selectedOutput.index;

    const str = computeBezierCurve(
      conPosTable[selectedOutput.id][outId].x() / zoom - nodeEditorOffset.x,
      conPosTable[selectedOutput.id][outId].y() / zoom - nodeEditorOffset.y,
      x2 / zoom - nodeEditorOffset.x,
      y2 / zoom - nodeEditorOffset.y
    );
    setMousePath(str);
  };

  const updateExtraData = (
    nodeID: string,
    input: boolean,
    index: number,
    data: any
  ) => {
    const copyNodes = nodes.map((node) => {
      return {
        ...node,
        inputs: node.inputs.map((io) => {
          return { ...io };
        }),
        outputs: node.outputs.map((io) => {
          return { ...io };
        }),
      };
    });

    copyNodes.forEach((node, nodeIndex) => {
      if (node.id !== nodeID) return;
      if (input) copyNodes[nodeIndex].inputs[index].data = data;
      else copyNodes[nodeIndex].outputs[index].data = data;
    });

    setNodes(copyNodes);
  };

  const onConnect = (node: selectedNode) => {
    const cons = connections.map((con) => {
      return { ...con };
    });
    let connectionExists = false;

    cons.forEach((con, index) => {
      if (con.input.id === node.id && con.input.index === node.index) {
        connectionExists = true;
        if (selectedOutput) {
          if (con.input.type !== selectedOutput.type) return;
          cons[index].output = selectedOutput;
        } else {
          selectedOutput = cons[index].output;
          cons.splice(index, 1);
        }
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
      if (cons[i].output.id === nodeId && cons[i].output.index === index)
        cons.splice(i, 1);
    setConnections(cons);
  };

  const addNodeToEditor = (node: LogicNode) => {
    setNodes(nodes.concat(node));
    hideContextMenu();
  };

  const deleteNodeFromEditor = (id: string) => {
    if (id === rootId) return;

    const newNodes: LogicNode[] = [];
    nodes.forEach((n) => {
      if (n.id !== id) newNodes.push(n);
    });

    const newConnections: Connection[] = [];
    connections.forEach((con) => {
      if (con.input.id !== id && con.output.id !== id) newConnections.push(con);
    });

    hideNodeContextMenu();
    setConnections(newConnections);
    setNodes(newNodes);
  };

  const showContextMenu = (e: MouseEvent) => {
    setContextMenuOptions({
      showContextMenu: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const showNodeContextMenu = (e: MouseEvent, func: () => void) => {
    hideContextMenu();
    setNodeContextMenuOptions({
      showContextMenu: true,
      x: e.clientX,
      y: e.clientY,
      delete: func,
    });
  };

  const hideContextMenu = () => {
    setContextMenuOptions({
      ...contextMenuOptions,
      showContextMenu: false,
    });
  };

  const hideNodeContextMenu = () => {
    setNodeContextMenuOptions({
      ...nodeContextMenuOptions,
      showContextMenu: false,
    });
  };

  //Reorder node array so the currently selected Node will be darwn last
  const reorderNode = (index: number) => {
    const reorderedNodes = nodes.map((n) => {
      return { ...n };
    });
    const activeNode = reorderedNodes[index];

    reorderedNodes.splice(index, 1);
    reorderedNodes.push(activeNode);
    setNodes(reorderedNodes);
  };

  //Execute the defined node tree based on an abstract mapping of the nodes and it's connections
  const execute = () => {
    const logicNodes: LogicNode[] = nodes.map((node) => {
      return {
        ...node,
        inputs: node.inputs.map((io) => {
          return { ...io };
        }),
        outputs: node.outputs.map((io) => {
          return { ...io };
        }),
      };
    });

    proccesstNodes(logicNodes, connections, rootId);
  };

  //Executes logiGrapg after each node or connection upgrade
  const doLiveUpdate = () => {
    if (props.liveUpdate) execute();
  };

  const updateBackground = () => {
    if (!ref.current) return;

    const width = ref.current.getBoundingClientRect().width;
    const height = ref.current.getBoundingClientRect().height;

    setEditorDimensions({ width: width, height: height });
  };

  useEffect(() => {
    if (!dragNodeId) doLiveUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections, nodes]);

  //Update background grid with nodeEditor width and height
  useEffect(() => {
    updateBackground();

    window.onresize = updateBackground;
  }, [zoom]);

  //Update store if this node Editor is first created
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!nodeEditorStore) {
      createNewNodeEditor();

      if (!ref.current) return;
      setNodeEditorOffset({
        x: ref.current.getBoundingClientRect().x,
        y: ref.current.getBoundingClientRect().y,
      });
    }
  });

  //When nodes change (positions/add/delete/etc.) => update the storr nodes
  useEffect(() => {
    const reduxNodes: ReduxNode[] = [];
    nodes.forEach((n) => {
      if (n.configId === props.root.id) {
        dispatch(
          updateRootNodePos({
            id: rootId,
            x: n.x,
            y: n.y,
          })
        );
        return;
      }

      const extraDataInput: any[] = [];
      const extraDataOutput: any[] = [];

      for (let i = 0; i < n.inputs.length; i++)
        extraDataInput.push(n.inputs[i].data);

      for (let i = 0; i < n.outputs.length; i++)
        extraDataOutput.push(n.outputs[i].data);

      reduxNodes.push({
        x: n.x,
        y: n.y,
        configId: n.configId,
        nodeId: n.id,
        inputs: extraDataInput,
        outputs: extraDataOutput,
      });
    });
    dispatch(
      updateNodes({
        id: rootId,
        nodes: reduxNodes,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  //update nodeEditor zoom
  const zoomListener = (e: WheelEvent) => {
    let newZoom = zoom;
    if (e.deltaY > 0) newZoom += 0.05;
    else newZoom -= 0.05;

    if (newZoom < 0.3 || newZoom > 1.2) return;

    setZoom(newZoom);
    updateMousePath(e as MouseEvent);
  };

  let pathId: number = 0;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      id={props.id}
      className="NodeEditor"
      onMouseUp={onMouseUpHandler}
      onMouseDown={onMouseDownHandler}
      onClick={resetSelectedOutput}
      onMouseMove={onMove}>
      <EditorContextMenu
        config={props.config}
        show={contextMenuOptions.showContextMenu}
        x={contextMenuOptions.x}
        y={contextMenuOptions.y}
        panning={panningOffset}
        zoom={zoom}
        addNode={addNodeToEditor}
      />
      <NodeContextMenu
        show={nodeContextMenuOptions.showContextMenu}
        x={nodeContextMenuOptions.x}
        y={nodeContextMenuOptions.y}
        delete={nodeContextMenuOptions.delete}
      />
      <button style={{ position: "absolute" }} onClick={execute}>
        proccess me
      </button>

      <svg
        className="NodeEditorSVG"
        onClick={() => {
          hideContextMenu();
          hideNodeContextMenu();
        }}
        onWheel={zoomListener}
        onContextMenu={(e) => {
          e.preventDefault();
          hideNodeContextMenu();
          showContextMenu(e);
        }}>
        <BackgroundGrid
          width={editorDimensions.width}
          height={editorDimensions.height}
          offsetX={panningOffset.offsetX}
          offsetY={panningOffset.offsetY}
          zoom={zoom}
        />
        {connections.map((con, index) => {
          const inId = con.input.id + "In" + con.input.index;
          const outId = con.output.id + "Out" + con.output.index;

          if (!conPosTable[con.input.id]) return null;
          if (!conPosTable[con.output.id]) return null;

          if (!conPosTable[con.input.id][inId]) return null;
          if (!conPosTable[con.output.id][outId]) return null;

          const str = computeBezierCurve(
            conPosTable[con.output.id][outId].x() / zoom -
              nodeEditorOffset.x / zoom,
            conPosTable[con.output.id][outId].y() / zoom -
              nodeEditorOffset.y / zoom,
            conPosTable[con.input.id][inId].x() / zoom -
              nodeEditorOffset.x / zoom,
            conPosTable[con.input.id][inId].y() / zoom -
              nodeEditorOffset.y / zoom
          );
          pathId++;
          return (
            <NodeConnection
              key={pathId}
              index={index}
              color={con.output.color}
              zoom={zoom}
              d={str}
              removeConnection={onRemoveConnecton}
            />
          );
        })}
        <svg>
          <path
            style={{ transform: `scale(${zoom})` }}
            fill="none"
            stroke="gray"
            strokeWidth={2}
            strokeDasharray="20,5,5,10,5,5"
            d={mousePath}
          />
        </svg>
      </svg>
      {nodes.map((node: LogicNode, index: number) => {
        return (
          <ReactEditorNode
            index={index}
            x={node.x * zoom + panningOffset.offsetX}
            y={node.y * zoom + panningOffset.offsetY}
            editorOffset={nodeEditorOffset}
            zoom={zoom}
            name={node.name}
            inputs={node.inputs}
            outputs={node.outputs}
            dragHandler={selecteNodeToDrag}
            showContextMenu={showNodeContextMenu}
            hideContextMenu={hideNodeContextMenu}
            deleteNode={deleteNodeFromEditor}
            reorderNode={reorderNode}
            onInputClicked={onConnect}
            onOutputClicked={onOutputClicked}
            onOutputRightClikced={onRemoveAllConnections}
            updateIOPosition={updatedNodeIOPosition}
            updateExtraData={updateExtraData}
            id={node.id}
            key={node.id}
          />
        );
      })}
    </div>
  );
};
