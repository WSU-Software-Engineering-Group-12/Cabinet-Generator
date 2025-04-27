import { useEffect, useRef, useState } from "react";
import { Rect, Text } from "react-konva";
import PropTypes from "prop-types";
import Measurement from "../Measurement/Measurement";
import { cabinetFill } from "../../../utils/globalVars";

/**
 * WallItem represents a cabinet placed on a wall in the design.
 * It displays the cabinet as a rectangle with a label and triggers a callback on click.
 * It also provides a measurement annotation for the cabinet's position and dimensions.
 *
 * @param {number} x - The x-coordinate of the cabinet's top-left corner.
 * @param {number} y - The y-coordinate of the cabinet's top-left corner.
 * @param {number} width - The width of the cabinet.
 * @param {number} height - The height of the cabinet.
 * @param {string} fill - The fill color of the cabinet. Defaults to "gray".
 * @param {string} stroke - The stroke color of the cabinet. Defaults to "black".
 * @param {number} strokeWidth - The stroke width of the cabinet. Defaults to 2.
 * @param {boolean} isBase - A boolean indicating whether the cabinet is a base cabinet.
 * @param {("left" | "top" | "right")} orientation - The orientation of the cabinet (left, top, or right).
 * @param {string} name - The name of the cabinet.
 * @param {function} onClick - The function to call when the cabinet is clicked, passing the cabinet's details.
 */
const WallItem = ({ x, y, width, height, fill, stroke, strokeWidth, isBase, orientation, name, onClick }) => {
    const cabinetRef = useRef();
    const [renderInfo, setRenderInfo] = useState({ textX: 0, textY: 0, isFiller: false });

    useEffect(() => {
        // Get the reference to the cabinet rectangle
        const cabinet = cabinetRef.current;

        // Set up event listeners for mouse hover and click
        cabinet.on('mouseenter', () => {
            cabinet.fill('grey');
            cabinet.getLayer().batchDraw();
        });

        cabinet.on('mouseleave', () => {
            cabinet.fill(cabinetFill);
            cabinet.getLayer().batchDraw();
        });

        // Handle click event on the cabinet
        const handleCabinetClick = () => {
            onClick({ x, y, width, height, fill, stroke, strokeWidth, isBase, orientation, name });
        };

        // Attach the click event handler
        cabinet.on('click', handleCabinetClick);

        // Calculate rendering information when component mounts or props change
        setRenderInfo(calculateRenderInfo());

        // Clean up event listeners when component unmounts or props change
        return () => {
            cabinet.off('click', handleCabinetClick);
        };
    }, [x, y, width, height, fill, stroke, strokeWidth, isBase, orientation, name, onClick]);

    /**
     * Calculate the position of the cabinet label and whether it's a filler.
     * @returns {Object} Render info including label position (textX, textY) and filler status.
     */
    const calculateRenderInfo = () => {
        const textSize = 15;
        const isFiller = name[0] === "F"; // If name starts with 'F', it's a filler.

        let textX = 0;
        let textY = 0;

        if (!isBase) {
            // If it's not a base cabinet, position the text differently
            textX = x;
            textY = y + (height / 2);
        } else if (name === "BC36") {
            // Special case for a corner cabinet (BC36)
            if (orientation === "left") {
                textX = x + (width / 3);
                textY = y + (height / 1.5) + textSize;
            } else if (orientation === "right") {
                textX = x - (width / 3);
                textY = y + (height / 1.5) + textSize;
            } else {
                console.warn("Corners should not appear in orientation", orientation);
            }
        } else {
            // Position text based on orientation
            switch (orientation) {
                case "left":
                    textX = x + (width / 4);
                    textY = y + (height / 2);
                    break;
                case "top":
                    textX = x;
                    textY = y + (height / 1.75) + textSize;
                    break;
                case "right":
                    textX = x - (width / 4);
                    textY = y + (height / 2);
                    break;
                default:
                    console.warn("Unknown orientation:", orientation);
            }
        }

        return { textX, textY, isFiller };
    };

    return (
        <>
            {/* Cabinet rectangle */}
            <Rect
                ref={cabinetRef}
                x={x}
                y={y}
                width={width}
                height={height}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
            {/* Cabinet name label */}
            <Text
                x={renderInfo.textX}
                y={renderInfo.textY}
                width={width}
                align="center"
                text={renderInfo.isFiller ? "" : name} // If it's a filler, don't display the name
                fontSize={15}
            />
            {/* Measurement display for the cabinet */}
            <Measurement
                x={orientation === "right" ? x + width : x} // Adjust for right-oriented cabinets
                y={y}
                width={width}
                height={height}
                orientation={orientation}
                parentType={isBase ? "base" : "upper"} // Indicate if it's a base or upper cabinet
            />
        </>
    );
};

// Define prop types for validation
WallItem.propTypes = {
    x: PropTypes.number.isRequired, // X position of the cabinet
    y: PropTypes.number.isRequired, // Y position of the cabinet
    width: PropTypes.number.isRequired, // Width of the cabinet
    height: PropTypes.number.isRequired, // Height of the cabinet
    fill: PropTypes.string, // Fill color of the cabinet
    stroke: PropTypes.string, // Stroke color of the cabinet
    strokeWidth: PropTypes.number, // Stroke width of the cabinet
    isBase: PropTypes.bool.isRequired, // Flag indicating if the cabinet is a base cabinet
    orientation: PropTypes.oneOf(["left", "top", "right"]).isRequired, // Orientation of the cabinet
    name: PropTypes.string.isRequired, // Name of the cabinet
    onClick: PropTypes.func.isRequired, // Click handler for the cabinet
};

// Default props for the component
WallItem.defaultProps = {
    fill: "gray", // Default fill color if not provided
    stroke: "black", // Default stroke color if not provided
    strokeWidth: 2, // Default stroke width if not provided
    name: "UNDEF" // Default name if not provided
};

export default WallItem;
