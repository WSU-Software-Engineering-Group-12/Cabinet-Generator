import './CabinetKey.css';
import ExportToPDF from '../ExportToPDF/ExportToPDF';

/**
 * @summary A component that displays a key for the room design
 */
const CabinetKey = () => {
  return (
    <div className="cabinet-key">
      <h2 style={{fontSize: '2em', textAlign: 'center'}}>Design Overview</h2>
      <p><strong><span style={{color: 'red'}}>Red</span></strong> boxes represent base cabinets</p>
      <p><strong>Black</strong> boxes represent upper cabinets</p>
      <ExportToPDF />
    </div>
  );
};

export default CabinetKey;
