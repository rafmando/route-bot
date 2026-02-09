# File Structure

Complete project organization for route-bot.

---

## Repository Structure

```
route-bot/
├── backend/              ← AWS CDK infrastructure
├── frontend/             ← React application
├── docs/                 ← Documentation (this folder!)
└── README.md
```

**Two separate repos approach:**
- `route-bot-backend` - AWS infrastructure
- `route-bot-frontend` - React app

**OR monorepo approach:**
- Single `route-bot` repo with both folders

---

## Backend Structure

```
route-bot-backend/
├── bin/
│   └── route-bot.ts              ← CDK app entry point
│
├── lib/
│   └── route-bot-stack.ts        ← Main CDK stack (creates all AWS resources)
│
├── lambda/
│   ├── auth.ts                   ← Login/Signup handler
│   ├── routes.ts                 ← Save/Get routes handler
│   ├── leaderboard.ts            ← Get leaderboard handler
│   └── maps.ts                   ← Get maps handler
│
├── test/
│   └── route-bot.test.ts         ← CDK stack tests
│
├── cdk.json                      ← CDK configuration
├── tsconfig.json                 ← TypeScript config
├── package.json
└── README.md
```

### **Key Backend Files:**

**`bin/route-bot.ts`** - Initializes CDK app
```typescript
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RouteBotStack } from '../lib/route-bot-stack';

const app = new cdk.App();
new RouteBotStack(app, 'RouteBotStack', {
  env: { region: 'us-east-1' }
});
```

**`lib/route-bot-stack.ts`** - Defines all AWS resources
- Creates DynamoDB tables
- Creates Lambda functions
- Creates API Gateway
- Sets up Cognito

**`lambda/*.ts`** - Individual handler functions
- Each file = one API endpoint
- Keeps functions small and focused

---

## Frontend Structure

```
route-bot-frontend/
├── public/
│   ├── favicon.ico
│   └── assets/
│       └── van-sprite.png        ← Delivery van image
│
├── src/
│   ├── App.tsx                   ← Main app component
│   ├── main.tsx                  ← React entry point
│   │
│   ├── pages/
│   │   ├── Home.tsx              ← Landing page
│   │   ├── Simulator.tsx         ← Main simulator page
│   │   ├── Leaderboard.tsx       ← Leaderboard page
│   │   └── Login.tsx             ← Login/signup page
│   │
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapCanvas.tsx     ← Canvas that draws map
│   │   │   ├── Van.tsx           ← Van sprite component
│   │   │   └── Legend.tsx        ← Map legend
│   │   │
│   │   ├── Controls/
│   │   │   ├── AlgorithmPicker.tsx ← Dropdown to select algorithm
│   │   │   └── SimButtons.tsx    ← Start/Pause/Reset buttons
│   │   │
│   │   ├── Stats/
│   │   │   └── StatsPanel.tsx    ← Distance/time/efficiency display
│   │   │
│   │   ├── Auth/
│   │   │   ├── LoginForm.tsx     ← Login form
│   │   │   └── SignupForm.tsx    ← Signup form
│   │   │
│   │   └── Layout/
│   │       ├── Header.tsx        ← Site header
│   │       └── Footer.tsx        ← Site footer
│   │
│   ├── engine/
│   │   ├── simulator.ts          ← Main simulation engine
│   │   │
│   │   ├── algorithms/
│   │   │   ├── dijkstra.ts       ← Dijkstra's algorithm
│   │   │   ├── greedy.ts         ← Greedy/nearest neighbor
│   │   │   └── clustered.ts      ← Clustered delivery
│   │   │
│   │   └── graph/
│   │       ├── Graph.ts          ← Graph data structure
│   │       └── Node.ts           ← Graph node class
│   │
│   ├── services/
│   │   ├── api.ts                ← Backend API client
│   │   ├── auth.ts               ← Auth service (Cognito)
│   │   └── storage.ts            ← LocalStorage helpers
│   │
│   ├── hooks/
│   │   ├── useAuth.ts            ← Authentication hook
│   │   ├── useSimulation.ts      ← Simulation state hook
│   │   └── useLeaderboard.ts     ← Leaderboard data hook
│   │
│   ├── context/
│   │   ├── AuthContext.tsx       ← Auth state provider
│   │   └── SimContext.tsx        ← Simulation state provider
│   │
│   ├── types/
│   │   ├── map.ts                ← Map/Location/Road types
│   │   ├── route.ts              ← Route types
│   │   ├── algorithm.ts          ← Algorithm types
│   │   └── user.ts               ← User types
│   │
│   ├── utils/
│   │   ├── calculations.ts       ← Distance/efficiency calculations
│   │   ├── formatting.ts         ← Format numbers/dates
│   │   └── constants.ts          ← App constants
│   │
│   └── styles/
│       ├── index.css             ← Global styles
│       └── tailwind.css          ← Tailwind imports
│
├── index.html
├── vite.config.ts                ← Vite configuration
├── tsconfig.json                 ← TypeScript config
├── tailwind.config.js            ← Tailwind config
├── package.json
└── README.md
```

---

## Key Frontend Files Explained

### **Pages (User-facing routes)**
- `Home.tsx` - Landing page with demo
- `Simulator.tsx` - Main app where simulation runs
- `Leaderboard.tsx` - Global rankings
- `Login.tsx` - Auth forms

### **Components (Reusable UI pieces)**
- `MapCanvas.tsx` - Draws warehouse, houses, roads, van
- `AlgorithmPicker.tsx` - Dropdown: Dijkstra/Greedy/Clustered
- `StatsPanel.tsx` - Shows metrics during/after simulation

### **Engine (Core logic - no React)**
- `simulator.ts` - Controls simulation state, animation loop
- `algorithms/*.ts` - Pure functions that calculate routes
- `graph/*.ts` - Graph data structure for pathfinding

### **Services (External communication)**
- `api.ts` - All fetch calls to backend
- `auth.ts` - Cognito integration
- `storage.ts` - Save user preferences locally

### **Types (TypeScript definitions)**
```typescript
// types/map.ts
export interface Location {
  id: string;
  x: number;
  y: number;
  name: string;
  type: 'warehouse' | 'house';
}

export interface Road {
  from: string;
  to: string;
  distance: number;
}

export interface Map {
  id: string;
  name: string;
  warehouse: Location;
  locations: Location[];
  roads: Road[];
}
```

---

## Import Patterns

### **Absolute imports (configured in tsconfig):**
```typescript
import { MapCanvas } from '@/components/Map/MapCanvas';
import { dijkstra } from '@/engine/algorithms/dijkstra';
import { api } from '@/services/api';
import type { Map, Route } from '@/types';
```

### **Relative imports (within same folder):**
```typescript
import { Van } from './Van';
import { Legend } from './Legend';
```

---

## File Naming Conventions

- **Components:** PascalCase - `MapCanvas.tsx`
- **Utils/Services:** camelCase - `calculations.ts`
- **Types:** camelCase - `map.ts`
- **Constants:** UPPER_CASE - exported as `CONST_NAME`

---

## Dependencies

### **Backend:**
```json
{
  "dependencies": {
    "aws-cdk-lib": "^2.x",
    "@aws-cdk/aws-apigatewayv2-alpha": "^2.x",
    "constructs": "^10.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/node": "^20.x"
  }
}
```

### **Frontend:**
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "typescript": "^5.x",
    "@types/react": "^18.x",
    "tailwindcss": "^3.x"
  }
}
```

---

## Build Output

### **Backend:**
```
cdk.out/
├── RouteBotStack.template.json   ← CloudFormation template
└── assembly-RouteBotStack/
```

### **Frontend:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── assets/van-sprite.png
```

---

## Environment Variables

### **Backend (.env):**
```
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxx
API_GATEWAY_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com
```

### **Frontend (.env):**
```
VITE_API_URL=https://api.route-bot.com
VITE_COGNITO_USER_POOL_ID=us-east-1_xxxxx
VITE_COGNITO_CLIENT_ID=xxxxx
```

---

## What Goes Where?

**Need to add a new algorithm?**
→ `frontend/src/engine/algorithms/new-algo.ts`

**Need new API endpoint?**
→ `backend/lambda/new-handler.ts` + update `route-bot-stack.ts`

**Need new React page?**
→ `frontend/src/pages/NewPage.tsx` + add route in `App.tsx`

**Need shared TypeScript types?**
→ `frontend/src/types/new-type.ts`

**Need utility function?**
→ `frontend/src/utils/helpers.ts`