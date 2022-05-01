import { nanoid } from "nanoid";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { ContextMenuProps } from "../types/ContextMenuTypes";
import { LogicNode, ProtoNode } from "../types/NodeTypes";
import "./../css/NodeContextMenu.css";

export const NodeContextMenu = (props: ContextMenuProps) => {
  let listId = 0;

  const [searchText, setSearchText] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [nodes, setNodes] = useState<ProtoNode[]>(props.config);

  const style = {
    top: `${props.y}px`,
    left: `${props.x}px`,
  };

  const updateTextSearch = (s: string) => {
    setSelectedIndex(0);
    setSearchText(s);
  };

  const onKeyDownHandler = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp")
      setSelectedIndex((index) => {
        if (index > 0) return index - 1;
        return index;
      });
    if (e.key === "ArrowDown")
      setSelectedIndex((index) => {
        if (index < nodes.length - 1) return index + 1;
        return index;
      });
    if (e.key === "Enter")
      if (ref.current)
        addLogicNode(
          ref.current.getBoundingClientRect().x,
          ref.current.getBoundingClientRect().y,
          nodes[selectedIndex]
        );
  };

  const addLogicNode = (x: number, y: number, protoNode: ProtoNode) => {
    const logicNode: LogicNode = {
      id: nanoid(),
      configId: protoNode.id,
      name: protoNode.name,
      x: x / props.zoom - props.panning.offsetX,
      y: y / props.zoom - props.panning.offsetY,
      inputs: protoNode.inputs,
      outputs: protoNode.outputs,
      forward: protoNode.forward,
    };
    props.addNode(logicNode);
  };

  useEffect(() => {
    const newNodes: ProtoNode[] = [];

    props.config.forEach((node) => {
      if (
        node.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
      )
        newNodes.push(node);
    });
    setNodes(newNodes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  useEffect(() => {
    setSearchText("");
  }, [props.show]);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div style={style} className="NodeContextMenuContainer">
      {props.show ? (
        <div
          ref={ref}
          className="NodeContextMenu"
          onKeyDown={(e) => onKeyDownHandler(e)}
          tabIndex={0}>
          <div className="NodeContextMenuItem searchBar">
            <header>Search</header>
            <input
              autoFocus
              placeholder="search..."
              type="text"
              onChange={(e) => updateTextSearch(e.target.value)}
            />
          </div>
          {nodes.map((node, index) => {
            listId++;
            return (
              <div
                className={
                  selectedIndex === index
                    ? "NodeContextMenuItem selectedItem"
                    : "NodeContextMenuItem"
                }
                key={listId}
                onClick={(e) => addLogicNode(e.clientX, e.clientY, node)}
                onMouseEnter={() => setSelectedIndex(index)}>
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
