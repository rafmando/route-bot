# Map Data Structure

How maps are structured and stored in route-bot.

---

## Map Object Format

```typescript
interface Map {
  id: string;              // Unique identifier
  name: string;            // Display name
  warehouse: Location;     // Starting point
  locations: Location[];   // Delivery addresses
  roads: Road[];          // Connections
}

interface Location {
  id: string;       // Unique ID (e.g., "h1", "h2")
  x: number;        // Canvas X coordinate (pixels)
  y: number;        // Canvas Y coordinate (pixels)
  name: string;     // Display name (e.g., "15 Maple Drive")
  type: 'warehouse' | 'house' | 'shop';
}

interface Road {
  from: string;     // Location ID
  to: string;       // Location ID
  distance: number; // Distance in km
}
```

---

## Example: Suburban Area Map

```javascript
const suburbanMap = {
  id: "suburban-area",
  name: "Suburban Area",
  
  warehouse: {
    id: "warehouse",
    x: 400,
    y: 100,
    name: "Distribution Center",
    type: "warehouse"
  },
  
  locations: [
    { id: "h1", x: 200, y: 300, name: "15 Maple Drive", type: "house" },
    { id: "h2", x: 600, y: 300, name: "42 Oak Lane", type: "house" },
    { id: "h3", x: 400, y: 500, name: "78 Pine Road", type: "house" },
    { id: "h4", x: 100, y: 450, name: "23 Birch Street", type: "house" },
    { id: "h5", x: 700, y: 450, name: "91 Cedar Court", type: "house" },
    { id: "h6", x: 250, y: 600, name: "56 Elm Avenue", type: "house" },
    { id: "h7", x: 550, y: 600, name: "34 Willow Way", type: "house" },
    { id: "h8", x: 150, y: 200, name: "12 Ash Place", type: "house" },
    { id: "h9", x: 650, y: 200, name: "67 Spruce Lane", type: "house" },
    { id: "h10", x: 400, y: 350, name: "89 Cherry Drive", type: "house" }
  ],
  
  roads: [
    // From warehouse
    { from: "warehouse", to: "h1", distance: 5.2 },
    { from: "warehouse", to: "h2", distance: 7.1 },
    { from: "warehouse", to: "h8", distance: 4.3 },
    { from: "warehouse", to: "h9", distance: 6.8 },
    { from: "warehouse", to: "h10", distance: 3.5 },
    
    // Between houses (creating a connected graph)
    { from: "h1", to: "h2", distance: 3.5 },
    { from: "h1", to: "h3", distance: 4.2 },
    { from: "h1", to: "h4", distance: 2.8 },
    { from: "h1", to: "h8", distance: 2.5 },
    { from: "h1", to: "h10", distance: 2.1 },
    
    { from: "h2", to: "h3", distance: 4.0 },
    { from: "h2", to: "h5", distance: 2.6 },
    { from: "h2", to: "h9", distance: 2.3 },
    { from: "h2", to: "h10", distance: 2.0 },
    
    { from: "h3", to: "h4", distance: 3.8 },
    { from: "h3", to: "h5", distance: 3.6 },
    { from: "h3", to: "h6", distance: 2.5 },
    { from: "h3", to: "h7", distance: 2.3 },
    { from: "h3", to: "h10", distance: 2.8 },
    
    { from: "h4", to: "h6", distance: 2.9 },
    { from: "h4", to: "h8", distance: 3.1 },
    
    { from: "h5", to: "h7", distance: 2.7 },
    { from: "h5", to: "h9", distance: 3.2 },
    
    { from: "h6", to: "h7", distance: 3.0 },
    { from: "h7", to: "h10", distance: 3.4 },
    { from: "h8", to: "h9", distance: 5.5 },
    { from: "h9", to: "h10", distance: 3.1 }
  ]
};
```

---

## Visual Representation

```
Canvas (800x700 pixels)

                    [Warehouse]
                    (400, 100)
                         |
         ┌───────────────┼───────────────┐
         |               |               |
      [h8]            [h10]           [h9]
    (150,200)       (400,350)       (650,200)
         |               |               |
      [h1]───────────────┼───────────[h2]
    (200,300)            |           (600,300)
         |               |               |
      [h4]            [h3]            [h5]
    (100,450)       (400,500)       (700,450)
         |               |               |
      [h6]───────────[h7]
    (250,600)       (550,600)
```

---

## How Roads Work

**Roads are bidirectional** (can travel both ways):

```javascript
// This road:
{ from: "h1", to: "h2", distance: 3.5 }

// Means you can go:
h1 → h2 (3.5 km)
h2 → h1 (3.5 km)  // Same road, reverse direction
```

**No need to define both directions separately.**

---

## Converting to Graph Structure

The algorithm needs a graph (adjacency list):

```typescript
function mapToGraph(map: Map): Graph {
  const graph = {};
  
  // Add all locations as nodes
  const allLocations = [map.warehouse, ...map.locations];
  allLocations.forEach(loc => {
    graph[loc.id] = [];
  });
  
  // Add roads as edges (bidirectional)
  map.roads.forEach(road => {
    graph[road.from].push({ node: road.to, distance: road.distance });
    graph[road.to].push({ node: road.from, distance: road.distance });
  });
  
  return graph;
}

// Result:
{
  "warehouse": [
    { node: "h1", distance: 5.2 },
    { node: "h2", distance: 7.1 },
    { node: "h8", distance: 4.3 }
  ],
  "h1": [
    { node: "warehouse", distance: 5.2 },
    { node: "h2", distance: 3.5 },
    { node: "h3", distance: 4.2 }
  ],
  // ... etc
}
```

---

## Map Difficulty Levels

### **Easy (10 locations, dense connections):**
- Many roads between houses
- Short distances
- Multiple path options

### **Medium (15 locations, moderate connections):**
- Fewer direct roads
- Some longer distances
- Clustering required

### **Hard (20 locations, sparse connections):**
- Limited road options
- Longer distances
- Strategic planning needed

---

## Storing Maps in DynamoDB

```javascript
// Maps table item
{
  "id": "suburban-area",
  "name": "Suburban Area",
  "difficulty": "easy",
  "data": {
    "warehouse": { ... },
    "locations": [ ... ],
    "roads": [ ... ]
  },
  "metadata": {
    "totalLocations": 10,
    "totalRoads": 27,
    "averageDistance": 3.4,
    "mapBounds": { width: 800, height: 700 }
  },
  "createdAt": "2026-02-10T00:00:00Z"
}
```

---

## Frontend: Loading and Rendering

```typescript
// 1. Fetch map from backend
const map = await api.getMap('suburban-area');

// 2. Store in state
setCurrentMap(map);

// 3. Draw on canvas
function drawMap(map: Map, ctx: CanvasRenderingContext2D) {
  // Draw roads (lines)
  map.roads.forEach(road => {
    const from = findLocation(map, road.from);
    const to = findLocation(map, road.to);
    
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Draw warehouse (red)
  ctx.fillStyle = 'red';
  ctx.fillRect(
    map.warehouse.x - 20,
    map.warehouse.y - 20,
    40, 40
  );
  
  // Draw houses (blue)
  map.locations.forEach(loc => {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(loc.x, loc.y, 10, 0, Math.PI * 2);
    ctx.fill();
  });
}
```

---

## Creating Custom Maps

**Users could create custom maps (future feature):**

```typescript
interface MapEditor {
  addLocation(x: number, y: number, name: string): void;
  addRoad(fromId: string, toId: string, distance: number): void;
  removeLocation(id: string): void;
  removeRoad(fromId: string, toId: string): void;
  saveMap(name: string): Promise<Map>;
}
```

**For MVP: Use pre-made maps only.**

---

## Map Validation Rules

**Before saving a map, check:**

```typescript
function validateMap(map: Map): boolean {
  // 1. Must have warehouse
  if (!map.warehouse) return false;
  
  // 2. Must have at least 5 locations
  if (map.locations.length < 5) return false;
  
  // 3. All locations must be reachable from warehouse
  if (!isFullyConnected(map)) return false;
  
  // 4. No duplicate location IDs
  const ids = new Set(map.locations.map(l => l.id));
  if (ids.size !== map.locations.length) return false;
  
  // 5. All roads reference valid locations
  for (const road of map.roads) {
    if (!locationExists(map, road.from)) return false;
    if (!locationExists(map, road.to)) return false;
  }
  
  return true;
}
```

---

## Sample Maps Library

**Starter maps to include:**

1. **Suburban Area** (Easy)
   - 10 houses, dense connections
   - Good for learning

2. **Urban District** (Medium)
   - 15 houses, moderate connections
   - Requires strategy

3. **Rural Route** (Hard)
   - 20 houses, sparse connections
   - Real challenge

4. **City Center** (Expert)
   - 25 houses, one-way streets
   - For advanced users

---

## Performance Considerations

**Map loading:**
- Small maps (<15 locations): Load immediately
- Large maps (>15 locations): Show loading indicator
- Cache maps in localStorage

**Rendering:**
- Redraw only when map changes
- Use OffscreenCanvas for better performance
- Don't redraw static elements every frame

---

## Future: Dynamic Maps

**Procedurally generated maps:**

```typescript
function generateRandomMap(
  numLocations: number,
  density: 'sparse' | 'dense'
): Map {
  // Randomly place houses
  // Connect based on distance
  // Ensure all reachable
  // Return valid map
}
```

**Not needed for MVP, but architecture supports it.**

---

## Summary

**Key Points:**
- Maps are JSON objects with locations and roads
- Roads are bidirectional (one definition = both ways)
- Convert to graph structure for algorithms
- Store in DynamoDB, cache in browser
- Validate before using

**For MVP: Create 2-3 hardcoded maps and focus on the simulation logic.** 🗺️