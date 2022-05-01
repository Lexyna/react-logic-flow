import { MouseEvent, WheelEvent } from "react";
import { computeBezierCurve } from "../logic/Utils";
import { ConnectionStageProps } from "../types/ConnectionStageTypes";
import { BackgroundGrid } from "./BackgroundGrid";
import { NodeConnection } from "./NodeConnection";

export const ConnectionStage = (props: ConnectionStageProps) => {
  //update nodeEditor zoom
  const zoomListener = (e: WheelEvent) => {
    let newZoom = props.zoom;
    if (e.deltaY > 0) newZoom += 0.05;
    else newZoom -= 0.05;

    if (newZoom < 0.3 || newZoom > 1.2) return;

    props.setZoom(newZoom);
    props.updateMousePath(e as MouseEvent);
  };

  const onRemoveConnecton = (index: number) => {
    const cons = props.connections.map((con) => {
      return { ...con };
    });
    cons.splice(index, 1);

    props.setConnections(cons);
  };

  let pathId: number = 0;

  return (
    <svg
      className="NodeEditorSVG"
      onWheel={zoomListener}
      onContextMenu={(e) => {
        e.preventDefault();
        props.hideNodeContextMenu();
        props.showEditorContexMenu(e);
      }}>
      <BackgroundGrid
        width={props.editorDimensions.width}
        height={props.editorDimensions.height}
        offsetX={props.panningOffset.offsetX}
        offsetY={props.panningOffset.offsetY}
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
