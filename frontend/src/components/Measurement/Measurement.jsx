import { Rect, Text } from "react-konva";
import PropTypes from "prop-types";
import { defaultInchPx } from "../../../utils/globalVars";

const Measurement = ({ x, y, width, height, orientation, parentType }) => {
    const fontSize = 20;
    const textWidth = 60;

    const { 
        mainLine, 
        dashedLines,
        measurementText
    } = calculateMeasurements({ x, y, width, height, orientation, parentType, fontSize, textWidth });

    return(
        <>
            {/* Dashed lines connecting measurement to its base */}
            <Rect
                x={dashedLines.first.x}
                y={dashedLines.first.y}
                width={dashedLines.first.width}
                height={dashedLines.first.height}
                stroke="grey"
                strokeWidth={2}
                dash={[10, 5]}
            />
            <Rect
                x={dashedLines.last.x}
                y={dashedLines.last.y}
                width={dashedLines.last.width}
                height={dashedLines.last.height}
                stroke="grey"
                strokeWidth={3}
                dash={[10, 5]}
            />

            {/* Main, solid line */}
            <Rect
                x={mainLine.x}
                y={mainLine.y}
                width={mainLine.width}
                height={mainLine.height}
                orientation={orientation}
                stroke="black"
                strokeWidth={3}
            />

            {/* Measurement info text */}
            <Text
                text={measurementText.text}
                x={measurementText.x}
                y={measurementText.y}
                fontSize={fontSize}
                align="center"
                width={textWidth}
            />
        </>
    );
}
Measurement.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    orientation: PropTypes.oneOf(["left", "top", "right"]).isRequired,
    parentType: PropTypes.oneOf(["base", "upper", "wall"]).isRequired
};



const calculateMeasurements = ({ x, y, width, height, orientation, parentType, fontSize, textWidth }) => {
    let mainLine = { x: 0, y: 0, offset: 0, width: 0, height: 0 };

    let dashedLines = {
        first: { width: 0, height: 0, x: 0, y: 0 },
        last: { width: 0, height: 0, x: 0, y: 0 },
    };

    let measurementText = { text: "", x: 0, y: 0}
    
    // Measurements should be placed base -> upper -> wall. Change the offset accordingly
    switch(parentType) {
        case "base":
            mainLine.offset = 10;
            break;
        case "upper":
            mainLine.offset = 20;
            break;
        case "wall":
            mainLine.offset = 200;
            break;
        default:
            console.warn("Invalid parent for measurement:", parentType);
    };

    // Rendering information will look different for different orientations, set the dimensions accordingly
    switch(orientation) {
        case "left":
            mainLine.x = x - mainLine.offset;
            mainLine.y = y;
            mainLine.height = height;
            mainLine.width = 0;

            dashedLines.first = { height: 0, width: mainLine.offset, x: mainLine.x, y: y }
            dashedLines.last = { height: 0, width: mainLine.offset, x: mainLine.x, y: y + height }
            
            measurementText = {
                text: `${height / defaultInchPx} in`,
                x: x - mainLine.offset - textWidth, 
                y: (height / 2) - (fontSize / 2)
            }
            break;
        case "top":
            mainLine.x = x;
            mainLine.y = y - mainLine.offset;
            mainLine.height = 0;
            mainLine.width = width;

            dashedLines.first = { height: mainLine.offset, width: 0, x: x, y: y - mainLine.offset }
            dashedLines.last = { height: mainLine.offset, width: 0, x: x + width, y: y - mainLine.offset }
            
            measurementText = {
                text: `${width / defaultInchPx} in`,
                x: (width / 2) - (textWidth / 2), 
                y: y - mainLine.offset - fontSize
            }
            break;
        case "right":
            mainLine.x = x + mainLine.offset;
            mainLine.y = y;
            mainLine.height = height;
            mainLine.width = 0;

            dashedLines.first = { height: 0, width: mainLine.offset, x: x, y: y }
            dashedLines.last = { height: 0, width: mainLine.offset, x: x, y: y + height }
            
            measurementText = {
                text: `${height / defaultInchPx} in`,
                x: x + mainLine.offset, 
                y: (height / 2) - (fontSize / 2)
            }
            break;
        default:
            console.warn("Invalid orientation:", orientation);
    };

    return { mainLine, dashedLines, measurementText };
}
export default Measurement;