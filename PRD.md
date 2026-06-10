# CORTEX — Product Requirements Document

**Version:** 1.0  
**Date:** June 2026  
**Team size:** 5 developers  
**Status:** Active Development

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Criteria](#3-goals--success-criteria)
4. [Users](#4-users)
5. [System Architecture](#5-system-architecture)
6. [Tech Stack](#6-tech-stack)
7. [Feature Specifications](#7-feature-specifications)
8. [Data Models](#8-data-models)
9. [API Contract](#9-api-contract)
10. [WebSocket Events](#10-websocket-events)
11. [Page Inventory](#11-page-inventory)
12. [Design System Summary](#12-design-system-summary)
13. [Out of Scope](#13-out-of-scope)
14. [Open Questions & Decisions](#14-open-questions--decisions)
15. [Glossary](#15-glossary)

---

## 1. Project Overview

CORTEX is a **railway conflict management and decision-support platform**. It detects conflicts between trains on a shared rail network, generates AI-driven recommendations for resolving them, and presents those recommendations to a human controller who makes the final call.

The platform is built as a demonstration system intended to showcase how intelligent operations tooling can work in a high-stakes, real-time environment. It consists of three layers working together:

- A **simulation engine** that models train movement and generates conflicts
- A **backend platform** that runs detection, recommendation logic, and stores decisions
- A **frontend dashboard** that controllers use to monitor, decide, and act

CORTEX is not a fully autonomous system. The controller always decides. CORTEX explains.

---

## 2. Problem Statement

Railway networks using single-track sections face a fundamental scheduling challenge: two trains cannot occupy the same segment at the same time from opposite directions. When schedules slip — due to delays, mechanical issues, or cascading upstream events — conflicts arise that a human dispatcher must resolve manually, often under time pressure with incomplete information.

The core problems CORTEX addresses:

- Controllers lack a unified, real-time view of where trains are and where conflicts are developing
- When a conflict is spotted, the reasoning required to pick the right resolution is complex (priority, downstream impact, passenger load, cascading effects) and done mentally under pressure
- Decisions made in the field are not consistently recorded, making post-incident review difficult
- Demo environments for showcasing conflict resolution tooling don't exist in a clean, standalone form

---

## 3. Goals & Success Criteria

### Goals

- Give a controller immediate situational awareness: where everything is, what is going wrong, right now
- Surface conflict resolutions with clear reasoning so controllers spend time deciding, not calculating
- Record every controller decision with its context and outcome for audit purposes
- Provide a controllable simulation environment for demonstrating the platform to external audiences

### Success Criteria

| Criterion | Target |
|-----------|--------|
| Controller can identify the most critical conflict on the network | Within 5 seconds of opening the dashboard |
| Recommendation explanation is understandable by a non-technical person | Readable without domain expertise |
| All controller actions (accept / reject / override) are recorded | 100% capture rate |
| Network state reflects real-time changes | Within 3 seconds of a simulation event |
| Simulation can be started, paused, and reset without a page reload | Full in-page control |

---

## 4. Users

CORTEX has one primary user type for this version.

### Railway Controller

The person watching the network and making decisions. They are not necessarily technical. They understand train operations, priorities, and scheduling — but they do not write code or configure systems.

What they need:
- To see where every train is at a glance
- To understand what conflict is most urgent right now
- To read a recommendation and understand why it was made before acting on it
- To override a recommendation when they disagree, and record their reasoning
- To review past decisions after an incident

**Everything in the UI is designed for this person.** If a piece of information requires domain-specific knowledge to interpret, it needs a label or explanation.

---

## 5. System Architecture

CORTEX is divided into three components. Each has clear ownership and communicates only through defined contracts.

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│   Dashboard / Network View / Conflicts / Recommendations /      │
│   Simulation / Audit                                            │
│                                                                 │
│   Consumes: REST API + WebSocket from Platform Backend          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP /api/*  +  Socket.IO
┌──────────────────────────▼──────────────────────────────────────┐
│                   PLATFORM BACKEND (Node.js)                    │
│   API server, conflict store, recommendation store, audit log,  │
│   WebSocket broadcaster, simulation controller                  │
│                                                                 │
│   Consumes: Conflict Engine via internal calls                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Internal
┌──────────────────────────▼──────────────────────────────────────┐
│                    CONFLICT ENGINE (Python)                     │
│   Train movement simulation, conflict detection logic,          │
│   recommendation generation, explanation generation             │
│                                                                 │
│   Exposes: internal API only — never called directly by UI      │
└─────────────────────────────────────────────────────────────────┘
```

### Key architectural rules

- The frontend **never calls the engine directly**. All requests go through `/api/*` on the platform backend.
- The engine is a black box from the frontend's perspective. It produces conflicts, recommendations, and explanations. It does not own any UI concerns.
- The platform backend owns the WebSocket connection and is responsible for broadcasting state changes to all connected clients.
- The frontend is purely a rendering and interaction layer. It holds no business logic.

---

## 6. Tech Stack

### Frontend

| Concern | Library |
|---------|---------|
| Framework | React with TypeScript (strict mode) |
| UI components | shadcn/ui |
| Styling | Tailwind CSS |
| Real-time | Socket.IO client |
| Server state | TanStack React Query |
| Client state | Zustand |
| Routing | React Router v6 or Next.js App Router |
| Charts / Viz | Recharts or Visx |
| Network map | SVG (custom) |
| Icons | Lucide React |

### Backend (Platform)

Node.js, Express or Fastify, Socket.IO server, PostgreSQL or SQLite for persistence (team decision pending), REST API.

### Engine

Python. Internal only. Team responsible for this layer owns the algorithm and exposes an internal interface to the platform backend.

### Shared

TypeScript types in `domain.ts` are the canonical contract between frontend and backend. Any change to a type must be agreed on by both sides before either implements it.

---

## 7. Feature Specifications

### 7.1 Real-Time Network Monitoring

The platform maintains a live view of every train's position, status, and delay across the network.

- Train positions update in real time via WebSocket
- Each train carries: name, number, direction (UP/DOWN), priority (0–5), status, current location, delay in minutes
- Status values: RUNNING, WAITING, CROSSING, DELAYED, STOPPED, COMPLETED
- The network consists of stations connected by track segments, most of which are single-track
- The frontend renders this as a visual map and also exposes it as structured data in cards and tables

### 7.2 Conflict Detection (Engine responsibility, displayed by Frontend)

Conflicts are detected by the engine and pushed to the frontend via the platform backend.

- A conflict is created when two or more trains are at risk of occupying the same segment simultaneously
- Each conflict has: type, location, affected train IDs, severity, creation timestamp, and a plain-language description
- Severity levels: LOW, MEDIUM, HIGH, CRITICAL
- The frontend displays conflicts sorted by severity (CRITICAL first), then by time detected
- Controllers can filter conflicts by severity level
- New CRITICAL conflicts trigger a prominent toast notification

### 7.3 Recommendation Generation (Engine responsibility, displayed by Frontend)

For each conflict, the engine generates one or more recommendations for the controller.

- A recommendation specifies an action (e.g. "Hold Train 12045 at Gwalior for 6 minutes"), affected trains, expected delay benefit in minutes, and a confidence score (0–1)
- Every recommendation is accompanied by an **explanation** with five fields: Situation, Decision, Reasoning, Expected Outcome, and Future Consequences
- The explanation must be readable by a non-technical person. Technical jargon is not acceptable in explanation text
- Recommendations have three possible controller outcomes: ACCEPTED, REJECTED, OVERRIDDEN

### 7.4 Controller Decision Workflow

This is the core interaction of the platform. The controller reviews a recommendation and takes one of three actions.

**Accept:** The controller agrees with the recommendation. It is submitted as ACCEPTED and recorded in the audit log.

**Reject:** The controller disagrees and will not follow the recommendation. Recorded as REJECTED. No further action required.

**Override with custom:** The controller disagrees with the specific parameters but wants to take a different action. They specify their own action (Hold / Proceed / Other), duration in minutes if applicable, and a mandatory reasoning note. Recorded as OVERRIDDEN.

All three paths require a two-step confirmation. First click changes the button to a confirm state. Second click submits. This prevents accidental submissions.

### 7.5 Simulation Control

CORTEX includes a built-in simulation environment for demonstration purposes.

- Five scenarios: Basic Crossing, Priority Conflict, Cascade Delay, Disruption Handling, Controller Override Test
- Controllers (or demo operators) can start, pause, resume, and reset simulations without a page reload
- Speed can be set to 1x, 2x, or 5x
- Events can be injected mid-simulation: add delay to a specific train, block a track segment, trigger a conflict manually
- A live event log shows all simulation events as they happen (timestamped, auto-scrolling)

### 7.6 Audit History

Every controller decision is permanently recorded with full context.

- Records are immutable once written
- Each record contains: timestamp, recommendation summary, affected trains, controller action, delay impact, and any override notes
- The audit table is filterable by date range and action type
- Rows are expandable to show the full explanation narrative and override reasoning

---

## 8. Data Models

These are the canonical TypeScript types. Backend responses must match these shapes exactly. If a field changes, both teams update `domain.ts` together before either side ships.

```typescript
// domain.ts

export type TrainStatus =
  | 'RUNNING'
  | 'WAITING'
  | 'CROSSING'
  | 'DELAYED'
  | 'STOPPED'
  | 'COMPLETED';

export type ConflictSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ControllerAction = 'ACCEPTED' | 'REJECTED' | 'OVERRIDDEN' | 'IGNORED';

export type SimulationStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';

export interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'MAJOR' | 'MINOR' | 'JUNCTION' | 'CROSSING_LOOP';
}

export interface TrackSegment {
  id: string;
  sourceStationId: string;
  destStationId: string;
  lengthKm: number;
  isSingleTrack: boolean;
}

export interface Train {
  id: string;
  name: string;
  number: string;
  priority: 0 | 1 | 2 | 3 | 4 | 5;
  direction: 'UP' | 'DOWN';
  status: TrainStatus;
  currentStationId: string | null;
  currentSegmentId: string | null;
  delayMinutes: number;
  scheduledArrival: string; // ISO 8601
}

export interface Conflict {
  id: string;
  type: string;
  location: string;
  trainIds: string[];
  severity: ConflictSeverity;
  createdAt: string; // ISO 8601
  description: string;
}

export interface Recommendation {
  id: string;
  conflictId: string;
  action: string;
  actionParams: Record<string, unknown>;
  reason: string;
  expectedBenefitMinutes: number;
  confidenceScore: number; // 0 to 1
  createdAt: string; // ISO 8601
}

export interface Explanation {
  id: string;
  recommendationId: string;
  situation: string;
  decision: string;
  reasoning: string;
  expectedOutcome: string;
  futureConsequences: string;
}

export interface AuditRecord {
  id: string;
  recommendationId: string;
  controllerAction: ControllerAction;
  timestamp: string; // ISO 8601
  notes: string | null;
}

export interface NetworkState {
  trains: Train[];
  conflicts: Conflict[];
  recommendations: Recommendation[];
  lastUpdated: string; // ISO 8601
}
```

---

## 9. API Contract

All endpoints are prefixed `/api`. The frontend calls only these. The engine is never called directly.

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/dashboard` | Summary stats + top conflicts + top recommendations | Dashboard aggregate |
| GET | `/api/network/state` | Full network state (trains, conflicts, recommendations) | `NetworkState` |
| GET | `/api/trains` | All trains | `Train[]` |
| GET | `/api/conflicts` | All active conflicts | `Conflict[]` |
| GET | `/api/recommendations` | All recommendations | `Recommendation[]` |
| GET | `/api/recommendations/:id/explanation` | Explanation for a recommendation | `Explanation` |
| GET | `/api/audit` | Full audit log | `AuditRecord[]` |
| POST | `/api/recommendations/:id/decision` | Submit controller decision | `AuditRecord` |
| POST | `/api/simulation/start` | Start a simulation scenario | `{ status: SimulationStatus }` |
| POST | `/api/simulation/pause` | Pause running simulation | `{ status: SimulationStatus }` |
| POST | `/api/simulation/reset` | Reset simulation to idle | `{ status: SimulationStatus }` |
| POST | `/api/simulation/inject` | Inject an event into running simulation | `{ success: boolean }` |

### POST `/api/recommendations/:id/decision` — Request body

```json
{
  "action": "ACCEPTED" | "REJECTED" | "OVERRIDDEN",
  "notes": "string or null"
}
```

### POST `/api/simulation/start` — Request body

```json
{
  "scenario": "BASIC_CROSSING" | "PRIORITY_CONFLICT" | "CASCADE_DELAY" | "DISRUPTION" | "OVERRIDE_TEST"
}
```

### POST `/api/simulation/inject` — Request body

```json
{
  "type": "DELAY" | "BLOCK_TRACK" | "TRIGGER_CONFLICT",
  "trainId": "string (for DELAY)",
  "segmentId": "string (for BLOCK_TRACK)",
  "minutes": "number (for DELAY)"
}
```

### Error response shape (all endpoints)

```json
{
  "error": true,
  "message": "Human-readable description of what went wrong",
  "code": "MACHINE_READABLE_CODE"
}
```

---

## 10. WebSocket Events

The platform backend maintains a Socket.IO connection. The frontend connects once at app startup and listens for the following events. All events are consumed by Zustand stores — no local component state for server-sourced data.

| Event name | Payload type | Frontend action |
|------------|-------------|-----------------|
| `NETWORK_STATE_UPDATE` | `NetworkState` | Replace full network state in store |
| `NEW_CONFLICT` | `Conflict` | Append to conflict list; show toast if CRITICAL or HIGH |
| `NEW_RECOMMENDATION` | `Recommendation` | Append to recommendation list; update pending badge count |
| `TRAIN_POSITION_UPDATE` | `{ trainId: string; segmentId: string \| null; stationId: string \| null; delay: number }` | Update single train position in store |
| `SIMULATION_STATUS` | `SimulationStatus` | Update simulation status in Zustand simulation store |
| `CONFLICT_RESOLVED` | `{ conflictId: string }` | Remove conflict from active list |

---

## 11. Page Inventory

| Route | Page name | Primary job |
|-------|-----------|-------------|
| `/` | Landing | Explain what CORTEX is; single entry point into demo |
| `/dashboard` | Dashboard | Immediate situational awareness — "what is happening right now?" |
| `/network` | Network View | Visual map of the railway; always know where trains are |
| `/conflicts` | Conflict Center | All active conflicts, filterable by severity |
| `/recommendations` | Recommendation Center | Pending recommendations; controller acts here |
| `/simulation` | Simulation Control | Run demonstration scenarios; inject events |
| `/audit` | Audit History | Full log of every controller decision |

### Page summary

**Landing (`/`):** Hero with bold headline, three-feature row (Detect / Recommend / Explain), a visual "How It Works" flow (Observe → Detect → Recommend → Decide → Record), a network preview, and two CTAs: "Launch Demo" (routes to `/simulation` with auto-start) and "View Dashboard".

**Dashboard (`/dashboard`):** Top bar with four stat cards (Active Trains, Active Conflicts, Pending Recommendations, Total Delay Minutes). Two-column layout: left has a mini network map and a live events feed (last 10 events); right has the top 3 conflicts and top 3 pending recommendations as clickable cards. Updates every 3 seconds.

**Network View (`/network`):** Full-canvas SVG map of all stations (nodes) and track segments (lines). Train markers move and are color-coded by status (green = on time, amber = delayed, red = conflict, blue = waiting, grey = stopped/completed). Conflict segments pulse red. Clicking a train opens a detail sidebar. Controls for zoom and filtering (all / delayed only / conflicts only).

**Conflict Center (`/conflicts`):** Filterable list of all active conflicts sorted by severity then time. Each card shows conflict type, location, severity badge, affected trains, time detected, description, and a link to the related recommendation.

**Recommendation Center (`/recommendations`):** Tabbed view (Pending / Accepted / Rejected). Each pending recommendation card shows the action, affected trains, expected benefit, confidence score, and a linked conflict. Expanding a card reveals the full five-field explanation. Action bar: Accept, Reject, Override with custom (opens a modal). Accepted and rejected cards are read-only.

**Simulation Control (`/simulation`):** Split layout. Left panel: scenario selector (5 options), Start / Pause / Resume / Reset controls, speed selector (1× / 2× / 5×), and inject event buttons. Right panel: live embedded network map and a scrolling event log showing timestamped simulation events.

**Audit History (`/audit`):** Filterable table by date range and action type. Columns: Timestamp, Recommendation summary, Affected Trains, Controller Action (badged), Delay Impact, Notes. Rows expand to show full explanation narrative and override notes.

---

## 12. Design System Summary

The full design specification lives in `RAILOPTIX_DESIGN.md`. This section is a summary for quick reference.

### Visual direction

Dark-first operations dashboard. Concept: "Deep Infrastructure" — the visual grammar of things that matter. No decoration. Every visual element encodes state.

### Key colors

| Token | Hex | Used for |
|-------|-----|---------|
| Background | `#0A0E1A` | Page canvas |
| Surface | `#111827` | Cards, panels |
| Surface Alt | `#1C2333` | Hover states, inset panels |
| Border | `#1F2D40` | Card borders, separators |
| Primary action | `#3B82F6` | CTAs, decisions, links |
| Success | `#10B981` | Running, accepted, on time |
| Warning | `#F59E0B` | Delayed, pending |
| Danger | `#EF4444` | Critical conflict, rejected |
| Text primary | `#F1F5F9` | Main content |
| Text secondary | `#94A3B8` | Labels, metadata |

### Typography

- UI and body: **Inter** (400–700)
- Train IDs, segment codes, timestamps: **JetBrains Mono**

### Core rules

- Train numbers, segment IDs, and all timestamps must render in monospace
- Status is always communicated with both color and a text label — never color alone
- All controller actions (Accept / Reject / Override) require a two-step confirmation
- Every async data fetch must show a skeleton loading state
- Every empty list must show an informative empty state — never a blank container
- Error messages must be specific ("Could not load recommendations — engine unreachable"), never generic ("Error")

---

## 13. Out of Scope

The following are explicitly not part of CORTEX in this version.

- Authentication and user accounts. There is one controller persona and no login.
- Multi-user / multi-controller coordination. One active session is assumed.
- Real railway data integration. All data is simulated.
- Automatic execution of recommendations. The controller always decides.
- Mobile-first design. The platform is desktop-optimised; mobile is graceful degradation only.
- Notification systems (email, SMS, push). In-app toasts only.
- Multi-network / multi-corridor support. One rail section at a time.
- Historical simulation playback. Simulation runs forward only.
- Role-based access (admin vs controller vs viewer).

---

## 14. Open Questions & Decisions

These need to be resolved before or during development. Each item has a designated decision owner.

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | Next.js App Router or React Router v6? | Frontend | Open |
| 2 | PostgreSQL or SQLite for platform backend? | Backend | Open |
| 3 | SVG (custom) or React Flow for network map? | Frontend | Open — SVG preferred for simplicity |
| 4 | What is the base URL for local dev? (likely `localhost:3001`) | Backend | Open |
| 5 | Will the engine expose a REST API or will backend call it in-process? | Backend + Engine | Open |
| 6 | Exact WebSocket event payload format for `TRAIN_POSITION_UPDATE` | Backend + Frontend | Needs agreement before hooks are built |
| 7 | How many stations and segments in the demo network? (suggested 8–12) | Engine | Open |
| 8 | Is `confidenceScore` on `Recommendation` 0–1 or 0–100? | Backend + Frontend | Spec says 0–1; confirm before building progress bar |
| 9 | Should `GET /api/audit` support query params for filtering, or is filtering client-side? | Backend | Open |
| 10 | Sonner or shadcn/ui Toast for notifications? | Frontend | Open |

---

## 15. Glossary

| Term | Definition |
|------|-----------|
| **Conflict** | A situation where two or more trains are at risk of occupying the same track segment at the same time |
| **Controller** | The human operator who monitors the network and makes decisions |
| **Crossing loop** | A short stretch of double track on an otherwise single-track line that allows trains to pass each other |
| **Engine** | The Python-based simulation and conflict detection component. Internal only |
| **Explanation** | The five-field narrative (Situation, Decision, Reasoning, Outcome, Consequences) attached to every recommendation |
| **Platform backend** | The Node.js API server that sits between the frontend and the engine |
| **Priority** | A numeric ranking (0 = highest, 5 = lowest) that determines which train takes precedence in a conflict |
| **Recommendation** | A specific action proposed by the engine to resolve a conflict, with a confidence score and explanation |
| **Segment** | A stretch of track between two stations. Single-track segments are where conflicts occur |
| **Simulation** | A controlled scenario that drives the engine to produce train movements, conflicts, and recommendations for demonstration |
| **Station** | A named stop on the network. Can be MAJOR, MINOR, JUNCTION, or CROSSING_LOOP |
| **UP / DOWN** | The two directions of travel on the network. Direction is relative to the network's reference orientation |
| **Override** | A controller decision that rejects the recommendation's specific parameters and substitutes a custom action, recorded with mandatory reasoning |