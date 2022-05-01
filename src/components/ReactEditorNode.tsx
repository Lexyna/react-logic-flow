import { MouseEvent } from "react";
import { NodeProps } from "../types/NodeTypes";
import "./../css/NodeContainer.css";
import { ReactNodeIO } from "./NodeIO";

export const ReactEditorNode = (props: NodeProps) => {
  const style = {
    top: props.y - props.editorOffset.y + "px",
    left: props.x - props.editorOffset.x + "px",
    transform: `scale(${props.zoom})`,
    transformOrigin: "top left",
  };

  const onDrag = (e: MouseEvent) => {
    const diffX = e.pageX - props.x;
    const diffY = e.pageY - props.y;

    props.dragHandler(props.id, diffX, diffY);
    props.reorderNode(props.index);
  };

  const deleteNode = () => {
    props.deleteNode(props.id);
  };

  let ioKey: number = 0;

  return (
    <div>
      <div
        className="NodeContainer"
        style={style}
        onContextMenu={(e) => {
          e.preventDefault();
          props.showContextMenu(e, deleteNode);
        }}
        onClick={props.hideContextMenu}>
        <header
          onMouseDown={(e: MouseEvent) => {
            e.preventDefault();
            props.hideContextMenu();
            onDrag(e);
          }}>
          {props.name}
        </header>
        <ul>
          {/* IO Ports will never change => they can have a generic id */}
          {props.inputs.map((io, index) => {
            ioKey++;
            return (
              <ReactNodeIO
                key={ioKey}
                nodeId={props.id}
                isInput={true}
                index={index}
                type={io.type}
                value={io.value}
                color={io.color}
                label={io.name}
                extra={io.extra}
                data={io.data}
                onClick={props.onInputClicked}
                onRightClick={null}
                updateData={props.updateExtraData}
                updateIOPosition={props.updateIOPosition}
              />
            );
          })}
          {props.outputs.map((io, index) => {
            ioKey++;
            return (
              <ReactNodeIO
                key={ioKey}
                nodeId={props.id}
                isInput={false}
                index={index}
                type={io.type}
                value={io.value}
                color={io.color}
                label={io.name}
                extra={io.extra}
                data={io.data}
                onClick={props.onOutputClicked}
                onRightClick={props.onOutputRightClikced}
                updateData={props.updateExtraData}
                updateIOPosition={props.updateIOPosition}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};
