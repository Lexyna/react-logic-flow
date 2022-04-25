import { useState } from "react";
import { NodeConnectionProps } from "../types/NodeEditorTypes";
import "./../css/NodeConnection.css";

export const NodeConnection = (props: NodeConnectionProps) => {
  const [strokeWidth, setStrokeWidth] = useState(2);

  const onHover = () => {
    setStrokeWidth(4);
  };

  const onHoverLeave = () => {
    setStrokeWidth(2);
  };

  const onConnectionClicked = () => {
    props.removeConnection(props.index);
  };

  return (
    <svg onMouseEnter={onHover} onMouseLeave={onHoverLeave}>
      <path
        className="NodeConnection"
        onClick={onConnectionClicked}
        fill="none"
        stroke={props.color}
        strokeWidth={strokeWidth}
        d={props.d}
      />
    </svg>
  );
};
