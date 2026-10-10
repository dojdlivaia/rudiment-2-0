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
    id: 'baseRate',
    title: 'Задача на базовый шанс',
    text: 'Болезнь встречается у 1 из 1000 человек. Тест определяет болезнь с точностью 99% (то есть 1% ложноположительных и 1% ложноотрицательных). Человек получил положительный результат. Какова вероятность, что он действительно болен?',
    options: ['~99%', '~50%', '~10%', '~1%'],
    correct: 2,
    explanation: 'Правильный ответ — ~10%. Из 1000 человек: 1 болен (тест покажет +), из 999 здоровых ~10 получат ложный +. Итого: 1/(1+10) ≈ 9%. Это base rate fallacy — мы игнорируем базовую вероятность.',
  },
  {
    id: 'montyHall',
    title: 'Задача Монти Холла',
    text: 'Три двери. За одной — машина, за двумя — козы. Ты выбираешь дверь 1. Ведущий (который знает, где машина) открывает дверь 3 — там коза. Он спрашивает: хочешь переключиться на дверь 2?',
    options: ['Переключиться — шанс 50/50', 'Не переключаться — шанс выше', 'Переключиться — шанс 2/3', 'Нет разницы — шанс 1/3'],
    correct: 2,
    explanation: 'Правильный ответ — переключиться, шанс 2/3. При первом выборе шанс угадать 1/3. Когда ведущий открывает козу, оставшаяся дверь «вбирает» вероятность 2/3. Это контринтуитивно, но математически верно.',
  },
  {
    id: 'gambler',
    title: 'Ошибка игрока',
    text: 'Монета выпала орлом 5 раз подряд. Какова вероятность, что в 6-й раз выпадет решка?',
    options: ['Выше 50% — решка «должна» выпасть', 'Ровно 50%', 'Ниже 50% — орёл «в ударе»', 'Зависит от монеты'],
    correct: 1,
    explanation: 'Правильный ответ — ровно 50%. Каждый бросок независим. Монета «не помнит» предыдущих бросков. Ошибка игрока — вера в то, что прошлые результаты влияют на будущие в независимых событиях.',
  },
  {
    id: 'conjunction',
    title: 'Ошибка конъюнкции',
    text: 'Линда — 31 год, она одинока, откровенна и очень ярка. Она училась на философии, участвовала в протестах. Что вероятнее?',
    options: [
      'Линда — банковский кассир',
      'Линда — банковский кассир И активна в феминистском движении',
      'Одинаково вероятно',
      'Невозможно определить',
    ],
    correct: 0,
    explanation: 'Правильный ответ — «банковский кассир». Вероятность конъюнкции (А И Б) ВСЕГДА ≤ вероятности каждого события по отдельности. Но описание Линды «подходит» под феминистку, и мозг добавляет детали.',
  },
  {
    id: 'regression',
    title: 'Регрессия к среднему',
    text: 'Тренер хвалит игроков после отличной игры — и следующая игра хуже. Ругает после плохой — следующая лучше. Вывод: ругать эффективнее?',
    options: [
      'Да, наказание работает лучше поощрения',
      'Нет, это регрессия к среднему',
      'Зависит от спорта',
      'Нужно больше данных',
    ],
    correct: 1,
    explanation: 'Правильный ответ — регрессия к среднему. После экстремально хорошего результата следующий, скорее всего, будет ближе к среднему (просто потому что «экстремально» — это отклонение). И наоборот после плохого.',
  },
];

export default function StatisticalTest({ profile, setProfile }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentQ = questions[step];

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (step === questions.length - 1) {
      setFinished(true);
      const score = answers.filter((a, i) => a === questions[i].correct).length;
      const result = {
        id: Date.now().toString(),
        testType: 'statistical',
        date: new Date().toISOString(),
        score,
        maxScore: questions.length,
        details: { answers },
      };
      setProfile(addTestResult(profile, result));
    } else {
      setStep(step + 1);
    }
  };

  if (finished) {
    const score = answers.filter((a, i) => a === questions[i].correct).length;
    
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Результат: Статистическая интуиция</h1>
        
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-stone-800">{score}/{questions.length}</div>
            <p className="text-stone-500 mt-1">правильных ответов</p>
          </div>
          
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div key={i} className={`p-3 rounded-xl ${answers[i] === q.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="text-sm font-medium text-stone-800">{q.title}</p>
                <p className="text-xs text-stone-600 mt-1">
                  {answers[i] === q.correct ? '✓ Верно' : `✗ Ты: "${q.options[answers[i]]}" → Верно: "${q.options[q.correct]}"`}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-rose-50 rounded-2xl border border-rose-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-rose-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-rose-800 mb-2">Как это работает</h3>
              <p className="text-sm text-rose-700 mb-2">
                Статистическая интуиция — одна из самых слабых сторон нашего мозга. 
                Мы эволюционировали для работы с конкретными объектами (1, 2, 3 льва), 
                а не с вероятностями и процентами.
              </p>
              <p className="text-sm text-rose-700">
                <strong>Совет:</strong> Встречая задачу на вероятность, сначала спроси: 
                «Какова базовая вероятность?» Потом учитывай дополнительную информацию. 
                И помни: корреляция ≠ причинность.
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
        <h1 className="text-xl font-bold text-stone-800">Статистическая интуиция</h1>
        <span className="text-sm text-stone-500">{step + 1} / {questions.length}</span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-rose-500 h-2 rounded-full transition-all"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-3">{currentQ.title}</h2>
        <p className="text-stone-600 mb-6">{currentQ.text}</p>
        
        {!showExplanation ? (
          <div className="space-y-2">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-rose-300 hover:bg-rose-50 
                           text-stone-700 transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className={`p-4 rounded-xl mb-4 ${answers[step] === currentQ.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="font-medium text-sm mb-1">
                {answers[step] === currentQ.correct ? '✓ Верно!' : '✗ Не совсем...'}
              </p>
              <p className="text-sm text-stone-700">{currentQ.explanation}</p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
            >
              {step === questions.length - 1 ? 'Завершить' : 'Дальше'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
