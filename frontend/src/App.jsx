import CabinetKey from './components/CabinetKey/CabinetKey.jsx';
import RoomManager from './components/RoomManager/RoomManager.jsx';
import './App.css';


function App() {
  return (
    <div className='container'>
      <CabinetKey className='column' />
      <RoomManager className='column' />
    </div>
  )
}

export default App;
