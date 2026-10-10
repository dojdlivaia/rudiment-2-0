import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, addTestResult } from '../store';
import { ArrowLeft, Info } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

const questions = [
  {
    id: 1,
    anchor: 1945,
    question: 'В каком году был основан ООН?',
    correctAnswer: 1945,
    tolerance: 5,
  },
  {
    id: 2,
    anchor: 680,
    question: 'Какова высота Эйфелевой башни (в метрах)?',
    correctAnswer: 330,
    tolerance: 50,
  },
  {
    id: 3,
    anchor: 15,
    question: 'Сколько процентов поверхности Земли покрыто водой?',
    correctAnswer: 71,
    tolerance: 10,
  },
  {
    id: 4,
    anchor: 2500,
    question: 'Сколько лет Великой Китайской стене (примерно)?',
    correctAnswer: 2300,
    tolerance: 300,
  },
  {
    id: 5,
    anchor: 80,
    question: 'Какова средняя температура тела человека (°C)?',
    correctAnswer: 36.6,
    tolerance: 1,
  },
];

export default function AnchorTest({ profile, setProfile }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showAnchor, setShowAnchor] = useState(true);
  const [finished, setFinished] = useState(false);
  const [currentInput, setCurrentInput] = useState('');

  const currentQ = questions[step];
  const isLast = step === questions.length - 1;

  const handleNext = () => {
    if (currentInput === '') return;
    const newAnswers = [...answers];
    newAnswers[step] = Number(currentInput);
    setAnswers(newAnswers);
    setCurrentInput('');

    if (isLast) {
      setFinished(true);
      // Calculate score based on resistance to anchoring
      const anchoringResistance = questions.reduce((acc, q, i) => {
        const answer = newAnswers[i] || 0;
        const distanceFromAnchor = Math.abs(answer - q.anchor);
        const distanceFromCorrect = Math.abs(answer - q.correctAnswer);
        if (distanceFromAnchor < distanceFromCorrect) return acc;
        return acc + 1;
      }, 0);

      const finalScore = Math.round((anchoringResistance / questions.length) * questions.length);
      
      const result = {
        id: Date.now().toString(),
        testType: 'anchoring',
        date: new Date().toISOString(),
        score: finalScore,
        maxScore: questions.length,
        details: { answers: newAnswers },
      };
      
      setProfile(addTestResult(profile, result));
    } else {
      setStep(step + 1);
      setShowAnchor(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Результат: Эффект якоря</h1>
        
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <h2 className="font-semibold text-stone-800 mb-4">Разбор ответов</h2>
          <div className="space-y-6">
            {questions.map((q, i) => {
              const answer = answers[i] || 0;
              const distFromAnchor = Math.abs(answer - q.anchor);
              const distFromCorrect = Math.abs(answer - q.correctAnswer);
              const totalDist = distFromAnchor + distFromCorrect;
              
              // Процент влияния якоря: чем ближе к якорю, тем выше процент
              const anchorInfluence = totalDist > 0 ? Math.round((1 - distFromAnchor / totalDist) * 100) : 50;
              const wasAnchored = distFromAnchor < distFromCorrect;
              const wasResistant = distFromAnchor > distFromCorrect;
              const wasNeutral = distFromAnchor === distFromCorrect;
              
              return (
                <div key={i} className="border-b border-stone-100 pb-4 last:border-0">
                  <p className="text-sm font-medium text-stone-700 mb-3">{q.question}</p>
                  
                  {/* Числовое сравнение */}
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className="bg-stone-50 p-2 rounded text-center">
                      <p className="text-stone-500">Якорь</p>
                      <p className="text-lg font-bold text-stone-700">{q.anchor}</p>
                    </div>
                    <div className={`p-2 rounded text-center ${wasAnchored ? 'bg-orange-50' : wasResistant ? 'bg-green-50' : 'bg-blue-50'}`}>
                      <p className="text-stone-500">Твой ответ</p>
                      <p className="text-lg font-bold text-stone-800">{answer}</p>
                    </div>
                    <div className="bg-stone-50 p-2 rounded text-center">
                      <p className="text-stone-500">Правильно</p>
                      <p className="text-lg font-bold text-stone-700">{q.correctAnswer}</p>
                    </div>
                  </div>
                  
                  {/* Визуальная шкала */}
                  <div className="relative h-8 bg-stone-100 rounded-full mb-2 overflow-hidden">
                    {/* Якорь */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-stone-400"
                      style={{ left: '0%' }}
                    />
                    {/* Правильный ответ */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-stone-400"
                      style={{ left: '100%' }}
                    />
                    {/* Твой ответ */}
                    <div 
                      className={`absolute top-1 bottom-1 w-3 rounded-full ${
                        wasAnchored ? 'bg-orange-500' : wasResistant ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ left: `${(distFromAnchor / totalDist) * 100}%`, transform: 'translateX(-50%)' }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-stone-400 mb-3">
                    <span>← Якорь</span>
                    <span>Правильно →</span>
                  </div>
                  
                  {/* Интерпретация */}
                  <div className={`p-3 rounded-lg ${
                    wasAnchored ? 'bg-orange-50 border border-orange-200' : 
                    wasResistant ? 'bg-green-50 border border-green-200' : 
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    {wasAnchored && (
                      <p className="text-sm text-orange-700">
                        <span className="font-medium">🦖 Раптор потянул к якорю</span><br/>
                        <span className="text-xs">Твой ответ ближе к якорю ({q.anchor}), чем к правильному ({q.correctAnswer}). 
                        Влияние якоря: {anchorInfluence}%</span>
                      </p>
                    )}
                    {wasResistant && (
                      <p className="text-sm text-green-700">
                        <span className="font-medium">✓ Ты устоял</span><br/>
                        <span className="text-xs">Твой ответ ближе к правильному ({q.correctAnswer}), чем к якорю ({q.anchor}). 
                        Раптор не смог тебя потянуть.</span>
                      </p>
                    )}
                    {wasNeutral && (
                      <p className="text-sm text-blue-700">
                        <span className="font-medium">⚖️ Нейтрально</span><br/>
                        <span className="text-xs">Твой ответ одинаково далёк от якоря и правильного ответа.</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl border border-green-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Как это работает 🦖</h3>
              <p className="text-sm text-green-700 mb-2">
                Эффект якоря — одна из самых мощных когнитивных ловушек. Даже зная о нём, 
                мы не можем полностью отключить его. Первое число, которое мы видим, 
                становится «якорем» — точкой отсчёта, от которой трудно уйти.
              </p>
              <p className="text-sm text-green-700 mb-2">
                Наш рептильный мозг (тот самый велоцираптор внутри) 
                эволюционировал для быстрых решений в саванне. Увидел число — зацепился за него, 
                как за ветку. Кора головного мозга пытается скорректировать, но раптор уже принял решение.
              </p>
              <p className="text-sm text-green-700">
                <strong>Совет:</strong> Перед оценкой попробуй сформулировать «нулевую гипотезу» — 
                что бы ты ответил, не видя первого числа. Это даёт коре шанс перехватить управление.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 mb-6">
          <h3 className="font-semibold text-stone-800 mb-2">📚 Историческая справка</h3>
          <p className="text-sm text-stone-600 mb-2">
            Эффект якоря (anchoring effect) был описан <strong>Амосом Тверски</strong> и <strong>Даниэлем Канеманом</strong> 
            в 1974 году в их знаменитой статье «Эвристики и предубеждения: суждение в условиях неопределённости». 
            В эксперименте участники крутили колесо фортуны (которое всегда останавливалось на 10 или 65), 
            а затем оценивали процент африканских стран в ООН. Те, кто видел 65, давали оценки в среднем 45%, 
            а те, кто видел 10 — в среднем 25%.
          </p>
          <p className="text-sm text-stone-600">
            <strong>Книга:</strong> Даниэль Канеман «Думай медленно... решай быстро» (2011) — глава об эффекте якоря.
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
        <h1 className="text-xl font-bold text-stone-800">Эффект якоря</h1>
        <span className="text-sm text-stone-500">{step + 1} / {questions.length}</span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-green-500 h-2 rounded-full transition-all"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        {showAnchor && (
          <div className="text-center mb-6 animate-fade-in">
            <p className="text-sm text-stone-500 mb-2">Случайное число для тебя:</p>
            <div className="text-5xl font-bold text-stone-300">{currentQ.anchor}</div>
            <button
              onClick={() => setShowAnchor(false)}
              className="mt-3 text-sm text-green-600 hover:text-green-700"
            >
              Понятно, дальше →
            </button>
          </div>
        )}

        {!showAnchor && (
          <div className="animate-fade-in">
            <p className="text-lg font-medium text-stone-800 mb-6">{currentQ.question}</p>
            <input
              type="number"
              value={currentInput}
              onChange={e => setCurrentInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNext()}
              placeholder="Твой ответ..."
              className="w-full px-4 py-3 border border-stone-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
              autoFocus
            />
            <button
              onClick={handleNext}
              disabled={currentInput === ''}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-stone-300 text-white px-4 py-3 rounded-xl font-medium transition-colors"
            >
              {isLast ? 'Завершить' : 'Дальше'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
