import { 
    Stage, 
    Text, 
    Layer, 
    Rect 
} from 'react-konva';

const KonvaTest = () => {
    return (
        <Stage width={400} height={400}>
            <Layer>
                <Text
                    text='Konva Canvas' 
                    fontSize={50}
                    fill='black'
                />
                <Rect
                    x={200}
                    y={200}
                    width={50}
                    height={50}
                    fill='white'
                    stroke='black'
                    strokeWidth='.5'
                />
            </Layer>
        </Stage>
    );
}

export default KonvaTest;