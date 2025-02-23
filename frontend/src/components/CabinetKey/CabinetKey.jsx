import { Stage, Layer, Rect } from 'react-konva';
import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * @summary A component that displays a key for the room design
 */
const CabinetKey = () => {
    const [cabinets, setCabinets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const placeCabinet = async () => {
        const cabinetData = {
          cabinet: {
            name: 'Base Cabinet',
            width: 5,
            height: 5
          },
          x: 10,
          y: 1
        };
    
        try {
          setIsLoading(true);
          const response = await axios.post('http://127.0.0.1:8000/api/place_cabinet/', cabinetData);
          const placedCabinet = response.data.placed_cabinet;
    
          // Use the functional form of setCabinets to get the latest state and append the new cabinet
          setCabinets((prevCabinets) => {
            const updatedCabinets = [...prevCabinets, placedCabinet];
    
            return updatedCabinets; // Return the new updated state
          });
    
          setIsLoading(false);
        } catch (error) {
          console.error("Error placing cabinet:", error);
          setIsLoading(false);
        }
      };

      // useEffect to call the API when the component loads
      /*useEffect(() => {
        placeCabinet();
      }, []);*/

      return (
        <div className='cabinet-key'>
            <h2>Legend</h2>
            <p>Base Cabinet</p>
            <Stage className='canvas' width={300} height={400}>
                <Layer>
                    {/* Ensure cabinets array has data before trying to render */}
                    {cabinets.length > 0 && (
                    <Rect
                        x={cabinets[0].position_x}  // Correct property for x
                        y={cabinets[0].position_y}  // Correct property for y
                        width={cabinets[0].width * 10}  // Scaling factor
                        height={cabinets[0].height * 10}  // Scaling factor
                        stroke='red'
                        strokeWidth={3}
                    />
                    )}
                </Layer>
            </Stage>
        </div>
      )
}

export default CabinetKey;