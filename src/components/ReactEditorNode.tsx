import { MouseEvent } from "react";
import { NodeProps } from "../types/NodeTypes";
import "./../css/NodeContainer.css";
import { ReactNodeIO } from "./NodeIO";

export const ReactEditorNode = (props: NodeProps) => {
  const style = {
    top: props.y + "px",
    left: props.x + "px",
  };

  const onDrag = (e: MouseEvent) => {
    const diffX = e.pageX - props.x;
    const diffY = e.pageY - props.y;

    props.dragHandler(props.id, diffX, diffY);
    props.reorderNode(props.index);
  };

  let ioKey: number = 0;

  return (
    <div className="NodeContainer" style={style}>
      <header
        onMouseDown={(e: MouseEvent) => {
          e.preventDefault();
          onDrag(e);
        }}>
        {props.name}
      </header>
      <ul>
        {/* IO Ports will never change => the can have a generic id */}
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
            />
          );
        })}
      </ul>
    </div>
  );
};
