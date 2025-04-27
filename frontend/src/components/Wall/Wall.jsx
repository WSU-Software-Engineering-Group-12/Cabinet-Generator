import { useEffect, useState } from "react";
import { Group, Rect } from "react-konva";
import { generateWall } from "../../../utils/api";
import PropTypes from "prop-types";
import { defaultInchPx, baseColor, upperColor, cabinetFill } from "../../../utils/globalVars";
import WallItem from "../WallItem/WallItem.jsx";
import Measurement from "../Measurement/Measurement";

/**
 * Generates a set of cabinet components given the wall's orientation and cabinet data.
 * The cabinets are placed on the wall either vertically (for left/right orientations) 
 * or horizontally (for top orientation).
 *
 * @param {string} orientation - The orientation of the wall, either "left", "right", or "top".
 * @param {number} x - The initial x-coordinate for the first cabinet.
 * @param {number} y - The initial y-coordinate for the first cabinet.
 * @param {Array} cabArray - An array of cabinet objects, each containing width and depth.
 * @param {number} inchPx - The conversion factor for inches to pixels.
 * @param {string} color - The color used for the cabinet's stroke.
 * @param {boolean} isBase - Flag to determine if the cabinet is a base or upper cabinet.
 * @param {function} onCabinetClick - Callback function when a cabinet is clicked.
 * @returns {Array} An array of React components representing the cabinets.
 */
const generateCabinets = (orientation, x, y, cabArray, inchPx, color, isBase, onCabinetClick) => {
    let cabinetRects = [];
    const keyPrefix = isBase ? "base-" : "upper-";

    if (orientation === "left" || orientation === "right") {
        let cumulativeY = y;
        cabinetRects = cabArray.slice().reverse().map((cabinet, index) => {
            const rectWidth = cabinet.width * inchPx;
            const rectHeight = cabinet.depth * inchPx;
            const rect = (
                <WallItem
                    key={`${keyPrefix}top-${index}`}
                    x={orientation === "left" ? x : x - rectHeight}
                    y={cumulativeY}
                    width={rectHeight}
                    height={rectWidth}
                    fill={cabinetFill}
                    stroke={color}
                    strokeWidth={3}
                    isBase={isBase}
                    orientation={orientation}
                    name={cabinet.name}
                    onClick={() => onCabinetClick(cabinet)}
                />
            );
            cumulativeY += rectWidth;
            return rect;
        });
    }

    if (orientation === "top") {
        let cumulativeX = x;
        cabinetRects = cabArray.map((cabinet, index) => {
            const rectWidth = cabinet.width * inchPx;
            const rectHeight = cabinet.depth * inchPx;
            const rect = (
                <WallItem
                    key={`${keyPrefix}top-${index}`}
                    x={cumulativeX}
                    y={y}
                    width={rectWidth}
                    height={rectHeight}
                    fill={cabinetFill}
                    stroke={color}
                    strokeWidth={3}
                    isBase={isBase}
                    orientation={orientation}
                    name={cabinet.name}
                    onClick={() => onCabinetClick(cabinet)}
                />
            );
            cumulativeX += rectWidth;
            return rect;
        });
    }

    return cabinetRects;
};

/**
 * Creates the wall and its corresponding cabinets based on the wall orientation, length,
 * and cabinet data (both base and upper cabinets).
 *
 * @param {string} orientation - The orientation of the wall, either "left", "right", or "top".
 * @param {number} lengthFeet - The length of the wall in feet.
 * @param {number} inchPx - The conversion factor for inches to pixels.
 * @param {number} offset - The offset value used for right orientation walls.
 * @param {Array} bases - The array of base cabinets.
 * @param {Array} uppers - The array of upper cabinets.
 * @param {function} onCabinetClick - Callback function when a cabinet is clicked.
 * @returns {Object} An object containing the wall rectangle, wall properties, and the base and upper cabinet components.
 */
const getWallAndCabinets = (orientation, lengthFeet, inchPx, offset, bases, uppers, onCabinetClick) => {
    const wallLengthPx = lengthFeet * inchPx;
    let wallRect = null;
    let upperRects = [];
    let baseRects = [];
    let wallProps = {};
    let wallKey = "";

    if (orientation === "top") {
        let startingX = 36 * inchPx;
        baseRects = generateCabinets(orientation, startingX, 0, bases, inchPx, baseColor, true, onCabinetClick);

        startingX = 24 * inchPx;
        upperRects = generateCabinets(orientation, startingX, 0, uppers, inchPx, upperColor, false, onCabinetClick);

        wallKey = "top-wall";
        wallProps = { x: 0, y: 0, width: wallLengthPx, height: 5, fill: "black", orientation: orientation };
    } else if (orientation === "left") {
        let startingY = 0;
        baseRects = generateCabinets(orientation, 0, startingY, bases, inchPx, baseColor, true, onCabinetClick);
        upperRects = generateCabinets(orientation, 0, startingY, uppers, inchPx, upperColor, false, onCabinetClick);

        wallKey = "left-wall";
        wallProps = { x: 0, y: 0, width: 5, height: wallLengthPx, fill: "black", orientation: orientation };
    } else if (orientation === "right") {
        let startingY = 0;
        baseRects = generateCabinets(orientation, offset * inchPx, startingY, bases, inchPx, baseColor, true, onCabinetClick);
        upperRects = generateCabinets(orientation, offset * inchPx, startingY, uppers, inchPx, upperColor, false, onCabinetClick);

        wallKey = "right-wall";
        wallProps = { x: offset * inchPx, y: 0, width: 5, height: wallLengthPx, fill: "black", orientation: orientation };
    }

    wallRect = <Rect {...wallProps} key={wallKey} />;

    return { wallRect, wallProps, baseRects, upperRects };
};

/**
 * Wall component that fetches wall data, builds the wall, and renders the base and upper cabinets.
 * This component interacts with the API to fetch cabinet data based on the wall's orientation and length.
 * It then generates the wall and cabinet elements and renders them in the appropriate positions.
 *
 * @param {Object} props - The component's props.
 * @param {number} props.lengthFeet - The length of the wall in feet.
 * @param {string} props.orientation - The orientation of the wall, either "left", "right", or "top".
 * @param {number} props.footPx - The conversion factor for feet to pixels. Defaults to `defaultInchPx`.
 * @param {number} props.offset - The offset value for right-facing walls (only required for "right" orientation).
 * @param {function} props.onCabinetClick - Callback function triggered when a cabinet is clicked.
 * @returns {JSX.Element|null} The JSX elements to render the wall and cabinets, or `null` if data is unavailable.
 */
const Wall = ({ lengthFeet, orientation, footPx = defaultInchPx, offset, onCabinetClick }) => {
    const [error, setError] = useState(null);
    const [bases, setBases] = useState([]);
    const [uppers, setUppers] = useState([]);

    useEffect(() => {
        const fetchWall = async () => {
            try {
                const response = await generateWall(lengthFeet, orientation);
                if (response?.cabinets) {
                    setBases(response.cabinets.bases);
                    setUppers(response.cabinets.uppers);
                } else {
                    console.error("Unexpected API response format:", response);
                    setBases([]);
                    setUppers([]);
                }
            } catch (error) {
                setError("Failed to load wall data");
                console.error(error);
            }
        };

        fetchWall();
    }, [lengthFeet, orientation]);

    if (error) return <p>{error}</p>;
    if (bases.length === 0 && uppers.length === 0) return null;

    const { wallRect, wallProps, baseRects, upperRects } = getWallAndCabinets(
        orientation, 
        lengthFeet, 
        footPx, 
        offset, 
        bases, 
        uppers,
        onCabinetClick
    );

    const allRects = [
        ...baseRects.map(cabinet => ({ node: cabinet, zIndex: 1 })),
        ...upperRects.map(cabinet => ({ node: cabinet, zIndex: 2 })),
        { node: wallRect, zIndex: 3 }
    ]
    .sort((a, b) => a.zIndex - b.zIndex)
    .map(obj => obj.node);

    return (
        <>
            <Group>{allRects}</Group>
            <Measurement 
                x={wallProps.x} 
                y={wallProps.y} 
                width={wallProps.width} 
                height={wallProps.height} 
                orientation={wallProps.orientation}
                parentType="wall"
            />
        </>
    );
};

Wall.propTypes = {
    lengthFeet: PropTypes.number.isRequired,
    orientation: PropTypes.oneOf(["left", "right", "top"]).isRequired,
    footPx: PropTypes.number,
    offset: (props, propName, componentName) => {
        if (props.orientation === "right" && (props[propName] === undefined || props[propName] === null)) {
            return new Error(
                `Invalid prop \`${propName}\` supplied to \`${componentName}\`. The \`offset\` prop is required when \`orientation\` is "right".`
            );
        }
        return null;
    },
    onCabinetClick: PropTypes.func.isRequired,
};

export default Wall;
