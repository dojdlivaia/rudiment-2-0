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
    text: 'Линда — 31 год, она одинока, откровенна и очень ярка. Она училась на философии, участвовала в протестах против несправедливости. Что вероятнее?',
    options: [
      'Линда работает банковским кассиром',
      'Линда работает банковским кассиром И активно участвует в феминистском движении',
    ],
    correct: 0,
    explanation: 'Правильный ответ — «работает банковским кассиром». Это контринтуитивно, но математически верно: вероятность того, что человек одновременно является кассиром И феминисткой, НЕ МОЖЕТ быть выше, чем вероятность того, что он просто кассир. Ведь феминисток-кассиров меньше, чем просто кассиров. Но описание Линды так «подходит» под феминистку, что наш раптор добавляет детали и выбирает более «правдоподобный» вариант.',
  },
  {
    id: 'regression',
    title: 'Возврат к норме',
    text: 'Тренер хвалит игроков после отличной игры — и следующая игра хуже. Ругает после плохой — следующая лучше. Вывод: ругать эффективнее?',
    options: [
      'Да, наказание работает лучше поощрения',
      'Нет, это случайное колебание — после пика обычно следует спад, и наоборот',
      'Зависит от спорта',
      'Нужно больше данных',
    ],
    correct: 1,
    explanation: 'Правильный ответ — это случайное колебание. Представь: если ты подбросил монету 10 раз и 8 раз выпал орёл — это аномалия. В следующий раз результат, скорее всего, будет ближе к 50/50. Не потому что монета «исправилась», а потому что экстремальные отклонения редко продолжаются. Так и с игроками: после блестящей игры (редкий пик) следующая скорее всего будет обычной. После провальной (редкий провал) — тоже обычной. Тренер думает, что его ругание помогло, но на самом деле это просто статистика.',
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
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 mb-6">
          <p className="text-sm text-rose-700 mb-2">Это был эксперимент на</p>
          <h1 className="text-3xl font-bold text-rose-800 mb-2">Статистическую интуицию</h1>
          <p className="text-stone-600">Наш мозг плохо работает с вероятностями. Посмотрим, как именно.</p>
        </div>
        
        <h2 className="text-xl font-bold text-stone-800 mb-4">Твои результаты</h2>
        
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
              <h3 className="font-semibold text-rose-800 mb-2">Как это работает 🦖</h3>
              <p className="text-sm text-rose-700 mb-2">
                Статистическая интуиция — одна из самых слабых сторон нашего рептильного мозга. 
                Мы эволюционировали для работы с конкретными объектами (1, 2, 3 льва), 
                а не с вероятностями и процентами. Раптор видит «99% точность теста» и думает: 
                «Отлично!» — но не считает базовую вероятность. Кора могла бы, но раптор уже принял решение.
              </p>
              <p className="text-sm text-rose-700">
                <strong>Совет:</strong> Встречая задачу на вероятность, сначала спроси: 
                «Какова базовая вероятность?» Дай коре шанс перехватить управление у раптора. 
                И помни: корреляция ≠ причинность.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 mb-6">
          <h3 className="font-semibold text-stone-800 mb-2">📚 Историческая справка</h3>
          <p className="text-sm text-stone-600 mb-2">
            Задачу Монти Холла популяризировала колонка <strong>Мэрилин вос Савант</strong> в журнале Parade в 1990 году. 
            Она вызвала бурную дискуссию — даже известные математики (включая Пола Эрдиша) initially не соглашались с её ответом. 
            Задача названа в честь ведущего шоу «Let's Make a Deal» Монти Холла.
          </p>
          <p className="text-sm text-stone-600 mb-2">
            Ошибка конъюнкции была описана <strong>Амосом Тверски</strong> и <strong>Даниэлем Канеманом</strong> в 1983 году 
            в эксперименте с «Линдой» — описанием вымышленной женщины, которое подталкивало к логической ошибке.
          </p>
          <p className="text-sm text-stone-600">
            <strong>Книга:</strong> Даниэль Канеман «Думай медленно... решай быстро» (2011) — разделы о статистическом мышлении.
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
        <h1 className="text-xl font-bold text-stone-800">Эксперимент №3</h1>
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
