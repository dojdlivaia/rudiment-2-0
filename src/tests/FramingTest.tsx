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
    title: 'Йогурт',
    versionA: {
      text: 'Йогурт содержит 10% жира',
      question: 'Купишь этот йогурт?',
    },
    versionB: {
      text: 'Йогурт на 90% обезжиренный',
      question: 'Купишь этот йогурт?',
    },
    correctAnswer: 'Одинаково',
    explanation: 'Это один и тот же йогурт! 10% жира = 90% обезжиренный. Но формулировка влияет на восприятие: «90% обезжиренный» звучит привлекательнее, хотя это одно и то же. Раптор реагирует на слова, а не на суть.',
  },
  {
    id: 2,
    title: 'Медицинская программа',
    versionA: {
      text: 'Программа спасёт 200 из 600 человек',
      question: 'Поддержишь эту программу?',
    },
    versionB: {
      text: 'В программе умрут 400 из 600 человек',
      question: 'Поддержишь эту программу?',
    },
    correctAnswer: 'Одинаково',
    explanation: 'Это одна и та же программа! Спасти 200 = потерять 400. Но формулировка «спасёт» вызывает поддержку, а «умрут» — отторжение. Раптор реагирует на эмоциональные слова, а кора должна видеть математику.',
  },
  {
    id: 3,
    title: 'Мясо',
    versionA: {
      text: 'Мясо содержит 80% постного мяса',
      question: 'Купишь это мясо?',
    },
    versionB: {
      text: 'Мясо содержит 20% жира',
      question: 'Купишь это мясо?',
    },
    correctAnswer: 'Одинаково',
    explanation: 'Это одно и то же мясо! 80% постного = 20% жира. Но «80% постного» звучит диетичнее. Раптор цепляется за позитивную формулировку, хотя суть не меняется.',
  },
  {
    id: 4,
    title: 'Штраф за опоздание',
    versionA: {
      text: 'Штраф за опоздание — 500 рублей',
      question: 'Опоздаешь?',
    },
    versionB: {
      text: 'Бонус за пунктуальность — 500 рублей (теряешь при опоздании)',
      question: 'Опоздаешь?',
    },
    correctAnswer: 'Одинаково',
    explanation: 'Математически это одно и то же: опоздание = потеря 500 рублей. Но «штраф» воспринимается как наказание, а «потеря бонуса» — как упущенная выгода. Исследования показывают, что люди сильнее реагируют на потери, чем на эквивалентные штрафы (эффект неприятия потерь).',
  },
];

export default function FramingTest({ profile, setProfile }: Props) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<'A' | 'B'>('A');
  const [answers, setAnswers] = useState<{ A: string; B: string }[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [finished, setFinished] = useState(false);

  const currentScenario = scenarios[step];
  const currentVersion = phase === 'A' ? currentScenario.versionA : currentScenario.versionB;

  const handleAnswer = (answer: string) => {
    setCurrentAnswer(answer);
    
    if (phase === 'A') {
      // Переходим к версии B
      setTimeout(() => {
        setPhase('B');
        setCurrentAnswer('');
      }, 500);
    } else {
      // Завершаем сценарий
      const newAnswers = [...answers, { A: answers[step]?.A || currentAnswer, B: answer }];
      setAnswers(newAnswers);

      if (step === scenarios.length - 1) {
        setFinished(true);
        // Подсчёт: сколько раз человек ответил одинаково на A и B
        let score = 0;
        newAnswers.forEach(a => {
          if (a.A === a.B) score++;
        });
        
        const result = {
          id: Date.now().toString(),
          testType: 'framing',
          date: new Date().toISOString(),
          score,
          maxScore: scenarios.length,
          details: { answers: newAnswers },
        };
        setProfile(addTestResult(profile, result));
      } else {
        setStep(step + 1);
        setPhase('A');
        setCurrentAnswer('');
      }
    }
  };

  if (finished) {
    let consistentCount = 0;
    answers.forEach(a => {
      if (a.A === a.B) consistentCount++;
    });
    
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Результат: Эффект формулировки</h1>
        
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-stone-800">{consistentCount}/{scenarios.length}</div>
            <p className="text-stone-500 mt-1">последовательных ответов</p>
            <p className="text-sm text-stone-400 mt-2">
              {consistentCount === scenarios.length ? '🎯 Отлично! Раптор не смог тебя обмануть' :
               consistentCount >= scenarios.length / 2 ? 'Неплохо, но формулировки всё же влияют' :
               '🦖 Раптор реагирует на слова, а не на суть'}
            </p>
          </div>
          
          <div className="space-y-3">
            {scenarios.map((s, i) => (
              <div key={i} className="p-3 bg-stone-50 rounded-xl">
                <p className="text-sm font-medium text-stone-800 mb-2">{s.title}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-blue-700 font-medium mb-1">Версия A:</p>
                    <p className="text-stone-600">{s.versionA.text}</p>
                    <p className="text-blue-600 mt-1">Ответ: {answers[i].A}</p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <p className="text-purple-700 font-medium mb-1">Версия B:</p>
                    <p className="text-stone-600">{s.versionB.text}</p>
                    <p className="text-purple-600 mt-1">Ответ: {answers[i].B}</p>
                  </div>
                </div>
                <p className={`text-xs mt-2 ${answers[i].A === answers[i].B ? 'text-green-600' : 'text-orange-600'}`}>
                  {answers[i].A === answers[i].B ? '✓ Последовательно' : '🦖 Формулировка повлияла'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-pink-50 rounded-2xl border border-pink-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-pink-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-pink-800 mb-2">Как это работает 🦖</h3>
              <p className="text-sm text-pink-700 mb-2">
                Эффект формулировки (framing effect) — наш рептильный мозг реагирует на слова, а не на суть. 
                «90% обезжиренный» звучит лучше, чем «10% жира», хотя это одно и то же. Раптор эволюционировал 
                реагировать на эмоциональные сигналы: «спасёт» vs «умрут», «штраф» vs «потеря бонуса». 
                Кора головного мозга должна перевести слова в математику, но раптор уже принял решение.
              </p>
              <p className="text-sm text-pink-700">
                <strong>Совет:</strong> Когда видишь рекламу или предложение, переформулируй его в нейтральных терминах. 
                «90% обезжиренный» → «10% жира». «Скидка 50%» → «платишь полную цену». Дай коре шанс оценить суть.
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
        <h1 className="text-xl font-bold text-stone-800">Эффект формулировки</h1>
        <span className="text-sm text-stone-500">{step + 1} / {scenarios.length}</span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-pink-500 h-2 rounded-full transition-all"
          style={{ width: `${((step + 1) / scenarios.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="mb-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            phase === 'A' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            Версия {phase}
          </span>
        </div>
        
        <h2 className="text-lg font-semibold text-stone-800 mb-3">{currentScenario.title}</h2>
        <p className="text-stone-600 mb-6">{currentVersion.text}</p>
        <p className="text-sm text-stone-500 mb-4">{currentVersion.question}</p>
        
        <div className="space-y-2">
          <button
            onClick={() => handleAnswer('Да')}
            className="w-full p-3 rounded-xl border border-stone-200 hover:border-pink-300 hover:bg-pink-50 
                       text-stone-700 transition-all"
          >
            Да
          </button>
          <button
            onClick={() => handleAnswer('Нет')}
            className="w-full p-3 rounded-xl border border-stone-200 hover:border-pink-300 hover:bg-pink-50 
                       text-stone-700 transition-all"
          >
            Нет
          </button>
          <button
            onClick={() => handleAnswer('Не знаю')}
            className="w-full p-3 rounded-xl border border-stone-200 hover:border-pink-300 hover:bg-pink-50 
                       text-stone-700 transition-all"
          >
            Не знаю
          </button>
        </div>
      </div>
    </div>
  );
}
