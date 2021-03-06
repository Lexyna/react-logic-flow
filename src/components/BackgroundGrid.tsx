import { GridProps } from "../types/GridType";

interface line {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
}

export const BackgroundGrid = (props: GridProps) => {
  const lineWidth = props.width;
  const lineHeight = props.height;

  const defaultColor: string = "rgb(55, 55, 55)";
  const boldColor: string = "black";

  let boldLine = 7;
  const gridPadding = 15 * props.zoom;

  const defaultLines: line[] = [];
  const boldLines: line[] = [];

  const editorOffsetX = props.editorOffset.x;
  const editorOffsetY = props.editorOffset.y;

  for (let i = -gridPadding; i < lineWidth + editorOffsetX; i += gridPadding) {
    boldLine++;

    defaultLines.push({
      startX: i + (props.offsetX % gridPadding) - editorOffsetX,
      startY: 0,
      endX: i + (props.offsetX % gridPadding) - editorOffsetX,
      endY: lineHeight,
      color: defaultColor,
    });
    if (boldLine % 8 === 0)
      boldLines.push({
        startX: i + (props.offsetX % (8 * gridPadding)) - editorOffsetX,
        startY: 0,
        endX: i + (props.offsetX % (8 * gridPadding)) - editorOffsetX,
        endY: lineHeight,
        color: boldColor,
      });
  }

  boldLine = 7;

  for (let i = -gridPadding; i < lineHeight + editorOffsetY; i += gridPadding) {
    boldLine++;

    defaultLines.push({
      startX: 0,
      startY: i + (props.offsetY % gridPadding) - editorOffsetY,
      endX: lineWidth,
      endY: i + (props.offsetY % gridPadding) - editorOffsetY,
      color: defaultColor,
    });
    if (boldLine % 8 === 0)
      boldLines.push({
        startX: 0,
        startY: i + (props.offsetY % (gridPadding * 8)) - editorOffsetY,
        endX: lineWidth,
        endY: i + (props.offsetY % (gridPadding * 8)) - editorOffsetY,
        color: boldColor,
      });
  }

  let keyId = 0;

  return (
    <svg>
      {defaultLines.map((line) => {
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
      {boldLines.map((line) => {
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
