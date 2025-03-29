import { useEffect, useState } from "react";
import { Rect, Layer } from "react-konva";
import { generateWall } from "../../../utils/api";
import PropTypes from "prop-types";
import { defaultFootPx } from "../../../utils/globalVars";

/**
 * Wall component for rendering a wall with cabinets in a floor plan.
 *
 * This component represents a wall in a cabinet layout. It supports three orientations:
 * "top" (horizontal at the top), "left" (vertical on the left), and "right" (vertical on the right).
 * Cabinets are drawn along the wall based on data fetched from an API.
 *
 * Props:
 * @param {number} lengthFeet - The length of the wall in feet.
 * @param {("left" | "right" | "top")} orientation - The orientation of the wall.
 * @param {number} [footPx=defaultFootPx] - The number of pixels per foot for scaling.
 * @param {number} [offset] - Used only for right walls; represents the length of the top wall
 *                            to properly offset the right wall's position.
 *
 * Behavior:
 * - Fetches wall and cabinet data from an API on mount and when `lengthFeet` or `orientation` changes.
 * - Draws a wall as a black rectangle and places cabinets along it as gray outlined rectangles.
 * - For "top" orientation, bases are placed underneath the wall.
 * - For "left" and "right" orientations, uppers are placed vertically.
 * - The `offset` prop is used for right walls to ensure proper positioning relative to the top wall.
 *
 * Returns:
 * @returns {JSX.Element} A Konva Layer containing the wall and cabinet Rects.
 */
const Wall = ({lengthFeet, orientation, footPx = defaultFootPx, offset}) => {
    const [error, setError] = useState(null);
    const [bases, setBases] = useState([]);
    const [uppers, setUppers] = useState([]);

    useEffect(() => {
        const fetchWall = async () => {
            try {
                const response = await generateWall(lengthFeet, orientation);
                console.log("API Response:", response);
                // Ensure the API response contains an array of cabinets.
                if (response?.cabinets) {
                    setBases(response.cabinets.bases);
                    setUppers(response.cabinets.uppers)
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

    // Base case checking
    if(error) return <p>{error}</p>
    if(uppers.length === 0 && uppers.length === 0) return null;

    let cabinetRects = null;
    let wallRect = null;
    
    // The overall wall dimension in pixels
    const wallLengthPx = lengthFeet * footPx;

    if (orientation === "top") {
        // -- Top Wall: horizontal wall at the top, cabinets drawn underneath --
        // We'll use the bases array here.
        let cumulativeX = 36 * footPx; // Initialize cumulativeX to be beyond the corner cabinet (no corners drawn on top wall)
        cabinetRects = bases.map((cabinet, index) => {
            const rectWidth = cabinet.width * footPx || 0; // horizontal dimension
            const rectHeight = cabinet.depth * footPx || 0; // vertical dimension
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
        // Draw the horizontal wall at the top
        wallRect = (
            <Rect
                x={0}
                y={0}
                width={wallLengthPx}
                height={5}
                fill="black"
            />
        );
    } else if (orientation === "left") {
        // -- Left Wall: vertical wall on the left, cabinets drawn on its right, arranged vertically upward --
        // We'll use the uppers array here.
        let cumulativeY = wallLengthPx; // start from the bottom of the wall
        cabinetRects = uppers.map((cabinet, index) => {
            // When drawn vertically, we assume the cabinet's width becomes its vertical extent.
            const rectHeight = cabinet.width * footPx || 0;
            const rectWidth = cabinet.depth * footPx || 0;
            const yPos = cumulativeY - rectHeight;
            cumulativeY -= rectHeight;
            return (
                <Rect
                    key={`left-${index}`}
                    x={0}  // Drawn to the right of the wall
                    y={yPos}
                    width={rectWidth}
                    height={rectHeight}
                    fill={null}
                    stroke="gray"
                    strokeWidth={3}
                />
            );
        });
        // Draw the vertical wall along the left edge
        wallRect = (
            <Rect
                x={0}
                y={0}
                width={5}
                height={wallLengthPx}
                fill="black"
            />
        );
    } else if (orientation === "right") {
        // -- Right Wall: vertical wall on the right, cabinets drawn on its left, arranged vertically upward --
        // We'll use the uppers array again.
        let cumulativeY = wallLengthPx; // start from the bottom of the wall
        cabinetRects = uppers.map((cabinet, index) => {
            const rectHeight = cabinet.width * footPx;
            const rectWidth = cabinet.depth * footPx;
            const yPos = cumulativeY - rectHeight;
            cumulativeY -= rectHeight;
            return (
                <Rect
                    key={`right-${index}`}
                    x={(offset * footPx) - rectWidth}  // Drawn to the left of the wall (wall is at right edge)
                    y={yPos}
                    width={rectWidth}
                    height={rectHeight}
                    fill={null}
                    stroke="gray"
                    strokeWidth={3}
                />
            );
        });
        // Draw the vertical wall along the right edge
        wallRect = (
            <Rect
                x={offset * footPx}
                y={0}
                width={5}
                height={wallLengthPx}
                fill="black"
            />
        );
    }


    return (
        <Layer>
            {/* Draw the cabinets */}
            {wallRect}
            {cabinetRects}
        </Layer>
    )
}

Wall.propTypes = {
    lengthFeet: PropTypes.number.isRequired,
    orientation: PropTypes.oneOf(["left", "right", "top"]).isRequired,
    footPx: PropTypes.number,
    offset: (props, propName, componentName) => {
        if (props.orientation === "right" && (props[propName] === undefined || props[propName] === null)) {
          return new Error(
            `Invalid prop \`${propName}\` supplied to \`${componentName}\`. ` +
            `The \`offset\` prop is required when \`orientation\` is "right".`
          );
        }
        return null; // No error if validation passes
      }
}

export default Wall;