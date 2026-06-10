# RailOptix — Frontend Team Brief
**Audience:** Frontend Developer(s)  
**Stack:** React + shadcn/ui + Tailwind CSS  
**Repo:** `railoptix-platform` → `/src` directory

---

## Your Mission

You own everything the controller sees and touches. You do NOT write any railway logic. You consume APIs and render state.

**Primary question before every decision:** "Can a controller understand this in under 5 seconds?"

---

## What You Are NOT Building

- No recommendation algorithms
- No conflict detection logic
- No train scheduling
- No priority resolution

You receive data from APIs. You render it. You send controller decisions back.

---

## Tech Stack

```
React (with TypeScript — strict mode, no `any`)
shadcn/ui                → pre-built accessible components
Tailwind CSS             → utility styling
Socket.IO client         → real-time updates
React Query (TanStack)   → server state, caching, polling
Zustand                  → lightweight client state (simulation, UI toggles)
React Router v6 or       → page routing
  Next.js App Router
Recharts or Visx         → network visualization / charts
Lucide React             → icons
```

---

## Application Structure

```
src/
├── pages/              (or app/ if using Next.js)
│   ├── index           → Landing Page
│   ├── dashboard        → Dashboard
│   ├── network          → Network View
│   ├── conflicts        → Conflict Center
│   ├── recommendations  → Recommendation Center
│   ├── simulation       → Simulation Control
│   └── audit            → Audit History
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── Layout.tsx
│   ├── network/
│   │   ├── NetworkCanvas.tsx     → SVG/Canvas map
│   │   ├── TrainMarker.tsx
│   │   ├── StationNode.tsx
│   │   └── ConflictOverlay.tsx
│   ├── trains/
│   │   ├── TrainCard.tsx
│   │   └── TrainStatusBadge.tsx
│   ├── conflicts/
│   │   ├── ConflictCard.tsx
│   │   └── SeverityBadge.tsx
│   ├── recommendations/
│   │   ├── RecommendationCard.tsx
│   │   ├── ExplanationPanel.tsx
│   │   └── ControllerActionBar.tsx
│   └── shared/
│       ├── StatusPill.tsx
│       ├── MetricCard.tsx
│       └── EmptyState.tsx
│
├── hooks/
│   ├── useNetworkState.ts
│   ├── useConflicts.ts
│   ├── useRecommendations.ts
│   └── useSimulation.ts
│
├── services/
│   ├── api.ts           → all fetch/axios calls
│   └── socket.ts        → Socket.IO connection + event handlers
│
├── store/
│   └── simulationStore.ts   → Zustand: sim running state, active scenario
│
└── types/
    └── domain.ts        → shared TypeScript types (matches backend models)
```

---

## Pages Specification

---

### Page 1 — Landing Page (`/`)

**Job:** Convey what RailOptix is in under 10 seconds. Provide a single entry point into the demo.

**Content Structure:**
1. **Hero** — Bold headline + one-line subhead + "Launch Demo" CTA button
2. **What It Does** — 3-column: Detect Conflicts / Generate Recommendations / Explain Decisions
3. **How It Works** — Visual flow: Observe → Detect → Recommend → Decide → Record
4. **Network Preview** — Static or animated screenshot/mockup of the network view
5. **Footer** — Project info only

**Interactions:**
- "Launch Demo" → routes to `/simulation` with auto-start
- "View Dashboard" → routes to `/dashboard`

---

### Page 2 — Dashboard (`/dashboard`)

**Job:** Immediate situational awareness. Answer "What is happening right now?" in under 10 seconds.

**Layout:** Top stat bar + two-column content area

**Top Stat Bar (4 cards):**
- Active Trains (count)
- Active Conflicts (count, red if > 0)
- Pending Recommendations (count, amber if > 0)
- Total Delay Minutes (network-wide)

**Left Column:**
- Live Network Mini-Map (condensed version of Network View)
- Recent Events Feed (last 10 events, auto-updating)

**Right Column:**
- Top 3 Active Conflicts (cards, clickable → Conflict Center)
- Top 3 Pending Recommendations (cards, clickable → Recommendation Center)

**Real-time behavior:** Updates every 3 seconds via socket or polling. No page refresh.

---

### Page 3 — Network View (`/network`)

**Job:** Visual map of the railway section. Controllers always know where trains are.

**Implementation Options (choose one):**
- SVG canvas — preferred for simplicity and control
- React Flow — good for graph-like networks
- D3.js embedded in React

**What Renders:**
- Stations as named nodes (circle + label)
- Track segments as lines between stations
- Train markers (moving, direction indicated by arrow/color)
- Conflict indicators (pulsing red overlay on segment/station)
- Train tooltip on hover: name, number, priority, delay, status

**Train Marker Colors:**
- Green → Running on time
- Amber → Delayed
- Red → In conflict
- Blue → Waiting/Holding
- Grey → Completed/Stopped

**Controls:**
- Zoom in/out
- Toggle: show all trains / show delayed only / show conflicts only
- Train click → opens sidebar with full train detail

---

### Page 4 — Conflict Center (`/conflicts`)

**Job:** Show all active conflicts. Let the controller understand each one at a glance.

**Layout:** Filter bar + card list

**Filter bar:** All | Low | Medium | High | Critical

**Conflict Card contains:**
- Conflict type (label)
- Location (station/segment name)
- Severity badge (color-coded)
- Affected train names + priority
- Time detected
- Short description ("Train A (Rajdhani) and Train B (Goods) approaching Segment X from opposite ends")
- Button: "View Recommendation" → links to related recommendation

**Sort:** By severity (Critical first), then by time detected

---

### Page 5 — Recommendation Center (`/recommendations`)

**Job:** Show pending recommendations. Enable controller to act.

**Layout:** Tab bar (Pending / Accepted / Rejected) + card list

**Recommendation Card contains:**
- Action (bold, top: "Hold Train 12045 Rajdhani Express for 6 minutes at Gwalior")
- Affected trains (pill badges)
- Expected benefit ("Saves 14 minutes of network delay")
- Confidence score (progress bar, e.g. 87%)
- Linked conflict reference
- Expand → shows Explanation Panel

**Explanation Panel (expanded):**
```
SITUATION:    Train 12045 and Train 14034 approaching Segment GWL-JHS from opposite ends
DECISION:     Hold Train 14034 (Passenger) at Gwalior for 6 minutes
REASONING:    Train 12045 (Priority 1 — Rajdhani) carries higher operational priority.
              Delaying the Passenger service now prevents 3 downstream conflicts.
OUTCOME:      Net delay reduction: 14 minutes across the network.
CONSEQUENCE:  Train 14034 delay remains contained; clears before next crossing loop.
```

**Action Bar (Pending only):**
- [Accept Recommendation] — green button
- [Reject] — outline button
- [Override with Custom] — opens input modal

**Override Modal:**
- Text field: "Enter your reasoning"
- Action dropdown: "Hold / Proceed / Other"
- Minutes field
- Submit → records as controller override

---

### Page 6 — Simulation Control (`/simulation`)

**Job:** Run and control demonstration scenarios.

**Layout:** Left panel (scenario selector + controls) + Right panel (live network view embedded)

**Scenario Selector:**
- Basic Crossing
- Priority Conflict
- Cascade Delay
- Disruption Handling
- Controller Override Test

**Controls:**
- [Start] [Pause] [Resume] [Reset]
- Speed: 1x / 2x / 5x
- Inject: [Add Delay] [Block Track] [Trigger Conflict]
- Inject modal: select train, delay minutes, reason

**Live Panel (right):**
- Embedded NetworkCanvas (same as Network View, smaller)
- Live event log at bottom (scrolling, auto-appending)
- Conflict/Recommendation indicators pop in real-time

---

### Page 7 — Audit History (`/audit`)

**Job:** Show what happened, what was recommended, what was decided.

**Layout:** Filter bar + table

**Filters:** Date range, Controller Action (All / Accepted / Rejected / Overridden)

**Table columns:**
- Timestamp
- Recommendation (summary)
- Affected Trains
- Controller Action (badge)
- Delay Impact
- Notes

**Row expand:** Shows full explanation narrative + override notes if applicable

---

## Design System

### Visual Direction

**Concept:** Mission-critical operations dashboard. Dark-first. Data-dense but unambiguous.

**Palette:**
```
Background:     #0A0E1A   (deep navy, near-black)
Surface:        #111827   (card backgrounds)
Surface Alt:    #1C2333   (hover states, secondary panels)
Border:         #1F2D40   (subtle separators)

Primary Action: #3B82F6   (blue — decisions, CTAs)
Success:        #10B981   (green — running, accepted)
Warning:        #F59E0B   (amber — delayed, pending)
Danger:         #EF4444   (red — critical conflict)
Info:           #6366F1   (indigo — informational)

Text Primary:   #F1F5F9   (white-ish)
Text Secondary: #94A3B8   (muted slate)
Text Disabled:  #475569
```

**Typography:**
```
Display / Headers:   Inter (600-700 weight)
Body / Labels:       Inter (400-500 weight)
Monospace / IDs:     JetBrains Mono (train numbers, segment IDs, timestamps)
```

**Border Radius:**
```
Cards:       rounded-lg   (8px)
Buttons:     rounded-md   (6px)
Pills:       rounded-full
```

**Motion:**
- Subtle fade-in on card appearance (150ms)
- Pulse animation on Critical conflict badges
- Train markers animate position changes (300ms ease)
- No decorative animation — everything serves state communication

---

### shadcn/ui Components to Use

```
Card, CardHeader, CardContent, CardFooter
Badge                 → severity, status, priority
Button                → actions
Dialog                → override modal
Tabs                  → Pending/Accepted/Rejected
Table                 → audit history
Tooltip               → train hover info
Sheet                 → sidebar details
Progress              → confidence score
Separator
Skeleton              → loading states
Alert                 → system notifications
```

---

## Types (domain.ts — matches backend exactly)

```typescript
export type TrainStatus = 'RUNNING' | 'WAITING' | 'CROSSING' | 'DELAYED' | 'STOPPED' | 'COMPLETED';
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
  scheduledArrival: string; // ISO timestamp
}

export interface Conflict {
  id: string;
  type: string;
  location: string;
  trainIds: string[];
  severity: ConflictSeverity;
  createdAt: string;
  description: string;
}

export interface Recommendation {
  id: string;
  conflictId: string;
  action: string;
  actionParams: Record<string, unknown>;
  reason: string;
  expectedBenefitMinutes: number;
  confidenceScore: number; // 0–1
  createdAt: string;
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
  timestamp: string;
  notes: string | null;
}

export interface NetworkState {
  trains: Train[];
  conflicts: Conflict[];
  recommendations: Recommendation[];
  lastUpdated: string;
}
```

---

## API Calls (services/api.ts)

```typescript
// All calls go to /api/* (platform backend — never directly to engine)

export const api = {
  getDashboard:           () => GET('/api/dashboard'),
  getNetworkState:        () => GET('/api/network/state'),
  getTrains:              () => GET('/api/trains'),
  getConflicts:           () => GET('/api/conflicts'),
  getRecommendations:     () => GET('/api/recommendations'),
  getExplanation:         (recommendationId: string) => GET(`/api/recommendations/${recommendationId}/explanation`),
  getAudit:               () => GET('/api/audit'),
  submitDecision:         (id: string, action: ControllerAction, notes?: string) =>
                            POST(`/api/recommendations/${id}/decision`, { action, notes }),
  startSimulation:        (scenario: string) => POST('/api/simulation/start', { scenario }),
  pauseSimulation:        () => POST('/api/simulation/pause'),
  resetSimulation:        () => POST('/api/simulation/reset'),
  injectDelay:            (trainId: string, minutes: number) =>
                            POST('/api/simulation/inject', { type: 'DELAY', trainId, minutes }),
}
```

---

## WebSocket (services/socket.ts)

```typescript
// Connect once at app level
// Handle these incoming events:

socket.on('NETWORK_STATE_UPDATE', (state: NetworkState) => { /* update store */ });
socket.on('NEW_CONFLICT',         (conflict: Conflict) => { /* add to conflict list, toast */ });
socket.on('NEW_RECOMMENDATION',   (rec: Recommendation) => { /* add to rec list, badge update */ });
socket.on('TRAIN_POSITION_UPDATE', (update: { trainId: string; position: ...; delay: number }) => {});
socket.on('SIMULATION_STATUS',    (status: SimulationStatus) => {});
```

---

## Claude Prompts for Design Generation

Use these prompts when using Claude to help build individual pages or components:

### For Network View
```
I am building a dark-mode SVG-based railway network visualization component in React + TypeScript.
The railway section has 8–12 stations connected by track segments (mostly single-track).
Trains move between stations with direction indicators and color-coded status (green=on time, amber=delayed, red=conflict, blue=waiting).
Conflicts show as pulsing red overlays on the affected segment.
Train markers should show a tooltip on hover with: name, priority, delay, status.
Background: #0A0E1A. Use Tailwind where possible. Component: NetworkCanvas.tsx.
Data is passed as props: stations[], segments[], trains[], conflicts[].
```

### For Recommendation Card + Explanation
```
I am building a RecommendationCard React component with shadcn/ui.
Dark theme background #111827. The card shows:
- Bold action string at top (e.g. "Hold Train 12045 at Gwalior for 6 minutes")
- Affected train pill badges
- Expected benefit (e.g. "Saves 14 min of network delay")
- Confidence progress bar (0–100%)
- Expand toggle that reveals a 5-field explanation panel: Situation, Decision, Reasoning, Expected Outcome, Future Consequences
- Accept / Reject / Override buttons at bottom (Accept = blue, Reject = outline, Override = ghost)
Strict TypeScript. No inline styles — use Tailwind only.
```

### For Dashboard Stats Bar
```
I am building a StatBar React component for a railway operations dashboard.
Dark theme. 4 metric cards in a horizontal row (responsive: 2x2 on smaller screens):
- Active Trains (count, green icon)
- Active Conflicts (count, red if > 0 else grey)
- Pending Recommendations (count, amber if > 0)
- Total Network Delay in minutes (amber/red if high)
Each card: icon + big number + small label. Subtle border on danger state.
shadcn/ui Card component. Tailwind. TypeScript.
```

### For Simulation Page
```
I am building a Simulation Control page in React + TypeScript.
Split layout: left 1/3 panel (scenario selector + controls), right 2/3 panel (live network map + event log).
Left panel: 5 scenario buttons (radio-style), Start/Pause/Resume/Reset controls, speed selector (1x 2x 5x), and an "Inject Event" section with Add Delay / Block Track buttons.
Right panel: embedded NetworkCanvas (takes full remaining width), scrolling event log at bottom showing timestamped events (conflicts detected, recommendations issued, controller actions).
Dark theme. Tailwind + shadcn/ui.
```

---

## Rules

1. **Never call the engine directly.** All requests go through `/api/*`.
2. **All state from socket events must update UI immediately** — no polling lag.
3. **TypeScript strict mode.** No `any`. All API responses typed.
4. **All controller actions require confirmation** (button click → confirm → submit). No accidental accepts.
5. **Loading states on every async fetch.** Use shadcn Skeleton.
6. **Empty states are informative.** "No conflicts detected — network is clear" not a blank screen.
7. **Error states are specific.** "Could not load recommendations — engine unreachable" not "Error."
8. **The Explanation Panel must always be readable by a non-technical person.**

---

## Sync Points with Backend Team

The backend team will give you:
- Final API response shapes (match the types in `domain.ts`)
- WebSocket event payload formats
- The base URL for local dev (likely `http://localhost:3001` or Next.js same-origin)

Agree on these before building data-fetching hooks. Mock data is fine during Phase 1.