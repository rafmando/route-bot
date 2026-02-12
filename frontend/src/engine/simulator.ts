import type { Map, Location } from '../types/map';

interface SimulationState {
    currentPosition: { x: number; y: number };
    targetIndex: number;
    progress: number;
    isRunning: boolean;
}

export class RouteSimulator {
    private route: string[];
    private map: Map;
    private state: SimulationState;
    private animationId: number | null = null;

    constructor(map: Map, route: string[]) {
        this.map = map;
        this.route = route;
        this.state = {
            currentPosition: { x: map.warehouse.y, y: map.warehouse.y },
            targetIndex: 1,
            progress: 0,
            isRunning: false
        }
    }

    start(onUpdate: (position: { x: number; y: number }) => void) {
        this.state.isRunning = true;

        const animate = () => {
            if (!this.state.isRunning || this.state.targetIndex >= this.route.length) {
                this.stop();
                return;
            }

            const currentId = this.route[this.state.targetIndex - 1];
            const targetId = this.route[this.state.targetIndex];

            const currentLoc = this.getLocation(currentId);
            const targetLoc = this.getLocation(targetId);

            if (!currentLoc || !targetLoc) return;

            this.state.progress += 0.02;

            if (this.state.progress >= 1) {
                this.state.targetIndex++;
                this.state.progress = 0;
            }

            this.state.currentPosition = {
                x: currentLoc.x + (targetLoc.x - currentLoc.x) * this.state.progress,
                y: currentLoc.y + (targetLoc.y - currentLoc.y) * this.state.progress
            };

            onUpdate(this.state.currentPosition);
            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    stop() {
        this.state.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    reset() {
        this.stop();
        this.state = {
            currentPosition: { x: this.map.warehouse.x, y: this.map.warehouse.y },
            targetIndex: 1,
            progress: 0,
            isRunning: false
        };
    }

    private getLocation(id: string): Location | null {
        if (id === 'warehouse') return this.map.warehouse;
        return this.map.locations.find(l => l.id === id) || null;
    }

}