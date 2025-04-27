import PropTypes from "prop-types";  // Import PropTypes for type-checking the component's props
import "./CabinetMenu.css";  // Import CSS styles specific to the CabinetMenu component
import { defaultInchPx } from "../../../utils/globalVars";  // Import the default conversion value from pixels to inches

/**
 * @summary CabinetMenu component that displays a popup with cabinet details.
 * 
 * This component displays a popup when a user selects a cabinet, showing its type and dimensions.
 * It also includes a "Close" button that hides the popup.
 */
const CabinetMenu = ({ setPopupVisible, cabinet }) => {

    // Function to handle closing the popup by setting popup visibility to false
    const handleClosePopup = () => {
        setPopupVisible(false);  // Hide the popup
    }

    return (
        <>
            {/* Overlay that dims the background when the popup is visible */}
            <div className="overlay" onClick={handleClosePopup} />
            
            {/* Popup container with cabinet details */}
            <div className="popup">
                <div className="popup-content">
                    {/* Display the cabinet type (name) */}
                    <h2>Type: {cabinet.name}</h2>
                    
                    {/* Display the dimensions of the cabinet, converted from pixels to inches */}
                    <p>Dimensions: {cabinet.width / defaultInchPx}in x {cabinet.height / defaultInchPx}in</p>

                    {/* Flex container for the "Close" button */}
                    <div className="popup-flex">
                        <button className="popup-flex" onClick={handleClosePopup}>Close</button>
                    </div>
                </div>
            </div>
        </>
    );
}

// Define the expected types for the props using PropTypes
CabinetMenu.propTypes = {
    setPopupVisible: PropTypes.func.isRequired,  // setPopupVisible is a required function
    cabinet: PropTypes.shape({
        name: PropTypes.string.isRequired,  // cabinet name must be a string
        width: PropTypes.number.isRequired,  // cabinet width must be a number
        height: PropTypes.number.isRequired,  // cabinet height must be a number
        depth: PropTypes.number.isRequired,  // cabinet depth must be a number
        isBase: PropTypes.bool.isRequired,  // cabinet type (base or not) must be a boolean
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,  // onSubmit is a required function
};

// Export the CabinetMenu component for use in other parts of the app
export default CabinetMenu;
