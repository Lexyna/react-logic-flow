import { GridProps } from "../types/GridType";

interface line {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
}

export const BackgroundGrid = (props: GridProps) => {
  const renderLines: line[] = [];

  const lineWidth = props.width / props.zoom;
  const lineHeight = props.height / props.zoom;

  const defaultColor: string = "rgb(55, 55, 55)";
  const boldColor: string = "black";

  let boldLine = 7;

  for (let i = 0; i < lineWidth; i += 15) {
    boldLine++;

    renderLines.push({
      startX: i,
      startY: 0,
      endX: i,
      endY: lineHeight,
      color: boldLine % 8 === 0 ? boldColor : defaultColor,
    });
  }

  boldLine = 0;
  for (let i = 0; i < lineHeight; i += 15) {
    boldLine++;
    renderLines.push({
      startX: 0,
      startY: i,
      endX: lineWidth,
      endY: i,
      color: boldLine % 8 === 0 ? boldColor : defaultColor,
    });
  }

  let keyId = 0;

  return (
    <svg>
      {renderLines.map((line) => {
        keyId++;
        return (
          <line
            key={keyId}
            x1={line.startX}
            y1={line.startY}
            x2={line.endX}
            y2={line.endY}
            stroke={line.color}></line>
        );
      })}
    </svg>
  );
};
