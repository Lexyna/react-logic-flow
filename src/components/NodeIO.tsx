import { FunctionComponent, useRef } from "react";
import { ExtraProps, ReactIO } from "../types/IOTypes";

export const ReactNodeIO = (props: ReactIO<any>) => {
  const dotRef = useRef<HTMLUListElement>(null);

  const updateData = (data: any) => {
    props.updateData(props.nodeId, props.isInput, props.index, data);
  };

  const CustomComponent = props.extra as FunctionComponent<ExtraProps<any>>;

  return (
    <li className={props.isInput ? "Input" : "Output"}>
      {props.extra ? (
        <div>
          <CustomComponent value={props.value} setData={updateData} />
        </div>
      ) : (
        <span>{props.label}</span>
      )}
      <i> </i>
    </li>
  );
};
