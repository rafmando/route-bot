import type { Map, Location } from '../types/map';

interface SimulationState {
    currentPosition: { x: number; y: number };
    targetIndex: number;
    progress: number;
    isRunning: boolean;
    totalDistance: number;
    elapsedTime: number;
}

export class RouteSimulator {
    private route: string[];
    private map: Map;
    private state: SimulationState;
    private animationId: number | null = null;
    private startTime: number = 0;

    constructor(map: Map, route: string[]) {
        this.map = map;
        this.route = route;
        this.state = {
            currentPosition: { x: map.warehouse.x, y: map.warehouse.y },
            targetIndex: 1,
            progress: 0,
            isRunning: false,
            totalDistance: 0,
            elapsedTime: 0
        };
    }

    start(onUpdate: (position: { x: number; y: number }, stats: { distance: number; time: number }) => void) {
        this.state.isRunning = true;
        this.startTime = Date.now();

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
                const segmentDistance = this.getRoadDistance(currentId, targetId);
                this.state.totalDistance += segmentDistance;
                this.state.targetIndex++;
                this.state.progress = 0;
            }

            this.state.elapsedTime = (Date.now() - this.startTime) / 1000;

            this.state.currentPosition = {
                x: currentLoc.x + (targetLoc.x - currentLoc.x) * this.state.progress,
                y: currentLoc.y + (targetLoc.y - currentLoc.y) * this.state.progress
            };

            onUpdate(this.state.currentPosition, {
                distance: this.state.totalDistance,
                time: this.state.elapsedTime
            });

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
            isRunning: false,
            totalDistance: 0,
            elapsedTime: 0
        };
    }

    private getLocation(id: string): Location | null {
        if (id === 'warehouse') return this.map.warehouse;
        return this.map.locations.find(l => l.id === id) || null;
    }

    private getRoadDistance(fromId: string, toId: string): number {
        const road = this.map.roads.find(r =>
            (r.from === fromId && r.to === toId) ||
            (r.from === toId && r.to === fromId)
        );
        return road ? road.distance : 0;
    }
}