import { useState } from "react";
import RoomGrid from '../RoomGrid/RoomGrid.jsx';
import ExportToPDF from '../ExportToPDF/ExportToPDF.jsx';
import Wall from "../Wall/Wall.jsx";
import { Group, Layer, Stage } from "react-konva";
import { defaultGridOffset } from "../../../utils/globalVars.js";

const RoomManager = () => {
    const [roomDetails, setRoomDetails] = useState(null);

    const handleRoomDetails = () => {
        const leftWallFeet = parseFloat(prompt("Enter the length of the left wall (in feet)"), 10);
        const topWallFeet = parseFloat(prompt("Enter the length of the top wall (in feet)"), 10);
        const rightWallFeet = parseFloat(prompt("Enter the length of the right wall (in feet)"), 15);
    
        // Ensure that no invalid characters have been passed
        if (
            isNaN(leftWallFeet) || leftWallFeet <= 0 ||
            isNaN(topWallFeet) || topWallFeet <= 0 ||
            isNaN(rightWallFeet) || rightWallFeet <= 0
        ) {
            alert("Please enter valid positive numbers.");
            return;
        }
    
        setRoomDetails({
          footPx: 10,
          leftWallFeet,
          topWallFeet,
          rightWallFeet
        });
    }
    return (
        <div>
            {!roomDetails ? (
                <>
                    <h1>Welcome to CabineXt</h1>
                    <p>Generate a cabinet layout tailored specifically to your own room!</p>
                    <button onClick={handleRoomDetails}>Enter Your Room&apos;s Details</button>
                </>
                
            ) : (
                <>
                    <h2>Room Layout</h2>
                    <Stage width={5000} height={5000}>
                        <Layer>
                            <Group x={defaultGridOffset} y={defaultGridOffset}>
                                <RoomGrid 
                                    leftWallFeet={roomDetails.leftWallFeet}
                                    topWallFeet={roomDetails.topWallFeet}
                                    rightWallFeet={roomDetails.rightWallFeet}
                                />
                                <Wall 
                                    lengthFeet={roomDetails.leftWallFeet} 
                                    orientation="left" 
                                />
                                <Wall 
                                    lengthFeet={roomDetails.topWallFeet} 
                                    orientation="top" 
                                />
                                <Wall 
                                    lengthFeet={roomDetails.rightWallFeet}
                                    orientation="right" 
                                    offset={roomDetails.topWallFeet} 
                                />
                            </Group>
                        </Layer>
                        
                    </Stage>
                    <ExportToPDF />
                </>
            )}
        </div>
    );
}

export default RoomManager;