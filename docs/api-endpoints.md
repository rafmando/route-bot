# API Endpoints

Complete REST API reference for route-bot backend.

**Base URL:** `https://api.route-bot.com` (or your API Gateway URL)

---

## Authentication

All endpoints except `/auth/*` require an `Authorization` header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### **POST /auth/signup**

Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "username": "johndoe"
}
```

**Response (200):**
```json
{
  "userId": "uuid-here",
  "token": "jwt-token-here",
  "username": "johndoe"
}
```

**Errors:**
- `400` - Invalid email format
- `409` - Email already exists

---

### **POST /auth/login**

Login to existing account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "userId": "uuid-here",
  "token": "jwt-token-here",
  "username": "johndoe"
}
```

**Errors:**
- `401` - Invalid credentials
- `404` - User not found

---

### **POST /routes**

Save a completed route.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "mapId": "suburban-area",
  "algorithm": "dijkstra",
  "totalDistance": 15.3,
  "totalTime": 45,
  "efficiency": 87.5,
  "path": ["warehouse", "h1", "h3", "h2", "warehouse"]
}
```

**Response (201):**
```json
{
  "routeId": "uuid-here",
  "saved": true,
  "rank": 3
}
```

**Errors:**
- `401` - Unauthorized (invalid/missing token)
- `400` - Invalid route data

---

### **GET /routes**

Get user's saved routes.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional) - Max results (default: 20)
- `mapId` (optional) - Filter by specific map

**Example:**
```
GET /routes?limit=10&mapId=suburban-area
```

**Response (200):**
```json
{
  "routes": [
    {
      "id": "uuid-1",
      "mapId": "suburban-area",
      "algorithm": "dijkstra",
      "totalDistance": 15.3,
      "totalTime": 45,
      "efficiency": 87.5,
      "createdAt": "2026-02-10T10:30:00Z"
    },
    {
      "id": "uuid-2",
      "mapId": "urban-area",
      "algorithm": "greedy",
      "totalDistance": 22.1,
      "totalTime": 58,
      "efficiency": 75.2,
      "createdAt": "2026-02-09T14:20:00Z"
    }
  ],
  "total": 2
}
```

---

### **GET /leaderboard**

Get global leaderboard for a specific map.

**Query Parameters:**
- `mapId` (required) - Map identifier
- `limit` (optional) - Max results (default: 10)

**Example:**
```
GET /leaderboard?mapId=suburban-area&limit=10
```

**Response (200):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "username": "speedydriver",
      "efficiency": 95.8,
      "totalDistance": 14.2,
      "totalTime": 42,
      "algorithm": "dijkstra",
      "createdAt": "2026-02-08T16:45:00Z"
    },
    {
      "rank": 2,
      "username": "routemaster",
      "efficiency": 92.3,
      "totalDistance": 14.8,
      "totalTime": 43,
      "algorithm": "clustered",
      "createdAt": "2026-02-09T09:15:00Z"
    }
  ],
  "mapId": "suburban-area",
  "total": 10
}
```

---

### **GET /maps**

Get all available maps.

**Response (200):**
```json
{
  "maps": [
    {
      "id": "suburban-area",
      "name": "Suburban Area",
      "difficulty": "easy",
      "totalLocations": 10,
      "averageDistance": 45.2
    },
    {
      "id": "urban-area",
      "name": "Urban District",
      "difficulty": "medium",
      "totalLocations": 15,
      "averageDistance": 62.8
    }
  ]
}
```

---

### **GET /maps/:id**

Get detailed map data including locations and roads.

**Example:**
```
GET /maps/suburban-area
```

**Response (200):**
```json
{
  "id": "suburban-area",
  "name": "Suburban Area",
  "warehouse": {
    "id": "warehouse",
    "x": 400,
    "y": 100,
    "name": "Distribution Center"
  },
  "locations": [
    {
      "id": "h1",
      "x": 200,
      "y": 300,
      "name": "15 Maple Drive",
      "type": "house"
    },
    {
      "id": "h2",
      "x": 600,
      "y": 300,
      "name": "42 Oak Lane",
      "type": "house"
    }
  ],
  "roads": [
    {
      "from": "warehouse",
      "to": "h1",
      "distance": 5.2
    },
    {
      "from": "warehouse",
      "to": "h2",
      "distance": 7.1
    },
    {
      "from": "h1",
      "to": "h2",
      "distance": 3.5
    }
  ]
}
```

**Errors:**
- `404` - Map not found

---

## Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Email already exists",
    "details": "user@example.com is already registered"
  }
}
```

**Common Error Codes:**
- `INVALID_REQUEST` - Bad request data
- `UNAUTHORIZED` - Missing or invalid token
- `NOT_FOUND` - Resource doesn't exist
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

---

## Rate Limits

- **Anonymous:** 10 requests/minute
- **Authenticated:** 60 requests/minute
- **Burst:** 100 requests in 10 seconds

Rate limit headers included in response:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1644509876
```

---

## CORS

API supports CORS for these origins:
- `https://route-bot.vercel.app` (production)
- `http://localhost:5173` (development)

---

## Pagination

Endpoints that return lists support pagination:

**Request:**
```
GET /routes?limit=10&offset=20
```

**Response includes:**
```json
{
  "routes": [...],
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 20,
    "hasMore": true
  }
}
```