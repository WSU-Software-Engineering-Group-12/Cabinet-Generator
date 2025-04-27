import PropTypes from "prop-types";
import "./CabinetMenu.css";
import { defaultInchPx } from "../../../utils/globalVars";

const CabinetMenu = ({ setPopupVisible, cabinet }) => {
    const handleClosePopup = () => {
        setPopupVisible(false);
    }

    return (
        <>
            <div className="overlay" onClick={handleClosePopup}/>
            <div className="popup">
                <div className="popup-content">
                    <h2>Type: {cabinet.name}</h2>
                    <p>Dimensions: {cabinet.width / defaultInchPx}in x {cabinet.height / defaultInchPx}in</p>

                    <div className="popup-flex">
                        <button className="popup-flex" onClick={handleClosePopup}>Close</button>
                    </div>
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
        depth: PropTypes.number.isRequired,
        isBase: PropTypes.bool.isRequired,
    }).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default CabinetMenu;