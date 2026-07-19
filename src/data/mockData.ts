import type {
  Train,
  Conflict,
  Recommendation,
  Explanation,
  AuditRecord,
  Station,
  TrackSegment,
  SystemEvent,
  NetworkState,
  DashboardStats,
} from '@/types/domain'

// ─── Stations ────────────────────────────────────────────────────────────────
export const STATIONS: Station[] = [
  { id: 'NDLS', name: 'New Delhi', code: 'NDLS', x: 120, y: 80, type: 'MAJOR' },
  { id: 'MTJ',  name: 'Mathura Junction', code: 'MTJ', x: 230, y: 160, type: 'JUNCTION' },
  { id: 'AGC',  name: 'Agra Cantt', code: 'AGC', x: 310, y: 190, type: 'MAJOR' },
  { id: 'GWL',  name: 'Gwalior', code: 'GWL', x: 420, y: 220, type: 'JUNCTION' },
  { id: 'JHS',  name: 'Jhansi', code: 'JHS', x: 520, y: 250, type: 'JUNCTION' },
  { id: 'BPL',  name: 'Bhopal', code: 'BPL', x: 620, y: 340, type: 'MAJOR' },
  { id: 'ETW',  name: 'Etawah', code: 'ETW', x: 280, y: 130, type: 'CROSSING_LOOP' },
  { id: 'DHO',  name: 'Dholpur', code: 'DHO', x: 370, y: 200, type: 'MINOR' },
]

// ─── Segments ─────────────────────────────────────────────────────────────────
export const SEGMENTS: TrackSegment[] = [
  { id: 'NDLS-MTJ', sourceStationId: 'NDLS', destStationId: 'MTJ', lengthKm: 141, isSingleTrack: false },
  { id: 'MTJ-AGC',  sourceStationId: 'MTJ',  destStationId: 'AGC', lengthKm: 56,  isSingleTrack: false },
  { id: 'AGC-GWL',  sourceStationId: 'AGC',  destStationId: 'GWL', lengthKm: 119, isSingleTrack: true },
  { id: 'GWL-JHS',  sourceStationId: 'GWL',  destStationId: 'JHS', lengthKm: 103, isSingleTrack: true },
  { id: 'JHS-BPL',  sourceStationId: 'JHS',  destStationId: 'BPL', lengthKm: 313, isSingleTrack: false },
  { id: 'NDLS-ETW', sourceStationId: 'NDLS', destStationId: 'ETW', lengthKm: 233, isSingleTrack: false },
  { id: 'ETW-MTJ',  sourceStationId: 'ETW',  destStationId: 'MTJ', lengthKm: 67,  isSingleTrack: true },
  { id: 'AGC-DHO',  sourceStationId: 'AGC',  destStationId: 'DHO', lengthKm: 55,  isSingleTrack: true },
  { id: 'DHO-GWL',  sourceStationId: 'DHO',  destStationId: 'GWL', lengthKm: 64,  isSingleTrack: true },
]

// ─── Trains ───────────────────────────────────────────────────────────────────
export const TRAINS: Train[] = [
  {
    id: 'T-12045', name: 'Rajdhani Express', number: '12045',
    priority: 1, direction: 'DOWN', status: 'DELAYED',
    currentStationId: null, currentSegmentId: 'GWL-JHS', segmentProgress: 0.42,
    delayMinutes: 14, scheduledArrival: '2026-07-16T14:15:00Z',
    scheduledDeparture: '2026-07-16T06:00:00Z', actualDeparture: '2026-07-16T06:02:00Z',
    speedKmh: 124, serviceId: 'RD-44591-BPL', origin: 'New Delhi (NDLS)', destination: 'Bhopal (BPL)',
  },
  {
    id: 'T-14034', name: 'Intercity Express', number: '14034',
    priority: 2, direction: 'UP', status: 'RUNNING',
    currentStationId: null, currentSegmentId: 'GWL-JHS', segmentProgress: 0.71,
    delayMinutes: 0, scheduledArrival: '2026-07-16T15:30:00Z',
    scheduledDeparture: '2026-07-16T08:00:00Z', actualDeparture: '2026-07-16T08:00:00Z',
    speedKmh: 98, serviceId: 'IC-22108-NDLS', origin: 'Bhopal (BPL)', destination: 'New Delhi (NDLS)',
  },
  {
    id: 'T-58801', name: 'Goods Express', number: '58801',
    priority: 4, direction: 'DOWN', status: 'WAITING',
    currentStationId: 'GWL', currentSegmentId: null, segmentProgress: 0,
    delayMinutes: 42, scheduledArrival: '2026-07-16T12:00:00Z',
    scheduledDeparture: '2026-07-16T04:00:00Z', actualDeparture: '2026-07-16T04:00:00Z',
    speedKmh: 0, serviceId: 'GD-58801-BPL', origin: 'New Delhi (NDLS)', destination: 'Bhopal (BPL)',
  },
  {
    id: 'T-22108', name: 'Shatabdi Express', number: '22108',
    priority: 1, direction: 'UP', status: 'RUNNING',
    currentStationId: null, currentSegmentId: 'NDLS-MTJ', segmentProgress: 0.6,
    delayMinutes: 0, scheduledArrival: '2026-07-16T18:00:00Z',
    scheduledDeparture: '2026-07-16T09:00:00Z', actualDeparture: '2026-07-16T09:00:00Z',
    speedKmh: 130, serviceId: 'SH-22108-MTJ', origin: 'Bhopal (BPL)', destination: 'New Delhi (NDLS)',
  },
  {
    id: 'T-11077', name: 'Jhelum Express', number: '11077',
    priority: 3, direction: 'DOWN', status: 'RUNNING',
    currentStationId: null, currentSegmentId: 'MTJ-AGC', segmentProgress: 0.3,
    delayMinutes: 5, scheduledArrival: '2026-07-16T16:00:00Z',
    scheduledDeparture: '2026-07-16T07:30:00Z', actualDeparture: '2026-07-16T07:35:00Z',
    speedKmh: 87, serviceId: 'JH-11077-AGC', origin: 'New Delhi (NDLS)', destination: 'Gwalior (GWL)',
  },
]

// ─── Conflicts ────────────────────────────────────────────────────────────────
export const CONFLICTS: Conflict[] = [
  {
    id: 'CF-001', type: 'HEAD-ON COLLISION',
    location: 'Segment GWL-JHS', segmentId: 'GWL-JHS', stationId: null,
    trainIds: ['T-12045', 'T-14034'], severity: 'CRITICAL',
    createdAt: new Date(Date.now() - 12 * 60000).toISOString(),
    description: 'Train 12045 Rajdhani and Train 14034 Intercity approaching Segment GWL-JHS from opposite ends.',
    tMinusMinutes: 12, headOnProbability: 0.82,
  },
  {
    id: 'CF-002', type: 'BUFFER OVERFLOW RISK',
    location: 'Sector 04-B / Yard Junction', segmentId: null, stationId: 'GWL',
    trainIds: ['T-58801'], severity: 'HIGH',
    createdAt: new Date(Date.now() - 28 * 60000).toISOString(),
    description: 'Train 22108 expected to wait >45 mins at Yard Junction. Capacity at 98%.',
    tMinusMinutes: 24,
  },
  {
    id: 'CF-003', type: 'SIGNALING SYNC ERROR',
    location: 'Route 40-Alpha', segmentId: 'AGC-DHO', stationId: null,
    trainIds: ['T-11077'], severity: 'MEDIUM',
    createdAt: new Date(Date.now() - 65 * 60000).toISOString(),
    description: 'Signaling synchronization failure detected. Sync probability at 65%.',
    tMinusMinutes: 45,
  },
  {
    id: 'CF-004', type: 'MINOR LATENCY SPIKE',
    location: 'System Config', segmentId: null, stationId: null,
    trainIds: [], severity: 'LOW',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    description: 'System monitored auto-correction in progress.',
    tMinusMinutes: 90,
  },
]

// ─── Recommendations ──────────────────────────────────────────────────────────
export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'REC-001', conflictId: 'CF-001',
    action: 'Hold Train 14034 Intercity at Gwalior for 6 minutes',
    actionParams: { trainId: 'T-14034', stationId: 'GWL', holdMinutes: 6 },
    reason: 'Route Divergence X-9: Switch Freight-A to Side Track 2 to reduce delay by 14m.',
    expectedBenefitMinutes: 14, confidenceScore: 0.91,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    status: 'PENDING',
  },
  {
    id: 'REC-002', conflictId: 'CF-002',
    action: 'Throttle Train 22108 to 0.8x speed through Zone 4',
    actionParams: { trainId: 'T-22108', speedFactor: 0.8, zone: '4' },
    reason: 'Throttle Limit 0.8x: Adjust speed on Zone 4 to align with terminal arrival window.',
    expectedBenefitMinutes: 8, confidenceScore: 0.77,
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    status: 'PENDING',
  },
  {
    id: 'REC-003', conflictId: 'CF-003',
    action: 'Stage departure of EV-Trains to stabilise grid at 15:00',
    actionParams: { type: 'PEAK_POWER', time: '15:00' },
    reason: 'Peak Power Load Balancer: Stage departure of EV-Trains to stabilize grid at 15:00.',
    expectedBenefitMinutes: 5, confidenceScore: 0.65,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    status: 'PENDING',
  },
]

// ─── Explanations ─────────────────────────────────────────────────────────────
export const EXPLANATIONS: Record<string, Explanation> = {
  'REC-001': {
    id: 'EXP-001', recommendationId: 'REC-001',
    situation: 'Train 12045 (Rajdhani) and Train 14034 (Intercity) are approaching Segment GWL-JHS from opposite ends at combined closure speed of 222 km/h.',
    decision: 'Hold Train 14034 (Intercity Express) at Gwalior station for 6 minutes until Train 12045 clears the segment.',
    reasoning: 'Train 12045 (Priority 1 — Rajdhani Express) carries higher operational priority. Holding the lower-priority Intercity for 6 minutes prevents a head-on conflict with 82% probability. Delaying Passenger service now prevents 3 downstream conflicts.',
    expectedOutcome: 'Net delay reduction: 14 minutes across the network. Train 12045 clears GWL-JHS unimpeded and arrives at Bhopal within 2 minutes of schedule.',
    futureConsequences: 'Train 14034 delay remains contained at 6 minutes and clears before the next crossing loop at Jhansi. No cascading delays expected on the Bhopal corridor.',
  },
}

// ─── Audit Records ────────────────────────────────────────────────────────────
export const AUDIT_RECORDS: AuditRecord[] = [
  {
    id: 'AUD-001', recommendationId: 'REC-003',
    recommendation: 'Divert Freight-X to bypass central corridor',
    affectedTrains: ['T-58801'],
    controllerAction: 'ACCEPTED', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    delayImpact: '-18 min', notes: null,
  },
  {
    id: 'AUD-002', recommendationId: 'REC-004',
    recommendation: 'Hold Train 11077 at Agra for 4 minutes',
    affectedTrains: ['T-11077'],
    controllerAction: 'OVERRIDDEN', timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    delayImpact: '+3 min', notes: 'Controller decided to proceed — platform clear sooner than predicted.',
  },
]

// ─── System Events ────────────────────────────────────────────────────────────
export const INITIAL_EVENTS: SystemEvent[] = [
  { id: 'EV-15', timestamp: new Date(Date.now() - 30 * 60000).toISOString(), level: 'INFO', message: 'System boot sequence completed.' },
  { id: 'EV-14', timestamp: new Date(Date.now() - 28 * 60000).toISOString(), level: 'INFO', message: 'Core optimization core_worker_00 online.' },
  { id: 'EV-13', timestamp: new Date(Date.now() - 26 * 60000).toISOString(), level: 'INFO', message: 'Establishing secure bridge tunnels...' },
  { id: 'EV-12', timestamp: new Date(Date.now() - 24 * 60000).toISOString(), level: 'INFO', message: 'Security protocol TLS 1.3 active.' },
  { id: 'EV-11', timestamp: new Date(Date.now() - 22 * 60000).toISOString(), level: 'INFO', message: 'Memory allocation limits verified (8.0 GB).' },
  { id: 'EV-10', timestamp: new Date(Date.now() - 20 * 60000).toISOString(), level: 'INFO', message: 'Garbage collector initialized (340ms target).' },
  { id: 'EV-9',  timestamp: new Date(Date.now() - 18 * 60000).toISOString(), level: 'WARN', message: 'Platform overlap at Terminal A3. Inbound schedule mismatch at Bay 12.' },
  { id: 'EV-8',  timestamp: new Date(Date.now() - 16 * 60000).toISOString(), level: 'INFO', message: 'Maintenance crew cleared Sector 12. Normal operation resumed.' },
  { id: 'EV-7',  timestamp: new Date(Date.now() - 14 * 60000).toISOString(), level: 'INFO', message: 'System health check complete. Latency 4ms.' },
  { id: 'EV-6',  timestamp: new Date(Date.now() - 12 * 60000).toISOString(), level: 'RECO', message: 'New recommendation: Divert freight-X to bypass central corridor.' },
  { id: 'EV-5',  timestamp: new Date(Date.now() - 10 * 60000).toISOString(), level: 'WARN', message: 'CONFLICT detected at Node 11-Gamma. Train 882 & 109.' },
  { id: 'EV-4',  timestamp: new Date(Date.now() - 8 * 60000).toISOString(),  level: 'INFO', message: 'SWITCH_092 engaged. Route 4A-North secured.' },
  { id: 'EV-3',  timestamp: new Date(Date.now() - 6 * 60000).toISOString(),  level: 'INFO', message: 'Handshake established with external gateway.' },
  { id: 'EV-2',  timestamp: new Date(Date.now() - 4 * 60000).toISOString(),  level: 'WARN', message: 'Latency spike detected on node_cluster_B. Retrying...' },
  { id: 'EV-1',  timestamp: new Date(Date.now() - 2 * 60000).toISOString(),  level: 'INFO', message: 'node_cluster_B stabilized. Current RTT: 15ms.' },
]

// ─── Network State snapshot ───────────────────────────────────────────────────
export const MOCK_NETWORK_STATE: NetworkState = {
  trains: TRAINS,
  conflicts: CONFLICTS,
  recommendations: RECOMMENDATIONS,
  events: INITIAL_EVENTS,
  lastUpdated: new Date().toISOString(),
  activeTrains: 1284,
  networkDelayMinutes: 42,
  safetyIndex: 99.982,
  networkLoadGbps: 42.8,
}

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  activeTrains: 1284,
  activeConflicts: 4,
  pendingRecommendations: 8,
  totalDelayMinutes: 42,
  networkDelayTrend: 'UP',
}
