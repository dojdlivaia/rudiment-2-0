import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { UserProfile, getCalibrationAccuracy } from '../store';
import { Flame, TrendingUp, Calendar } from 'lucide-react';

interface Props {
  profile: UserProfile;
}

export default function ProgressPage({ profile }: Props) {
  // Group results by date for timeline
  const resultsByDate: Record<string, { date: string; tests: number; avgScore: number }[]> = {};
  
  profile.testResults.forEach(r => {
    const date = r.date.split('T')[0];
    if (!resultsByDate[date]) resultsByDate[date] = [];
    resultsByDate[date].push({
      date,
      tests: 1,
      avgScore: (r.score / r.maxScore) * 100,
    });
  });

  const timelineData = Object.values(resultsByDate)
    .flat()
    .sort((a, b) => a.date.localeCompare(b.date));

  const calibrationData = getCalibrationAccuracy(profile.calibrationData);

  // Bias progress over time
  const biasTimeline: Record<string, { date: string; [key: string]: any }[]> = {};
  
  const typeMap: Record<string, string> = {
    anchoring: 'anchoring',
    confirmation: 'confirmation',
    hindsight: 'hindsight',
    statistical: 'baseRate',
    planning: 'planning',
    illusion: 'perception',
  };

  profile.testResults.forEach(r => {
    const biasKey = typeMap[r.testType];
    if (!biasKey) return;
    if (!biasTimeline[biasKey]) biasTimeline[biasKey] = [];
    biasTimeline[biasKey].push({
      date: r.date.split('T')[0],
      score: Math.round((r.score / r.maxScore) * 100),
    });
  });

  const biasLabels: Record<string, string> = {
    anchoring: 'Якорь',
    confirmation: 'Подтверждение',
    hindsight: 'Ретроспектива',
    baseRate: 'Базовый шанс',
    planning: 'Планирование',
    perception: 'Восприятие',
  };

  const biasColors: Record<string, string> = {
    anchoring: '#3b82f6',
    confirmation: '#8b5cf6',
    hindsight: '#f59e0b',
    baseRate: '#ef4444',
    planning: '#6366f1',
    perception: '#06b6d4',
  };

  if (profile.testResults.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in text-center">
        <div className="py-20">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Пока нет данных</h1>
          <p className="text-stone-500 mb-6">Пройди тесты, чтобы увидеть динамику</p>
          <a href="/tests" className="inline-flex items-center gap-2 bg-raptor-600 text-white px-6 py-3 rounded-xl font-semibold">
            К тестам
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Динамика</h1>
      <p className="text-stone-500 mb-8">Твой прогресс во времени</p>

      {/* Streak */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🔥</div>
          <div>
            <div className="text-3xl font-bold text-amber-700">{profile.streak} дней</div>
            <div className="text-sm text-amber-600">Стрик — мягкий, без давления. Просто приятно.</div>
          </div>
        </div>
      </div>

      {/* Overall timeline */}
      {timelineData.length > 1 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-raptor-600" />
            <h2 className="text-lg font-semibold text-stone-800">Общая динамика</h2>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="avgScore" stroke="#22c55e" fill="#dcfce7" name="Результат %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Per-bias progress */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} className="text-raptor-600" />
          <h2 className="text-lg font-semibold text-stone-800">Прогресс по искажениям</h2>
        </div>
        <div className="space-y-4">
          {Object.entries(biasTimeline).map(([key, data]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-stone-700">{biasLabels[key]}</span>
                <span className="text-xs text-stone-500">{data.length} тестов</span>
              </div>
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <XAxis dataKey="date" hide />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip formatter={(v: number) => `${v}%`} labelFormatter={(l) => l} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={biasColors[key] || '#666'}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Результат"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calibration progress */}
      {calibrationData.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={20} className="text-amber-500" />
            <h2 className="text-lg font-semibold text-stone-800">Калибровка неделя к неделе</h2>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calibrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="confidence" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="accuracy" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Точность %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-stone-400 text-center mt-2">
            Чем ближе линия к диагонали — тем лучше калибровка
          </p>
        </div>
      )}
    </div>
  );
}
