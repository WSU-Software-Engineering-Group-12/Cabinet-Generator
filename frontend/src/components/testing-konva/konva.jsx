import { 
    Stage, 
    Layer, 
    Rect 
} from 'react-konva';
import './konva.css'

const KonvaTest = () => {
    const rows = 10;
    const cols = 10;
    const width = 500;
    const height = 500;

    const cellWidth = width / cols;
    const cellHeight = height / rows;

    const gridRects = [];

    // Generate the grid 
    for(let row = 0; row < rows; row++) {
        for(let col = 0; col < cols; col++) {
            gridRects.push(
                <Rect 
                    key={`row, col`}
                    x={col*cellWidth}
                    y={row*cellHeight}
                    width={cellWidth}
                    height={cellHeight}
                    stroke='black'
                    strokeWidth={.1}
                />
            )
        }
    }

    return (
        <Stage className='canvas' width={width} height={height}>
            <Layer>
                {/* Border */}
                <Rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill='white'
                    stroke='black'
                    strokeWidth='5'
                />

                {/* Grid */}
                {gridRects}
            </Layer>
        </Stage>
        
    );
}

export default KonvaTest;