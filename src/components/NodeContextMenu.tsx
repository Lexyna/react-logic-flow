import { nanoid } from "nanoid";
import { MouseEvent, useState } from "react";
import { ContextMenuProps } from "../types/ContextMenuTypes";
import { LogicNode, ProtoNode } from "../types/NodeTypes";
import "./../css/NodeContextMenu.css";

export const NodeContextMenu = (props: ContextMenuProps) => {
  let listId = 0;

  const [searchText, setSearchText] = useState<string>("");

  const style = {
    top: `${props.y}px`,
    left: `${props.x}px`,
  };

  const updateTextSearch = (s: string) => {
    setSearchText(s);
  };

  const addLogicNode = (e: MouseEvent, protoNode: ProtoNode) => {
    const logicNode: LogicNode = {
      id: nanoid(),
      configId: protoNode.id,
      name: protoNode.name,
      x: e.clientX / props.zoom - props.panning.offsetX,
      y: e.clientY / props.zoom - props.panning.offsetY,
      inputs: protoNode.inputs,
      outputs: protoNode.outputs,
      forward: protoNode.forward,
    };
    props.addNode(logicNode);
  };

  return (
    <div style={style} className="NodeContextMenuContainer">
      {props.show ? (
        <div className="NodeContextMenu">
          <div className="NodeContextMenuItem">
            <header>Search</header>
            <input
              autoFocus
              placeholder="search..."
              type="text"
              onChange={(e) => updateTextSearch(e.target.value)}
            />
          </div>
          {props.config.map((node) => {
            if (!node.name.includes(searchText)) return null;
            listId++;
            return (
              <div
                className="NodeContextMenuItem"
                key={listId}
                onClick={(e) => addLogicNode(e, node)}>
                <header>{node.name}</header>
                <span>{node.description}</span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
