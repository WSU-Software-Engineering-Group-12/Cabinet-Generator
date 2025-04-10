import { Rect } from "react-konva";
import { baseColor, upperColor, cabinetFill } from "../../../utils/globalVars";
import Cabinet from "../Cabinet/Cabinet";

const generateCabinets = (orientation, x, y, cabArray, inchPx, color, isBase) => {
    let cabinetRects = [];

    // Dynamically create a unique key prefix to be added in front of each index
    const keyPrefix = isBase ? "base-" : "upper-";

    // If vertical, draw cabinets with a changing y coordinate
    if(orientation === "left" || orientation === "right") {
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
                />
            );

            cumulativeY += rectWidth;
            return rect;
        });
    }
    // If horizontal, draw cabinets with a changing x coordinate
    if(orientation === "top") {
        // Offset starting position to account for missing corner
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
                />
            );

            cumulativeX += rectWidth;
            return rect;
        });
    }

    return cabinetRects;
}

/**
 * Generates the wall and cabinet Rect elements based on orientation.
 *
 * @param {string} orientation - The orientation of the wall ("top", "left", "right").
 * @param {number} lengthFeet - The length of the wall in feet.
 * @param {number} footPx - The number of pixels per foot for scaling.
 * @param {number} offset - Used only for right walls; represents the length of the top wall.
 * @param {Array} bases - Array of base cabinets (used for top orientation).
 * @param {Array} uppers - Array of upper cabinets (used for left and right orientations).
 * @returns {{ wallRect: JSX.Element, cabinetRects: JSX.Element[] }} 
 */
export const getWallAndCabinets = (orientation, lengthFeet, inchPx, offset, bases, uppers) => {
    const wallLengthPx = lengthFeet * inchPx;
    let wallRect = null;
    let upperRects = [];
    let baseRects = [];

    if (orientation === "top") {
        let startingX = 36 * inchPx; // Start after corner cabinet
        baseRects = generateCabinets(orientation, startingX, 0, bases, inchPx, baseColor, true);

        startingX = 24 * inchPx; // Update to uppers smaller size
        upperRects = generateCabinets(orientation, startingX, 0, uppers, inchPx, upperColor, false);

        wallRect = <Rect x={0} y={0} width={wallLengthPx} height={5} fill="black" key="top-wall" />;
    } else if (orientation === "left") {
        let startingY = 0;
        baseRects = generateCabinets(orientation, 0, startingY, bases, inchPx, baseColor, true);
        upperRects = generateCabinets(orientation, 0, startingY, uppers, inchPx, upperColor, false);

        wallRect = <Rect x={0} y={0} width={5} height={wallLengthPx} fill="black" key="left-wall" />;
    } else if (orientation === "right") {
        let startingY = 0;
        baseRects = generateCabinets(orientation, offset * inchPx, startingY, bases, inchPx, baseColor, true);
        upperRects = generateCabinets(orientation, offset * inchPx, startingY, uppers, inchPx, upperColor, false);

        wallRect = <Rect x={offset * inchPx} y={0} width={5} height={wallLengthPx} fill="black" key="right-wall" />;
    }

    return { wallRect, baseRects, upperRects };
};