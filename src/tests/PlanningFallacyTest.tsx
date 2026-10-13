import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, addTestResult } from '../store';
import { ArrowLeft, Info } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

const tasks = [
  {
    id: 1,
    title: 'Написать email коллеге',
    description: 'Короткое письмо с вопросом о встрече',
    typicalTime: 10, // минут
  },
  {
    id: 2,
    title: 'Приготовить ужин',
    description: 'Простое блюдо: pasta с овощами',
    typicalTime: 30,
  },
  {
    id: 3,
    title: 'Прочитать статью',
    description: 'Длинная статья (2000 слов) на знакомую тему',
    typicalTime: 15,
  },
  {
    id: 4,
    title: 'Сделать презентацию',
    description: '5 слайдов с базовой информацией',
    typicalTime: 45,
  },
  {
    id: 5,
    title: 'Убрать квартиру',
    description: 'Генеральная уборка 2-комнатной квартиры',
    typicalTime: 120,
  },
];

export default function PlanningTest({ profile, setProfile }: Props) {
  const [step, setStep] = useState(0);
  const [estimates, setEstimates] = useState<number[]>([]);
  const [currentEstimate, setCurrentEstimate] = useState(30);
  const [finished, setFinished] = useState(false);

  const currentTask = tasks[step];

  const handleEstimate = () => {
    const newEstimates = [...estimates, currentEstimate];
    setEstimates(newEstimates);

    if (step === tasks.length - 1) {
      setFinished(true);
      // Подсчёт: насколько точно человек оценил время
      let totalError = 0;
      newEstimates.forEach((est, i) => {
        const actual = tasks[i].typicalTime;
        const error = Math.abs(est - actual) / actual;
        totalError += error;
      });
      const avgError = totalError / tasks.length;
      // Score: 0 = идеально, 1+ = сильно ошибся
      const score = Math.max(0, Math.round((1 - avgError) * tasks.length));
      
      const result = {
        id: Date.now().toString(),
        testType: 'planningFallacy',
        date: new Date().toISOString(),
        score,
        maxScore: tasks.length,
        details: { estimates: newEstimates, avgError },
      };
      setProfile(addTestResult(profile, result));
    } else {
      setStep(step + 1);
      setCurrentEstimate(30);
    }
  };

  if (finished) {
    let totalError = 0;
    estimates.forEach((est, i) => {
      const actual = tasks[i].typicalTime;
      const error = Math.abs(est - actual) / actual;
      totalError += error;
    });
    const avgError = totalError / tasks.length;
    
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 mb-6">
          <p className="text-sm text-violet-700 mb-2">Это был эксперимент на</p>
          <h1 className="text-3xl font-bold text-violet-800 mb-2">Ошибку планирования</h1>
          <p className="text-stone-600">Мы систематически недооцениваем время, необходимое для выполнения задач.</p>
        </div>
        
        <h2 className="text-xl font-bold text-stone-800 mb-4">Твои результаты</h2>
        
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-stone-800">{Math.round(avgError * 100)}%</div>
            <p className="text-stone-500 mt-1">средняя ошибка оценки</p>
            <p className="text-sm text-stone-400 mt-2">
              {avgError < 0.2 ? '🎯 Отлично! Ты хорошо оцениваешь время' :
               avgError < 0.5 ? 'Неплохо, но есть куда расти' :
               '🦖 Раптор слишком оптимистичен'}
            </p>
          </div>
          
          <div className="space-y-3">
            {tasks.map((task, i) => {
              const estimate = estimates[i];
              const actual = task.typicalTime;
              const error = Math.abs(estimate - actual);
              const errorPercent = Math.round((error / actual) * 100);
              const optimistic = estimate < actual;
              
              return (
                <div key={i} className="p-3 bg-stone-50 rounded-xl">
                  <p className="text-sm font-medium text-stone-800 mb-2">{task.title}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-blue-700 font-medium">Твоя оценка</p>
                      <p className="text-stone-600">{estimate} мин</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-green-700 font-medium">Реальность</p>
                      <p className="text-stone-600">{actual} мин</p>
                    </div>
                    <div className={`p-2 rounded ${optimistic ? 'bg-orange-50' : 'bg-purple-50'}`}>
                      <p className={`font-medium ${optimistic ? 'text-orange-700' : 'text-purple-700'}`}>
                        {optimistic ? 'Оптимизм' : 'Пессимизм'}
                      </p>
                      <p className="text-stone-600">{errorPercent}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-violet-50 rounded-2xl border border-violet-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-violet-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-violet-800 mb-2">Как это работает 🦖</h3>
              {avgError > 0.2 ? (
                <>
                  <p className="text-sm text-violet-700 mb-2">
                    Ты склонен переоценивать время — возможно, из-за тревожности или перфекционизма. 
                    Раптор видит потенциальные проблемы везде и думает: «А вдруг что-то пойдёт не так?»
                  </p>
                  <p className="text-sm text-violet-700 mb-2">
                    В саванне осторожность помогала выживать: «Лучше подготовлюсь дольше, чем попаду в ловушку». 
                    Но в современном мире это может приводить к прокрастинации — «я ещё не готов начать».
                  </p>
                </>
              ) : avgError < -0.2 ? (
                <>
                  <p className="text-sm text-violet-700 mb-2">
                    Ошибка планирования (planning fallacy) — наш рептильный мозг оптимистично оценивает время 
                    выполнения задач. Раптор думает: «Я быстро справлюсь!» — и игнорирует прошлый опыт. 
                    Исследования показывают, что люди систематически недооценивают время на 20-50%.
                  </p>
                  <p className="text-sm text-violet-700 mb-2">
                    В саванне оптимизм помогал: «Я догоню эту антилопу!» — и ты бежал быстрее. 
                    Но в современном мире, где задачи сложнее, раптор не учитывает непредвиденные обстоятельства, 
                    усталость, отвлечения.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-violet-700 mb-2">
                    У тебя хорошая калибровка времени! Ты учитываешь и оптимизм раптора, и реалистичный опыт коры.
                  </p>
                </>
              )}
              <p className="text-sm text-violet-700">
                <strong>Совет:</strong> Оценивая время, спрашивай: «Сколько это заняло в прошлый раз?» 
                Если оптимист — умножай на 1.5. Если пессимист — дели на 1.3. Раптор живёт в идеальном или страшном мире, 
                но кора помнит реальность.
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
        <h1 className="text-xl font-bold text-stone-800">Эксперимент №7</h1>
        <span className="text-sm text-stone-500">{step + 1} / {tasks.length}</span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-violet-500 h-2 rounded-full transition-all"
          style={{ width: `${((step + 1) / tasks.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-2">{currentTask.title}</h2>
        <p className="text-stone-600 mb-6">{currentTask.description}</p>
        
        <p className="text-sm text-stone-500 mb-4">Сколько минут это займёт?</p>
        
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="5"
              max="180"
              step="5"
              value={currentEstimate}
              onChange={e => setCurrentEstimate(Number(e.target.value))}
              className="flex-1 accent-violet-500"
            />
            <span className="text-lg font-bold text-stone-700 w-16 text-right">{currentEstimate} мин</span>
          </div>
          <div className="flex justify-between text-xs text-stone-400 mt-1">
            <span>5 мин</span>
            <span>180 мин</span>
          </div>
        </div>

        <button
          onClick={handleEstimate}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
        >
          {step === tasks.length - 1 ? 'Завершить' : 'Далее →'}
        </button>
      </div>
    </div>
  );
}
