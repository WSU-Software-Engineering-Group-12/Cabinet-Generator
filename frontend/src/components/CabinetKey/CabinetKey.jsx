import './CabinetKey.css';  // Import the CSS styles for the CabinetKey component
import ExportToPDF from '../ExportToPDF/ExportToPDF';  // Import the ExportToPDF component for exporting the design

/**
 * @summary A component that displays a key for the room design.
 * 
 * This component serves as a legend or key for the room layout. It explains the color coding of the 
 * cabinet boxes and provides an option to export the design to a PDF format.
 */
const CabinetKey = () => {
  return (
    <div className="cabinet-key">
      {/* Title of the section with styling */}
      <h2 style={{fontSize: '2em', textAlign: 'center'}}>Design Overview</h2>
      
      {/* Instructions for the color coding of cabinets */}
      <p>
        <strong><span style={{color: 'red'}}>Red</span></strong> boxes represent base cabinets
      </p>
      <p>
        <strong>Black</strong> boxes represent upper cabinets
      </p>

      {/* Export button for exporting the design to a PDF */}
      <div className="pdf-button">
        <ExportToPDF />
      </div>

      <p className='bottom-text'>For any questions, comments, or bug reports, please reach out to <a href='mailto:help@cabinext.com'>help@cabinext.com</a></p>
    </div>
  );
};

// Export the CabinetKey component for use in other parts of the app
export default CabinetKey;
