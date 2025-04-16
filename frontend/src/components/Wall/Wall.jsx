import { useEffect, useState } from "react";
import { Group, Rect } from "react-konva";
import { generateWall } from "../../../utils/api";
import PropTypes from "prop-types";
import { defaultInchPx, baseColor, upperColor, cabinetFill } from "../../../utils/globalVars";
import Cabinet from "../Cabinet/Cabinet";
import Measurement from "../Measurement/Measurement";

// -----------------------------------------------------------------------------
// Helper function that generates Cabinet components given wall parameters.
const generateCabinets = (orientation, x, y, cabArray, inchPx, color, isBase, onCabinetClick) => {
    let cabinetRects = [];
    // Create a unique key prefix for this set of cabinets.
    const keyPrefix = isBase ? "base-" : "upper-";

    // If the wall is vertical (for left or right orientations)
    if (orientation === "left" || orientation === "right") {
        let cumulativeY = y;
        cabinetRects = cabArray.slice().reverse().map((cabinet, index) => {
            const rectWidth = cabinet.width * inchPx;
            const rectHeight = cabinet.depth * inchPx;
            const rect = (
                <Cabinet
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
                    onClick={onCabinetClick}
                />
            );
            cumulativeY += rectWidth;
            return rect;
        });
    }
    // If the wall is horizontal (orientation "top")
    if (orientation === "top") {
        let cumulativeX = x;
        cabinetRects = cabArray.map((cabinet, index) => {
            const rectWidth = cabinet.width * inchPx;
            const rectHeight = cabinet.depth * inchPx;
            const rect = (
                <Cabinet
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
                    onClick={onCabinetClick}
                />
            );
            cumulativeX += rectWidth;
            return rect;
        });
    }

    return cabinetRects;
};

// -----------------------------------------------------------------------------
// Helper that creates the wall rectangle and combines cabinet components.
export const getWallAndCabinets = (orientation, lengthFeet, inchPx, offset, bases, uppers, onCabinetClick) => {
    const wallLengthPx = lengthFeet * inchPx;
    let wallRect = null;
    let upperRects = [];
    let baseRects = [];
    let wallProps = {};
    let wallKey = "";

    if (orientation === "top") {
        let startingX = 36 * inchPx; // Start after a corner cabinet.
        baseRects = generateCabinets(orientation, startingX, 0, bases, inchPx, baseColor, true, onCabinetClick);

        startingX = 24 * inchPx; // Adjust for upper cabinets.
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

// -----------------------------------------------------------------------------
// Wall component that fetches wall data, builds the wall and its cabinets, and renders them.
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

    // Merge and sort all elements for proper rendering order.
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
