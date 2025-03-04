import { Stage, Layer, Rect } from "react-konva";
import { useState, useEffect } from "react";
import axios from "axios";
import { FOOT_PX } from "../../global_files/global_vars";

/**
 * @summary A component that displays a key for the room design
 */
const CabinetKey = () => {
  const [cabinets, setCabinets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const placeCabinet = async (width, height, x, y) => {
    const cabinetData = {
      cabinet: {
        name: "Base Cabinet",
        width: width,
        height: height,
      },
      x: x,
      y: y,
    };

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/place_cabinet/",
        cabinetData
      );
      const placedCabinet = response.data.placed_cabinet;
      

      // Use the functional form of setCabinets to get the latest state and append the new cabinet
      setCabinets((prevCabinets) => [...prevCabinets, placedCabinet]);

      setIsLoading(false);
    } catch (error) {
      console.error("Error placing cabinet:", error);
      setIsLoading(false);
    }
  };

  // useEffect to call the API when the component loads
  useEffect(() => {
    const placeCabinets = async () => {
      for(let i = 1; i <= 5; i++) {
        await placeCabinet(3, 3, (i * 3 * FOOT_PX) + 1, 1);
      }
    }

    placeCabinets();
  }, []);

  return (
    <div className="cabinet-key">
      <h2>Legend</h2>
      <p>Base Cabinet</p>
      <Stage className="canvas" width={300} height={400}>
        <Layer>
          {/* Ensure cabinets array has data before trying to render */}
          {cabinets.length > 0 &&
            cabinets.map((cabinet, index) => (
              <Rect
                key={index}
                x={cabinet.position_x} // Correct property for x
                y={cabinet.position_y} // Correct property for y
                width={cabinet.width * 10} // Scaling factor
                height={cabinet.height * 10} // Scaling factor
                stroke="red"
                strokeWidth={3}
              />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default CabinetKey;