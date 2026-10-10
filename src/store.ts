// Store for managing test results and cognitive profile
export interface TestResult {
  id: string;
  testType: string;
  date: string;
  score: number;
  maxScore: number;
  details: Record<string, any>;
}

export interface CalibrationPoint {
  confidence: number;
  correct: boolean;
  date: string;
}

export interface UserProfile {
  testResults: TestResult[];
  calibrationData: CalibrationPoint[];
  streak: number;
  lastVisit: string;
  biasScores: Record<string, number>;
}

const STORAGE_KEY = 'rudiment2_profile';

const defaultProfile: UserProfile = {
  testResults: [],
  calibrationData: [],
  streak: 0,
  lastVisit: '',
  biasScores: {
    anchoring: 0,
    confirmation: 0,
    hindsight: 0,
    baseRate: 0,
    planning: 0,
    perception: 0,
    sunkCost: 0,
    framing: 0,
    availability: 0,
    planningFallacy: 0,
  },
};

export function loadProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load profile:', e);
  }
  return { ...defaultProfile };
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export function addTestResult(profile: UserProfile, result: TestResult): UserProfile {
  const newProfile = {
    ...profile,
    testResults: [...profile.testResults, result],
    lastVisit: new Date().toISOString().split('T')[0],
  };
  // Update bias scores
  newProfile.biasScores = calculateBiasScores(newProfile);
  // Update streak
  newProfile.streak = updateStreak(profile.streak, profile.lastVisit);
  saveProfile(newProfile);
  return newProfile;
}

export function addCalibrationPoint(profile: UserProfile, point: CalibrationPoint): UserProfile {
  const newProfile = {
    ...profile,
    calibrationData: [...profile.calibrationData, point],
    lastVisit: new Date().toISOString().split('T')[0],
  };
  newProfile.streak = updateStreak(profile.streak, profile.lastVisit);
  saveProfile(newProfile);
  return newProfile;
}

function updateStreak(currentStreak: number, lastVisit: string): number {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (lastVisit === today) return currentStreak;
  if (lastVisit === yesterday) return currentStreak + 1;
  return 1;
}

function calculateBiasScores(profile: UserProfile): Record<string, number> {
  const scores: Record<string, number> = {
    anchoring: 0,
    confirmation: 0,
    hindsight: 0,
    baseRate: 0,
    planning: 0,
    perception: 0,
    sunkCost: 0,
    framing: 0,
    availability: 0,
    planningFallacy: 0,
  };

  const typeMap: Record<string, string> = {
    anchoring: 'anchoring',
    confirmation: 'confirmation',
    hindsight: 'hindsight',
    calibration: 'anchoring', // Калибровка влияет на общую точность
    statistical: 'baseRate',
    planning: 'planning',
    illusion: 'perception',
    sunkCost: 'sunkCost',
    framing: 'framing',
    availability: 'availability',
    planningFallacy: 'planningFallacy',
  };

  // Calculate average score per bias type (0-100, higher = more susceptible)
  const typeResults: Record<string, number[]> = {};
  
  profile.testResults.forEach(r => {
    const biasKey = typeMap[r.testType];
    if (biasKey) {
      if (!typeResults[biasKey]) typeResults[biasKey] = [];
      // Score is inverted: higher test score = less susceptible
      const susceptibility = 100 - (r.score / r.maxScore) * 100;
      typeResults[biasKey].push(susceptibility);
    }
  });

  Object.entries(typeResults).forEach(([key, values]) => {
    if (values.length > 0) {
      scores[key] = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    }
  });

  return scores;
}

export function getCalibrationAccuracy(data: CalibrationPoint[]): { confidence: number; accuracy: number }[] {
  // Group by confidence buckets
  const buckets: Record<number, { total: number; correct: number }> = {};
  
  data.forEach(p => {
    const bucket = Math.round(p.confidence / 10) * 10;
    if (!buckets[bucket]) buckets[bucket] = { total: 0, correct: 0 };
    buckets[bucket].total++;
    if (p.correct) buckets[bucket].correct++;
  });

  return Object.entries(buckets).map(([conf, { total, correct }]) => ({
    confidence: Number(conf),
    accuracy: Math.round((correct / total) * 100),
  }));
}
