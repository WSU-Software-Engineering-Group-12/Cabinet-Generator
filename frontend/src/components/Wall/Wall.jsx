import { useEffect, useState, useRef } from "react";
import { Group } from "react-konva";
import { generateWall } from "../../../utils/api";
import PropTypes from "prop-types";
import { defaultInchPx } from "../../../utils/globalVars";
import { getWallAndCabinets } from "./getWallAndCabinets";

const Wall = ({ lengthFeet, orientation, footPx = defaultInchPx, offset }) => {
    const [error, setError] = useState(null);
    const [bases, setBases] = useState([]);
    const [uppers, setUppers] = useState([]);
    const topGroup = useRef(null);

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

        // Ensure the walls render on top of everything else
        if (topGroup.current) {
            topGroup.current.moveToTop();
            topGroup.current.batchDraw(); // Force re-render
        }
    }, [lengthFeet, orientation]);

    if (error) return <p>{error}</p>;
    if (bases.length === 0 && uppers.length === 0) return null;

    const { wallRect, baseRects, upperRects } = getWallAndCabinets(orientation, lengthFeet, footPx, offset, bases, uppers);

    return (
        <>
            <Group>{baseRects}</Group>
            <Group>{upperRects}</Group>
            <Group ref={topGroup}>{wallRect}</Group>
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
                `Invalid prop \`${propName}\` supplied to \`${componentName}\`. ` +
                `The \`offset\` prop is required when \`orientation\` is "right".`
            );
        }
        return null;
    },
};

export default Wall;
