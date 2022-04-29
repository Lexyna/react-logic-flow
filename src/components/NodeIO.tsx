import { FunctionComponent, MouseEvent, useEffect, useRef } from "react";
import { ExtraProps, NodeIOProps } from "../types/IOTypes";

export const ReactNodeIO = (props: NodeIOProps<any, any>) => {
  const dotRef = useRef<HTMLUListElement>(null);

  const setSelectedNode = () => {
    const id = props.nodeId;

    props.onClick({
      id: id,
      color: props.color,
      index: props.index,
      type: props.type,
    });
  };

  const onRightClick = (e: MouseEvent) => {
    e.preventDefault();
    if (!props.onRightClick) return;
    props.onRightClick(props.nodeId, props.index);
  };

  const updateData = (data: any) => {
    props.updateData(props.nodeId, props.isInput, props.index, data);
  };

  //Update connection (if any) with the new position of this io port
  useEffect(() => {
    let id = props.isInput
      ? props.nodeId + "In" + props.index
      : props.nodeId + "Out" + props.index;

    const x = () => {
      if (!dotRef.current) return -1;
      return (
        dotRef.current.getBoundingClientRect().left +
        dotRef.current.getBoundingClientRect().width
      );
    };
    const y = () => {
      if (!dotRef.current) return -1;
      return (
        dotRef.current.getBoundingClientRect().y +
        0.4 * dotRef.current.getBoundingClientRect().height
      );
    };

    props.updateIOPosition(props.nodeId, id, {
      x: x,
      y: y,
    });
  });

  const CustomComponent = props.extra as FunctionComponent<
    ExtraProps<any, any>
  >;

  return (
    <li className={props.isInput ? "Input" : "Output"}>
      {props.extra ? (
        <div>
          <CustomComponent value={props.value} setData={updateData} />
        </div>
      ) : (
        <span>{props.label}</span>
      )}
      <i
        style={{ backgroundColor: `${props.color}` }}
        onClick={() => setSelectedNode()}
        onContextMenu={onRightClick}
        onChange={() => console.log("change: " + props.nodeId)}
        ref={dotRef}></i>
    </li>
  );
};
