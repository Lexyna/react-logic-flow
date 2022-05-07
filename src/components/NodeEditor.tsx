import { MouseEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../css/NodeEditor.css";
import { createNewConnection } from "../logic/ConnetionMapping";
import { createLivingGarph, createOneTimeGraph } from "../logic/NodeProcessing";
import { computeBezierCurve, createLogicNodeArray } from "../logic/Utils";
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
  ContextMenuOptions,
  NodeContextMenuOptions,
} from "../types/ContextMenuTypes";
import {
  Connection,
  ConnectionPosition,
  ConnectionPosTable,
  NodeEditorProps,
} from "../types/NodeEditorTypes";
import { LogicNode, selectedNode } from "../types/NodeTypes";
import { DragOffset } from "../types/utilTypes";
import { ConnectionStage } from "./ConnectionStage";
import { EditorContextMenu } from "./EditorContextMenu";
import { NodeContextMenu } from "./NodeContextMenu";
import { ReactEditorNode } from "./ReactEditorNode";

let selectedOutput: selectedNode | null = null;
let isSelected: boolean = false;

export const NodeEditor = (props: NodeEditorProps) => {
  const rootId = props.id; // main id for the identification of this nodeEditor in the store

  //-------------------------------------------------- Editor States --------------------------------------------------

  const rootPos = useSelector(selectRootNodePos(rootId));

  const savedNode = useSelector(selectNodeEditorNodes(rootId));
  const [nodes, setNodes] = useState<LogicNode[]>(
    createLogicNodeArray(props.config, savedNode).concat({
      ...props.root,
      name: props.root.name + "(Root)",
      id: rootId,
      configId: props.root.id,
      autoUpdate: !(props.root.autoUpdate === undefined)
        ? props.root.autoUpdate
        : true,
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

  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panningOffset, setPanningOffset] = useState<DragOffset>({
    offsetX: 0,
    offsetY: 0,
  });

  //top left positon of the node editor relative to the screen
  const [nodeEditorOffset, setNodeEditorOffset] = useState({ x: 0, y: 0 });

  //conPosTable is used to store a function referncing the x,y location of each ioPort. This way, we can serrialize the connection Objects in the store without having to worry about losing the information to draw the svg paths
  const [conPosTable, setConPosTable] = useState<ConnectionPosTable>({});

  //Identify the node to be dragged
  const [dragNodeId, setDragNodeId] = useState<string | null>("");

  //stroke path from output to mouse; bezier curve - if any
  const [previewPath, setPreviewPath] = useState<string>("");

  //Helper state to draw the contextMenu
  const [contextMenuOptions, setContextMenuOptions] =
    useState<ContextMenuOptions>({
      showContextMenu: false,
      x: 0,
      y: 0,
    });

  //Helper state to draw node specific ContextMenu
  const [nodeContextMenuOptions, setNodeContextMenuOptions] =
    useState<NodeContextMenuOptions>({
      showContextMenu: false,
      x: 0,
      y: 0,
      delete: () => {},
    });

  const [zoom, setZoom] = useState(1);

  //Drag offset of the node the is being dragged
  const [dragOffset, setDragOffset] = useState<DragOffset>({
    offsetX: 0,
    offsetY: 0,
  });

  const dispatch = useDispatch();

  //-------------------------------------------------- Functions --------------------------------------------------

  //Functions related to mouseEvents in the editor

  const setPanning = (isPanning: boolean) => {
    if (ref.current) {
      if (isPanning) ref.current.classList.add("NodeEditorDrag");
      else ref.current.classList.remove("NodeEditorDrag");
    }

    setIsPanning(isPanning);
  };

  const selecteNodeToDrag = (id: string, x: number, y: number) => {
    setDragNodeId(id);
    setDragOffset({ offsetX: x, offsetY: y });
  };

  const updateEditorOffset = (e: MouseEvent) => {
    if (!isPanning) return;

    setPanningOffset({
      offsetX: panningOffset.offsetX + e.movementX,
      offsetY: panningOffset.offsetY + e.movementY,
    });
  };

  const onMove = (e: MouseEvent) => {
    updateNodePosition(e);
    updatePreviewConnectionPath(e);
    updateEditorOffset(e);
  };

  const onMouseDownHandler = (e: MouseEvent) => {
    if (e.button === 1) setPanning(true);
  };

  const onMouseUpHandler = (e: MouseEvent) => {
    setDragNodeId(null);
    setPanning(false);
  };

  const updatePreviewConnectionPath = (e: MouseEvent) => {
    if (!selectedOutput) return;
    const x2 = e.clientX;
    const y2 = e.clientY;

    const outId = selectedOutput.id + "Out" + selectedOutput.index;

    const str = computeBezierCurve(
      conPosTable[selectedOutput.id][outId].x() / zoom -
        nodeEditorOffset.x / zoom,
      conPosTable[selectedOutput.id][outId].y() / zoom -
        nodeEditorOffset.y / zoom,
      x2 / zoom - nodeEditorOffset.x / zoom,
      y2 / zoom - nodeEditorOffset.y / zoom
    );
    setPreviewPath(str);
  };

  //functions related to connections

  const resetSelectedOutput = () => {
    if (selectedOutput && isSelected) {
      selectedOutput = null;
      isSelected = false;
      setPreviewPath("");
    }
    if (selectedOutput) isSelected = true;
  };

  const onOutputClicked = (node: selectedNode) => {
    selectedOutput = node;
  };

  //connect the selectdOutput node with the passed input node
  const onConnect = (selectedInput: selectedNode) => {
    const cons = connections.map((con) => {
      return { ...con };
    });

    if (!selectedOutput) {
      for (let i = 0; i < cons.length; i++)
        if (
          cons[i].input.id === selectedInput.id &&
          cons[i].input.index === selectedInput.index
        ) {
          selectedOutput = cons[i].output;
          cons.splice(i, 1);
          break;
        }
      setConnections(cons);
      return;
    }

    if (selectedOutput.type !== selectedInput.type) return;

    const newConnections = createNewConnection(
      selectedOutput,
      selectedInput,
      cons
    );

    setConnections(newConnections);
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

  //functions related to the context Menu

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

  const showNodeContextMenu = (e: MouseEvent, func: () => void) => {
    hideContextMenu();
    setNodeContextMenuOptions({
      showContextMenu: true,
      x: e.clientX,
      y: e.clientY,
      delete: func,
    });
  };

  const hideNodeContextMenu = () => {
    setNodeContextMenuOptions({
      ...nodeContextMenuOptions,
      showContextMenu: false,
    });
  };

  // Functions to handle nodes

  //To display the selected node ontop, we have to reorder the array
  const reorderNode = (index: number) => {
    const reorderedNodes = nodes.map((n: LogicNode) => {
      return { ...n };
    });
    const activeNode = reorderedNodes[index];

    reorderedNodes.splice(index, 1);
    reorderedNodes.push(activeNode);
    setNodes(reorderedNodes);
  };

  //To keep a io ports serializable, we have to populate a second object with a function to return the relative position of each io port
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

  const updateNodePosition = (e: MouseEvent) => {
    if (!dragNodeId) return;

    const newNodes: LogicNode[] = nodes.map((n: LogicNode) => {
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

  const addNodeToEditor = (node: LogicNode) => {
    setNodes(nodes.concat(node));
    hideContextMenu();
  };

  const deleteNodeFromEditor = (id: string) => {
    if (id === rootId) return;

    const newNodes: LogicNode[] = [];
    nodes.forEach((n: LogicNode) => {
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

  //functions to execute the graph logic

  const execute = () => {
    createOneTimeGraph(props.id, props.config, props.root);
  };

  const doLiveUpdate = () => {
    if (props.liveUpdate) execute();
  };

  const setupLivingGraph = () => {
    createLivingGarph(props.id, props.config);
  };

  // Other functions

  const createNewNodeEditor = () => {
    const editor: NodeEditorStore = {
      id: props.id,
      rootNodePos: { x: 50, y: 50 },
      nodes: [],
      connections: [],
    };
    dispatch(addNodeEditor(editor));
  };

  const updateExtraData = (
    nodeID: string,
    input: boolean,
    index: number,
    data: any
  ) => {
    const copyNodes = nodes.map((node: LogicNode) => {
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

    copyNodes.forEach((node: LogicNode, nodeIndex: number) => {
      if (node.id !== nodeID) return;
      if (input) copyNodes[nodeIndex].inputs[index].data = data;
      else copyNodes[nodeIndex].outputs[index].data = data;
    });

    setNodes(copyNodes);
  };

  // -------------------------------------------------- Effects --------------------------------------------------

  useEffect(() => {
    if (!dragNodeId) doLiveUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections, nodes]);

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

  //To keep track of te nodes position whenever they get changed
  useEffect(() => {
    const reduxNodes: ReduxNode[] = [];
    nodes.forEach((n: LogicNode) => {
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

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      id={props.id}
      className="NodeEditor"
      onMouseUp={onMouseUpHandler}
      onMouseDown={onMouseDownHandler}
      onClick={() => {
        resetSelectedOutput();
        hideNodeContextMenu();
        hideContextMenu();
      }}
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
      <button
        style={{ position: "absolute", left: "10rem" }}
        onClick={setupLivingGraph}>
        Create living Grapg
      </button>
      <ConnectionStage
        zoom={zoom}
        connections={connections}
        conPosTable={conPosTable}
        nodeEditorOffset={nodeEditorOffset}
        panningOffset={panningOffset}
        setZoom={setZoom}
        setConnections={setConnections}
        updatePreviewConnectionPath={updatePreviewConnectionPath}
        mousePath={previewPath}
        showEditorContexMenu={showContextMenu}
        hideNodeContextMenu={hideNodeContextMenu}
      />
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
