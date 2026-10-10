import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserProfile, addCalibrationPoint } from '../store';
import { ArrowLeft, Info } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

const questions = [
  { q: 'Столица Австралии?', options: ['Сидней', 'Мельбурн', 'Канберра', 'Брисбен'], correct: 2 },
  { q: 'Сколько костей в теле взрослого человека?', options: ['186', '206', '226', '256'], correct: 1 },
  { q: 'В каком году пала Берлинская стена?', options: ['1987', '1989', '1991', '1985'], correct: 1 },
  { q: 'Какая планета самая большая в Солнечной системе?', options: ['Сатурн', 'Нептун', 'Юпитер', 'Уран'], correct: 2 },
  { q: 'Кто написал «Войну и мир»?', options: ['Достоевский', 'Чехов', 'Толстой', 'Тургенев'], correct: 2 },
  { q: 'Какой элемент имеет атомный номер 79?', options: ['Серебро', 'Золото', 'Платина', 'Медь'], correct: 1 },
  { q: 'Сколько хромосом у человека?', options: ['23', '44', '46', '48'], correct: 2 },
  { q: 'Какой океан самый глубокий?', options: ['Атлантический', 'Индийский', 'Тихий', 'Северный Ледовитый'], correct: 2 },
];

export default function CalibrationTest({ profile, setProfile }: Props) {
  const [step, setStep] = useState(0);
  const [confidence, setConfidence] = useState(50);
  const [answers, setAnswers] = useState<{ selected: number; confidence: number; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  const currentQ = questions[step];

  const handleAnswer = (selected: number) => {
    const correct = selected === currentQ.correct;
    const newAnswers = [...answers, { selected, confidence, correct }];
    setAnswers(newAnswers);

    const point = {
      confidence,
      correct,
      date: new Date().toISOString().split('T')[0],
    };
    setProfile(addCalibrationPoint(profile, point));

    if (step === questions.length - 1) {
      setFinished(true);
    } else {
      setStep(step + 1);
      setConfidence(50);
    }
  };

  if (finished) {
    const correctCount = answers.filter(a => a.correct).length;
    const avgConfidence = Math.round(answers.reduce((a, b) => a + b.confidence, 0) / answers.length);
    const accuracy = Math.round((correctCount / answers.length) * 100);
    const calibrationGap = avgConfidence - accuracy;

    const chartData = answers.map((a, i) => ({
      question: `Q${i + 1}`,
      confidence: a.confidence,
      correct: a.correct ? 100 : 0,
    }));

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Результат: Калибровка</h1>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
            <div className="text-2xl font-bold text-stone-800">{correctCount}/{questions.length}</div>
            <div className="text-xs text-stone-500 mt-1">Правильных</div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
            <div className="text-2xl font-bold text-stone-800">{avgConfidence}%</div>
            <div className="text-xs text-stone-500 mt-1">Ср. уверенность</div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
            <div className={`text-2xl font-bold ${Math.abs(calibrationGap) < 15 ? 'text-green-600' : 'text-amber-600'}`}>
              {calibrationGap > 0 ? '+' : ''}{calibrationGap}%
            </div>
            <div className="text-xs text-stone-500 mt-1">Калибровка</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <h3 className="font-semibold text-stone-800 mb-4">Уверенность vs Результат</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="question" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="confidence" stroke="#f59e0b" strokeWidth={2} name="Уверенность %" />
                <Line type="monotone" dataKey="correct" stroke="#22c55e" strokeWidth={2} name="Правильно" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl border border-green-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Что это значит</h3>
              <p className="text-sm text-green-700 mb-2">
                {calibrationGap > 15 && 'Ты склонен к сверхуверенности. Уверенность выше, чем реальная точность. Это типично для экспертов в знакомых областях.'}
                {calibrationGap < -15 && 'Ты склонен к неуверенности. Твоя точность выше, чем ты думаешь. Это бывает у людей с синдромом самозванца.'}
                {Math.abs(calibrationGap) <= 15 && 'Отличная калибровка! Твоя уверенность примерно соответствует реальности. Это редкий и ценный навык.'}
              </p>
              <p className="text-sm text-green-700">
                <strong>Совет:</strong> Калибровка — тренируемый навык. После каждого решения 
                спрашивай: «Насколько я уверен?» и потом проверяй. Со временем мозг учится точнее оценивать себя.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/tests" className="flex-1 text-center bg-stone-100 text-stone-700 px-4 py-3 rounded-xl font-medium">
            К тестам
          </Link>
          <Link to="/profile" className="flex-1 text-center bg-green-600 text-white px-4 py-3 rounded-xl font-medium">
            Мой профиль
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <Link to="/tests" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 mb-6">
        <ArrowLeft size={16} /> Назад к тестам
      </Link>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-800">Калибровка уверенности</h1>
        <span className="text-sm text-stone-500">{step + 1} / {questions.length}</span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-green-500 h-2 rounded-full transition-all"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <p className="text-lg font-medium text-stone-800 mb-6">{currentQ.q}</p>
        
        <div className="space-y-2 mb-6">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-green-300 hover:bg-green-50 
                         text-stone-700 transition-all"
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="border-t border-stone-200 pt-4">
          <p className="text-sm text-stone-500 mb-2">Насколько ты уверен? (не влияя на выбор ответа)</p>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={e => setConfidence(Number(e.target.value))}
              className="flex-1 accent-green-500"
            />
            <span className="text-lg font-bold text-stone-700 w-12 text-right">{confidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
