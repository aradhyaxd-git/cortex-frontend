export type TrainStatus = 'RUNNING' | 'WAITING' | 'CROSSING' | 'DELAYED' | 'STOPPED' | 'COMPLETED';
export type ConflictSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ControllerAction = 'ACCEPTED' | 'REJECTED' | 'OVERRIDDEN' | 'IGNORED';
export type SimulationStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';

export interface Station {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
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
  segmentProgress: number; // 0–1
  delayMinutes: number;
  scheduledArrival: string;
  scheduledDeparture: string;
  actualDeparture: string | null;
  speedKmh: number;
  serviceId: string;
  origin: string;
  destination: string;
}

export interface Conflict {
  id: string;
  type: string;
  location: string;
  segmentId: string | null;
  stationId: string | null;
  trainIds: string[];
  severity: ConflictSeverity;
  createdAt: string;
  description: string;
  tMinusMinutes: number;
  headOnProbability?: number;
}

export interface Recommendation {
  id: string;
  conflictId: string;
  action: string;
  actionParams: Record<string, unknown>;
  reason: string;
  expectedBenefitMinutes: number;
  confidenceScore: number;
  createdAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'OVERRIDDEN';
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
  recommendation: string;
  affectedTrains: string[];
  controllerAction: ControllerAction;
  timestamp: string;
  delayImpact: string;
  notes: string | null;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'RECO' | 'ERROR';
  message: string;
}

export interface NetworkState {
  trains: Train[];
  conflicts: Conflict[];
  recommendations: Recommendation[];
  events: SystemEvent[];
  lastUpdated: string;
  activeTrains: number;
  networkDelayMinutes: number;
  safetyIndex: number;
  networkLoadGbps: number;
}

export interface DashboardStats {
  activeTrains: number;
  activeConflicts: number;
  pendingRecommendations: number;
  totalDelayMinutes: number;
  networkDelayTrend: 'UP' | 'DOWN' | 'STABLE';
}
