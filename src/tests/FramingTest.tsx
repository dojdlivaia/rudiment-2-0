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
    explanation: 'Это один и тот же йогурт! 10% жира = 90% обезжиренный. Но формулировка влияет на восприятие: «90% обезжиренный» звучит привлекательнее, хотя это одно и то же.',
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
    explanation: 'Это одна и та же программа! Спасти 200 = потерять 400. Но «спасёт» вызывает поддержку, а «умрут» — отторжение.',
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
    explanation: 'Это одно и то же мясо! 80% постного = 20% жира. Но «80% постного» звучит диетичнее.',
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
    explanation: 'Математически это одно и то же: опоздание = потеря 500 рублей. Но «штраф» воспринимается как наказание, а «потеря бонуса» — как упущенная выгода.',
  },
];

// Генерация последовательности: сначала все A в случайном порядке, потом все B в другом случайном порядке
function generateSequence() {
  const indicesA = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  const indicesB = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
  
  return {
    phaseA: indicesA.map(i => ({ scenarioIndex: i, version: 'A' as const })),
    phaseB: indicesB.map(i => ({ scenarioIndex: i, version: 'B' as const })),
  };
}

export default function FramingTest({ profile, setProfile }: Props) {
  const [sequence] = useState(() => generateSequence());
  const [currentStep, setCurrentStep] = useState(0);
  const [answersA, setAnswersA] = useState<string[]>([]);
  const [answersB, setAnswersB] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  const totalSteps = sequence.phaseA.length + sequence.phaseB.length;
  const isPhaseA = currentStep < sequence.phaseA.length;
  const currentItem = isPhaseA 
    ? sequence.phaseA[currentStep] 
    : sequence.phaseB[currentStep - sequence.phaseA.length];
  
  const currentScenario = scenarios[currentItem.scenarioIndex];
  const currentVersion = currentItem.version === 'A' ? currentScenario.versionA : currentScenario.versionB;

  const handleAnswer = (answer: string) => {
    if (isPhaseA) {
      const newAnswersA = [...answersA, answer];
      setAnswersA(newAnswersA);
      setCurrentStep(currentStep + 1);
    } else {
      const newAnswersB = [...answersB, answer];
      setAnswersB(newAnswersB);
      
      if (currentStep === totalSteps - 1) {
        setFinished(true);
        
        // Подсчёт последовательности: сравниваем ответы для каждого сценария
        let consistentCount = 0;
        sequence.phaseA.forEach((itemA, i) => {
          const itemB = sequence.phaseB.find(item => item.scenarioIndex === itemA.scenarioIndex);
          if (itemB) {
            const answerA = answersA[i];
            const answerB = newAnswersB[sequence.phaseB.indexOf(itemB)];
            if (answerA === answerB) consistentCount++;
          }
        });
        
        const result = {
          id: Date.now().toString(),
          testType: 'framing',
          date: new Date().toISOString(),
          score: consistentCount,
          maxScore: scenarios.length,
          details: { answersA: answersA, answersB: newAnswersB, sequence },
        };
        setProfile(addTestResult(profile, result));
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  if (finished) {
    let consistentCount = 0;
    const comparisonData: { scenario: typeof scenarios[0]; answerA: string; answerB: string; consistent: boolean }[] = [];
    
    sequence.phaseA.forEach((itemA, i) => {
      const itemB = sequence.phaseB.find(item => item.scenarioIndex === itemA.scenarioIndex);
      if (itemB) {
        const answerA = answersA[i];
        const answerB = answersB[sequence.phaseB.indexOf(itemB)];
        const consistent = answerA === answerB;
        if (consistent) consistentCount++;
        comparisonData.push({
          scenario: scenarios[itemA.scenarioIndex],
          answerA,
          answerB,
          consistent,
        });
      }
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
            {comparisonData.map((data, i) => (
              <div key={i} className="p-3 bg-stone-50 rounded-xl">
                <p className="text-sm font-medium text-stone-800 mb-2">{data.scenario.title}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-blue-700 font-medium mb-1">Версия A:</p>
                    <p className="text-stone-600">{data.scenario.versionA.text}</p>
                    <p className="text-blue-600 mt-1">Ответ: {data.answerA}</p>
                  </div>
                  <div className="bg-purple-50 p-2 rounded">
                    <p className="text-purple-700 font-medium mb-1">Версия B:</p>
                    <p className="text-stone-600">{data.scenario.versionB.text}</p>
                    <p className="text-purple-600 mt-1">Ответ: {data.answerB}</p>
                  </div>
                </div>
                <p className={`text-xs mt-2 ${data.consistent ? 'text-green-600' : 'text-orange-600'}`}>
                  {data.consistent ? '✓ Последовательно' : '🦖 Формулировка повлияла'}
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
                Наш рептильный мозг реагирует на слова, а не на суть. 
                «90% обезжиренный» звучит лучше, чем «10% жира», хотя это одно и то же. 
                Раптор эволюционировал реагировать на эмоциональные сигналы.
              </p>
              <p className="text-sm text-pink-700">
                <strong>Совет:</strong> Когда видишь рекламу или предложение, переформулируй его в нейтральных терминах. 
                «90% обезжиренный» → «10% жира». Дай коре шанс оценить суть.
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
        <span className="text-sm text-stone-500">{currentStep + 1} / {totalSteps}</span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-pink-500 h-2 rounded-full transition-all"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="mb-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            currentItem.version === 'A' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
          }`}>
            Вопрос {currentStep + 1} из {totalSteps}
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
