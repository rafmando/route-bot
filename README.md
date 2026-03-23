# route-bot 🚚

> Delivery route optimization simulator comparing pathfinding algorithms

Compare Dijkstra's, Greedy, and Clustered delivery strategies to find the most efficient routes. Built with AWS CDK, React, TypeScript, and Canvas API.

**Inspired by:** Eloquent JavaScript's robot delivery problem + Real delivery driver experience

---

## 🎯 What It Does

Simulate real-world delivery scenarios where a driver starts at a warehouse and delivers orders to multiple addresses. Watch algorithms compete to find the most efficient route.

### Key Features

- 🗺️ **Interactive Map** - Visual delivery area with warehouse and customer addresses
- 🤖 **Multiple Algorithms** - Compare Dijkstra's, Greedy, and Clustered strategies
- 📊 **Performance Metrics** - Track distance, time, and efficiency scores
- 🏆 **Leaderboard** - Compete globally for the best routes
- 💾 **Save Routes** - User accounts to track your best scores
- 🎨 **Animated Delivery** - Watch the van navigate in real-time

---

## 🚀 Live Demo

[Demo Link] - Try it without signing up

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Canvas API (map rendering)
- Vite (build tool)
- Tailwind CSS

**Backend:**
- AWS CDK (Infrastructure as Code)
- API Gateway (REST API)
- Lambda (Node.js/TypeScript)
- DynamoDB (NoSQL database)
- Cognito (Authentication)

**Algorithms:**
- Dijkstra's Algorithm (shortest path)
- Greedy Best-First (nearest neighbor)
- Clustered Delivery (area-based grouping)

---

## 📚 Documentation

- [Database Schema](docs/database-schema.md) - Data structure and tables
- [API Endpoints](docs/api-endpoints.md) - Backend API reference
- [File Structure](docs/file-structure.md) - Project organization
- [Data Flow](docs/data-flow.md) - How components communicate
- [Map Data](docs/map-data.md) - Map structure and format
- [Algorithms](docs/algorithms.md) - Pathfinding implementation
- [Week Plan](docs/week-plan.md) - Development timeline

---

## 🎮 How To Use

1. **Try Demo** - Select a map and algorithm
2. **Watch Simulation** - See the van deliver orders
3. **View Results** - Check distance, time, and efficiency
4. **Save Route** - Sign up to save your best scores
5. **Compete** - Climb the global leaderboard

---

## 💡 Why I Built This

When I read about the robot delivery problem in Eloquent JavaScript, it clicked - I was solving this every day. I built route-bot to explore different pathfinding algorithms and see how they compare to real-world delivery strategies.

---

## 🏗️ Local Development

**Prerequisites:**
- Node.js 18+
- AWS Account (for backend)
- AWS CLI configured

**Backend Setup:**
```bash
cd backend
npm install
cdk deploy
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🚢 Deployment

**Backend:**
```bash
cd backend
cdk deploy --all
```

**Frontend:**
```bash
cd frontend
npm run build
```

---

## 📈 Roadmap

- [x] Core simulation engine
- [x] Dijkstra's algorithm
- [x] User authentication
- [x] Leaderboard
- [ ] Custom map creator
- [ ] Time windows (delivery slots)
- [ ] Traffic simulation
- [ ] Mobile app


