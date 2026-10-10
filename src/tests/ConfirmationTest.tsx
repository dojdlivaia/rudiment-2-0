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
    title: 'Новая диета',
    setup: 'Ты склоняешься к тому, что новая диета эффективна. Перед тобой несколько исследований. Какие из них ты бы прочитал подробнее?',
    evidence: [
      { text: 'Исследование на 15 людях показало потерю веса', supports: true },
      { text: '80% участников бросили диету через месяц', supports: false },
      { text: 'Автор продаёт добавки для этой диеты', supports: false },
      { text: 'Один знакомый похудел на 10 кг', supports: true },
      { text: 'Мета-анализ 50 исследований не нашёл эффекта', supports: false },
    ],
  },
  {
    id: 2,
    title: 'Политическая реформа',
    setup: 'Ты считаешь, что определённая экономическая реформа полезна. Какие аргументы ты бы изучил внимательнее?',
    evidence: [
      { text: 'Статистика показывает рост экономики после реформы', supports: true },
      { text: 'Соседняя страна провела ту же реформу — результат хуже', supports: false },
      { text: 'Эксперт, которого ты уважаешь, поддерживает эту политику', supports: true },
      { text: 'Другой эксперт указывает на скрытые издержки', supports: false },
      { text: 'Опрос показывает, что 60% людей довольны', supports: true },
    ],
  },
  {
    id: 3,
    title: 'Инвестиционное решение',
    setup: 'Ты веришь, что акция компании X вырастет. Какие данные ты бы изучил подробнее?',
    evidence: [
      { text: 'Аналитик с хорошим треком рекомендует покупать', supports: true },
      { text: 'P/E компании выше среднего по отрасли', supports: false },
      { text: 'Выручка растёт 3 квартала подряд', supports: true },
      { text: 'Конкурент теряет долю рынка, но и у X она падает', supports: false },
      { text: 'Инсайдеры продают акции', supports: false },
    ],
  },
];

export default function ConfirmationTest({ profile, setProfile }: Props) {
  const [step, setStep] = useState(0);
  const [selectedEvidence, setSelectedEvidence] = useState<Set<number>>(new Set());
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState<{ scenario: number; biased: boolean }[]>([]);

  const currentScenario = scenarios[step];

  const toggleEvidence = (idx: number) => {
    const newSet = new Set(selectedEvidence);
    if (newSet.has(idx)) newSet.delete(idx);
    else newSet.add(idx);
    setSelectedEvidence(newSet);
  };

  const handleContinue = () => {
    // Проверяем, выбрал ли пользователь преимущественно подтверждающую информацию
    const supportingCount = Array.from(selectedEvidence).filter(idx => 
      currentScenario.evidence[idx].supports
    ).length;
    const totalCount = selectedEvidence.size;
    const biased = totalCount > 0 && supportingCount / totalCount > 0.6;
    
    const newResults = [...results, { scenario: step, biased }];
    setResults(newResults);

    if (step === scenarios.length - 1) {
      setFinished(true);
      const score = newResults.filter(r => !r.biased).length;
      const result = {
        id: Date.now().toString(),
        testType: 'confirmation',
        date: new Date().toISOString(),
        score,
        maxScore: scenarios.length,
        details: { results: newResults },
      };
      setProfile(addTestResult(profile, result));
    } else {
      setStep(step + 1);
      setSelectedEvidence(new Set());
    }
  };

  if (finished) {
    const biasedCount = results.filter(r => r.biased).length;
    
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Результат: Confirmation Bias</h1>
        
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-stone-800">{scenarios.length - biasedCount}/{scenarios.length}</div>
            <p className="text-stone-500 mt-1">сценариев без confirmation bias</p>
          </div>
          
          <div className="space-y-3">
            {scenarios.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                <span className={results[i]?.biased ? 'text-red-500' : 'text-green-600'}>
                  {results[i]?.biased ? '🦖' : '✓'}
                </span>
                <span className="text-sm text-stone-700">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-purple-50 rounded-2xl border border-purple-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-purple-800 mb-2">Как это работает</h3>
              <p className="text-sm text-purple-700 mb-2">
                Confirmation bias (склонность к подтверждению) — наш мозг автоматически ищет информацию, 
                подтверждающую уже существующее убеждение. Это не глупость — это экономия энергии. 
                Но в сложном мире это приводит к систематическим ошибкам.
              </p>
              <p className="text-sm text-purple-700">
                <strong>Совет:</strong> Когда формируешь мнение, задай себе вопрос: 
                «Какие 3 факта могли бы изменить моё мнение?» Если не можешь ответить — 
                это красный флаг.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 mb-6">
          <h3 className="font-semibold text-stone-800 mb-2">📚 Историческая справка</h3>
          <p className="text-sm text-stone-600 mb-2">
            Термин «confirmation bias» ввёл английский психолог <strong>Питер Уэйсон</strong> в 1960 году 
            в своём классическом эксперименте «2-4-6». Участники должны были угадать правило, по которому 
            построена тройка чисел. Уэйсон обнаружил, что люди тестируют только те гипотезы, которые 
            подтверждают их предположения, игнорируя опровергающие.
          </p>
          <p className="text-sm text-stone-600">
            Позже <strong>Даниэль Канеман</strong> и <strong>Амос Тверски</strong> показали, что этот эффект 
            проявляется во всех сферах — от науки до повседневных решений.
          </p>
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
        <h1 className="text-xl font-bold text-stone-800">Confirmation Bias</h1>
        <span className="text-sm text-stone-500">{step + 1} / {scenarios.length}</span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-purple-500 h-2 rounded-full transition-all"
          style={{ width: `${((step + 1) / scenarios.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-2">{currentScenario.title}</h2>
        <p className="text-stone-600 mb-6">{currentScenario.setup}</p>
        
        <p className="text-sm text-stone-500 mb-3">Выбери исследования, которые ты бы прочитал:</p>
        
        <div className="space-y-2 mb-6">
          {currentScenario.evidence.map((ev, idx) => (
            <button
              key={idx}
              onClick={() => toggleEvidence(idx)}
              className={`w-full text-left p-3 rounded-xl border transition-all text-sm ${
                selectedEvidence.has(idx)
                  ? 'bg-purple-50 border-purple-300 text-purple-800'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              {ev.text}
            </button>
          ))}
        </div>

        {selectedEvidence.size > 0 && (
          <button
            onClick={handleContinue}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
          >
            {step === scenarios.length - 1 ? 'Завершить' : 'Далее →'}
          </button>
        )}
      </div>
    </div>
  );
}
