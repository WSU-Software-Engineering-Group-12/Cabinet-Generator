import PropTypes from "prop-types";
import "./CabinetMenu.css";

const CabinetMenu = ({ setPopupVisible, cabinet  }) => {
    const handleClosePopup = () => {
        setPopupVisible(false);
    }
    return (
        <>
            <div className="overlay" onClick={handleClosePopup}/>
            <div className="popup">
                <div className="popup-content">
                    <h2>{cabinet.name}</h2>
                    <p>Dimensions: {cabinet.width} x {cabinet.height}</p>
                    <button onClick={handleClosePopup}>Close</button>

                    {/* TODO Implement */}
                    <button onClick={() => {}}>Swap</button>
                </div>
            </div>
        </>
    )
}

CabinetMenu.propTypes = {
    setPopupVisible: PropTypes.func.isRequired,
    cabinet: PropTypes.shape({
        name: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
};

export default CabinetMenu;