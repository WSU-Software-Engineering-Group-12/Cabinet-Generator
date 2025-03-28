import { useEffect, useState } from "react";
import { Rect, Stage, Layer } from "react-konva";
import { generateWall } from "../../../utils/api";

const Wall = ({lengthFeet, generation, footPx}) => {
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
    }, [lengthFeet, generation]);

    if(error) return <p>{error}</p>
    if(uppers.length === 0) return null;

    // Calculate cumulative x positions for each upper.
    let cumulativeXUpper = 0;
    const upperRects = uppers.map((cabinet, index) => {
        const rectWidth = cabinet.width * footPx; // Convert cabinet width to pixels.
        const rectHeight = cabinet.depth * footPx; // Use depth as the rectangle's height.
        const rect = (
        <Rect
            key={`upper-${index}`}
            x={cumulativeXUpper}
            y={1} // You can adjust the y offset as needed.
            width={rectWidth}
            height={rectHeight}
            fill={null}
            stroke="black"
            strokeWidth={1}
        />
        );
        cumulativeXUpper += rectWidth; // Move to the right for the next cabinet.
        return rect;
    });

    // Calculate cumulative x positions for each base.
    let cumulativeXBase = 0;
    const baseRects = bases.map((cabinet, index) => {
        const rectWidth = cabinet.width * footPx; // Convert cabinet width to pixels.
        const rectHeight = cabinet.depth * footPx; // Use depth as the rectangle's height.
        const rect = (
        <Rect
            key={`base-${index}`}
            x={cumulativeXBase}
            y={1} // You can adjust the y offset as needed.
            width={rectWidth}
            height={rectHeight}
            fill={null}
            stroke="red"
            strokeWidth={1}
        />
        );
        cumulativeXUpper += rectWidth; // Move to the right for the next cabinet.
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
                {baseRects}
                {upperRects}
            </Layer>
        </Stage>
    )
}

export default Wall;