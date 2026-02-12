import { MapCanvas } from '../components/Map/MapCanvas';
import { AlgorithmPicker } from '../components/Controls/AlgorithmPicker';
import { suburbanMap } from '../data/sampleMap';
import { useState, useRef } from 'react';
import { greedyAlgorithm } from '../engine/algorithms/greedy';
import { RouteSimulator } from '../engine/simulator';


export function Simulator() {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('greedy')
    const [route, setRoute] = useState<string[]>([]);
    const [vanPosition, setVanPosition] = useState<{ x: number; y: number } | null>(null);
    const simulatorRef = useRef<RouteSimulator | null>(null);

    const handleCalculate = () => {
        if (selectedAlgorithm === 'greedy') {
            const calculatedRoute = greedyAlgorithm(suburbanMap);
            setRoute(calculatedRoute);
            console.log('Calculated route:', calculatedRoute);
        }
    }

    const handleAnimate = () => {
        if (route.length === 0) return;

        if (simulatorRef.current) {
            simulatorRef.current.stop()
        }

        // new simulator 
        const simulator = new RouteSimulator(suburbanMap, route);
        simulatorRef.current = simulator;

        // start animation
        simulator.start((position) => {
            setVanPosition(position);
        })
    };

    const handleReset = () => {
        if (simulatorRef.current) {
            simulatorRef.current.reset()
        }
        setVanPosition(null)
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
            <button
                onClick={handleAnimate}
                disabled={route.length === 0}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    marginRight: '10px',
                    cursor: route.length === 0 ? 'not-allowed' : 'pointer'
                }}
            >
                Animate
            </button>
            <button
                onClick={handleReset}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}
            >
                Reset
            </button>

            {route.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <strong>Route:</strong> {route.join(' → ')}
                </div>
            )}

            <MapCanvas map={suburbanMap} route={route} vanPosition={vanPosition} />
        </div>
    );
}