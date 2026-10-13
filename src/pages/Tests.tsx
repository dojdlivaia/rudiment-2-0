import { Link } from 'react-router-dom';
import { Brain, Target, Shield, Eye, TrendingUp, Puzzle, ChevronRight, DollarSign, MessageSquare, Search, Clock, Sparkles } from 'lucide-react';
import { UserProfile } from '../store';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

// Порядок: от нейтральных к «говорящим»
const experiments = [
  {
    id: 'illusion',
    path: '/test/illusion',
    icon: <Eye size={24} />,
    title: 'Что ты видишь?',
    subtitle: 'Эксперимент №1',
    description: 'Несколько изображений. Выбери правильный ответ.',
    duration: '3 мин',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  },
  {
    id: 'calibration',
    path: '/test/calibration',
    icon: <TrendingUp size={24} />,
    title: 'Насколько ты уверен?',
    subtitle: 'Эксперимент №2',
    description: 'Отвечай на вопросы и оценивай уверенность.',
    duration: '5 мин',
    color: 'bg-green-50 border-green-200 text-green-700',
  },
  {
    id: 'statistical',
    path: '/test/statistical',
    icon: <Puzzle size={24} />,
    title: 'Статистическая интуиция',
    subtitle: 'Эксперимент №3',
    description: 'Задачи на вероятность. Доверяй интуиции.',
    duration: '5 мин',
    color: 'bg-rose-50 border-rose-200 text-rose-700',
  },
  {
    id: 'anchoring',
    path: '/test/anchoring',
    icon: <Target size={24} />,
    title: 'Первое число',
    subtitle: 'Эксперимент №4',
    description: 'Тебе покажут число, а потом зададут вопрос.',
    duration: '4 мин',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
  },
  {
    id: 'availability',
    path: '/test/availability',
    icon: <Search size={24} />,
    title: 'Что чаще случается?',
    subtitle: 'Эксперимент №5',
    description: 'Выбери, какое событие происходит чаще.',
    duration: '3 мин',
    color: 'bg-teal-50 border-teal-200 text-teal-700',
  },
  {
    id: 'framing',
    path: '/test/framing',
    icon: <MessageSquare size={24} />,
    title: 'Одна история, две версии',
    subtitle: 'Эксперимент №6',
    description: 'Прочитай несколько историй и ответь на вопросы.',
    duration: '4 мин',
    color: 'bg-pink-50 border-pink-200 text-pink-700',
  },
  {
    id: 'planningFallacy',
    path: '/test/planning-fallacy',
    icon: <Clock size={24} />,
    title: 'Сколько это займёт?',
    subtitle: 'Эксперимент №7',
    description: 'Оцени, сколько времени займут обычные задачи.',
    duration: '3 мин',
    color: 'bg-violet-50 border-violet-200 text-violet-700',
  },
  {
    id: 'confirmation',
    path: '/test/confirmation',
    icon: <Shield size={24} />,
    title: 'Проверяем гипотезу',
    subtitle: 'Эксперимент №8',
    description: 'Ты получаешь информацию. Что ты будешь изучать?',
    duration: '4 мин',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
  },
  {
    id: 'hindsight',
    path: '/test/hindsight',
    icon: <Sparkles size={24} />,
    title: 'Предскажи исход',
    subtitle: 'Эксперимент №9',
    description: 'Прочитай историю и оцени, насколько предсказуем результат.',
    duration: '3 мин',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  {
    id: 'sunkCost',
    path: '/test/sunk-cost',
    icon: <DollarSign size={24} />,
    title: 'Продолжать или выйти?',
    subtitle: 'Эксперимент №10',
    description: 'Несколько жизненных сценариев. Что ты выберешь?',
    duration: '3 мин',
    color: 'bg-orange-50 border-orange-200 text-orange-700',
  },
  {
    id: 'planning',
    path: '/test/planning',
    icon: <Brain size={24} />,
    title: 'Башня',
    subtitle: 'Эксперимент №11',
    description: 'Перемести диски с одного стержня на другой.',
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
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-2">Эксперименты</h1>
        <p className="text-stone-500">11 экспериментов по когнитивной психологии</p>
      </div>

      <div className="space-y-3">
        {experiments.map(exp => {
          const results = getTestResult(exp.id);
          const lastScore = results.length > 0 ? results[results.length - 1].score : null;
          
          return (
            <Link
              key={exp.id}
              to={exp.path}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${exp.color}`}>
                {exp.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-stone-400">{exp.subtitle}</span>
                  <h3 className="font-semibold text-stone-800">{exp.title}</h3>
                  <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{exp.duration}</span>
                </div>
                <p className="text-sm text-stone-500 truncate">{exp.description}</p>
                {results.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">
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
