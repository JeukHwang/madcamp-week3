import { useEffect, useState } from "react";
import "./styles.scss";

export default function App() {
  const [lines, setLines] = useState([
    { from: "topLeft", to: "centerLeft" },
    { from: "bottomCenter", to: "centerRight" }
  ]);

  return (
    <div className="App">
      <h1>Simple Circle Grid</h1>
      <SVGGrid
        lines={lines}
        addNewLine={(newLine) => setLines((lines) => [...lines, newLine])}
        removeLineByIndex={(lineIdx) =>
          setLines([...lines.slice(0, lineIdx), ...lines.slice(lineIdx + 1)])
        }
      />
    </div>
  );
}

// we assume a 100x100 coordinate space
// it would be fairly simple to make this dynamically sized, but it's irrelevant here
// I don't implement click handlers but you can see you would attach them to elements very easily
// declare type SVGGridCircleID = 'topLeft' | 'topCenter' | ... | 'bottomRight';
// declare type SVGGridLine = { from: SVGGridCircleID, to: SVGGridCircleID }
export function SVGGrid({
  addNewLine = () => console.log("User did not provide line handler"),
  removeLineByIndex = () => console.log("No deletion logic provided"),
  deselectOnNewLine = true,
  padding = defaultSizingOptions.padding,
  lines = []
}) {
  const [svgSize, setSVGSize] = useState(() => getSVGSize(padding));
  const [newLineSource, setNewLineSource] = useState(null);

  useEffect(() => {
    const resizeListener = () => setSVGSize(getSVGSize(padding));
    window.addEventListener("resize", resizeListener);
    return window.removeEventListener("resize", () => resizeListener);
  }, [padding]);

  const circleRadius = 5;
  const circlePositions = [
    { id: "topLeft", pos: [10, 10] },
    { id: "topCenter", pos: [50, 10] },
    { id: "topRight", pos: [90, 10] },
    { id: "centerLeft", pos: [10, 50] },
    { id: "center", pos: [50, 50] },
    { id: "centerRight", pos: [90, 50] },
    { id: "bottomLeft", pos: [10, 90] },
    { id: "bottomCenter", pos: [50, 90] },
    { id: "bottomRight", pos: [90, 90] }
  ];

  const getCirclePositionById = (id) =>
    circlePositions.find((cPos) => cPos.id === id)?.pos;

  const handleBackgroundClick = (e) => {
    setNewLineSource(null);
  };

  const handleCircleClick = (e, circleId) => {
    if (newLineSource && circleId !== newLineSource) {
      addNewLine({ from: newLineSource, to: circleId });
      if (deselectOnNewLine) {
        setNewLineSource(null);
      }
    } else if (!newLineSource) {
      setNewLineSource(circleId);
    } else {
      setNewLineSource(null);
    }
  };
  
  return (
    <svg
      viewBox="0 0 100 100"
      width={svgSize}
      height={svgSize}
      onClick={handleBackgroundClick}
    >
      {/* draw fixed circles */}
      {circlePositions.map(({ id, pos }) => (
        <circle
          id={`SVGGrid-circle-${id}`}
          className={[
            "SVGGrid-circle",
            id === newLineSource && "SVGGrid-circle-active"
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={(e) => handleCircleClick(e, id)}
          cx={pos[0]}
          cy={pos[1]}
          r={circleRadius}
        />
      ))}
      {/* draw user provided lines */}
      {lines.map((line, idx) => {
        const sourcePos = getCirclePositionById(line.from);
        const targetPos = getCirclePositionById(line.to);
        if (!sourcePos || !targetPos) {
          console.error("Invalid source line, probably:", {
            line,
            sourcePos,
            targetPos
          });
          return null;
        }

        return (
          <line
            className="SVGGrid-line"
            onClick={(e) => removeLineByIndex(idx)}
            x1={sourcePos[0]}
            y1={sourcePos[1]}
            x2={targetPos[0]}
            y2={targetPos[1]}
          />
        );
      })}
    </svg>
  );
}

const defaultSizingOptions = {
  padding: 30,
  maxSize: 400
};
const getSVGSize = (padding) => Math.min(400, window.innerWidth - 2 * padding);
