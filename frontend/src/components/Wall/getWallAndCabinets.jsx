import { Rect } from "react-konva";
import { baseColor, upperColor } from "../../../utils/globalVars";

const generateCabinets = (orientation, x, y, cabArray, inchPx, color) => {
    let cabinetRects = [];

    // If vertical, draw cabinets with a changing y coordinate
    if(orientation === "left" || orientation === "right") {
        let cumulativeY = y;

        cabinetRects = cabArray.slice().reverse().map((cabinet, index) => {
            const rectWidth = cabinet.width * inchPx;
            const rectHeight = cabinet.depth * inchPx;
            const rect = (
                <Rect
                    key={`top-${index}`}
                    x={orientation === "left" ? x : x - rectHeight}
                    y={cumulativeY}
                    width={rectHeight}
                    height={rectWidth}
                    fill={null}
                    stroke={color}
                    strokeWidth={3}
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
                <Rect
                    key={`top-${index}`}
                    x={cumulativeX}
                    y={y}
                    width={rectWidth}
                    height={rectHeight}
                    fill={null}
                    stroke={color}
                    strokeWidth={3}
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
        baseRects = generateCabinets(orientation, startingX, 0, bases, inchPx, baseColor);

        startingX = 24 * inchPx; // Update to uppers smaller size
        upperRects = generateCabinets(orientation, startingX, 0, uppers, inchPx, upperColor);

        wallRect = <Rect x={0} y={0} width={wallLengthPx} height={5} fill="black" />;
    } else if (orientation === "left") {
        let startingY = 0;
        baseRects = generateCabinets(orientation, 0, startingY, bases, inchPx, baseColor);
        upperRects = generateCabinets(orientation, 0, startingY, uppers, inchPx, upperColor);

        wallRect = <Rect x={0} y={0} width={5} height={wallLengthPx} fill="black" />;
    } else if (orientation === "right") {
        let startingY = 0;
        baseRects = generateCabinets(orientation, offset * inchPx, startingY, bases, inchPx, baseColor);
        upperRects = generateCabinets(orientation, offset * inchPx, startingY, uppers, inchPx, upperColor);

        wallRect = <Rect x={offset * inchPx} y={0} width={5} height={wallLengthPx} fill="black" />;
    }

    return { wallRect, baseRects, upperRects };
};

/*export const getWallAndCabinets = (orientation, lengthFeet, footPx, offset, bases, uppers) => {
    const wallLengthPx = lengthFeet * footPx;
    let cabinetRects = [];
    let wallRect = null;

    if (orientation === "top") {
        let cumulativeX = 36 * footPx; // Start after corner cabinet
        cabinetRects = bases.map((cabinet, index) => {
            const rectWidth = cabinet.width * footPx;
            const rectHeight = cabinet.depth * footPx;
            const rect = (
                <Rect
                    key={`top-${index}`}
                    x={cumulativeX}
                    y={0}
                    width={rectWidth}
                    height={rectHeight}
                    fill={null}
                    stroke="gray"
                    strokeWidth={3}
                />
            );
            cumulativeX += rectWidth;
            return rect;
        });

        wallRect = <Rect x={0} y={0} width={wallLengthPx} height={5} fill="black" />;
    } else if (orientation === "left") {
        let cumulativeY = wallLengthPx;
        cabinetRects = uppers.map((cabinet, index) => {
            const rectHeight = cabinet.width * footPx;
            const rectWidth = cabinet.depth * footPx;
            const yPos = cumulativeY - rectHeight;
            cumulativeY -= rectHeight;
            return (
                <Rect
                    key={`left-${index}`}
                    x={0}
                    y={yPos}
                    width={rectWidth}
                    height={rectHeight}
                    fill={null}
                    stroke="gray"
                    strokeWidth={3}
                />
            );
        });

        wallRect = <Rect x={0} y={0} width={5} height={wallLengthPx} fill="black" />;
    } else if (orientation === "right") {
        let cumulativeY = wallLengthPx;
        cabinetRects = uppers.map((cabinet, index) => {
            const rectHeight = cabinet.width * footPx;
            const rectWidth = cabinet.depth * footPx;
            const yPos = cumulativeY - rectHeight;
            cumulativeY -= rectHeight;
            return (
                <Rect
                    key={`right-${index}`}
                    x={(offset * footPx) - rectWidth}
                    y={yPos}
                    width={rectWidth}
                    height={rectHeight}
                    fill={null}
                    stroke="gray"
                    strokeWidth={3}
                />
            );
        });

        wallRect = <Rect x={offset * footPx} y={0} width={5} height={wallLengthPx} fill="black" />;
    }

    return { wallRect, cabinetRects };
};*/