import { useState } from "react";
import RoomGrid from '../RoomGrid/RoomGrid.jsx';
import Wall from "../Wall/Wall.jsx";
import { Group, Layer, Stage } from "react-konva";
import { defaultGridOffset, defaultInchPx } from "../../../utils/globalVars.js";
import './RoomManager.css';
import CabinetKey from '../CabinetKey/CabinetKey.jsx'

const RoomManager = () => {
    const [roomDetails, setRoomDetails] = useState(null);

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
    
        setRoomDetails({
          inchPx: defaultInchPx,
          leftWallFeet,
          topWallFeet,
          rightWallFeet
        });
        // Update the background color to better reflect a sheet of paper
        document.documentElement.style.backgroundColor = 'white';
        document.documentElement.style.color = 'black';
    }

    const getStageHeight = () => {
        if(!roomDetails) return window.innerHeight;

        // Find the biggest side and base the canvas's size off of that
        return (Math.max(roomDetails.leftWallFeet, roomDetails.rightWallFeet) * roomDetails.inchPx) + defaultGridOffset;
    }

    return (
        <div className="room-manager">
            {!roomDetails ? (
                <div className="intro-text">
                    <h1>Welcome to CabineXt</h1>
                    <p>Generate a cabinet layout tailored specifically to your own room!</p>
                    <button onClick={handleRoomDetails}>Enter Your Room&apos;s Details</button>
                </div>
                
            ) : (
                <div className="flex-box">
                    <div className='flex-item'>
                        <CabinetKey />
                    </div>

                    <div className='flex-item'>
                        <h2>Room Layout</h2>
                        <Stage width={window.innerWidth} height={getStageHeight()}>
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
                    </div>
                    
                </div>
            )}
        </div>
    );
}

export default RoomManager;