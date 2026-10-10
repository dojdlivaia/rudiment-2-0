import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, addTestResult } from '../store';
import { ArrowLeft, Info } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

const scenarios = [
  {
    id: 1,
    event: 'Компания А выпустила новый смартфон',
    outcome: 'Смартфон провалился на рынке — продажи на 70% ниже прогноза',
    question: 'Насколько предсказуемым тебе кажется этот результат СЕЙЧАС?',
    scale: '1 = полная неожиданность, 7 = совершенно очевидно',
  },
  {
    id: 2,
    event: 'Сборная Б вышла в финал чемпионата',
    outcome: 'Сборная Б проиграла финал со счётом 1:4',
    question: 'Насколько предсказуемым тебе кажется этот результат СЕЙЧАС?',
    scale: '1 = полная неожиданность, 7 = совершенно очевидно',
  },
  {
    id: 3,
    event: 'Стартап В получил инвестиции $10M',
    outcome: 'Через год стартап В закрылся',
    question: 'Насколько предсказуемым тебе кажется этот результат СЕЙЧАС?',
    scale: '1 = полная неожиданность, 7 = совершенно очевидно',
  },
  {
    id: 4,
    event: 'Учёные объявили о новой вакцине',
    outcome: 'Вакцина показала эффективность 95%',
    question: 'Насколько предсказуемым тебе кажется этот результат СЕЙЧАС?',
    scale: '1 = полная неожиданность, 7 = совершенно очевидно',
  },
];

export default function HindsightTest({ profile, setProfile }: Props) {
  const [step, setStep] = useState(0);
  const [ratings, setRatings] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const currentScenario = scenarios[step];

  const handleRate = (rating: number) => {
    const newRatings = [...ratings, rating];
    setRatings(newRatings);

    if (step === scenarios.length - 1) {
      setFinished(true);
      // Hindsight bias: average rating > 4 indicates bias
      // Lower average = less biased (recognizing unpredictability)
      const avg = newRatings.reduce((a, b) => a + b, 0) / newRatings.length;
      const biasScore = Math.min(100, Math.max(0, (avg - 1) / 6 * 100));
      const score = Math.round((1 - biasScore / 100) * scenarios.length);
      
      const result = {
        id: Date.now().toString(),
        testType: 'hindsight',
        date: new Date().toISOString(),
        score,
        maxScore: scenarios.length,
        details: { ratings: newRatings, average: avg },
      };
      setProfile(addTestResult(profile, result));
    } else {
      setStep(step + 1);
    }
  };

  if (finished) {
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const biasLevel = avg > 5 ? 'высокий' : avg > 3.5 ? 'умеренный' : 'низкий';
    
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Результат: Hindsight Bias</h1>
        
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-stone-800">{avg.toFixed(1)}</div>
            <p className="text-stone-500 mt-1">средняя «предсказуемость» (из 7)</p>
            <p className={`text-sm mt-2 font-medium ${avg > 5 ? 'text-red-500' : avg > 3.5 ? 'text-amber-500' : 'text-raptor-600'}`}>
              Уровень hindsight bias: {biasLevel}
            </p>
          </div>
          
          <div className="space-y-3">
            {scenarios.map((s, i) => (
              <div key={i} className="p-3 bg-stone-50 rounded-xl">
                <p className="text-sm text-stone-600">{s.event}</p>
                <p className="text-sm text-stone-800 font-medium mt-1">→ {s.outcome}</p>
                <p className="text-xs text-stone-500 mt-1">Твоя оценка предсказуемости: {ratings[i]}/7</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Как это работает</h3>
              <p className="text-sm text-amber-700 mb-2">
                Hindsight bias — «я так и знал!» После того как мы узнали результат, 
                наш мозг перестраивает память, делая событие более «предсказуемым», 
                чем оно было на самом деле.
              </p>
              <p className="text-sm text-amber-700 mb-2">
                Это опасно, потому что создаёт иллюзию понимания мира. Если всё «очевидно» 
                задним числом, мы перестаём учиться на ошибках.
              </p>
              <p className="text-sm text-amber-700">
                <strong>Совет:</strong> Перед важными событиями записывай свои прогнозы. 
                Потом сравнивай с реальностью. Это единственный способ увидеть hindsight bias в действии.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/tests" className="flex-1 text-center bg-stone-100 text-stone-700 px-4 py-3 rounded-xl font-medium">
            К тестам
          </Link>
          <Link to="/profile" className="flex-1 text-center bg-raptor-600 text-white px-4 py-3 rounded-xl font-medium">
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
        <h1 className="text-xl font-bold text-stone-800">Hindsight Bias</h1>
        <span className="text-sm text-stone-500">{step + 1} / {scenarios.length}</span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-amber-500 h-2 rounded-full transition-all"
          style={{ width: `${((step + 1) / scenarios.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="mb-4">
          <p className="text-sm text-stone-500 mb-1">Событие:</p>
          <p className="text-lg font-medium text-stone-800">{currentScenario.event}</p>
        </div>
        
        <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-sm text-amber-600 mb-1">Результат:</p>
          <p className="text-stone-800 font-medium">{currentScenario.outcome}</p>
        </div>

        <p className="text-stone-700 mb-2">{currentScenario.question}</p>
        <p className="text-xs text-stone-400 mb-4">{currentScenario.scale}</p>

        <div className="grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map(n => (
            <button
              key={n}
              onClick={() => handleRate(n)}
              className="aspect-square rounded-xl border-2 border-stone-200 hover:border-amber-400 hover:bg-amber-50 
                         flex items-center justify-center font-bold text-stone-700 transition-all"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
