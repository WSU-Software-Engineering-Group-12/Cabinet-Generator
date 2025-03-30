import {  
    Rect,
    Text
} from 'react-konva';
import PropTypes from 'prop-types';
import './RoomGrid.css';
import { defaultInchPx, defaultGridOffset } from '../../../utils/globalVars';

/**
 * @summary A component that displays a bare 3-walled room with a grid on the inside displaying the size in feet
 * @param {number} inchPx the amount of pixels corresponding to 1 foot
 * @param {number} leftWallFeet the length of the left wall (in feet)
 * @param {number} topWallFeet the length of the top wall (in feet)
 * @param {number} rightWallFeet the length of the right wall (in feet)
 */
const RoomGrid = ({ inchPx = defaultInchPx, leftWallFeet, topWallFeet, rightWallFeet}) => {
    // Keep track of which side wall is larger (we will draw the grid down to the larger one)
    const maxSideWallFeet = leftWallFeet >= rightWallFeet ? leftWallFeet : rightWallFeet;
    
    // Size the canvas relative to the walls (leaving space for text on either side)
    const width = (topWallFeet * inchPx);
    const height = (maxSideWallFeet * inchPx);

    const fontSize = 24;

    const gridRects = [];

    // Generate the grid 
    for(let row = 0; row < maxSideWallFeet; row++) {
        for(let col = 0; col < topWallFeet; col++) {
            gridRects.push(
                <Rect 
                    key={`${row}, ${col}`}
                    x={col*inchPx}
                    y={row*inchPx}
                    width={inchPx}
                    height={inchPx}
                    stroke='black'
                    strokeWidth={.2}
                />
            )
        }
    }

    return (
        <>
            {/* Left Text */}
            <Text
                text={`${leftWallFeet} in`}
                fontSize={fontSize}
                align='left'
                verticalAlign='center'
                height={height}
                x={-defaultGridOffset}
                y={((leftWallFeet * inchPx) / 2) + (fontSize / 2)}
            />

            {/* Top Text */}
            <Text
                text={`${topWallFeet} in`}
                fontSize={fontSize}
                align='center'
                width={width}
                x={0}
                y={-fontSize}
            />

            {/* Right Text */}
            <Text
                text={`${rightWallFeet} in`}
                fontSize={fontSize}
                align='right'
                width={width}
                x={defaultGridOffset + 3}
                y={((rightWallFeet * inchPx) / 2) + (fontSize / 2)}
            />
            {/* Grid */}
            {gridRects}
        </>
    );
}

RoomGrid.propTypes = {
    inchPx: PropTypes.number,
    leftWallFeet: PropTypes.number.isRequired,
    topWallFeet: PropTypes.number.isRequired,
    rightWallFeet: PropTypes.number.isRequired
}

export default RoomGrid;