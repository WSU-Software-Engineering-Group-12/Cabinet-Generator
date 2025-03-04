import { 
    Stage, 
    Layer, 
    Rect,
    Line,
    Text
} from 'react-konva';
import PropTypes from 'prop-types';
import './RoomGrid.css';
import { FOOT_PX } from '../../global_files/global_vars';

/**
 * @summary A component that displays a bare 3-walled room with a grid on the inside displaying the size in feet
 * @param {number} leftWallFeet the length of the left wall (in feet)
 * @param {number} topWallFeet the length of the top wall (in feet)
 * @param {number} rightWallFeet the length of the right wall (in feet)
 */
const RoomGrid = ({ leftWallFeet, topWallFeet, rightWallFeet}) => {
    // Keep track of which side wall is larger (we will draw the grid down to the larger one)
    const maxSideWallFeet = leftWallFeet >= rightWallFeet ? leftWallFeet : rightWallFeet;
    
    // Size the canvas relative to the walls (leaving space for text on either side)
    const textOffsetPx = 50; // Pixel buffer between the grid and canvas (leaves space for text)
    const width = (topWallFeet * FOOT_PX) + (textOffsetPx * 2);
    const height = (maxSideWallFeet * FOOT_PX) + textOffsetPx;

    const fontSize = 24;

    const gridRects = [];

    // Generate the grid 
    for(let row = 0; row < maxSideWallFeet; row++) {
        for(let col = 0; col < topWallFeet; col++) {
            gridRects.push(
                <Rect 
                    key={`${row}, ${col}`}
                    x={(col*FOOT_PX) + textOffsetPx}
                    y={(row*FOOT_PX) + textOffsetPx}
                    width={FOOT_PX}
                    height={FOOT_PX}
                    stroke='black'
                    strokeWidth={.2}
                />
            )
        }
    }

    return (
        <Stage className='canvas' width={width} height={height}>
            <Layer>
                {/* Left Text */}
                <Text
                    text={`${leftWallFeet} ft`}
                    fontSize={fontSize}
                    align='left'
                    verticalAlign='center'
                    height={height}
                    x={0}
                    y={((leftWallFeet * FOOT_PX) / 2) + (fontSize / 2)}
                />

                {/* Top Text */}
                <Text
                    text={`${topWallFeet} ft`}
                    fontSize={fontSize}
                    align='center'
                    width={width}
                    x={0}
                />

                {/* Right Text */}
                <Text
                    text={`${rightWallFeet} ft`}
                    fontSize={fontSize}
                    align='right'
                    width={width}
                    x={0}
                    y={((rightWallFeet * FOOT_PX) / 2) + (fontSize / 2)}
                />
            </Layer>
            <Layer>
                {/* Left Border */}
                <Line
                    x={textOffsetPx}
                    y={textOffsetPx}
                    points={[0, 0, 0, leftWallFeet * FOOT_PX]}
                    stroke='black'
                    strokeWidth={3}
                />

                {/* Top Border */}
                <Line
                    x={textOffsetPx}
                    y={textOffsetPx}
                    points={[0, 0, topWallFeet * FOOT_PX, 0]}
                    stroke='black'
                    strokeWidth={3}
                />
                
                {/* Right Border */}
                <Line
                    x={(topWallFeet * FOOT_PX) + textOffsetPx}
                    y={textOffsetPx}
                    points={[
                        0, 0,
                        0, rightWallFeet * FOOT_PX]}
                    stroke='black'
                    strokeWidth={3}
                />

                {/* Grid */}
                {gridRects}
            </Layer>
        </Stage>
        
    );
}

RoomGrid.propTypes = {
    leftWallFeet: PropTypes.number.isRequired,
    topWallFeet: PropTypes.number.isRequired,
    rightWallFeet: PropTypes.number.isRequired
}

export default RoomGrid;