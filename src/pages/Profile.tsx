import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { UserProfile, getCalibrationAccuracy } from '../store';
import { Award, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  profile: UserProfile;
}

const biasLabels: Record<string, string> = {
  anchoring: 'Эффект якоря',
  confirmation: 'Склонность к подтверждению',
  hindsight: 'Эффект «я так и знал!»',
  baseRate: 'Игнорирование базовой вероятности',
  planning: 'Планирование',
  perception: 'Восприятие',
  sunkCost: 'Ошибка невозвратных затрат',
  framing: 'Эффект формулировки',
  availability: 'Эффект доступности',
  planningFallacy: 'Ошибка планирования',
};

const biasDescriptions: Record<string, string> = {
  anchoring: 'Первое число, которое ты видишь, влияет на оценку. Твой раптор цепляется за якорь.',
  confirmation: 'Ты ищешь подтверждения тому, во что уже веришь. Раптор охраняет свою территорию.',
  hindsight: 'После того, как узнал результат, кажется, что предсказал бы. Раптор переписывает историю.',
  baseRate: 'Ты игнорируешь базовую статистику и веришь в детали. Раптор не любит числа.',
  planning: 'Трудно удерживать в голове несколько шагов вперёд. Кора против раптора.',
  perception: 'Мозг достраивает реальность. Раптор рисует свою картину мира.',
  sunkCost: 'Ты продолжаешь вкладывать в то, что не работает. Раптор не любит терять.',
  framing: 'Формулировка влияет на твоё решение. Раптор реагирует на слова, а не на суть.',
  availability: 'Ты оцениваешь вероятность по тому, что легко вспомнить. Раптор верит в яркое.',
  planningFallacy: 'Ты недооцениваешь время задач. Раптор слишком оптимистичен.',
};

const normData: Record<string, number> = {
  anchoring: 55,
  confirmation: 60,
  hindsight: 50,
  baseRate: 65,
  planning: 45,
  perception: 40,
};

export default function ProfilePage({ profile }: Props) {
  const radarData = Object.entries(profile.biasScores).map(([key, value]) => ({
    subject: biasLabels[key] || key,
    score: value,
    norm: normData[key] || 50,
    fullMark: 100,
  }));

  const calibrationData = getCalibrationAccuracy(profile.calibrationData);

  // Determine strengths and weaknesses
  const scored = Object.entries(profile.biasScores).filter(([, v]) => v > 0);
  const sorted = [...scored].sort((a, b) => a[1] - b[1]);
  const strengths = sorted.slice(0, 3);
  const weaknesses = sorted.slice(-3).reverse();

  const recommendations: Record<string, { title: string; exercise: string }> = {
    anchoring: {
      title: 'Эффект якоря',
      exercise: 'Перед оценкой запиши «нулевую гипотезу» — что бы ты сказал, не видя первого числа. Сравни.',
    },
    confirmation: {
      title: 'Склонность к подтверждению (Confirmation Bias)',
      exercise: 'Когда формируешь мнение, специально найди 3 аргумента ПРОТИВ. Запиши их.',
    },
    hindsight: {
      title: 'Эффект «я так и знал!» (Hindsight Bias)',
      exercise: 'Перед важным событием запиши свой прогноз. После — сравни с реальностью честно.',
    },
    baseRate: {
      title: 'Игнорирование базовой вероятности (Base Rate Fallacy)',
      exercise: 'Решая задачу, сначала спроси: «Какова базовая вероятность?» Только потом учитывай детали.',
    },
    planning: {
      title: 'Планирование',
      exercise: 'Разбивай большие задачи на подзадачи. Визуализируй зависимости между ними.',
    },
    perception: {
      title: 'Восприятие',
      exercise: 'Периодически спрашивай себя: «Что я вижу на самом деле, а что достраиваю?»',
    },
  };

  if (profile.testResults.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in text-center">
        <div className="py-20">
          <div className="text-6xl mb-4">🧠</div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Профиль пока пуст</h1>
          <p className="text-stone-500 mb-6">Пройди хотя бы пару экспериментов, чтобы увидеть свой профиль</p>
          <a href="#/tests" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold">
            К экспериментам
          </a>
        </div>
      </div>
    );
  }

  // Блокировка профиля до 4 тестов
  if (profile.testResults.length < 4) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in text-center">
        <div className="py-20">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-stone-800 mb-2">Профиль скоро откроется</h1>
          <p className="text-stone-500 mb-2">Пройди ещё {4 - profile.testResults.length} эксперимент(а)</p>
          <p className="text-stone-400 text-sm mb-6">
            Мы не хотим праймить тебя на остальные искажения. Сначала — опыт, потом — анализ.
          </p>
          <a href="#/tests" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold">
            Продолжить эксперименты
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Когнитивный профиль</h1>
      <p className="text-stone-500 mb-8">На основе {profile.testResults.length} тестов</p>

      {/* Radar chart */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Радар искажений</h2>
        <div className="h-72 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e7e5e4" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#57534e' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Норма" dataKey="norm" stroke="#d6d3d1" fill="#d6d3d1" fillOpacity={0.2} />
              <Radar name="Ты" dataKey="score" stroke="#16a34a" fill="#22c55e" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-stone-400 text-center mt-2">
          Выше значение → больше подверженность искажению. Серая зона — средняя норма.
        </p>
      </div>

      {/* Calibration */}
      {calibrationData.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-stone-800 mb-2">Калибровка уверенности</h2>
          <p className="text-sm text-stone-500 mb-4">
            Насколько точно твоя уверенность соответствует реальности?
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calibrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis 
                  dataKey="confidence" 
                  tick={{ fontSize: 12 }} 
                  label={{ value: 'Уверенность в ответе (%)', position: 'bottom', offset: 0, fontSize: 11 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  label={{ value: 'Правильных ответов (%)', angle: -90, position: 'insideLeft', fontSize: 11 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Правильных ответов']}
                  labelFormatter={(label) => `Уверенность: ${label}%`}
                />
                <Bar dataKey="accuracy" fill="#22c55e" radius={[4, 4, 0, 0]} name="Точность" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-3 bg-stone-50 rounded-lg">
            <p className="text-xs text-stone-600">
              <strong>Как читать график:</strong> Каждый столбец показывает группу вопросов, 
              где ты был уверен на определённый процент (например, 50% — средняя уверенность). 
              Высота столбца — сколько из этих ответов оказались правильными.
            </p>
            <p className="text-xs text-stone-600 mt-2">
              <strong>Идеальная калибровка:</strong> Если ты был уверен на 70%, то 70% ответов должны быть правильными. 
              Столбцы должны следовать диагонали снизу-слева вверх-вправо.
            </p>
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 rounded-2xl border border-green-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award size={20} className="text-green-600" />
            <h3 className="font-semibold text-green-800">Сильные стороны</h3>
          </div>
          {strengths.length > 0 ? (
            <ul className="space-y-3">
              {strengths.map(([key, val]) => (
                <li key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-green-700">{biasLabels[key]}</span>
                    <span className="text-sm font-medium text-green-600">{val}/100</span>
                  </div>
                  <p className="text-xs text-green-600 italic">{biasDescriptions[key]}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-600">Пройди больше тестов</p>
          )}
        </div>

        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={20} className="text-amber-600" />
            <h3 className="font-semibold text-amber-800">Зоны роста</h3>
          </div>
          {weaknesses.length > 0 ? (
            <ul className="space-y-3">
              {weaknesses.map(([key, val]) => (
                <li key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-amber-700">{biasLabels[key]}</span>
                    <span className="text-sm font-medium text-amber-600">{val}/100</span>
                  </div>
                  <p className="text-xs text-amber-600 italic">{biasDescriptions[key]}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-amber-600">Пройди больше тестов</p>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {weaknesses.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={20} className="text-green-600" />
            <h2 className="text-lg font-semibold text-stone-800">Рекомендации</h2>
          </div>
          <div className="space-y-4">
            {weaknesses.slice(0, 3).map(([key]) => {
              const rec = recommendations[key];
              if (!rec) return null;
              return (
                <div key={key} className="bg-stone-50 rounded-xl p-4 border border-stone-100">
                  <h4 className="font-medium text-stone-800 mb-1">{rec.title}</h4>
                  <p className="text-sm text-stone-600">{rec.exercise}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
