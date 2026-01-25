# Tallman App Selector

The **Tallman App Selector** is a high-performance distributed application designed to manage and select applications within the Tallman ecosystem. Built on the **Enterprise Application Foundation**, it leverages dual-persistence, secure identity governance, and fault-tolerant AI orchestration.

## Quick Install (PowerShell)
```powershell
# Docker Desktop (Dev/Standard)
docker-compose -f docker-compose.yml up --build

# Docker Swarm (Production/Cluster)
docker stack deploy -c docker-compose.swarm.yml tallman_app
```
**URL**: [http://localhost:3100](http://localhost:3100)

## Repository
**URL**: [https://github.com/Robertstar2000-AppSelector](https://github.com/Robertstar2000-AppSelector)

## Product Specification
- **Name**: Tallman App Selector
- **Version**: 1.1.0
- **Architecture**: Microservices-ready (Docker/Swarm)
- **Orchestration**: Docker Swarm (Refer to `swarm.md`)
- **Frontend**: React 19 + Vite
- **Backend**: Node.js 20 (Express)
- **Database**: PostgreSQL 15 (Production) / SQLite (Dev Fallback)

## Network Configuration
| Service | Internal Port | Host Port | Protocol |
|---------|---------------|-----------|----------|
| App     | 3100          | 3100      | HTTP     |
| Database| 5432          | 5432      | TCP      |

## Installation Requirements

### 1. Docker Desktop (Recommended)
Required for full stack emulation and production-like environment.
- **System**: Windows 10/11 (WSL2), macOS, or Linux.
- **Version**: Docker Engine 24+

### 2. Development Mode
For local development without Docker (Partial Functional):
- **Node.js**: v20+
- **Database**: SQLite (built-in fallback)

### 3. Docker Swarm
This application is "Swarm-Ready".
- **Replicas**: Configured for 1 replica by default (stateful DB).
- **Persistence**: Requires node-pinning or shared volume drivers for multi-node clusters.

## Quick Start
```bash
# Clone
git clone https://github.com/Robertstar2000-AppSelector.git
cd TallmanAppSelector

# Docker Run (Production/Full Stack)
docker-compose up --build

# Local Dev (Frontend + Backend)
npm install
npm run dev
npm run server
```
