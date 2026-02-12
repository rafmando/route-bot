import { MapCanvas } from '../components/Map/MapCanvas';
import { AlgorithmPicker } from '../components/Controls/AlgorithmPicker';
import { suburbanMap } from '../data/sampleMap';
import { useState } from 'react';
import { greedyAlgorithm } from '../engine/algorithms/greedy';

export function Simulator() {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('greedy')
    const [route, setRoute] = useState<string[]>([]);

    const handleCalculate = () => {
        if (selectedAlgorithm === 'greedy') {
            const calculatedRoute = greedyAlgorithm(suburbanMap);
            setRoute(calculatedRoute);
            console.log('Calculated route:', calculatedRoute);
        }
    }


    return (
        <div style={{ padding: '20px' }}>
            <h1>Route Optimizer</h1>
            <AlgorithmPicker
                selected={selectedAlgorithm}
                onSelect={setSelectedAlgorithm}
            />
            <button
                onClick={handleCalculate}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    marginBottom: '20px',
                    cursor: 'pointer'
                }}
            >
                Calculate Route
            </button>

            {route.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <strong>Route:</strong> {route.join(' → ')}
                </div>
            )}

            <MapCanvas map={suburbanMap} route={route} />
        </div>
    );
}