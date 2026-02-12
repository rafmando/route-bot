import { useRef, useEffect } from 'react';
import type { Map } from '../../types/map';

interface Props {
    map: Map;
    route?: string[];
    vanPosition?: { x: number; y: number } | null;
}

export function MapCanvas({ map, route = [], vanPosition }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw roads first (background layer)
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;
        map.roads.forEach(road => {
            const fromLoc = map.locations.find(l => l.id === road.from) || map.warehouse;
            const toLoc = map.locations.find(l => l.id === road.to) ||
                (road.to === 'warehouse' ? map.warehouse : map.locations.find(l => l.id === road.to));

            if (fromLoc && toLoc) {
                ctx.beginPath();
                ctx.moveTo(fromLoc.x, fromLoc.y);
                ctx.lineTo(toLoc.x, toLoc.y);
                ctx.stroke();
            }
        });

        if (route.length > 1) {
            ctx.strokeStyle = 'green'
            ctx.lineWidth = 4;
            ctx.beginPath();

            for (let i = 0; i < route.length; i++) {
                const locationId = route[i];
                const location = locationId === 'warehouse' ? map.warehouse : map.locations.find(l => l.id === locationId);

                if (location) {
                    if (i === 0) {
                        ctx.moveTo(location.x, location.y);
                    } else {
                        ctx.lineTo(location.x, location.y);
                    }
                }
            }

            ctx.stroke();
        }



        // Draw warehouse (red square)
        ctx.fillStyle = 'red';
        ctx.fillRect(map.warehouse.x - 15, map.warehouse.y - 15, 30, 30);

        // Draw houses (blue circles)
        map.locations.forEach(location => {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(location.x, location.y, 10, 0, Math.PI * 2);
            ctx.fill();
        });

        // Van
        if (vanPosition) {
            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.arc(vanPosition.x, vanPosition.y, 12, 0, Math.PI * 2);
            ctx.fill();

            // Van outline
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw labels
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        // Warehouse label
        ctx.fillText(map.warehouse.name, map.warehouse.x, map.warehouse.y - 25);

        // House labels
        map.locations.forEach(location => {
            ctx.fillText(location.name, location.x, location.y + 25);
        });

    }, [map, route, vanPosition]);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={700}
            style={{ border: '1px solid #ddd' }}
        />
    );
}