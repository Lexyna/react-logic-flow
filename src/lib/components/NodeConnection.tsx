import { useState } from "react";
import { NodeConnectionProps } from "../../types/NodeEditorTypes";
import "./../../css/NodeConnection.css";

export const NodeConnection = (props: NodeConnectionProps) => {
  const [strokeWidth, setStrokeWidth] = useState(2);

  const connectionStye = {
    transform: `scale(${props.zoom})`,
    stroke: props.color,
    strokeWidth: strokeWidth,
    strokeDasharray: props.dashArray ? props.dashArray : "",
    animation: props.animated ? "connectionAnimation 50s linear infinite;" : "",
  };

  const onHover = () => {
    setStrokeWidth(6);
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
        style={connectionStye}
        className={props.animated ? "AnimatedConnection" : ""}
        onClick={onConnectionClicked}
        fill="none"
        d={props.d}
      />
    </svg>
  );
};
