import { useState, useRef } from 'react';
import { MapCanvas } from '../components/Map/MapCanvas';
import { AlgorithmPicker } from '../components/Controls/AlgorithmPicker';
import { suburbanMap } from '../data/sampleMap';
import { greedyAlgorithm } from '../engine/algorithms/greedy';
import { RouteSimulator } from '../engine/simulator';
import { saveRoute } from '../services/api';

export function Simulator() {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('greedy');
    const [route, setRoute] = useState<string[]>([]);
    const [vanPosition, setVanPosition] = useState<{ x: number; y: number } | null>(null);
    const [stats, setStats] = useState<{ distance: number; time: number }>({ distance: 0, time: 0 });  // ← NEW
    const simulatorRef = useRef<RouteSimulator | null>(null);

    const handleSave = async () => {
        try {
            const result = await saveRoute({
                mapId: suburbanMap.id,
                algorithm: selectedAlgorithm,
                totalDistance: stats.distance,
                path: route
            });
            console.log('Route saved:', result);
            alert(`Route saved!`);
        } catch (err) {
            console.log('Save error:', err);
        }
    };

    const handleCalculate = () => {
        if (selectedAlgorithm === 'greedy') {
            const calculatedRoute = greedyAlgorithm(suburbanMap);
            setRoute(calculatedRoute);
            console.log('Calculated route:', calculatedRoute);
        }
    };

    const handleAnimate = () => {
        if (route.length === 0) return;

        if (simulatorRef.current) {
            simulatorRef.current.stop();
        }

        const simulator = new RouteSimulator(suburbanMap, route);
        simulatorRef.current = simulator;

        simulator.start((position, statsUpdate) => {
            setVanPosition(position);
            setStats(statsUpdate);  // ← NEW
        });
    };

    const handleReset = () => {
        if (simulatorRef.current) {
            simulatorRef.current.reset();
        }
        setVanPosition(null);
        setStats({ distance: 0, time: 0 });  // ← NEW
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Route Optimizer</h1>

            <AlgorithmPicker
                selected={selectedAlgorithm}
                onSelect={setSelectedAlgorithm}
            />

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={handleCalculate}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        marginRight: '10px',
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
                    onClick={handleSave}
                    disabled={route.length === 0}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        marginRight: '10px',
                        cursor: route.length === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    Save Route
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
            </div>

            {route.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                    <strong>Route:</strong> {route.join(' → ')}
                </div>
            )}

            {/* NEW: Stats Display */}
            {vanPosition && (
                <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                    <div><strong>Distance Traveled:</strong> {stats.distance.toFixed(2)} km</div>
                    <div><strong>Time Elapsed:</strong> {stats.time.toFixed(1)} seconds</div>
                </div>
            )}

            <MapCanvas map={suburbanMap} route={route} vanPosition={vanPosition} />
        </div>
    );
}