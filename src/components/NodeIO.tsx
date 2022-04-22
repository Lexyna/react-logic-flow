import { FunctionComponent, MouseEvent, useRef } from "react";
import { ExtraProps, NodeIOProps } from "../types/IOTypes";

export const ReactNodeIO = (props: NodeIOProps<any, any>) => {
  const dotRef = useRef<HTMLUListElement>(null);

  const setSelectedNode = () => {
    if (!dotRef.current) return;
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
    const id = props.nodeId;

    props.onClick({
      x: x,
      y: y,
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
        ref={dotRef}></i>
    </li>
  );
};
