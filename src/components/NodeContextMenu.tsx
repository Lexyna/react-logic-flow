import { NodeContextMenuProps } from "../types/ContextMenuTypes";

export const NodeContextMenu = (props: NodeContextMenuProps) => {
  const style = {
    top: `${props.y}px`,
    left: `${props.x}px`,
  };

  return (
    <div style={style} className="ContextMenuContainer">
      {props.show ? (
        <div className="NodeContextMenu">
          <div className="NodeContextMenuItem" onClick={props.delete}>
            <header>Delete</header>
            <span>Delete this node</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
