import { Rect, Text } from "react-konva";
import PropTypes from "prop-types";

const Cabinet = ({x, y, width, height, fill, stroke, strokeWidth, isBase, orientation}) => {
    // Offset the text to the right on base cabinets so it shows up
    const xPos = isBase ? x + 25 : x;
    const yPos = isBase ? y + (height / 2) + 25 : y + (height / 2);

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
                x={xPos}
                y={yPos}
                width={width}
                align="center"
                text="BC36"
                fontSize={15}
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
  };
  
  Cabinet.defaultProps = {
    fill: "gray",
    stroke: "black",
    strokeWidth: 2,
  };

export default Cabinet;