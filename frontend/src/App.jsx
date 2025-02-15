import RoomGrid from './components/RoomGrid/RoomGrid.jsx';
import ExportToPDF from './components/ExportToPDF/ExportToPDF.jsx';

function App() {
  let roomDataEntered = false;

  let roomDetails = {
    footPx: 30,
    leftWallFeet: null,
    topWallFeet: null,
    rightWallFeet: null
  }

  const handleRoomDetails = (roomDetails) => {
    const leftWallFeet = prompt("Enter the length of the left wall (in feet)");
    const topWallFeet = prompt("Enter the length of the top wall (in feet)");
    const rightWallFeet = prompt("Enter the length of the right wall (in feet)");
  }

  return (
    <div>
      <ExportToPDF />
      {!roomDataEntered 
      ? <button onClick={handleRoomDetails}>
        Enter Room Details
      </button>
      : <RoomGrid
        footPx={30}
        leftWallFeet={10}
        topWallFeet={10}
        rightWallFeet={15}
      />}
    </div>
  )
}

export default App
