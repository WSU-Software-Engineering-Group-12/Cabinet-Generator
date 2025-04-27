import { useEffect, useRef, useState } from "react";
import { Rect, Text } from "react-konva";
import PropTypes from "prop-types";
import Measurement from "../Measurement/Measurement";
import { cabinetFill } from "../../../utils/globalVars";

const WallItem = ({ x, y, width, height, fill, stroke, strokeWidth, isBase, orientation, name, onClick }) => {
    const cabinetRef = useRef();
    const [renderInfo, setRenderInfo] = useState({ textX: 0, textY: 0, isFiller: false });

    useEffect(() => {
        const cabinet = cabinetRef.current;

        cabinet.on('mouseenter', () => {
            cabinet.fill('grey');
            cabinet.getLayer().batchDraw();
        });

        cabinet.on('mouseleave', () => {
            cabinet.fill(cabinetFill);
            cabinet.getLayer().batchDraw();
        });

        const handleCabinetClick = () => {
            onClick({ x, y, width, height, fill, stroke, strokeWidth, isBase, orientation, name });
        }

        cabinet.on('click', handleCabinetClick);

        // Calculate rendering info when component mounts or props change
        setRenderInfo(calculateRenderInfo());

        return () => {
            cabinet.off('click', handleCabinetClick);
        };
    }, [x, y, width, height, fill, stroke, strokeWidth, isBase, orientation, name, onClick]);

    // All WallItems start as cabinets, with the option for users to change them to obstacles
    // Check for those changes here
    const currentWallItem = () => {
        switch(name) {
            case "Window":
                <Rect
                    ref={cabinetRef}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill}
                    stroke="blue"
                    strokeWidth={strokeWidth}
                />
                break;
            case "Sink":
                break;
            case "Stove":
                break;
            case "Fridge":
                break;
            default:
                return (
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
                ); 
        }
    }

    const calculateRenderInfo = () => {
        const textSize = 15;
        const isFiller = name[0] === "F";

        let textX = 0;
        let textY = 0;

        if (!isBase) {
            textX = x;
            textY = y + (height / 2);
        } else if (name === "BC36") {
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
            {currentWallItem()}
            <Text
                x={renderInfo.textX}
                y={renderInfo.textY}
                width={width}
                align="center"
                text={renderInfo.isFiller ? "" : name}
                fontSize={15}
            />
            <Measurement
                x={orientation === "right" ? x + width : x}
                y={y}
                width={width}
                height={height}
                orientation={orientation}
                parentType={isBase ? "base" : "upper"}
            />
        </>
    );
};

WallItem.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
    isBase: PropTypes.bool.isRequired,
    orientation: PropTypes.oneOf(["left", "top", "right"]).isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

WallItem.defaultProps = {
    fill: "gray",
    stroke: "black",
    strokeWidth: 2,
    name: "UNDEF"
};

export default WallItem;
