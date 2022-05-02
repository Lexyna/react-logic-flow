import { MouseEvent, useEffect, useRef, useState, WheelEvent } from "react";
import { computeBezierCurve } from "../logic/Utils";
import { ConnectionStageProps } from "../types/ConnectionStageTypes";
import { clientDimensions } from "../types/utilTypes";
import { BackgroundGrid } from "./BackgroundGrid";
import { NodeConnection } from "./NodeConnection";

export const ConnectionStage = (props: ConnectionStageProps) => {
  //width and height of the NodeEditor. Needed to draw the background grid correctly
  const [editorDimensions, setEditorDimensions] = useState<clientDimensions>({
    width: 0,
    height: 0,
  });

  //update nodeEditor zoom
  const zoomListener = (e: WheelEvent) => {
    let newZoom = props.zoom;
    if (e.deltaY > 0) newZoom += 0.05;
    else newZoom -= 0.05;

    if (newZoom < 0.3 || newZoom > 1.2) return;

    props.setZoom(newZoom);
    props.updatePreviewConnectionPath(e as MouseEvent);
  };

  const onRemoveConnecton = (index: number) => {
    const cons = props.connections.map((con) => {
      return { ...con };
    });
    cons.splice(index, 1);

    props.setConnections(cons);
  };

  const updateBackground = () => {
    if (!ref.current) return;

    const width = ref.current.getBoundingClientRect().width;
    const height = ref.current.getBoundingClientRect().height;

    setEditorDimensions((dim) => {
      if (dim.width === width && dim.height === height) return dim;
      return {
        width: width,
        height: height,
      };
    });
  };

  //Update background grid with nodeEditor width and height after each change to the editor
  useEffect(() => {
    updateBackground();
  });

  //setup eventListeners to update bg Grid when componene size changes
  useEffect(() => {
    window.onresize = updateBackground;
  }, []);

  let pathId: number = 0;

  const ref = useRef<SVGSVGElement>(null);

  return (
    <svg
      ref={ref}
      className="NodeEditorSVG"
      onWheel={zoomListener}
      onContextMenu={(e) => {
        e.preventDefault();
        props.hideNodeContextMenu();
        props.showEditorContexMenu(e);
      }}>
      <BackgroundGrid
        width={editorDimensions.width}
        height={editorDimensions.height}
        offsetX={props.panningOffset.offsetX}
        offsetY={props.panningOffset.offsetY}
        editorOffset={props.nodeEditorOffset}
        zoom={props.zoom}
      />
      {props.connections.map((con, index) => {
        const inId = con.input.id + "In" + con.input.index;
        const outId = con.output.id + "Out" + con.output.index;

        if (!props.conPosTable[con.input.id]) return null;
        if (!props.conPosTable[con.output.id]) return null;

        if (!props.conPosTable[con.input.id][inId]) return null;
        if (!props.conPosTable[con.output.id][outId]) return null;

        const str = computeBezierCurve(
          props.conPosTable[con.output.id][outId].x() / props.zoom -
            props.nodeEditorOffset.x / props.zoom,
          props.conPosTable[con.output.id][outId].y() / props.zoom -
            props.nodeEditorOffset.y / props.zoom,
          props.conPosTable[con.input.id][inId].x() / props.zoom -
            props.nodeEditorOffset.x / props.zoom,
          props.conPosTable[con.input.id][inId].y() / props.zoom -
            props.nodeEditorOffset.y / props.zoom
        );
        pathId++;
        return (
          <NodeConnection
            key={pathId}
            index={index}
            color={con.output.color}
            zoom={props.zoom}
            d={str}
            removeConnection={onRemoveConnecton}
          />
        );
      })}
      <svg>
        <path
          style={{ transform: `scale(${props.zoom})` }}
          fill="none"
          stroke="gray"
          strokeWidth={2}
          strokeDasharray="20,5,5,10,5,5"
          d={props.mousePath}
        />
      </svg>
    </svg>
  );
};
