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
      <svg viewBox="0 0 300 180" className="w-full max-w-sm mx-auto">
        {/* Верхняя линия со сходящимися стрелками (выглядит длиннее) */}
        <g transform="translate(30, 0)">
          <line x1="20" y1="60" x2="220" y2="60" stroke="#1c1917" strokeWidth="3" />
          {/* Стрелки сходятся внутрь */}
          <line x1="20" y1="60" x2="40" y2="45" stroke="#1c1917" strokeWidth="3" />
          <line x1="20" y1="60" x2="40" y2="75" stroke="#1c1917" strokeWidth="3" />
          <line x1="220" y1="60" x2="200" y2="45" stroke="#1c1917" strokeWidth="3" />
          <line x1="220" y1="60" x2="200" y2="75" stroke="#1c1917" strokeWidth="3" />
        </g>
        {/* Нижняя линия с расходящимися стрелками (выглядит короче) */}
        <g transform="translate(50, 0)">
          <line x1="20" y1="130" x2="220" y2="130" stroke="#1c1917" strokeWidth="3" />
          {/* Стрелки расходятся наружу */}
          <line x1="20" y1="130" x2="5" y2="115" stroke="#1c1917" strokeWidth="3" />
          <line x1="20" y1="130" x2="5" y2="145" stroke="#1c1917" strokeWidth="3" />
          <line x1="220" y1="130" x2="235" y2="115" stroke="#1c1917" strokeWidth="3" />
          <line x1="220" y1="130" x2="235" y2="145" stroke="#1c1917" strokeWidth="3" />
        </g>
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
    title: 'Иллюзия тени (Адельсона)',
    description: 'Какого цвета квадраты A и Б?',
    render: () => (
      <svg viewBox="0 0 300 220" className="w-full max-w-sm mx-auto">
        {/* Светлая часть доски (зеленая) */}
        <rect x="20" y="20" width="260" height="180" fill="#86efac" />
        
        {/* Темные клетки шахматной доски */}
        <rect x="20" y="20" width="65" height="45" fill="#166534" />
        <rect x="150" y="20" width="65" height="45" fill="#166534" />
        <rect x="85" y="65" width="65" height="45" fill="#166534" />
        <rect x="215" y="65" width="65" height="45" fill="#166534" />
        <rect x="20" y="110" width="65" height="45" fill="#166534" />
        <rect x="150" y="110" width="65" height="45" fill="#166534" />
        <rect x="85" y="155" width="65" height="45" fill="#166534" />
        <rect x="215" y="155" width="65" height="45" fill="#166534" />
        
        {/* Цилиндр (тень от него) */}
        <ellipse cx="180" cy="90" rx="50" ry="25" fill="#57534e" opacity="0.5" />
        <rect x="130" y="40" width="100" height="50" fill="#57534e" opacity="0.4" />
        
        {/* Квадрат A в тени - СЕРЫЙ (одинаковый с Б!) */}
        <rect x="150" y="110" width="35" height="35" fill="#737373" />
        
        {/* Квадрат Б на свету - ТОЖЕ СЕРЫЙ (одинаковый с A!) */}
        <rect x="215" y="65" width="35" height="35" fill="#737373" />
        
        {/* Метки A и Б */}
        <line x1="167" y1="150" x2="167" y2="170" stroke="#1c1917" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="167" y="190" textAnchor="middle" fill="#1c1917" fontSize="18" fontWeight="bold">A</text>
        
        <line x1="232" y1="60" x2="232" y2="40" stroke="#1c1917" strokeWidth="2" markerEnd="url(#arrow)" />
        <text x="232" y="30" textAnchor="middle" fill="#1c1917" fontSize="18" fontWeight="bold">Б</text>
        
        {/* Определение стрелки */}
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#1c1917" />
          </marker>
        </defs>
      </svg>
    ),
    options: ['A темнее Б', 'Б темнее A', 'Они одинаковые'],
    correct: 2,
    explanation: 'Оба квадрата имеют ОДИНАКОВЫЙ серый цвет (#737373)! Мозг «знает», что тень делает вещи темнее, и компенсирует это. Поэтому квадрат A в тени кажется «светлым» (мозг думает: «раз он в тени, но выглядит серым, значит на самом деле он светлый»). А квадрат Б на свету кажется «тёмным» (мозг думает: «раз он на свету, но выглядит серым, значит на самом деле он тёмный»). Мозг оценивает не абсолютную яркость, а относительную с учётом контекста.',
  },
  {
    id: 4,
    title: 'Иллюзия Понцо',
    description: 'Какая горизонтальная линия длиннее?',
    render: () => (
      <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto">
        {/* Сходящиеся линии (как рельсы уходящие вдаль) */}
        <line x1="50" y1="180" x2="130" y2="20" stroke="#1c1917" strokeWidth="3" />
        <line x1="250" y1="180" x2="170" y2="20" stroke="#1c1917" strokeWidth="3" />
        
        {/* Верхняя линия - ТОЧНО 100px */}
        <line x1="100" y1="60" x2="200" y2="60" stroke="#1c1917" strokeWidth="4" />
        
        {/* Нижняя линия - ТОЧНО 100px (одинаковая с верхней!) */}
        <line x1="100" y1="140" x2="200" y2="140" stroke="#1c1917" strokeWidth="4" />
      </svg>
    ),
    options: ['Верхняя длиннее', 'Нижняя длиннее', 'Они одинаковые'],
    correct: 2,
    explanation: 'Обе линии абсолютно одинаковые (100px)! Мозг интерпретирует сходящиеся линии как перспективу — рельсы, уходящие вдаль. Верхняя линия кажется «дальше», поэтому мозг «увеличивает» её, компенсируя расстояние. Это та же механика, что и в иллюзии Мюллера-Лайера.',
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
        <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-6 mb-6">
          <p className="text-sm text-cyan-700 mb-2">Это был эксперимент на</p>
          <h1 className="text-3xl font-bold text-cyan-800 mb-2">Иллюзии восприятия</h1>
          <p className="text-stone-600">Мозг достраивает реальность. Иногда он ошибается — и мы видим иллюзии.</p>
        </div>
        
        <h2 className="text-xl font-bold text-stone-800 mb-4">Твои результаты</h2>
        
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
        <h1 className="text-xl font-bold text-stone-800">Эксперимент №1</h1>
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
