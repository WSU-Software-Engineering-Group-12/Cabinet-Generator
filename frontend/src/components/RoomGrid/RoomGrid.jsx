import { 
    Stage, 
    Layer, 
    Rect,
    Line,
    Text
} from 'react-konva';
import PropTypes from 'prop-types'
import './RoomGrid.css';

/**
 * @summary A component that displays a bare 3-walled room with a grid on the inside displaying the size in feet
 * @param {number} footPx the amount of pixels corresponding to 1 foot
 * @param {number} leftWallFeet the length of the left wall (in feet)
 * @param {number} topWallFeet the length of the top wall (in feet)
 * @param {number} rightWallFeet the length of the right wall (in feet)
 */
const RoomGrid = ({footPx, leftWallFeet, topWallFeet, rightWallFeet}) => {
    // Keep track of which side wall is larger (we will draw the grid down to the larger one)
    const maxSideWallFeet = leftWallFeet >= rightWallFeet ? leftWallFeet : rightWallFeet;
    
    // Size the canvas relative to the walls (leaving space for text on either side)
    const textOffsetPx = 50; // Pixel buffer between the grid and canvas (leaves space for text)
    const width = (topWallFeet * footPx) + (textOffsetPx * 2);
    const height = (maxSideWallFeet * footPx) + textOffsetPx;

    const fontSize = 24;

    const gridRects = [];

    // Generate the grid 
    for(let row = 0; row < maxSideWallFeet; row++) {
        for(let col = 0; col < topWallFeet; col++) {
            gridRects.push(
                <Rect 
                    key={`${row}, ${col}`}
                    x={(col*footPx) + textOffsetPx}
                    y={(row*footPx) + textOffsetPx}
                    width={footPx}
                    height={footPx}
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
                    y={((leftWallFeet * footPx) / 2) + (fontSize / 2)}
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
                    y={((rightWallFeet * footPx) / 2) + (fontSize / 2)}
                />
            </Layer>
            <Layer>
                {/* Left Border */}
                <Line
                    x={textOffsetPx}
                    y={textOffsetPx}
                    points={[0, 0, 0, leftWallFeet * footPx]}
                    stroke='black'
                    strokeWidth={3}
                />

                {/* Top Border */}
                <Line
                    x={textOffsetPx}
                    y={textOffsetPx}
                    points={[0, 0, topWallFeet * footPx, 0]}
                    stroke='black'
                    strokeWidth={3}
                />
                
                {/* Right Border */}
                <Line
                    x={(topWallFeet * footPx) + textOffsetPx}
                    y={textOffsetPx}
                    points={[
                        0, 0,
                        0, rightWallFeet * footPx]}
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
    footPx: PropTypes.number.isRequired,
    leftWallFeet: PropTypes.number.isRequired,
    topWallFeet: PropTypes.number.isRequired,
    rightWallFeet: PropTypes.number.isRequired
}

export default RoomGrid;