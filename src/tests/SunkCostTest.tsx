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
    title: 'Концерт',
    text: 'Ты купил билет на концерт за 5000 рублей. В день концерта началась сильная метель, дороги закрыты. Добираться 3 часа в опасных условиях. Пойдёшь на концерт?',
    options: [
      'Пойду — деньги уже потрачены',
      'Останусь дома — безопасность важнее',
    ],
    correct: 1,
    explanation: 'Правильный ответ — «останусь дома». Деньги уже потрачены и не вернутся независимо от твоего решения. Это невозвратные затраты (sunk costs). Решение должно основываться только на текущей ситуации: опасно ли ехать и хочешь ли ты идти в метель.',
  },
  {
    id: 2,
    title: 'Проект',
    text: 'Ты вложил 6 месяцев и 500 000 рублей в проект. Понял, что идея не работает и рынок не нужен. Продолжишь?',
    options: [
      'Продолжу — столько уже вложено',
      'Закрою проект — лучше начать что-то новое',
    ],
    correct: 1,
    explanation: 'Правильный ответ — «закрою проект». Вложенные ресурсы уже не вернуть. Вопрос: стоит ли вкладывать ещё больше времени и денег в заведомо провальную идею? Раптор кричит: «Мы столько вложили!» — но кора понимает, что это ловушка.',
  },
  {
    id: 3,
    title: 'Кино',
    text: 'Ты заплатил за билет в кино 800 рублей. Через 30 минут понимаешь, что фильм ужасный. Досмотришь до конца?',
    options: [
      'Досмотрю — деньги потрачены',
      'Уйду — время дороже',
    ],
    correct: 1,
    explanation: 'Правильный ответ — «уйду». Деньги за билет уже не вернутся. Вопрос: что лучше — провести ещё 1.5 часа на плохом фильме или заняться чем-то приятным? Раптор цепляется за «потраченные деньги», но кора видит, что это ловушка.',
  },
  {
    id: 4,
    title: 'Отношения',
    text: 'Ты 3 года в отношениях, которые тебя не устраивают. Друзья говорят, что ты выглядишь несчастным. Останешься?',
    options: [
      'Останусь — столько лет вместе',
      'Закончу отношения — жизнь слишком коротка',
    ],
    correct: 1,
    explanation: 'Правильный ответ — «закончу отношения». Вложенное время не вернёшь. Вопрос: хочешь ли ты провести следующие 3 года в несчастливых отношениях? Раптор шепчет: «Мы столько вложили!» — но кора понимает, что прошлое не должно определять будущее.',
  },
  {
    id: 5,
    title: 'Акции',
    text: 'Ты купил акции компании за 100 000 рублей. Сейчас они стоят 60 000. Аналитики говорят, что компания на грани банкротства. Продашь?',
    options: [
      'Буду держать — пусть вернутся к 100 000',
      'Продам — лучше спасти оставшиеся 60 000',
    ],
    correct: 1,
    explanation: 'Правильный ответ — «продам». Потеря 40 000 уже произошла. Вопрос: что вероятнее — акции вернутся к 100 000 или упадут до нуля? Раптор надеется «отыграться», но кора видит, что это ловушка невозвратных затрат.',
  },
];

export default function SunkCostTest({ profile, setProfile }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const currentScenario = scenarios[step];

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);

    if (step === scenarios.length - 1) {
      setFinished(true);
      const score = newAnswers.filter((a, i) => a === scenarios[i].correct).length;
      const result = {
        id: Date.now().toString(),
        testType: 'sunkCost',
        date: new Date().toISOString(),
        score,
        maxScore: scenarios.length,
        details: { answers: newAnswers },
      };
      setProfile(addTestResult(profile, result));
    } else {
      setStep(step + 1);
    }
  };

  if (finished) {
    const score = answers.filter((a, i) => a === scenarios[i].correct).length;
    
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-6">
          <p className="text-sm text-orange-700 mb-2">Это был эксперимент на</p>
          <h1 className="text-3xl font-bold text-orange-800 mb-2">Ошибка невозвратных затрат</h1>
          <p className="text-stone-600">Мы продолжаем вкладывать в то, что не работает, потому что уже вложили много.</p>
        </div>
        
        <h2 className="text-xl font-bold text-stone-800 mb-4">Твои результаты</h2>
        
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-stone-800">{score}/{scenarios.length}</div>
            <p className="text-stone-500 mt-1">правильных ответов</p>
          </div>
          
          <div className="space-y-3">
            {scenarios.map((s, i) => (
              <div key={i} className={`p-3 rounded-xl ${answers[i] === s.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="text-sm font-medium text-stone-800">{s.title}</p>
                <p className="text-xs text-stone-600 mt-1">
                  {answers[i] === s.correct ? '✓ Не попался в ловушку' : '🦖 Раптор цепляется за прошлое'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-orange-50 rounded-2xl border border-orange-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">Как это работает 🦖</h3>
              <p className="text-sm text-orange-700 mb-2">
                Ошибка невозвратных затрат (sunk cost fallacy) — наш рептильный мозг не любит терять. 
                Раптор видит «мы столько вложили!» и цепляется за прошлое, даже если будущее бесперспективно. 
                В саванне это помогало: не бросай добычу, которую уже почти поймал. Но в современном мире 
                это приводит к тому, что мы продолжаем плохие отношения, проекты и инвестиции только потому, 
                что уже вложили в них ресурсы.
              </p>
              <p className="text-sm text-orange-700">
                <strong>Совет:</strong> Принимая решение, спрашивай себя: «Если бы я начинал с нуля, 
                выбрал бы я этот путь?» Если нет — раптор держит тебя за прошлое.
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
        <h1 className="text-xl font-bold text-stone-800">Эксперимент №10</h1>
        <span className="text-sm text-stone-500">{step + 1} / {scenarios.length}</span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-orange-500 h-2 rounded-full transition-all"
          style={{ width: `${((step + 1) / scenarios.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-3">{currentScenario.title}</h2>
        <p className="text-stone-600 mb-6">{currentScenario.text}</p>
        
        <div className="space-y-2">
          {currentScenario.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-orange-300 hover:bg-orange-50 
                         text-stone-700 transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
