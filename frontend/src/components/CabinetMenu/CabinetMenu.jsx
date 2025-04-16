import { useState } from "react";
import PropTypes from "prop-types";
import "./CabinetMenu.css";
import { defaultInchPx } from "../../../utils/globalVars";

const CabinetMenu = ({ setPopupVisible, cabinet  }) => {
    const baseOptions = ["Sink", "Stove", "Fridge"];
    const upperOptions = ["Window"];

    const [selectedOption, setSelectedOption] = useState("");

    const options = cabinet.isBase ? baseOptions : upperOptions;

    const handleClosePopup = () => {
        setPopupVisible(false);
    }

    const handleChange = (e) => {
        setSelectedOption(e)
    }

    return (
        <>
            <div className="overlay" onClick={handleClosePopup}/>
            <div className="popup">
                <div className="popup-content">
                    <h2>{cabinet.name}</h2>
                    <p>Dimensions: {cabinet.width / defaultInchPx}in x {cabinet.height / defaultInchPx}in</p>

                    <div className="popup-flex">
                        <button className="popup-flex" onClick={handleClosePopup}>Close</button>

                        {/* Ensure that the cabinet is not a filler or corner before allowing them to swap */}
                        {(cabinet.name[0] === "F" || cabinet.name[1] === "C") ? <></> : (
                            <div className="select-row">
                                <label htmlFor="exercise-dropdown">Swap For...</label>
                                <select id="exercise-dropdown" onChange={handleChange} >
                                    <option value="">-- Choose an option --</option>
                                    {options.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </select>
                                {selectedOption === "" ? <></> : (
                                    <button>Submit</button>
                                )}
                                
                            </div>
                        )}
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
};

export default CabinetMenu;