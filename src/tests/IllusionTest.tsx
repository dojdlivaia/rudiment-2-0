import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, addTestResult } from '../store';
import { ArrowLeft, Info } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

const illusions = [
  {
    id: 1,
    title: 'Иллюзия Мюллера-Лайера',
    description: 'Какая линия длиннее?',
    render: () => (
      <svg viewBox="0 0 300 150" className="w-full max-w-sm mx-auto">
        <line x1="50" y1="50" x2="250" y2="50" stroke="#1c1917" strokeWidth="3" />
        <line x1="50" y1="50" x2="70" y2="35" stroke="#1c1917" strokeWidth="3" />
        <line x1="50" y1="50" x2="70" y2="65" stroke="#1c1917" strokeWidth="3" />
        <line x1="250" y1="50" x2="230" y2="35" stroke="#1c1917" strokeWidth="3" />
        <line x1="250" y1="50" x2="230" y2="65" stroke="#1c1917" strokeWidth="3" />
        <line x1="50" y1="110" x2="250" y2="110" stroke="#1c1917" strokeWidth="3" />
        <line x1="50" y1="110" x2="70" y2="95" stroke="#1c1917" strokeWidth="3" />
        <line x1="50" y1="110" x2="70" y2="125" stroke="#1c1917" strokeWidth="3" />
        <line x1="250" y1="110" x2="230" y2="95" stroke="#1c1917" strokeWidth="3" />
        <line x1="250" y1="110" x2="230" y2="125" stroke="#1c1917" strokeWidth="3" />
      </svg>
    ),
    options: ['Верхняя длиннее', 'Нижняя длиннее', 'Они одинаковые'],
    correct: 2,
    explanation: 'Обе линии абсолютно одинаковые (200px)! Мозг интерпретирует стрелки как перспективу: «расходящиеся» стрелки выглядят как угол, направленный от нас (ближе), а «сходящиеся» — как угол, уходящий вдаль (дальше). Мозг «компенсирует» расстояние, увеличивая «дальнюю» линию.',
  },
  {
    id: 2,
    title: 'Иллюзия размера (Эббингауза)',
    description: 'Какой центральный круг больше?',
    render: () => (
      <svg viewBox="0 0 300 150" className="w-full max-w-sm mx-auto">
        <circle cx="100" cy="75" r="20" fill="#f97316" />
        <circle cx="60" cy="45" r="30" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1" />
        <circle cx="140" cy="45" r="30" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1" />
        <circle cx="60" cy="105" r="30" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1" />
        <circle cx="140" cy="105" r="30" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1" />
        <circle cx="220" cy="75" r="20" fill="#f97316" />
        <circle cx="195" cy="55" r="10" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1" />
        <circle cx="245" cy="55" r="10" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1" />
        <circle cx="195" cy="95" r="10" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1" />
        <circle cx="245" cy="95" r="10" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1" />
        <circle cx="220" cy="45" r="10" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1" />
        <circle cx="220" cy="105" r="10" fill="#e7e5e4" stroke="#d6d3d1" strokeWidth="1" />
      </svg>
    ),
    options: ['Левый больше', 'Правый больше', 'Они одинаковые'],
    correct: 2,
    explanation: 'Оба оранжевых круга имеют радиус 20px! Мозг оценивает размер относительно окружения. Круг среди больших кажется маленьким, круг среди маленьких — большим. Это работает и в реальной жизни: человек кажется высоким среди низких.',
  },
  {
    id: 3,
    title: 'Иллюзия тени',
    description: 'Какого цвета квадраты A и Б?',
    render: () => (
      <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto">
        <rect x="20" y="20" width="260" height="160" fill="#4ade80" />
        <rect x="20" y="20" width="65" height="40" fill="#16a34a" />
        <rect x="150" y="20" width="65" height="40" fill="#16a34a" />
        <rect x="85" y="60" width="65" height="40" fill="#16a34a" />
        <rect x="215" y="60" width="65" height="40" fill="#16a34a" />
        <rect x="20" y="100" width="65" height="40" fill="#16a34a" />
        <rect x="150" y="100" width="65" height="40" fill="#16a34a" />
        <rect x="85" y="140" width="65" height="40" fill="#16a34a" />
        <ellipse cx="180" cy="80" rx="45" ry="20" fill="#57534e" opacity="0.4" />
        <rect x="135" y="40" width="90" height="40" fill="#57534e" opacity="0.3" />
        <rect x="150" y="100" width="30" height="30" fill="#57534e" />
        <text x="165" y="120" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">A</text>
        <rect x="215" y="60" width="30" height="30" fill="#86efac" />
        <text x="230" y="80" textAnchor="middle" fill="#166534" fontSize="12" fontWeight="bold">Б</text>
      </svg>
    ),
    options: ['A темнее Б', 'Б темнее A', 'Они одинаковые по яркости'],
    correct: 2,
    explanation: 'Квадраты A и Б имеют одинаковую яркость пикселей! Мозг «знает», что тень делает вещи темнее, и компенсирует это. Поэтому тёмный квадрат в тени кажется «нормальным», а светлый квадрат вне тени — «таким же нормальным». Мозг оценивает не абсолютную яркость, а относительную.',
  },
  {
    id: 4,
    title: 'Адаптация цвета',
    description: 'Смотри на центральный крест 10 секунд. Что происходит с цветными точками?',
    render: () => (
      <div className="relative w-full max-w-sm mx-auto h-48 bg-stone-100 rounded-xl overflow-hidden flex items-center justify-center">
        <div className="text-4xl text-stone-400">✚</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-40 h-40">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  background: i === 3 ? '#22c55e' : '#f97316',
                  top: `${50 + 45 * Math.sin((i / 12) * Math.PI * 2)}%`,
                  left: `${50 + 45 * Math.cos((i / 12) * Math.PI * 2)}%`,
                  transform: 'translate(-50%, -50%)',
                  animation: `pulse-soft 1s ease-in-out ${i * 0.15}s infinite`,
                  opacity: 0.9,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    options: [
      'Точки движутся по кругу',
      'Появляется зелёная точка, бегущая по кругу',
      'Оранжевые точки исчезают',
      'Всё неподвижно',
    ],
    correct: 1,
    explanation: 'Это иллюзия «исчезающей» точки. Когда ты фиксируешь взгляд на кресте, периферическое зрение адаптируется к оранжевым точкам (нейронная адаптация), и они «исчезают». Но зелёная точка — новая, и мозг её «ловит». Создаётся иллюзия бегущей зелёной точки.',
  },
];

export default function IllusionTest({ profile, setProfile }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentIllusion = illusions[step];

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (step === illusions.length - 1) {
      setFinished(true);
      const score = answers.filter((a, i) => a === illusions[i].correct).length;
      const result = {
        id: Date.now().toString(),
        testType: 'illusion',
        date: new Date().toISOString(),
        score,
        maxScore: illusions.length,
        details: { answers },
      };
      setProfile(addTestResult(profile, result));
    } else {
      setStep(step + 1);
    }
  };

  if (finished) {
    const score = answers.filter((a, i) => a === illusions[i].correct).length;
    
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Результат: Иллюзии восприятия</h1>
        
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-stone-800">{score}/{illusions.length}</div>
            <p className="text-stone-500 mt-1">правильных ответов</p>
            <p className="text-sm text-stone-400 mt-2">
              {score === illusions.length ? 'Ты распознал все иллюзии! (Но всё равно попался на них визуально 🦖)' : 'Не переживай — попасться на иллюзию ≠ плохое зрение'}
            </p>
          </div>
        </div>

        <div className="bg-cyan-50 rounded-2xl border border-cyan-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-cyan-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-cyan-800 mb-2">Как это работает 🦖</h3>
              <p className="text-sm text-cyan-700 mb-2">
                Иллюзии — это не баг зрения. Это демонстрация того, как наш рептильный мозг <em>конструирует</em> реальность. 
                Мы не видим мир «как есть» — мы видим интерпретацию, построенную на основе сигналов от глаз + 
                предыдущего опыта + предсказаний. Раптор рисует свою картину мира, и иллюзии — моменты, 
                когда мы видим мазки его кисти.
              </p>
              <p className="text-sm text-cyan-700">
                <strong>Метафора:</strong> Мозг — не камера, а художник-раптор. Он рисует то, что «должно быть» 
                (основываясь на эволюционном опыте), а не то, что «есть». В саванне это помогало выживать — 
                быстрее распознать хищника, даже если видишь только тень. Но в современном мире раптор 
                иногда ошибается, и мы видим иллюзии.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 mb-6">
          <h3 className="font-semibold text-stone-800 mb-2">📚 Историческая справка</h3>
          <p className="text-sm text-stone-600 mb-2">
            Иллюзия Мюллера-Лайера была описана немецкими психологами <strong>Францем Карлом Мюллер-Лайером</strong> 
            в 1889 году. Иллюзия Эббингауза (или Титченера) названа в честь немецкого психолога <strong>Германа Эббингауза</strong>, 
            который опубликовал её в 1902 году (хотя иногда приписывается Эдварду Титченеру).
          </p>
          <p className="text-sm text-stone-600 mb-2">
            Иллюзия тени (checkershadow illusion) была создана нейробиологом <strong>Эдвардом Адельсоном</strong> 
            из MIT в 1995 году. Она демонстрирует, как мозг компенсирует тени, оценивая не абсолютную яркость, 
            а относительную — с учётом контекста.
          </p>
          <p className="text-sm text-stone-600">
            <strong>Книга:</strong> «Иллюзии зрения» (Visual Illusions) — коллекция классических оптических иллюзий 
            с объяснением механизмов их восприятия.
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
        <h1 className="text-xl font-bold text-stone-800">Иллюзии восприятия</h1>
        <span className="text-sm text-stone-500">{step + 1} / {illusions.length}</span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-cyan-500 h-2 rounded-full transition-all"
          style={{ width: `${((step + 1) / illusions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-2">{currentIllusion.title}</h2>
        <p className="text-stone-600 mb-4">{currentIllusion.description}</p>
        
        <div className="mb-6 p-4 bg-stone-50 rounded-xl">
          {currentIllusion.render()}
        </div>
        
        {!showExplanation ? (
          <div className="space-y-2">
            {currentIllusion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-3 rounded-xl border border-stone-200 hover:border-cyan-300 hover:bg-cyan-50 
                           text-stone-700 transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className={`p-4 rounded-xl mb-4 ${answers[step] === currentIllusion.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="font-medium text-sm mb-2">
                {answers[step] === currentIllusion.correct ? '✓ Верно!' : '✗ Не совсем...'}
              </p>
              <p className="text-sm text-stone-700">{currentIllusion.explanation}</p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
            >
              {step === illusions.length - 1 ? 'Завершить' : 'Дальше'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
