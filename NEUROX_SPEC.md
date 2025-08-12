# NeuroX Product & Engineering Specification
**Version 1.0 | Target: 6-week MVP | Team: 4 developers**

## Executive Summary
NeuroX is a consumer cognitive-health app targeting students (13+), professionals, and older adults across iOS, Android (React Native/Expo), and Web (React + TypeScript). The app is NOT a medical device and focuses on educational cognitive training with local-first privacy.

---

## 1. PRIORITIZED FEATURES

### MVP (Weeks 1-6) - Core Functionality
1. **Onboarding & Profile** - Basic account creation with local storage, age range, learning goals, baseline cognitive assessment.
2. **Cognitive Assessments** - Reaction time test, N-back memory test, spatial recall puzzle with local result storage.
3. **Progress Dashboard** - Time series cognitive score visualization, per-test breakdown, weekly summary cards.
4. **Guided Meditation** - 3-10 minute audio sessions for stress reduction with completion tracking.
5. **Simulated EEG Visualizer** - Animated brainwave patterns (alpha/beta/theta/gamma) correlated to test performance.
6. **Privacy Controls** - Local-first storage, JSON export/import, opt-in cloud sync for research participation.
7. **Basic Personalization** - Beginner/intermediate/advanced content adaptation based on performance metrics.

### V1 (Weeks 7-12) - Enhanced Experience
1. **Personalized Coaching** - Rule-based daily tips and micro-tasks based on performance patterns and user goals.
2. **Sleep Input & Estimator** - Manual sleep logging with heuristic REM/NREM estimation algorithms.
3. **Adaptive Difficulty** - Real-time test difficulty adjustment based on user accuracy and reaction times.
4. **Shareable Progress** - Generated images and summaries for social sharing or coach/teacher review.

### V2 (Weeks 13+) - Advanced Features
1. **Social Features** - Anonymous leaderboards, group challenges, progress sharing with friends.
2. **Advanced Sleep Analysis** - Machine learning sleep stage prediction using phone sensors.
3. **Biometric Integration** - Heart rate variability correlation with cognitive performance.
4. **AR/VR Training Modules** - Immersive spatial puzzles and relaxation environments.

---

## 2. MVP TECHNICAL SPECIFICATIONS

### Feature: Reaction Time Test
**Purpose**: Measure simple attention and processing speed for cognitive baseline.
**Inputs**: Single-tap responses to visual stimulus, device timestamp, orientation data.
**Algorithm**: Compute mean/median RT, variance, flag outliers (<100ms, >2000ms), percentile ranking.
**UI Mock**: Fullscreen test with instruction overlay "Tap as soon as circle turns green". Practice mode (5 trials), main test (30 trials), summary graph with percentile interpretation.
**Acceptance Criteria**:
- 30 valid trials produce report within 2 seconds
- Results saved locally with summary visualization
- Percentile comparison against simulated benchmark data
- UI latency <50ms between stimulus and timestamp capture
**Performance Constraint**: Stimulus rendering at 60fps, timestamp accuracy ±5ms.

### Feature: N-back Memory Test  
**Purpose**: Assess working memory and cognitive updating capacity.
**Inputs**: Visual/audio stimulus sequence, user match responses, configurable N-level (1-3).
**Algorithm**: Calculate accuracy percentage, false positive rate, d-prime sensitivity, mean response time.
**UI Mock**: Clear sequence display with progress indicator, configurable difficulty selector, real-time feedback.
**Acceptance Criteria**:
- Reliable sequence presentation with accurate timing
- Correct scoring computation for all N-levels
- Adaptive mode adjusts N-level based on 80%+ or <60% accuracy thresholds
- Session data persisted locally with performance trends
**Performance Constraint**: Sequence timing accuracy ±10ms, smooth animations at 30fps.

### Feature: Simulated EEG Visualizer
**Purpose**: Create educational brain rhythm visualization correlated to cognitive performance.
**Inputs**: Latest test metrics (reaction time, accuracy), sleep quality scores, meditation session data.
**Algorithm**: Linear mapping of performance metrics to simulated power values for 5 frequency bands (delta/theta/alpha/beta/gamma) with temporal smoothing.
**UI Mock**: Animated waveform canvas with labeled frequency bands, tooltip explanations, adjustable timescale (5-60s).
**Acceptance Criteria**:
- Smooth animation at 30fps minimum
- Visual correlation between test performance changes and wave patterns
- Educational tooltips explaining each frequency band
- Responsive design across mobile/tablet/desktop
**Performance Constraint**: Canvas rendering optimized for 30fps, memory usage <50MB.

### Feature: Progress Dashboard
**Purpose**: Visualize cognitive improvement trends and session summaries.
**Inputs**: Historical test results, session durations, mood logs, sleep data.
**Algorithm**: Generate time-series charts, compute weekly averages, detect improvement trends, calculate streaks.
**UI Mock**: Card-based layout with KPI tiles (cognitive score, streak, sessions), sparkline charts, weekly summary with top improvements.
**Acceptance Criteria**:
- Real-time chart updates when new data added
- Weekly/monthly view toggles
- Export functionality for progress reports
- Responsive grid layout for different screen sizes
**Performance Constraint**: Chart rendering <500ms, smooth interactions on mobile.

---

## 3. API SPECIFICATION (REST)

### Authentication
**Method**: Local-first with optional JWT for cloud sync
**Headers**: `Authorization: Bearer <jwt>` (cloud sync only)

### Core Endpoints

```typescript
// Auth Endpoints
POST /auth/register
Request: {
  email: string;
  displayName?: string;
  ageRange: "13-17" | "18-29" | "30-49" | "50-65" | "65+";
  goals: string[];
}
Response: {
  userId: string;
  token: string;
  expiresAt: string;
}

POST /auth/login
Request: {
  email: string;
  deviceId: string;
}
Response: {
  userId: string;
  token: string;
  profile: UserProfile;
}

// Test Results
POST /api/tests/reaction
Request: {
  testId: string;
  userId: string;
  device: "web" | "ios" | "android";
  trials: Array<{
    trial: number;
    stimTimeMs: number;
    respTimeMs: number;
    valid: boolean;
  }>;
  summary: {
    meanRT: number;
    medianRT: number;
    sd: number;
    outliers: number;
  };
}
Response: {
  testId: string;
  percentile: number;
  improvement: number;
  cognitiveScore: number;
}

POST /api/tests/nback
Request: {
  testId: string;
  userId: string;
  nLevel: number;
  trials: Array<{
    stimulus: string;
    response: boolean;
    correct: boolean;
    reactionTime: number;
  }>;
  summary: {
    accuracy: number;
    falsePositiveRate: number;
    dPrime: number;
    meanRT: number;
  };
}
Response: {
  testId: string;
  nextDifficulty: number;
  cognitiveScore: number;
}

// Progress & Analytics
GET /api/progress/:userId
Response: {
  cognitiveScore: number;
  weeklyTrend: number;
  totalSessions: number;
  currentStreak: number;
  recentTests: TestResult[];
  achievements: Achievement[];
}

// Sleep & Wellness
POST /api/sleep
Request: {
  userId: string;
  bedtime: string;
  waketime: string;
  quality: "poor" | "fair" | "good" | "excellent";
  interruptions: number;
  date: string;
}
Response: {
  sleepId: string;
  remPercentage: number;
  deepPercentage: number;
  insights: string[];
}

// Data Export
GET /api/export/:userId
Response: {
  userData: UserProfile;
  testResults: TestResult[];
  sleepData: SleepRecord[];
  moodLogs: MoodEntry[];
  exportedAt: string;
}
```

### Example Response Payloads

```json
// Reaction Test Result
{
  "testId": "test_987",
  "userId": "u_123",
  "device": "web",
  "createdAt": "2025-08-12T10:00:00Z",
  "trials": [
    {"trial": 1, "stimTimeMs": 163, "respTimeMs": 342, "valid": true},
    {"trial": 2, "stimTimeMs": 460, "respTimeMs": 690, "valid": true}
  ],
  "summary": {"meanRT": 386, "medianRT": 366, "sd": 45, "outliers": 0},
  "percentile": 75,
  "cognitiveScore": 82
}

// Progress Summary
{
  "cognitiveScore": 78,
  "weeklyTrend": 12,
  "totalSessions": 24,
  "currentStreak": 8,
  "recentTests": [
    {"type": "reaction", "score": 385, "date": "2025-08-12", "percentile": 75}
  ],
  "achievements": [
    {"id": "week_streak", "title": "Week Warrior", "unlockedAt": "2025-08-10"}
  ]
}
```

---

## 4. DATA MODELS & TYPESCRIPT INTERFACES

```typescript
// Core User Models
interface UserProfile {
  userId: string;
  displayName?: string;
  ageRange: "13-17" | "18-29" | "30-49" | "50-65" | "65+";
  goals: string[];
  cognitiveScore: number;
  createdAt: string;
  lastActiveAt: string;
  settings: UserSettings;
}

interface UserSettings {
  difficulty: "beginner" | "intermediate" | "advanced" | "adaptive";
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  privacyMode: "local" | "cloud_sync" | "research_participant";
  dataRetentionDays: number;
}

// Test Results
interface TestResult {
  testId: string;
  userId: string;
  testType: "reaction" | "nback" | "spatial" | "attention";
  score: number;
  percentile: number;
  difficulty: number;
  completedAt: string;
  durationMs: number;
  metadata: Record<string, any>;
}

interface ReactionTestData {
  trials: Array<{
    trial: number;
    stimulusDelay: number;
    reactionTime: number;
    valid: boolean;
  }>;
  summary: {
    meanRT: number;
    medianRT: number;
    standardDeviation: number;
    outlierCount: number;
    consistencyScore: number;
  };
}

interface NBackTestData {
  nLevel: number;
  trials: Array<{
    stimulus: string;
    expectedResponse: boolean;
    userResponse: boolean;
    correct: boolean;
    reactionTime: number;
  }>;
  summary: {
    accuracy: number;
    falsePositiveRate: number;
    dPrime: number;
    meanResponseTime: number;
  };
}

// Sleep & Wellness
interface SleepRecord {
  sleepId: string;
  userId: string;
  bedtime: string;
  waketime: string;
  totalSleepMinutes: number;
  quality: "poor" | "fair" | "good" | "excellent";
  interruptions: number;
  estimatedREM: number;
  estimatedDeep: number;
  estimatedLight: number;
  date: string;
  notes?: string;
}

interface MoodEntry {
  moodId: string;
  userId: string;
  mood: "energetic" | "happy" | "calm" | "focused" | "neutral" | "tired" | "stressed" | "anxious";
  intensity: number; // 1-10
  cognitiveScore: number;
  loggedAt: string;
  context?: string;
}

// EEG Simulation
interface EEGState {
  userId: string;
  timestamp: string;
  bandPowers: {
    delta: number;   // 0.5-4 Hz
    theta: number;   // 4-8 Hz
    alpha: number;   // 8-13 Hz
    beta: number;    // 13-30 Hz
    gamma: number;   // 30+ Hz
  };
  dominantBand: string;
  cognitiveState: "deep_sleep" | "light_sleep" | "relaxed" | "focused" | "alert" | "stressed";
  confidence: number;
}

// Progress & Analytics
interface ProgressSummary {
  userId: string;
  period: "daily" | "weekly" | "monthly";
  cognitiveScore: number;
  trend: number; // percentage change
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  bestStreak: number;
  improvements: Array<{
    testType: string;
    improvement: number;
    timeframe: string;
  }>;
  generatedAt: string;
}
```

### SQL Schema (SQLite/Postgres)

```sql
-- Users table
CREATE TABLE users (
  user_id TEXT PRIMARY KEY,
  display_name TEXT,
  age_range TEXT NOT NULL,
  goals TEXT[], -- JSON array
  cognitive_score INTEGER DEFAULT 50,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  settings JSON
);

-- Test results table
CREATE TABLE test_results (
  test_id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id),
  test_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  percentile INTEGER,
  difficulty INTEGER DEFAULT 1,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duration_ms INTEGER,
  raw_data JSON, -- Trial-by-trial data
  summary_data JSON -- Computed metrics
);

-- Sleep records table
CREATE TABLE sleep_records (
  sleep_id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id),
  bedtime TIME NOT NULL,
  waketime TIME NOT NULL,
  total_sleep_minutes INTEGER,
  quality TEXT CHECK (quality IN ('poor', 'fair', 'good', 'excellent')),
  interruptions INTEGER DEFAULT 0,
  estimated_rem INTEGER,
  estimated_deep INTEGER,
  estimated_light INTEGER,
  sleep_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mood logs table
CREATE TABLE mood_logs (
  mood_id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id),
  mood TEXT NOT NULL,
  intensity INTEGER CHECK (intensity BETWEEN 1 AND 10),
  cognitive_score INTEGER,
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  context TEXT
);

-- Progress snapshots table
CREATE TABLE progress_snapshots (
  snapshot_id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(user_id),
  period TEXT NOT NULL,
  cognitive_score INTEGER,
  trend REAL,
  total_sessions INTEGER,
  total_minutes INTEGER,
  current_streak INTEGER,
  snapshot_date DATE NOT NULL,
  data JSON -- Detailed metrics
);

-- Indexes for performance
CREATE INDEX idx_test_results_user_date ON test_results(user_id, completed_at);
CREATE INDEX idx_sleep_records_user_date ON sleep_records(user_id, sleep_date);
CREATE INDEX idx_mood_logs_user_date ON mood_logs(user_id, logged_at);
```

---

## 5. FRONTEND COMPONENT LIST (React + TypeScript)

### Core Components

```typescript
// Onboarding Components
interface OnboardingScreenProps {
  onComplete: (user: UserProfile) => void;
  initialData?: Partial<UserProfile>;
}
// Responsibilities: Collect display name, age range, goals; validate inputs; create local user profile

interface GoalSelectorProps {
  selectedGoals: string[];
  onChange: (goals: string[]) => void;
  availableGoals: string[];
}
// Responsibilities: Multi-select goal picker with visual icons; save preferences locally

// Assessment Components
interface ReactionTestScreenProps {
  onTestComplete: (result: ReactionTestData) => void;
  difficulty: number;
  practiceMode?: boolean;
}
// Responsibilities: Render stimulus, capture precise timestamps, validate trials, compute summary

interface NBackTestScreenProps {
  onTestComplete: (result: NBackTestData) => void;
  nLevel: number;
  adaptiveDifficulty: boolean;
}
// Responsibilities: Present sequence, capture responses, compute accuracy metrics, adapt difficulty

interface TestSummaryModalProps {
  testResult: TestResult;
  percentileData: number;
  onClose: () => void;
  onRetake: () => void;
}
// Responsibilities: Show performance graph, percentile interpretation, improvement suggestions

// Dashboard Components
interface DashboardProps {
  userId: string;
  progressData: ProgressSummary;
  recentTests: TestResult[];
}
// Responsibilities: Display KPI cards, sparkline charts, recent activity feed, navigation

interface CognitiveScoreGaugeProps {
  score: number;
  trend: number;
  size?: "small" | "medium" | "large";
}
// Responsibilities: Animated circular progress, trend indicator, accessibility labels

interface ProgressChartProps {
  data: Array<{date: string; score: number}>;
  timeframe: "week" | "month" | "year";
  height: number;
}
// Responsibilities: Responsive line chart, zoom/pan, data point tooltips

// Meditation Components
interface MeditationPlayerProps {
  sessionId: string;
  duration: number;
  onComplete: (completedDuration: number) => void;
  onPause: () => void;
}
// Responsibilities: Audio playback, timer display, progress tracking, background mode support

interface BreathingGuideProps {
  pattern: "4-7-8" | "box" | "custom";
  duration: number;
  onSessionEnd: () => void;
}
// Responsibilities: Visual breathing animation, pattern timing, session completion tracking

// EEG Visualization
interface EEGVisualizerProps {
  eegState: EEGState;
  animationSpeed: number;
  showBandLabels: boolean;
}
// Responsibilities: Canvas-based wave animation, real-time data updates, performance optimization

interface BrainStateIndicatorProps {
  currentState: string;
  confidence: number;
  suggestions: string[];
}
// Responsibilities: Current cognitive state display, confidence visualization, actionable tips

// Settings & Privacy
interface PrivacyControlsProps {
  currentSettings: UserSettings;
  onSettingsChange: (settings: UserSettings) => void;
}
// Responsibilities: Toggle switches, data export options, clear explanations, consent flows

interface DataExportModalProps {
  userData: any;
  onExport: (format: "json" | "csv" | "pdf") => void;
  onClose: () => void;
}
// Responsibilities: Format selection, data preview, download generation, encryption options
```

### Example UI Copy

```typescript
// Button Labels
const UI_COPY = {
  buttons: {
    startTest: "Start Quick Test",
    viewProgress: "View My Progress", 
    startMeditation: "Begin Session",
    exportData: "Export My Data",
    retakeTest: "Try Again"
  },
  
  headers: {
    testSummary: "Test Complete!",
    progressDashboard: "Your Cognitive Journey",
    privacySettings: "Data & Privacy Controls"
  },
  
  descriptions: {
    reactionTest: "Measure your attention and processing speed with a simple tap test",
    nBackTest: "Challenge your working memory by identifying repeated patterns",
    emptyState: "Take your first test to see your cognitive profile",
    progressImprovement: "Your attention score this week: 74 (up 8% from last week)"
  },
  
  tooltips: {
    cognitiveScore: "Your overall cognitive performance based on recent tests",
    percentile: "You performed better than X% of users in your age group",
    eegSimulation: "This visualization shows simulated brainwave patterns based on your performance"
  }
};
```

---

## 6. BACKEND ARCHITECTURE & STORAGE

### Architecture Overview
- **Local-First**: Primary data storage in SQLite (mobile) or IndexedDB (web)
- **Cloud Sync**: Optional Postgres + REST API for multi-device sync
- **Hybrid Model**: Core functionality works offline, cloud enhances experience

### Storage Plan

```typescript
// Local Storage (SQLite/IndexedDB)
interface LocalStorageAdapter {
  saveUser(user: UserProfile): Promise<void>;
  getUser(userId: string): Promise<UserProfile | null>;
  saveTestResult(result: TestResult): Promise<void>;
  getTestResults(userId: string, limit?: number): Promise<TestResult[]>;
  exportAllData(userId: string): Promise<ExportData>;
  clearUserData(userId: string): Promise<void>;
}

// Cloud Storage (Postgres)
interface CloudStorageAdapter {
  syncUserData(userId: string, localData: any): Promise<SyncResult>;
  uploadTestResults(results: TestResult[]): Promise<void>;
  downloadUserData(userId: string, lastSync: string): Promise<any>;
  requestDataDeletion(userId: string): Promise<void>;
}
```

### Data Encryption Plan

```typescript
// Encryption Configuration
const ENCRYPTION_CONFIG = {
  algorithms: {
    local: "AES-256-GCM", // For local data encryption
    transit: "TLS 1.3",   // For API communication
    storage: "AES-256"    // For cloud data at rest
  },
  
  keyManagement: {
    local: "Device keychain/secure storage",
    cloud: "AWS KMS / Azure Key Vault",
    export: "User-provided passphrase"
  },
  
  implementation: {
    mobile: "SQLCipher for database encryption",
    web: "Web Crypto API for sensitive data",
    server: "Database-level encryption + application-layer for PII"
  }
};
```

### Backup & Export Strategy

```typescript
interface DataExportService {
  generateExport(userId: string, format: "json" | "csv" | "pdf"): Promise<Blob>;
  validateExport(exportData: any): boolean;
  encryptExport(data: Blob, passphrase: string): Promise<Blob>;
  scheduleBackup(userId: string, frequency: "daily" | "weekly"): void;
}

// Export Data Schema
interface ExportData {
  metadata: {
    exportVersion: "1.0";
    userId: string;
    exportedAt: string;
    dataRange: { from: string; to: string };
  };
  userData: UserProfile;
  testResults: TestResult[];
  sleepRecords: SleepRecord[];
  moodLogs: MoodEntry[];
  progressSnapshots: ProgressSummary[];
  checksum: string;
}
```

---

## 7. ML/ALGORITHM SPECIFICATION

### Cognitive Score Normalization

```typescript
interface CognitiveScoreNormalizer {
  computeZScore(rawScore: number, testType: string, ageRange: string): number;
  updateBaselineStats(newResults: TestResult[]): void;
  getPercentileRank(score: number, testType: string): number;
}

// Implementation: On-device normalization using synthetic benchmarks
const BASELINE_DATA = {
  reactionTime: {
    "18-29": { mean: 340, sd: 45, n: 1000 },
    "30-49": { mean: 365, sd: 50, n: 1000 },
    "50-65": { mean: 395, sd: 60, n: 1000 }
  },
  nBack: {
    "18-29": { meanAccuracy: 0.82, sd: 0.12 },
    "30-49": { meanAccuracy: 0.78, sd: 0.14 },
    "50-65": { meanAccuracy: 0.74, sd: 0.16 }
  }
};
```

### Sleep Stage Estimation (Heuristic)

```typescript
interface SleepStageEstimator {
  estimateStages(sleepData: SleepRecord): {
    remPercentage: number;
    deepPercentage: number;
    lightPercentage: number;
    confidence: number;
  };
}

// MVP Heuristic Implementation
function estimateSleepStages(totalSleep: number, quality: string, interruptions: number) {
  let remPercent = 25; // Default REM percentage
  let deepPercent = 20; // Default deep sleep
  
  // Adjust based on total sleep duration
  if (totalSleep < 360) { // < 6 hours
    remPercent = Math.max(15, remPercent - 5);
    deepPercent = Math.max(10, deepPercent - 5);
  } else if (totalSleep > 540) { // > 9 hours
    remPercent = Math.min(30, remPercent + 3);
  }
  
  // Adjust based on quality
  const qualityMultiplier = {
    poor: 0.7, fair: 0.85, good: 1.0, excellent: 1.15
  };
  
  remPercent *= qualityMultiplier[quality];
  deepPercent *= qualityMultiplier[quality];
  
  // Account for interruptions
  if (interruptions > 2) {
    remPercent *= 0.9;
    deepPercent *= 0.8;
  }
  
  const lightPercent = 100 - remPercent - deepPercent;
  
  return {
    remPercentage: Math.round(remPercent),
    deepPercentage: Math.round(deepPercent),
    lightPercentage: Math.round(lightPercent),
    confidence: interruptions === 0 && quality === "excellent" ? 0.8 : 0.6
  };
}
```

### Personalization Engine

```typescript
interface PersonalizationEngine {
  adaptDifficulty(userId: string, testType: string, recentResults: TestResult[]): number;
  generateRecommendations(userProfile: UserProfile, progressData: ProgressSummary): string[];
  selectOptimalTraining(currentScores: Record<string, number>): string[];
}

// Simple epsilon-greedy bandit algorithm
class AdaptiveDifficultyBandit {
  private arms: number[] = [1, 2, 3]; // Difficulty levels
  private rewards: Record<number, number[]> = {};
  private epsilon = 0.1;
  
  selectDifficulty(userId: string, testType: string): number {
    if (Math.random() < this.epsilon) {
      // Explore: random difficulty
      return this.arms[Math.floor(Math.random() * this.arms.length)];
    } else {
      // Exploit: best known difficulty
      return this.getBestArm(userId, testType);
    }
  }
  
  updateReward(userId: string, testType: string, difficulty: number, engagement: number) {
    const key = `${userId}-${testType}-${difficulty}`;
    if (!this.rewards[key]) this.rewards[key] = [];
    this.rewards[key].push(engagement);
  }
  
  private getBestArm(userId: string, testType: string): number {
    let bestArm = 1;
    let bestReward = 0;
    
    for (const arm of this.arms) {
      const key = `${userId}-${testType}-${arm}`;
      const rewards = this.rewards[key] || [];
      const avgReward = rewards.length > 0 ? 
        rewards.reduce((a, b) => a + b) / rewards.length : 0;
      
      if (avgReward > bestReward) {
        bestReward = avgReward;
        bestArm = arm;
      }
    }
    
    return bestArm;
  }
}
```

### Training Datasets & Evaluation

```typescript
// Synthetic Training Data Generation
interface TrainingDataGenerator {
  generateReactionTimeData(n: number, ageRange: string): ReactionTestData[];
  generateNBackData(n: number, difficulty: number): NBackTestData[];
  addRealisticNoise(cleanData: any[]): any[];
}

// Model Evaluation Metrics
interface ModelEvaluator {
  computeAUC(predictions: number[], actuals: number[]): number;
  computeRMSE(predictions: number[], actuals: number[]): number;
  trackRetentionImprovement(baseline: number, current: number): number;
}

const EVALUATION_TARGETS = {
  sleepEstimation: {
    rmse: "< 15% of actual sleep stage percentages",
    correlation: "> 0.7 with manual sleep logs"
  },
  difficultyAdaptation: {
    engagement: "> 20% improvement over fixed difficulty",
    accuracy: "Maintain 70-80% user accuracy band"
  },
  cognitiveScoring: {
    testRetest: "> 0.8 correlation for same user",
    ageNorms: "< 10% deviation from published norms"
  }
};
```

---

## 8. SECURITY, PRIVACY & COMPLIANCE

### Privacy-First Checklist

```typescript
const PRIVACY_COMPLIANCE = {
  dataMinimization: {
    required: ["Age range (not exact DOB)", "Test performance data"],
    optional: ["Display name", "Email (cloud sync only)"],
    prohibited: ["Exact location", "Device identifiers", "Biometric data"]
  },
  
  storageDefaults: {
    primary: "Local device storage (SQLite/IndexedDB)",
    cloudSync: "Explicit opt-in with clear consent",
    analytics: "Aggregated, anonymized, opt-in only"
  },
  
  encryption: {
    atRest: "AES-256 for local databases, cloud encryption for backups",
    inTransit: "TLS 1.3 for all API communication",
    exports: "Optional user-provided passphrase encryption"
  },
  
  userRights: {
    access: "Full data export in JSON format",
    deletion: "Complete local data wipe + cloud deletion request",
    portability: "Standard export format with schema documentation"
  },
  
  consent: {
    cloudSync: "Explicit consent with clear data flow explanation",
    research: "Separate opt-in for anonymized research participation",
    analytics: "Granular consent for usage analytics and crash reporting"
  }
};
```

### Legal & Compliance Copy

```typescript
const LEGAL_COPY = {
  medicalDisclaimer: "NeuroX is not a medical device and is not intended to diagnose, treat, or cure any medical condition. Content is for educational purposes only and should not replace professional medical advice.",
  
  dataUsage: "Your data stays on your device by default. Cloud sync is optional and can be disabled at any time. We never sell your personal information.",
  
  ageAppropriate: "Designed for users 13+ with parent/guardian consent required for minors. Content is educational and scientifically-based.",
  
  accuracyLimitations: "Cognitive assessments are estimates based on simple tests and should not be considered clinical evaluations. Results may vary based on factors like device performance, environment, and user state."
};
```

### Accessibility Requirements

```typescript
const ACCESSIBILITY_STANDARDS = {
  wcag: "WCAG 2.1 AA compliance",
  features: [
    "Screen reader support with semantic HTML",
    "Keyboard navigation for all interactive elements", 
    "High contrast mode with 4.5:1 color ratios",
    "Scalable text up to 200% without horizontal scroll",
    "Alternative text for all images and charts",
    "Reduced motion options for animations"
  ],
  testing: [
    "VoiceOver (iOS), TalkBack (Android), NVDA (Windows)",
    "Keyboard-only navigation testing",
    "Color blindness simulation testing"
  ]
};
```

---

## 9. TEST PLAN

### Unit Tests (Frontend)

```typescript
// Component Tests
describe('ReactionTestScreen', () => {
  test('renders stimulus and captures accurate timestamps', () => {
    // Test implementation
  });
  
  test('computes correct summary statistics', () => {
    const mockTrials = [
      { reactionTime: 300, valid: true },
      { reactionTime: 350, valid: true },
      { reactionTime: 400, valid: true }
    ];
    expect(computeSummary(mockTrials).meanRT).toBe(350);
  });
  
  test('filters invalid trials correctly', () => {
    // Test outlier detection
  });
});

// Algorithm Tests  
describe('SleepStageEstimator', () => {
  test('estimates REM percentage within expected range', () => {
    const result = estimateSleepStages(480, 'good', 1);
    expect(result.remPercentage).toBeGreaterThan(20);
    expect(result.remPercentage).toBeLessThan(30);
  });
});
```

### Integration Tests

```typescript
describe('Full Test Flow', () => {
  test('reaction test saves results and updates progress', async () => {
    // Mock user completing reaction test
    // Verify data saved locally
    // Verify progress dashboard updates
  });
  
  test('meditation session completion updates daily summary', async () => {
    // Test meditation completion flow
    // Verify session data persisted
    // Verify daily stats updated
  });
});
```

### User Acceptance Test Cases

1. **Onboarding Flow**: New user completes registration, sets goals, takes baseline test, arrives at personalized dashboard within 5 minutes.

2. **Reaction Test Accuracy**: User completes 30-trial reaction test, results show mean RT within ±50ms of manual verification, percentile ranking displayed correctly.

3. **Data Persistence**: User closes app mid-test, reopens app, can resume or restart test with previous data intact.

4. **Meditation Completion**: User starts 5-minute meditation, pauses at 2 minutes, resumes, completes session with accurate time tracking and progress update.

5. **Privacy Controls**: User enables cloud sync, uploads data, disables sync, verifies local data remains and cloud access revoked.

6. **Export Functionality**: User exports data as JSON, file contains all expected data fields, imports successfully on different device.

7. **Adaptive Difficulty**: User performs poorly on N-back test, next session automatically reduces difficulty, user performs well, difficulty increases appropriately.

8. **Offline Functionality**: User disconnects from internet, completes tests and meditation, reconnects, data syncs properly without loss.

### Performance Benchmarks

```typescript
const PERFORMANCE_TARGETS = {
  appLaunch: "< 2 seconds cold start",
  testStart: "< 500ms from button tap to stimulus",
  chartRendering: "< 1 second for 30-day progress chart",
  dataExport: "< 5 seconds for complete user dataset",
  memoryUsage: "< 100MB peak memory on mobile devices",
  batteryImpact: "< 2% battery drain per 10-minute session"
};
```

---

## 10. DEVELOPMENT TIMELINE (6 WEEKS)

### Week 1: Foundation & Core Setup
**Frontend Developer**:
- Project setup (React Native/Expo + React web)
- Design system implementation
- Onboarding screens and navigation
- Local storage architecture

**Backend Developer**:
- API design and endpoint structure
- Database schema implementation
- Authentication system (local + JWT)
- Basic user management

**ML/Data Developer**:
- Synthetic benchmark data generation
- Statistical analysis functions (mean, percentile, z-score)
- Basic cognitive score algorithms

**Designer**:
- Finalize UI/UX wireframes
- Create design system components
- Test flow mockups and user journey mapping

### Week 2: Core Assessment Features
**Frontend**:
- Reaction time test implementation
- N-back memory test implementation  
- Test summary and results display

**Backend**:
- Test result storage and retrieval
- Progress calculation algorithms
- Data validation and sanitization

**ML/Data**:
- Reaction time analysis algorithms
- N-back scoring and accuracy computation
- Percentile ranking system

**Designer**:
- Test interface design and usability testing
- Results visualization design
- Accessibility audit and improvements

### Week 3: Progress & Visualization
**Frontend**:
- Dashboard implementation with charts
- Progress tracking and history
- Basic EEG visualization

**Backend**:
- Progress aggregation APIs
- Historical data queries optimization
- Export functionality backend

**ML/Data**:
- Sleep stage estimation heuristics
- EEG simulation mapping algorithms
- Data trend analysis

**Designer**:
- Dashboard layout optimization
- Chart design and data visualization
- Mobile responsiveness testing

### Week 4: Meditation & Wellness
**Frontend**:
- Meditation player and timer
- Breathing guide animations
- Sleep logging interface

**Backend**:
- Session tracking and completion
- Sleep data storage and analysis
- Meditation progress APIs

**ML/Data**:
- Meditation impact on cognitive scores
- Sleep quality correlation analysis
- Personalization rule engine

**Designer**:
- Meditation interface design
- Calming visual design elements
- User flow optimization

### Week 5: Privacy & Personalization
**Frontend**:
- Privacy controls and settings
- Data export/import functionality
- Adaptive difficulty implementation

**Backend**:
- Cloud sync infrastructure (optional)
- Data encryption and security
- Privacy compliance features

**ML/Data**:
- Adaptive difficulty algorithms
- Personalized recommendations
- Performance optimization

**Designer**:
- Privacy UI design
- Settings and preferences interface
- Final usability testing

### Week 6: Polish & Testing
**All Team Members**:
- Integration testing and bug fixes
- Performance optimization
- User acceptance testing
- App store preparation
- Documentation completion

### Sprint Deliverables by Week

```typescript
const SPRINT_DELIVERABLES = {
  week1: [
    "Functional app skeleton with navigation",
    "User onboarding flow complete", 
    "Local data storage working",
    "Basic API endpoints operational"
  ],
  
  week2: [
    "Reaction time and N-back tests functional",
    "Test results saved and displayed",
    "Basic scoring algorithms implemented",
    "UI components match design system"
  ],
  
  week3: [
    "Progress dashboard with charts",
    "EEG visualization working",
    "Historical data queries optimized",
    "Mobile responsive design complete"
  ],
  
  week4: [
    "Meditation sessions functional",
    "Sleep logging and analysis",
    "Session tracking accurate",
    "Wellness features integrated"
  ],
  
  week5: [
    "Privacy controls implemented",
    "Data export/import working",
    "Adaptive difficulty functional",
    "Personalization engine operational"
  ],
  
  week6: [
    "All features tested and polished",
    "Performance targets met",
    "App store ready build",
    "Documentation complete"
  ]
};
```

---

## 11. UX FLOWS & WIREFRAME DESCRIPTIONS

### Main User Flow
**Onboarding → Baseline Assessment → Dashboard → Regular Training Loop**

### Screen Descriptions for Designer

```typescript
const SCREEN_WIREFRAMES = {
  onboarding: {
    screen1: "Welcome splash with app logo, tagline 'Train Your Brain', and 'Get Started' CTA button",
    screen2: "Age range selector with large, tappable buttons (13-17, 18-29, 30-49, 50-65, 65+)",
    screen3: "Goal selection grid with icons: Memory, Focus, Stress Relief, Sleep, Learning, Work Performance",
    screen4: "Privacy explanation with toggle switches: Stay Local Only, Enable Cloud Sync, Join Research",
    screen5: "Baseline test invitation: 'Let's measure your current cognitive abilities' with test preview"
  },
  
  dashboard: {
    layout: "Top: cognitive score gauge (large, centered), Middle: 3 KPI cards (streak, sessions, improvement), Bottom: quick action buttons (Start Test, Meditate, View Progress)",
    cognitiveGauge: "Circular progress indicator, 0-100 scale, current score prominently displayed, trend arrow (+/-)",
    kpiCards: "Card design with icon, large number, descriptive label, subtle background colors",
    quickActions: "Large, colorful buttons with icons, arranged in 2x2 grid on mobile, horizontal row on tablet"
  },
  
  reactionTest: {
    instructions: "Full-screen overlay with animated demonstration, 'Tap as soon as circle turns green', practice button",
    testScreen: "Minimal interface, large circular target in center, subtle background, precise timing display hidden",
    results: "Bar chart showing trial results, summary stats (mean, best, consistency), percentile comparison, retry option"
  },
  
  nBackTest: {
    setup: "Difficulty selector (1-back, 2-back, 3-back), sequence length choice, audio/visual toggle",
    testing: "Clean stimulus display area, progress indicator, response buttons (match/no match)",
    results: "Accuracy percentage prominently shown, breakdown by trial type, difficulty recommendation"
  },
  
  meditation: {
    sessionList: "Grid of meditation cards with duration, title, difficulty level, completion checkmarks",
    player: "Large play/pause control, time remaining, breathing visual guide, background dimming",
    breathing: "Animated circle that expands/contracts, rhythm timing, instruction text, soothing colors"
  },
  
  progress: {
    overview: "Time period selector (week/month/year), main line chart, trend indicators, achievement badges",
    details: "Drill-down charts per test type, improvement streaks, personal records, sharing options",
    insights: "AI-generated insights cards, correlation discoveries, goal progress tracking"
  },
  
  settings: {
    privacy: "Clear toggle switches with explanations, data usage summary, export/delete options",
    preferences: "Notification settings, difficulty preferences, accessibility options, sound controls",
    account: "Profile editing, goal adjustments, data insights, help and feedback"
  }
};
```

### Information Architecture

```
NeuroX App Structure
├── Onboarding (First-time setup)
│   ├── Welcome & Overview
│   ├── Age & Goals Selection  
│   ├── Privacy Preferences
│   └── Baseline Assessment
├── Main Dashboard (Home screen)
│   ├── Cognitive Score Display
│   ├── Daily Summary Cards
│   ├── Quick Actions
│   └── Recent Activity
├── Assessments (Core testing)
│   ├── Reaction Time Test
│   ├── N-Back Memory Test
│   ├── Spatial Reasoning Test
│   └── Attention Training
├── Training Hub (Skill building)
│   ├── Guided Exercises
│   ├── Difficulty Levels
│   ├── Progress Tracking
│   └── Achievement System
├── Wellness (Holistic health)
│   ├── Meditation Sessions
│   ├── Sleep Logging
│   ├── Mood Tracking
│   └── Stress Management
├── Progress (Analytics)
│   ├── Performance Charts
│   ├── Trend Analysis
│   ├── Goal Tracking
│   └── Insights
├── Settings (Preferences)
│   ├── Privacy Controls
│   ├── Notifications
│   ├── Accessibility
│   └── Data Management
└── Help & Support
    ├── Getting Started Guide
    ├── FAQ
    ├── Contact Support
    └── Privacy Policy
```

---

## 12. ANALYTICS & KPI METRICS

### Engagement Metrics

```typescript
interface EngagementKPIs {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  averageSessionDuration: number; // minutes
  sessionsPerUser: number;
  retentionRates: {
    day1: number;
    day7: number;
    day14: number;
    day30: number;
  };
}

const ENGAGEMENT_TARGETS = {
  day1Retention: "> 70%",
  day7Retention: "> 40%", 
  day30Retention: "> 20%",
  averageSessionTime: "8-12 minutes",
  testsPerWeek: "> 3 per active user",
  meditationCompletion: "> 60%"
};
```

### Performance & Learning Metrics

```typescript
interface PerformanceKPIs {
  cognitiveImprovementRate: number; // % improvement over 4 weeks
  testCompletionRate: number;
  accuracyImprovements: Record<string, number>;
  personalRecordAchievements: number;
  adaptiveDifficultyEffectiveness: number;
}

const PERFORMANCE_TARGETS = {
  cognitiveImprovement: "> 15% after 4 weeks of regular use",
  testCompletion: "> 85% of started tests completed",
  accuracyGains: "> 10% improvement in primary cognitive domains",
  engagementCorrelation: "Higher cognitive gains correlate with longer retention"
};
```

### Privacy & Trust Metrics

```typescript
interface PrivacyKPIs {
  cloudSyncOptInRate: number;
  researchParticipationRate: number;
  dataExportUsage: number;
  privacySettingsEngagement: number;
  dataRetentionPreferences: Record<string, number>;
}

const PRIVACY_TARGETS = {
  cloudSyncOptIn: "20-30% of users", 
  researchOptIn: "15-25% of users",
  dataExportUsage: "> 5% of users export data",
  transparencyRating: "> 4.5/5 in user feedback"
};
```

### Business Metrics

```typescript
interface BusinessKPIs {
  userAcquisitionCost: number;
  lifetimeValue: number;
  conversionFunnels: {
    downloadToSignup: number;
    signupToFirstTest: number;
    firstTestToWeeklyUser: number;
  };
  featureAdoption: Record<string, number>;
  supportTicketVolume: number;
}

const BUSINESS_TARGETS = {
  downloadToSignup: "> 60%",
  signupToFirstTest: "> 80%",
  firstTestToWeeklyUser: "> 35%",
  supportTicketRate: "< 5% of active users per month"
};
```

### Analytics Implementation

```typescript
// Privacy-Respecting Analytics
interface AnalyticsEvent {
  eventType: string;
  timestamp: string;
  userId?: string; // Hashed/anonymous ID only
  deviceType: "ios" | "android" | "web";
  properties: Record<string, any>;
  sessionId: string;
}

const TRACKED_EVENTS = {
  userActions: [
    "test_started", "test_completed", "meditation_started", 
    "settings_changed", "data_exported", "help_accessed"
  ],
  
  performance: [
    "app_launch_time", "test_load_time", "chart_render_time",
    "memory_usage", "battery_impact"
  ],
  
  engagement: [
    "session_duration", "feature_usage", "retention_milestone",
    "achievement_unlocked", "goal_progress"
  ]
};

// User Consent for Analytics
const ANALYTICS_CONSENT = {
  essential: "Required for app functionality (crashes, errors)",
  performance: "Optional usage analytics (feature adoption, performance)",
  research: "Optional anonymized research data (cognitive score trends)"
};
```

---

## 13. RISKS, ASSUMPTIONS & REGULATORY NOTES

### Technical Risks & Mitigation

```typescript
const TECHNICAL_RISKS = {
  high: {
    timestampAccuracy: {
      risk: "Mobile device timing inconsistencies affect reaction time accuracy",
      mitigation: "Use high-resolution performance timers, calibration tests, outlier detection",
      contingency: "Fallback to relative performance tracking vs absolute milliseconds"
    },
    
    crossPlatformConsistency: {
      risk: "React Native performance differences between iOS/Android",
      mitigation: "Platform-specific optimizations, extensive device testing",
      contingency: "Platform-specific calibration factors for scoring"
    }
  },
  
  medium: {
    localStorageReliability: {
      risk: "User data loss due to app uninstall or storage corruption",
      mitigation: "Regular data validation, automatic backup prompts, cloud sync option",
      contingency: "Data recovery tools and user education about exports"
    },
    
    batteryOptimization: {
      risk: "Background processing affects device battery life",
      mitigation: "Efficient algorithms, minimal background tasks, user controls",
      contingency: "Reduced functionality mode for battery-sensitive users"
    }
  }
};
```

### Product & Business Assumptions

```typescript
const ASSUMPTIONS = {
  userBehavior: [
    "Users will complete 3-5 minute tests without major interruptions",
    "Self-reported sleep and mood data will be reasonably accurate", 
    "Users understand educational vs medical distinction",
    "Privacy-conscious users prefer local-first storage"
  ],
  
  technical: [
    "Modern mobile devices provide sufficient timing accuracy for cognitive tests",
    "React Native performance is adequate for real-time visualizations",
    "Local storage capacity (50-100MB) is acceptable for user data",
    "Internet connectivity available for initial app download and optional sync"
  ],
  
  market: [
    "Demand exists for consumer-grade cognitive training tools",
    "Users willing to spend 10-15 minutes daily on cognitive health",
    "Educational apps can succeed without medical device claims",
    "Privacy-first approach differentiates from existing solutions"
  ]
};
```

### Regulatory & Ethical Considerations

```typescript
const REGULATORY_COMPLIANCE = {
  medical: {
    status: "NOT a medical device - educational/wellness tool only",
    claims: "Avoid diagnostic, therapeutic, or medical improvement claims",
    language: "Use 'cognitive training', 'brain exercise', 'mental fitness' terminology",
    disclaimers: "Clear statements about educational purpose and limitations"
  },
  
  privacy: {
    GDPR: "Right to access, deletion, portability, consent management",
    CCPA: "California privacy rights, opt-out mechanisms, data sale prohibition", 
    COPPA: "Parental consent required for users under 13",
    PIPEDA: "Canadian privacy law compliance for data handling"
  },
  
  accessibility: {
    ADA: "Digital accessibility requirements for US users",
    AODA: "Ontario accessibility standards compliance",
    WCAG: "International web accessibility guidelines adherence"
  },
  
  appStores: {
    iOS: "Health app review guidelines, privacy nutrition labels",
    Android: "Google Play health and safety policies",
    content: "Age-appropriate content rating and parental controls"
  }
};
```

### Ethical Guidelines

```typescript
const ETHICAL_PRINCIPLES = {
  transparency: [
    "Clear explanation of how cognitive scores are calculated",
    "Honest communication about app limitations and accuracy",
    "Open documentation of algorithms and data processing",
    "Regular updates about feature changes and data usage"
  ],
  
  beneficence: [
    "Design features to genuinely benefit user cognitive health",
    "Avoid dark patterns that maximize engagement over user welfare",
    "Provide actionable insights rather than just scores",
    "Include resources for users seeking professional help"
  ],
  
  autonomy: [
    "User control over all data sharing and privacy settings",
    "Option to use app entirely offline/locally",
    "Clear consent processes without coercion",
    "Easy data deletion and account termination"
  ],
  
  justice: [
    "Accessible design for users with disabilities",
    "Avoid bias in algorithms across age, gender, cultural groups",
    "Reasonable pricing and free tier availability",
    "Support for multiple languages and cultural contexts"
  ]
};
```

### Success Criteria & Exit Conditions

```typescript
const SUCCESS_METRICS = {
  mvpSuccess: {
    technical: "App functions reliably on 95% of target devices",
    engagement: "40% of users complete onboarding and take first test",
    retention: "25% retention at 2 weeks post-download",
    performance: "Average cognitive score improvement of 10% after 2 weeks"
  },
  
  pivotTriggers: {
    lowEngagement: "< 20% weekly retention after optimization attempts",
    technicalIssues: "Critical bugs affecting > 30% of users persist after 2 weeks",
    userFeedback: "< 3.0 app store rating despite product improvements",
    privacyConcerns: "Significant user complaints about data handling"
  },
  
  scaleIndicators: {
    productMarketFit: "> 40% of users would be 'very disappointed' if app discontinued",
    organicGrowth: "> 30% of new users from referrals/word-of-mouth",
    retentionGoals: "> 35% retention at 30 days",
    revenueViability: "Clear path to sustainable monetization without compromising core value"
  }
};
```

---

## IMPLEMENTATION CHECKLIST

### Pre-Development
- [ ] Design system finalized and approved
- [ ] API contracts agreed upon by frontend/backend teams  
- [ ] Database schemas reviewed and validated
- [ ] Privacy impact assessment completed
- [ ] Accessibility requirements documented
- [ ] Testing strategy and tools selected

### Development Gates
- [ ] Week 1: Core infrastructure and onboarding functional
- [ ] Week 2: Assessment tests working with accurate scoring
- [ ] Week 3: Progress tracking and visualization complete
- [ ] Week 4: Meditation and wellness features integrated
- [ ] Week 5: Privacy controls and personalization operational
- [ ] Week 6: Full integration testing and performance optimization

### Pre-Launch
- [ ] Security audit completed
- [ ] Privacy policy and terms of service finalized
- [ ] App store assets and descriptions prepared
- [ ] User acceptance testing completed with target demographics
- [ ] Performance benchmarks met on representative devices
- [ ] Analytics and monitoring systems configured
- [ ] Customer support processes established

---

This specification provides a complete roadmap for building NeuroX as a privacy-first, educational cognitive training platform. The modular architecture supports the 6-week MVP timeline while establishing foundations for future enhancements. Each team member has clear deliverables and success criteria for effective collaboration and accountability.
