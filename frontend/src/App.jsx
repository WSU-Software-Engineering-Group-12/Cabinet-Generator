import RoomGrid from './components/RoomGrid/RoomGrid.jsx';
import ExportToPDF from './components/ExportToPDF/ExportToPDF.jsx';

function App() {
  return (
    <div>
      <ExportToPDF />
      <RoomGrid
        footPx={30}
        leftWallFeet={10}
        topWallFeet={10}
        rightWallFeet={15}
      />
    </div>
  )
}

export default App
