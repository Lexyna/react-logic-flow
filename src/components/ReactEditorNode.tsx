import { ReactNode } from "../types/NodeTypes";
import "./../css/NodeContainer.css";

export const ReactEditorNode = (props: ReactNode) => {
  const style = {
    top: props.x + "px",
    left: props.y + "px",
  };

  const onDrag = () => {
    props.dragHandler(props.id);
  };

  let ioKey: number = 0;

  return (
    <div className="NodeContainer" style={style}>
      <header>{props.name}</header>
    </div>
  );
};
