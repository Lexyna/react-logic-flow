import { useState } from "react";
import { NodeConnectionProps } from "../types/NodeEditorTypes";

export const NodeConnection = (props: NodeConnectionProps) => {
  const [pathColor, setPathColor] = useState(props.color);
  const [strokeWidth, setStrokeWidth] = useState(2);

  const onHover = () => {
    setPathColor("black");
    props.setHover(props.index);
    setStrokeWidth(4);
  };

  const onHoverLeave = () => {
    setPathColor(props.color);
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
        stroke={pathColor}
        strokeWidth={strokeWidth}
        d={props.d}
      />
    </svg>
  );
};
