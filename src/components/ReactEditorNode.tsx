import { MouseEvent } from "react";
import { ProtoIOMapper } from "../types/NodeEditorTypes";
import { NodeProps } from "../types/NodeTypes";
import "./../css/NodeContainer.css";
import { ReactNodeIO } from "./NodeIO";

export const ReactEditorNode = (props: NodeProps) => {
  const style = {
    top: props.y - props.editorOffset.y + "px",
    left: props.x - props.editorOffset.x + "px",
    transform: `scale(${props.zoom})`,
    transformOrigin: "top left",
    backgroundColor: props.color,
  };

  const headerColor = {
    backgroundColor: props.headerColor,
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

  const ioPorts: ProtoIOMapper[] = [];

  for (let i = 0; i < props.inputs.length; i++)
    ioPorts.push({ input: props.inputs[i], output: null });

  for (let i = 0; i < props.outputs.length; i++)
    if (i < ioPorts.length) ioPorts[i].output = props.outputs[i];
    else ioPorts.push({ input: null, output: props.outputs[i] });

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
          }}
          style={headerColor}>
          {props.name}
        </header>

        {ioPorts.map((io, index) => {
          ioKey = ioKey + 2;

          return (
            <ul key={ioKey}>
              {io.input ? (
                <ReactNodeIO
                  key={ioKey}
                  nodeId={props.id}
                  isInput={true}
                  index={index}
                  type={io.input.type}
                  conMapping={io.input.conMapping}
                  value={io.input.value}
                  color={io.input.color}
                  label={io.input.name}
                  extra={io.input.extra}
                  data={io.input.data}
                  onClick={props.onInputClicked}
                  onRightClick={null}
                  updateData={props.updateExtraData}
                  updateIOPosition={props.updateIOPosition}
                />
              ) : null}
              {io.output ? (
                <ReactNodeIO
                  key={ioKey + 1}
                  nodeId={props.id}
                  isInput={false}
                  index={index}
                  type={io.output.type}
                  conMapping={io.output.conMapping}
                  value={io.output.value}
                  color={io.output.color}
                  label={io.output.name}
                  extra={io.output.extra}
                  data={io.output.data}
                  onClick={props.onOutputClicked}
                  onRightClick={props.onOutputRightClikced}
                  updateData={props.updateExtraData}
                  updateIOPosition={props.updateIOPosition}
                />
              ) : null}
            </ul>
          );
        })}
      </div>
    </div>
  );
};

/*

<ul>
            {/* IO Ports will never change => they can have a generic id }
            {props.inputs.map((io, index) => {
              ioKey++;
              return (
                <ReactNodeIO
                  key={ioKey}
                  nodeId={props.id}
                  isInput={true}
                  index={index}
                  type={io.type}
                  conMapping={io.conMapping}
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
          </ul>
          <ul>
            {props.outputs.map((io, index) => {
              ioKey++;
              return (
                <ReactNodeIO
                  key={ioKey}
                  nodeId={props.id}
                  isInput={false}
                  index={index}
                  type={io.type}
                  conMapping={io.conMapping}
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


*/
