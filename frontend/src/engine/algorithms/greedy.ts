import type { Map, Location } from '../../types/map';

function getDistance(loc1: Location, loc2: Location): number {
    const dx = loc2.x - loc1.x
    const dy = loc2.y - loc1.y

    return Math.sqrt(dx * dx + dy * dy);
}

export function greedyAlgorithm(map: Map): string[] {
    const route: string[] = [map.warehouse.id];
    const unvisited = new Set(map.locations.map(l => l.id));
    let current = map.warehouse;

    while (unvisited.size > 0) {
        let closestLocation: Location | null = null;
        let minDistance = Infinity

        for (const location of map.locations) {
            if (unvisited.has(location.id)) {
                const distance = getDistance(current, location);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestLocation = location;
                }
            }
        }

        if (closestLocation) {
            route.push(closestLocation.id);
            unvisited.delete(closestLocation.id);
            current = closestLocation;
        }


    }

    route.push(map.warehouse.id);
    return route;


}