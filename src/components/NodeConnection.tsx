import { useState } from "react";
import { NodeConnectionProps } from "../types/NodeEditorTypes";

export const NodeConnection = (props: NodeConnectionProps) => {
  const [strokeWidth, setStrokeWidth] = useState(2);

  const onHover = () => {
    props.setHover(props.index);
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
        onClick={onConnectionClicked}
        fill="none"
        stroke={props.color}
        strokeWidth={strokeWidth}
        d={props.d}
      />
    </svg>
  );
};
