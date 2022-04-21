import { MouseEvent } from "react";
import { NodeProps } from "../types/NodeTypes";
import "./../css/NodeContainer.css";
import { ReactNodeIO } from "./NodeIO";

export const ReactEditorNode = (props: NodeProps) => {
  const style = {
    top: props.y + "px",
    left: props.x + "px",
  };

  const onDrag = () => {
    props.dragHandler(props.id);
  };

  let ioKey: number = 0;

  return (
    <div className="NodeContainer" style={style}>
      <header
        onMouseDown={(e: MouseEvent) => {
          e.preventDefault();
          onDrag();
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
              updateData={props.updateExtraData}
            />
          );
        })}
      </ul>
    </div>
  );
};
