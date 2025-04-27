import { useState } from "react";  // Importing useState hook for managing component state
import Wall from "../Wall/Wall.jsx";  // Import the Wall component to render walls in the room
import { Group, Layer, Stage } from "react-konva";  // Importing Konva components for canvas drawing
import { defaultGridOffset, defaultInchPx } from "../../../utils/globalVars.js";  // Import global constants for grid offset and inch-to-pixel conversion
import './RoomManager.css';  // Importing CSS for styling the RoomManager component
import CabinetKey from '../CabinetKey/CabinetKey.jsx';  // Import CabinetKey component for displaying key information
import CabinetMenu from "../CabinetMenu/CabinetMenu.jsx";  // Import CabinetMenu component for handling cabinet interactions

/**
 * @summary RoomManager component that manages the room layout and cabinet placements.
 * 
 * The component allows users to input room dimensions and generates a visual layout of walls
 * on a Konva canvas. Users can click on walls to interact with cabinets, triggering the 
 * display of a menu with cabinet options.
 * 
 * @returns {JSX.Element} The RoomManager component.
 */
const RoomManager = () => {
    // State hooks for room details, menu visibility, and selected cabinet
    const [roomDetails, setRoomDetails] = useState(null);  // Stores the dimensions of the room
    const [isMenuVisible, setMenuVisible] = useState(false);  // Controls visibility of the cabinet menu
    const [selectedCabinet, setSelectedCabinet] = useState(null);  // Stores the selected cabinet for interaction

    /**
     * @summary Handles the room details input from the user.
     * 
     * Prompts the user to enter the length of the walls and validates the inputs.
     * If valid, it updates the state with the room dimensions and adjusts the page styles.
     */
    const handleRoomDetails = () => {
        const leftWallFeet = parseFloat(prompt("Enter the length of the left wall (in inches)"), 10);
        const topWallFeet = parseFloat(prompt("Enter the length of the top wall (in inches)"), 10);
        const rightWallFeet = parseFloat(prompt("Enter the length of the right wall (in inches)"), 15);
    
        // Ensure that no invalid characters have been passed
        if (
            isNaN(leftWallFeet) || leftWallFeet <= 0 ||
            isNaN(topWallFeet) || topWallFeet <= 0 ||
            isNaN(rightWallFeet) || rightWallFeet <= 0
        ) {
            alert("Please enter valid positive numbers.");
            return;
        }
    
        // Set the room details in the state
        setRoomDetails({
          inchPx: defaultInchPx,  // Set the pixel-to-inch conversion factor
          leftWallFeet,
          topWallFeet,
          rightWallFeet
        });
        
        // Adjust background colors to match the paper sheet style
        document.documentElement.style.backgroundColor = 'white';
        document.documentElement.style.color = 'black';
    }

    /**
     * @summary Calculates the height of the Konva Stage based on room dimensions.
     * 
     * @returns {number} The calculated height for the Stage element.
     */
    const getStageHeight = () => {
        if(!roomDetails) return window.innerHeight;  // Return full window height if room details are not set

        // Return the maximum wall length to determine the height of the canvas
        return (Math.max(roomDetails.leftWallFeet, roomDetails.rightWallFeet) * roomDetails.inchPx) + defaultGridOffset + 15;
    }

    /**
     * @summary Handles the cabinet click event.
     * 
     * Sets the selected cabinet and toggles the visibility of the cabinet menu.
     * 
     * @param {Object} cabinetInfo - Information about the clicked cabinet.
     */
    const handleCabinetClick = (cabinetInfo) => {
        setSelectedCabinet(cabinetInfo);  // Set selected cabinet data when clicked
        setMenuVisible(true);  // Show the menu to interact with the selected cabinet
    }

    return (
        <div className="room-manager">
            {/* Display introductory text if room details have not been entered */}
            {!roomDetails ? (
                <div className="intro-text">
                    <h1>Welcome to CabineXt</h1>
                    <p>Generate a cabinet layout tailored specifically to your own room!</p>
                    <button onClick={handleRoomDetails}>Enter Your Room&apos;s Details</button>
                </div>
                
            ) : (
                <div className="flex-box">
                    {/* Display the CabinetKey on the left side */}
                    <div className='flex-item'>
                        <CabinetKey />
                    </div>

                    {/* Display the room layout (walls and cabinets) in the center */}
                    <div className='flex-item'>
                        <h2>Room Layout</h2>
                        <Stage width={(roomDetails.topWallFeet * roomDetails.inchPx) + (defaultGridOffset * 2) + 15} height={getStageHeight()}>
                            <Layer>
                                <Group x={defaultGridOffset} y={defaultGridOffset}>
                                    {/* Render the walls with respective dimensions and click handlers */}
                                    <Wall 
                                        lengthFeet={roomDetails.leftWallFeet} 
                                        orientation="left" 
                                        onCabinetClick={handleCabinetClick} // Pass click info down to Wall
                                    />
                                    <Wall 
                                        lengthFeet={roomDetails.rightWallFeet}
                                        orientation="right" 
                                        offset={roomDetails.topWallFeet} 
                                        onCabinetClick={handleCabinetClick} // Pass click info down to Wall
                                    />
                                    <Wall 
                                        lengthFeet={roomDetails.topWallFeet} 
                                        orientation="top" 
                                        onCabinetClick={handleCabinetClick} // Pass click info down to Wall
                                    />
                                </Group>
                            </Layer>
                        </Stage>
                    </div>

                    {/* Display the Cabinet Menu if visible and a cabinet is selected */}
                    {isMenuVisible && selectedCabinet && (
                        <CabinetMenu
                            setPopupVisible={setMenuVisible}
                            cabinet={selectedCabinet}  // Pass selected cabinet to the menu
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default RoomManager;  // Export the RoomManager component for use elsewhere in the app