import { useRef, useEffect } from 'react';

export function Simulator() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = 'purple';
        ctx.fillRect(380, 80, 40, 40);

        ctx.fillStyle = 'blue';

        ctx.beginPath();
        ctx.arc(200, 300, 15, 0, Math.PI * 2);  
        ctx.fill();

        ctx.beginPath();
        ctx.arc(600, 300, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(400, 500, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#888';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(400, 120);  
        ctx.lineTo(200, 300);  
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(400, 120);
        ctx.lineTo(600, 300);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(400, 120);
        ctx.lineTo(400, 500);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(200, 300); 
        ctx.lineTo(600, 300);  
        ctx.stroke();
    }, []);

    return (
        <div>
            <h1>Route Optimizer Simulator</h1>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{
                    border: '1px solid black', display: 'block',
                    margin: '0 auto'
                }}
            />
        </div>
    );
}