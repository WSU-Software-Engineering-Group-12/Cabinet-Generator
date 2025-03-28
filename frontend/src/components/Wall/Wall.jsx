import { useEffect, useState } from "react";
import { Rect, Stage, Layer } from "react-konva";
import { generateWall } from "../../../utils/api";

const Wall = ({lengthFeet, orientation, footPx}) => {
    // TODO add orientation logic
    const validOrientations = ["left", "right", "top"];
    const [error, setError] = useState(null);
    const [bases, setBases] = useState([]);
    const [uppers, setUppers] = useState([]);

    useEffect(() => {
        const fetchWall = async () => {
            try {
                const response = await generateWall(lengthFeet);
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
    }, [lengthFeet]);

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
        let cumulativeX = 0;
        cabinetRects = bases.map((cabinet, index) => {
            const rectWidth = cabinet.width * footPx; // horizontal dimension
            const rectHeight = cabinet.depth * footPx; // vertical dimension
            const rect = (
                <Rect
                    key={`top-${index}`}
                    x={cumulativeX}
                    y={10} // Positioned below the wall line
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
            const rectHeight = cabinet.width * footPx;
            const rectWidth = cabinet.depth * footPx;
            const yPos = cumulativeY - rectHeight;
            cumulativeY -= rectHeight;
            return (
                <Rect
                    key={`left-${index}`}
                    x={5}  // Drawn to the right of the wall (wall is at x=0 to x=5)
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
                    x={wallLengthPx - rectWidth - 5}  // Drawn to the left of the wall (wall is at right edge)
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
                x={wallLengthPx - 5}
                y={0}
                width={5}
                height={wallLengthPx}
                fill="black"
            />
        );
    }


    return (
        <Stage width={5000} height={5000}>
            <Layer>
                {/* Draw the cabinets */}
                {wallRect}
                {cabinetRects}
            </Layer>
        </Stage>
    )
}

export default Wall;