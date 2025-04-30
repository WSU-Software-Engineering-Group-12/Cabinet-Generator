import { Rect, Text } from "react-konva";  // Importing Rect and Text from react-konva for drawing shapes and text
import PropTypes from "prop-types";  // PropTypes for prop validation
import { defaultInchPx } from "../../../utils/globalVars";  // Import default conversion for inches to pixels

/**
 * @summary Measurement component that visually displays dimensions on a Konva canvas.
 * 
 * This component renders a series of lines (main and dashed) and a text label to show
 * the measurements (either width or height) of a cabinet, based on the provided 
 * orientation (left, top, or right).
 * 
 * @param {Object} props - The component's props.
 * @param {number} props.x - The x-coordinate for placing the measurement.
 * @param {number} props.y - The y-coordinate for placing the measurement.
 * @param {number} props.width - The width of the object being measured.
 * @param {number} props.height - The height of the object being measured.
 * @param {string} props.orientation - The orientation of the object being measured ("left", "top", "right").
 * @param {string} props.parentType - The type of parent component ("base", "upper", "wall").
 * @returns {JSX.Element} The Measurement component.
 */
const Measurement = ({ x, y, width, height, orientation, parentType }) => {
    const fontSize = 15;  // Font size for the measurement text
    const textWidth = 60;  // Width of the text box for the measurement text

    // Calculate the main line, dashed lines, and measurement text based on the given props
    const { 
        mainLine, 
        dashedLines,
        measurementText
    } = calculateMeasurements({ x, y, width, height, orientation, parentType, fontSize, textWidth });

    return(
        <>
            {/* Dashed lines representing the connection from the main measurement line to its base */}
            <Rect
                x={dashedLines.first.x}
                y={dashedLines.first.y}
                width={dashedLines.first.width}
                height={dashedLines.first.height}
                stroke="grey"
                strokeWidth={2}
                dash={[10, 5]}  // Dashed line style
            />
            <Rect
                x={dashedLines.last.x}
                y={dashedLines.last.y}
                width={dashedLines.last.width}
                height={dashedLines.last.height}
                stroke="grey"
                strokeWidth={2}
                dash={[10, 5]}  // Dashed line style
            />

            {/* Main solid line for the measurement */}
            <Rect
                x={mainLine.x}
                y={mainLine.y}
                width={mainLine.width}
                height={mainLine.height}
                orientation={orientation}  // Orientation to adjust the placement
                stroke="black"
                strokeWidth={3}  // Thickness of the main measurement line
            />

            {/* Text displaying the measurement value */}
            <Text
                text={measurementText.text}  // Measurement value as text
                x={measurementText.x}
                y={measurementText.y}
                fontSize={fontSize}
                align="center"
                width={textWidth}  // Width of the text box to keep the text aligned
            />
        </>
    );
};

// Prop validation for the component props
Measurement.propTypes = {
    x: PropTypes.number.isRequired,  // X coordinate for placement
    y: PropTypes.number.isRequired,  // Y coordinate for placement
    width: PropTypes.number.isRequired,  // Width of the object
    height: PropTypes.number.isRequired,  // Height of the object
    orientation: PropTypes.oneOf(["left", "top", "right"]).isRequired,  // Orientation of the measurement
    parentType: PropTypes.oneOf(["base", "upper", "wall"]).isRequired  // Parent type for measurement reference
};

/**
 * @summary A helper function to calculate the positions and dimensions of the measurement lines and text.
 * 
 * @param {Object} params - Parameters to calculate the measurements.
 * @param {number} params.x - The x-coordinate of the object.
 * @param {number} params.y - The y-coordinate of the object.
 * @param {number} params.width - The width of the object being measured.
 * @param {number} params.height - The height of the object being measured.
 * @param {string} params.orientation - The orientation of the object ("left", "top", "right").
 * @param {string} params.parentType - The type of parent component ("base", "upper", "wall").
 * @param {number} params.fontSize - The font size for the measurement text.
 * @param {number} params.textWidth - The width of the measurement text box.
 * @returns {Object} The calculated lines and measurement text details.
 */
const calculateMeasurements = ({ x, y, width, height, orientation, parentType, fontSize, textWidth }) => {
    let mainLine = { x: 0, y: 0, offset: 0, width: 0, height: 0 };

    let dashedLines = {
        first: { width: 0, height: 0, x: 0, y: 0 },
        last: { width: 0, height: 0, x: 0, y: 0 },
    };

    let measurementText = { text: "", x: 0, y: 0}
    
    // Set the offset based on the parent component type
    switch(parentType) {
        case "base":
            mainLine.offset = 25;
            break;
        case "upper":
            mainLine.offset = 150;
            break;
        case "wall":
            mainLine.offset = 250;
            break;
        default:
            console.warn("Invalid parent for measurement:", parentType);
    };

    // Adjust the measurement lines and text depending on the orientation
    switch(orientation) {
        case "left":
            mainLine.x = x - mainLine.offset;
            mainLine.y = y;
            mainLine.height = height;
            mainLine.width = 1;

            dashedLines.first = { height: 1, width: mainLine.offset, x: mainLine.x, y: y }
            dashedLines.last = { height: 1, width: mainLine.offset, x: mainLine.x, y: y + height }
            
            measurementText = {
                text: `${height / defaultInchPx} in`,  // Height in inches
                x: x - mainLine.offset - textWidth,  // Position text to the left of the line
                y: y + (height / 2) - (fontSize / 2)  // Center the text vertically
            }
            break;
        case "top":
            mainLine.x = x;
            mainLine.y = y - mainLine.offset;
            mainLine.height = 1;
            mainLine.width = width;

            dashedLines.first = { height: mainLine.offset, width: 1, x: x, y: y - mainLine.offset }
            dashedLines.last = { height: mainLine.offset, width: 1, x: x + width, y: y - mainLine.offset }
            
            measurementText = {
                text: `${width / defaultInchPx} in`,  // Width in inches
                x: x + (width / 2) - (textWidth / 2),  // Center the text horizontally
                y: y - mainLine.offset - fontSize  // Position the text above the line
            }
            break;
        case "right":
            mainLine.x = x + mainLine.offset;
            mainLine.y = y;
            mainLine.height = height;
            mainLine.width = 1;

            dashedLines.first = { height: 1, width: mainLine.offset, x: x, y: y }
            dashedLines.last = { height: 1, width: mainLine.offset, x: x, y: y + height }
            
            measurementText = {
                text: `${height / defaultInchPx} in`,  // Height in inches
                x: x + mainLine.offset,  // Position text to the right of the line
                y: y + (height / 2) - (fontSize / 2)  // Center the text vertically
            }
            break;
        default:
            console.warn("Invalid orientation:", orientation);
    };

    return { mainLine, dashedLines, measurementText };  // Return the calculated measurement lines and text
}

export default Measurement;  // Export the Measurement component for use elsewhere in the app