import { ReactNode } from "../types/NodeTypes";
import "./../css/NodeContainer.css";

export const ReactEditorNode = (props: ReactNode) => {
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
      <header onMouseDown={onDrag}>{props.name}</header>
    </div>
  );
};
