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
    if(
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

  // TODO: extract logic to CabinetKey component (to keep with SOLID)
  const placeCabinet = async () => {
    const cabinetData = {
      cabinet: {
        name: 'Base Cabinet',
        width: 36,
        height: 20
      },
      x: 100,
      y: 150
    };

    try {
      setIsLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/api/place_cabinet/', cabinetData);
      console.log('Backend Response:', response.data);
      const placedCabinet = response.data.placed_cabinet;
      setCabinets(prevCabinets => {// Add placed cabinet to the canvas
        const updatedCabinets = [...prevCabinets, placeCabinet];
        console.log('Updated cabinets array after setState:', updatedCabinets);
        return updatedCabinets;
      });
      setIsLoading(false);
      console.log(`Placed cabinet ${placeCabinet}`);
      console.log(`cabinet array: ${cabinets}`)
    } catch (error) {
      console.error("Error placing cabinet:", error);
    }
  };

  // useEffect to call the API when the component loads
  useEffect(() => {
    placeCabinet();
  }, [])

  useEffect(() => {
    console.log('updated cabinets in useEffect:', cabinets)
  }, [cabinets])

  useEffect(() => {
    console.log("Updated roomDetails:", roomDetails);
  }, [roomDetails])

  return (
    <div className='container'>
      <div className='column'>
        <h2>Legend</h2>
        <Stage className='canvas' width={300} height={400}>
          <Layer>
            {cabinets.length > 0 && <Rect
              x={cabinets[0].position_x}
              y={cabinets[0].position_y}
              width={cabinets[0].width}
              height={cabinets[0].height}
              stroke='black'
              strokeWidth={3}
            />}
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

export default App
