import { Rect, Group } from "react-konva";
import { FOOT_PX } from "../../global_files/global_vars";

const Cabinet = ({ x, y, width, height }) => {
    return (
        <Group className="cabinet">
            <Rect
                x={x}
                y={y}
                width={width * FOOT_PX}
                height={height * FOOT_PX}
                stroke={'red'}
                strokeWidth={3}
            />
        </Group>
    );
}

export default Cabinet;