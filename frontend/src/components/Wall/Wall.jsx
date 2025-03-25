import { useEffect, useState } from "react";
import { Rect, Stage, Layer } from "react-konva";
import { generateWall } from "../../../utils/api";

const Wall = ({lengthFeet, generation, footPx}) => {
    // TODO add orientation logic
    const validOrientations = ["left", "right", "top"];
    const [error, setError] = useState(null);
    const [cabinets, setCabinets] = useState([]);

    useEffect(() => {
        const fetchWall = async () => {
            try {
                const response = await generateWall(lengthFeet, generation);
                console.log("API Response:", response);
                // Ensure the API response contains an array of cabinets.
                if (response && Array.isArray(response.cabinets)) {
                    setCabinets(response.cabinets);
                } else {
                    setCabinets([]);
                    console.error("Unexpected API response format:", response);
                }
            } catch (error) {
                setError("Failed to load wall data");
                console.error(error);
            }
        };

        fetchWall();
    }, [lengthFeet, generation]);

    if(error) return <p>{error}</p>
    if(cabinets.length === 0) return null;

    // Calculate cumulative x positions for each cabinet.
    let cumulativeX = 0;
    const cabinetRects = cabinets.map((cabinet, index) => {
        const rectWidth = cabinet.width * footPx; // Convert cabinet width to pixels.
        const rectHeight = cabinet.depth * footPx; // Use depth as the rectangle's height.
        const rect = (
        <Rect
            key={index}
            x={cumulativeX}
            y={10} // You can adjust the y offset as needed.
            width={rectWidth}
            height={rectHeight}
            fill="gray"
            stroke="black"
            strokeWidth={1}
        />
        );
        cumulativeX += rectWidth; // Move to the right for the next cabinet.
        return rect;
    });

    return (
        <Stage width={5000} height={5000}>
            <Layer>
                {/* Draw the wall */}
                <Rect
                    x={0}
                    y={0}
                    width={lengthFeet * footPx}
                    height={5}
                    fill="black"
                />
                {cabinetRects}
            </Layer>
        </Stage>
    )
}

export default Wall;