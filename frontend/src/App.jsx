import { useState, useEffect } from 'react';
import RoomGrid from './components/RoomGrid/RoomGrid.jsx';
import ExportToPDF from './components/ExportToPDF/ExportToPDF.jsx';
import './App.css'
import axios from 'axios'
import { Stage, Layer, Rect } from 'react-konva'

function App() {
  const [cabinets, setCabinets] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleRoomDetails = () => {
    const leftWallFeet = parseFloat(prompt("Enter the length of the left wall (in feet)"), 10);
    const topWallFeet = parseFloat(prompt("Enter the length of the top wall (in feet)"), 10);
    const rightWallFeet = parseFloat(prompt("Enter the length of the right wall (in feet)"), 15);

    // Ensure that no invalid characters have been passed
    if (
      isNaN(leftWallFeet) || leftWallFeet <= 0 ||
      isNaN(topWallFeet) || topWallFeet <= 0 ||
      isNaN(rightWallFeet) || rightWallFeet <= 0
    ) {
      alert("Please enter valid positive numbers.");
      return;
    }

    setRoomDetails({
      footPx: 10,
      leftWallFeet,
      topWallFeet,
      rightWallFeet
    });
  }

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

      // Log the response data from the backend
      console.log('full backend Response:', response);
      console.log('Placed Cabinet:', placedCabinet);

      // Use the functional form of setCabinets to get the latest state and append the new cabinet
      setCabinets((prevCabinets) => {
        const updatedCabinets = [...prevCabinets, placedCabinet];

        // Log the updated state (new array after update)
        console.log('Updated cabinets array after setState:', updatedCabinets);

        return updatedCabinets; // Return the new updated state
      });

      setIsLoading(false);
    } catch (error) {
      console.error("Error placing cabinet:", error);
      setIsLoading(false);
    }
  };

  // useEffect to call the API when the component loads
  useEffect(() => {
    placeCabinet();
  }, [])

  // useEffect to log the cabinets state after it updates
  useEffect(() => {
    console.log("Updated cabinets state in useEffect:", cabinets); // This will show the updated cabinets state after it's changed
  }, [cabinets]);  // This useEffect depends on cabinets state

  return (
    <div className='container'>
      <div className='column'>
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
      <div className='column'>
        {!roomDetails ? (
          <button onClick={handleRoomDetails}>Enter Room Details</button>
        ) : (
          <>
            <h2>Room Layout</h2>
            <RoomGrid {...roomDetails}/>
          </>
        )}
        <ExportToPDF />
      </div>
    </div>
  )
}

export default App;
