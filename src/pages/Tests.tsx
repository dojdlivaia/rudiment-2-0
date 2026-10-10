import { Link } from 'react-router-dom';
import { Brain, Target, Shield, Eye, TrendingUp, Puzzle, ChevronRight } from 'lucide-react';
import { UserProfile } from '../store';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

const tests = [
  {
    id: 'anchoring',
    path: '/test/anchoring',
    icon: <Target size={24} />,
    title: 'Эффект якоря',
    description: 'Как случайные числа влияют на твои оценки',
    duration: '3 мин',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  {
    id: 'confirmation',
    path: '/test/confirmation',
    icon: <Shield size={24} />,
    title: 'Confirmation Bias',
    description: 'Поиск подтверждений и слепота к противоречиям',
    duration: '4 мин',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
  },
  {
    id: 'hindsight',
    path: '/test/hindsight',
    icon: <Eye size={24} />,
    title: 'Hindsight Bias',
    description: '«Я так и знал!» — иллюзия предсказуемости',
    duration: '3 мин',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  {
    id: 'calibration',
    path: '/test/calibration',
    icon: <TrendingUp size={24} />,
    title: 'Калибровка уверенности',
    description: 'Насколько точна твоя самооценка знаний',
    duration: '5 мин',
    color: 'bg-raptor-50 border-raptor-200 text-raptor-700',
  },
  {
    id: 'statistical',
    path: '/test/statistical',
    icon: <Puzzle size={24} />,
    title: 'Статистическая интуиция',
    description: 'Base rate fallacy и задача Монти Холла',
    duration: '5 мин',
    color: 'bg-rose-50 border-rose-200 text-rose-700',
  },
  {
    id: 'illusion',
    path: '/test/illusion',
    icon: <Brain size={24} />,
    title: 'Иллюзии восприятия',
    description: 'Как мозг достраивает реальность',
    duration: '3 мин',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  },
  {
    id: 'planning',
    path: '/test/planning',
    icon: <Puzzle size={24} />,
    title: 'Башня (планирование)',
    description: 'Executive functions и рабочая память',
    duration: '5 мин',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  },
];

export default function TestsPage({ profile }: Props) {
  const getTestResult = (testId: string) => {
    return profile.testResults.filter(r => r.testType === testId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Тесты</h1>
        <p className="text-stone-500">Каждый тест — маленькое окно в работу твоего мозга</p>
      </div>

      <div className="space-y-3">
        {tests.map(test => {
          const results = getTestResult(test.id);
          const lastScore = results.length > 0 ? results[results.length - 1].score : null;
          
          return (
            <Link
              key={test.id}
              to={test.path}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${test.color}`}>
                {test.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-stone-800">{test.title}</h3>
                  <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{test.duration}</span>
                </div>
                <p className="text-sm text-stone-500 truncate">{test.description}</p>
                {results.length > 0 && (
                  <p className="text-xs text-raptor-600 mt-1">
                    Пройден {results.length}× {lastScore !== null && `• последний: ${lastScore}`}
                  </p>
                )}
              </div>
              <ChevronRight size={20} className="text-stone-400 flex-shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
