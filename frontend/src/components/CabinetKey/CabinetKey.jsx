import { Stage, Layer, Rect } from "react-konva";
import { useState, useEffect } from "react";
import { generateWall, placeCabinet } from "../../../utils/api";

/**
 * @summary A component that displays a key for the room design
 */
const CabinetKey = () => {
  const [wallData, setWallData] = useState(null);
  const [error, setError] = useState(false);
  const [cabinets, setCabinets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handlePlace = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Call a test cabinet
      // TODO make an actual legend on the sidebar
      const data = await placeCabinet('test', 15, 15, 15, 1, 1);

      console.log("API Response:", data)

      setCabinets((prevCabinets) => [...prevCabinets, data.placed_cabinet]);
    } catch (error) {
      setError("Failed to generate wall layout: " + error);
    }

    setIsLoading(false);
  }

  // useEffect to call the API when the component loads
  useEffect(() => {
    handlePlace();
  }, []);

  return (
    <div className="cabinet-key">
      <h2>Legend</h2>
      <p>Base Cabinet</p>
      <Stage className="canvas" width={300} height={400}>
        <Layer>
          {/* Ensure cabinets array has data before trying to render */}
          {cabinets.length > 0 && (
            <Rect
              x={cabinets[0].position_x} // Correct property for x
              y={cabinets[0].position_y} // Correct property for y
              width={cabinets[0].width * 10} // Scaling factor
              height={cabinets[0].height * 10} // Scaling factor
              stroke="red"
              strokeWidth={3}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default CabinetKey;
