import { MouseEvent, useState } from "react";
import { ContextMenuOptions } from "../types/NodeEditorTypes";
import { NodeProps } from "../types/NodeTypes";
import "./../css/NodeContainer.css";
import { NodeContextMenu } from "./NodeContextMenu";
import { ReactNodeIO } from "./NodeIO";

export const ReactEditorNode = (props: NodeProps) => {
  const [contextMenuOptions, setContextMenuOptions] =
    useState<ContextMenuOptions>({
      showContextMenu: false,
      x: 0,
      y: 0,
    });

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

  let ioKey: number = 0;

  return (
    <div>
      <NodeContextMenu
        show={contextMenuOptions.showContextMenu}
        x={contextMenuOptions.x}
        y={contextMenuOptions.y}
        delete={deleteNode}
      />
      <div
        className="NodeContainer"
        style={style}
        onContextMenu={(e) => {
          e.preventDefault();
          showContextMenu(e);
        }}
        onClick={hideContextMenu}>
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
