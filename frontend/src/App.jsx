import { useState, useEffect } from 'react';
import RoomGrid from './components/RoomGrid/RoomGrid.jsx';
import ExportToPDF from './components/ExportToPDF/ExportToPDF.jsx';

function App() {
  const [roomDetails, setRoomDetails] = useState(null);

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

  useEffect(() => {
    console.log("Updated roomDetails:", roomDetails);
  }, [roomDetails])

  return (
    <div>
      <ExportToPDF />
      {!roomDetails ? (
        <button onClick={handleRoomDetails}>Enter Room Details</button>
      ) : (
        <RoomGrid {...roomDetails}/>
      )}
    </div>
  )
}

export default App
