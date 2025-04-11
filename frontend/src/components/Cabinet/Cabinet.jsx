import { Rect, Text } from "react-konva";
import PropTypes from "prop-types";

const Cabinet = ({x, y, width, height, fill, stroke, strokeWidth, isBase, orientation, name}) => {
    const textSize = 15;
    const isFiller = name[0] === "F" ? true : false;
    
    // Determine the text offset based off of orientation and base/upper status
    let textX = null, textY = null; // Initialize positions to 0

    if(!isBase) {
        // ALL UPPERS: x, y positions are centered
        textX = x; 
        textY = y + (height / 2);
    } else if (name === "BC36") {
        // BC36 signifies a base corner, handle that special logic
        if(orientation === "left") {
            textX = x + (width / 3);
            textY = y + (height / 1.5) + textSize;
        } else if(orientation === "right") {
            textX = x - (width / 3);
            textY = y + (height / 1.5) + textSize;
        } else {
            console.warn("Corners should not appear in orientation", orientation)
        }

    } else {
        

        // Different conditions for base cabinets depending on orientation
        switch(orientation) {
            case "left":
                // Center vertically, towards right edge
                textX = x + (width / 4);
                textY = y + (height / 2);
                break;
            case "top":
                // Center horizontally, towards bottom edge
                textX = x;
                textY = y + (height / 1.75) + textSize;
                break;
            case "right":
                // Center vertically, towards left edge
                textX = x - (width / 4);
                textY = y + (height / 2);
                break;
            default:
                console.warn("Unknown orientation:", orientation);
        }
    }

    return (
        <>
            <Rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
            <Text
                x={textX}
                y={textY}
                width={width}
                align="center"
                text={isFiller ? "" : name} // If a cabinet is a filler, do not draw its name
                fontSize={textSize}
            />
        </>
    )
}
Cabinet.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    isBase: PropTypes.bool.isRequired,
    orientation: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  };
  
  Cabinet.defaultProps = {
    fill: "gray",
    stroke: "black",
    strokeWidth: 2,
  };

export default Cabinet;