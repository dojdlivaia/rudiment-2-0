import { Link } from 'react-router-dom';
import { Brain, Target, Eye, Puzzle, TrendingUp, Shield, DollarSign, MessageSquare, Search, Clock, Trash2, Sparkles } from 'lucide-react';
import { UserProfile, resetProfile } from '../store';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

// Порядок карточек: от нейтральных к «говорящим»
const experiments = [
  {
    title: 'Что ты видишь?',
    subtitle: 'Эксперимент №1',
    description: 'Несколько изображений. Тебе нужно выбрать правильный ответ.',
    icon: <Eye size={24} />,
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    link: '/test/illusion',
    testType: 'illusion',
  },
  {
    title: 'Насколько ты уверен?',
    subtitle: 'Эксперимент №2',
    description: 'Отвечай на вопросы и оценивай свою уверенность.',
    icon: <TrendingUp size={24} />,
    color: 'bg-green-50 text-green-700 border-green-200',
    link: '/test/calibration',
    testType: 'calibration',
  },
  {
    title: 'Статистическая интуиция',
    subtitle: 'Эксперимент №3',
    description: 'Задачи на вероятность. Доверяй интуиции.',
    icon: <Puzzle size={24} />,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    link: '/test/statistical',
    testType: 'statistical',
  },
  {
    title: 'Первое число',
    subtitle: 'Эксперимент №4',
    description: 'Тебе покажут число, а потом зададут вопрос.',
    icon: <Target size={24} />,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    link: '/test/anchoring',
    testType: 'anchoring',
  },
  {
    title: 'Что чаще случается?',
    subtitle: 'Эксперимент №5',
    description: 'Выбери, какое событие происходит чаще.',
    icon: <Search size={24} />,
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    link: '/test/availability',
    testType: 'availability',
  },
  {
    title: 'Одна история, две версии',
    subtitle: 'Эксперимент №6',
    description: 'Прочитай несколько историй и ответь на вопросы.',
    icon: <MessageSquare size={24} />,
    color: 'bg-pink-50 text-pink-700 border-pink-200',
    link: '/test/framing',
    testType: 'framing',
  },
  {
    title: 'Сколько это займёт?',
    subtitle: 'Эксперимент №7',
    description: 'Оцени, сколько времени займут обычные задачи.',
    icon: <Clock size={24} />,
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    link: '/test/planning-fallacy',
    testType: 'planningFallacy',
  },
  {
    title: 'Проверяем гипотезу',
    subtitle: 'Эксперимент №8',
    description: 'Ты получаешь информацию. Что ты будешь изучать?',
    icon: <Shield size={24} />,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    link: '/test/confirmation',
    testType: 'confirmation',
  },
  {
    title: 'Предскажи исход',
    subtitle: 'Эксперимент №9',
    description: 'Прочитай историю и оцени, насколько предсказуем результат.',
    icon: <Sparkles size={24} />,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    link: '/test/hindsight',
    testType: 'hindsight',
  },
  {
    title: 'Продолжать или выйти?',
    subtitle: 'Эксперимент №10',
    description: 'Несколько жизненных сценариев. Что ты выберешь?',
    icon: <DollarSign size={24} />,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    link: '/test/sunk-cost',
    testType: 'sunkCost',
  },
  {
    title: 'Башня',
    subtitle: 'Эксперимент №11',
    description: 'Перемести диски с одного стержня на другой.',
    icon: <Brain size={24} />,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    link: '/test/planning',
    testType: 'planning',
  },
];

export default function HomePage({ profile, setProfile }: Props) {
  const totalTests = profile.testResults.length;
  const streak = profile.streak;

  const handleReset = () => {
    if (window.confirm('Вы уверены? Вся статистика будет удалена.')) {
      const emptyProfile = resetProfile();
      setProfile(emptyProfile);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Hero */}
      <section className="text-center py-12 md:py-20">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="animate-pulse-soft">🦖</span>
          <span>11 экспериментов по когнитивной психологии</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 mb-4 leading-tight">
          Рудимент <span className="text-green-600">2.0</span>
        </h1>
        
        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-4">
          Твой внутренний велоцираптор реагирует быстрее, чем кора.
        </p>
        <p className="text-stone-500 max-w-xl mx-auto mb-8">
          Серия экспериментов, в которых ты будешь принимать решения. 
          После каждого — разбор того, как на самом деле работает твой мозг.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/tests"
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-green-200 hover:shadow-xl"
          >
            <Brain size={20} />
            Начать эксперименты
          </Link>
          <Link
            to="/profile"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-700 px-6 py-3 rounded-xl font-semibold border border-stone-200 transition-all"
          >
            <TrendingUp size={20} />
            Мой профиль
          </Link>
        </div>
      </section>

      {/* Stats */}
      {totalTests > 0 && (
        <>
          <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-2xl p-4 border border-stone-200 text-center">
              <div className="text-3xl font-bold text-green-600">{totalTests}</div>
              <div className="text-sm text-stone-500 mt-1">Экспериментов пройдено</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-stone-200 text-center">
              <div className="text-3xl font-bold text-amber-500">{streak} 🔥</div>
              <div className="text-sm text-stone-500 mt-1">Дней подряд</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-stone-200 text-center col-span-2 md:col-span-1">
              <div className="text-3xl font-bold text-orange-500">
                {Math.round(Object.values(profile.biasScores).reduce((a, b) => a + b, 0) / Math.max(Object.values(profile.biasScores).filter(v => v > 0).length, 1))}
              </div>
              <div className="text-sm text-stone-500 mt-1">Средняя уязвимость</div>
            </div>
          </section>
          <div className="flex justify-center mb-12">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-stone-500 hover:text-red-600 border border-stone-200 hover:border-red-300 rounded-xl transition-colors"
            >
              <Trash2 size={16} />
              Сбросить статистику
            </button>
          </div>
        </>
      )}

      {/* Experiments list */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">Эксперименты</h2>
        <p className="text-stone-500 mb-6">Проходи в любом порядке. После каждого — разбор.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {experiments.map((exp, i) => {
            const results = profile.testResults.filter(r => r.testType === exp.testType);
            const passed = results.length > 0;
            
            return (
              <Link
                key={i}
                to={exp.link}
                className={`block p-5 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-md ${exp.color}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium opacity-70">{exp.subtitle}</span>
                  {passed && <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full">✓</span>}
                </div>
                <div className="mb-3">{exp.icon}</div>
                <h3 className="font-semibold text-lg mb-1">{exp.title}</h3>
                <p className="text-sm opacity-80">{exp.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-gradient-to-br from-stone-50 to-green-50 rounded-3xl p-8 md:p-12 border border-stone-200">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">Как это работает</h2>
        <div className="grid md:grid-cols-3 gap-6 text-stone-600">
          <div>
            <div className="text-2xl mb-2">🧪</div>
            <p className="mb-2">
              <strong className="text-stone-800">Ты участвуешь в эксперименте.</strong> 
              Каждый сценарий — классический тест из когнитивной психологии.
            </p>
          </div>
          <div>
            <div className="text-2xl mb-2">🔍</div>
            <p className="mb-2">
              <strong className="text-stone-800">После — разбор.</strong> 
              Что произошло, почему мозг так решил, как это работает.
            </p>
          </div>
          <div>
            <div className="text-2xl mb-2">📊</div>
            <p className="mb-2">
              <strong className="text-stone-800">Потом — профиль.</strong> 
              После нескольких экспериментов ты увидишь свою карту.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
