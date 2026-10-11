import { Link } from 'react-router-dom';
import { Brain, Target, Eye, Puzzle, TrendingUp, Shield, DollarSign, MessageSquare, Search, Clock } from 'lucide-react';
import { UserProfile } from '../store';

interface Props {
  profile: UserProfile;
}

export default function HomePage({ profile }: Props) {
  const totalTests = profile.testResults.length;
  const streak = profile.streak;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Hero */}
      <section className="text-center py-12 md:py-20">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span className="animate-pulse-soft">🦖</span>
          <span>Когнитивные искажения и метапознание</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 mb-4 leading-tight">
          Рудимент <span className="text-green-600">2.0</span>
        </h1>
        
        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-4">
          Твой внутренний велоцираптор реагирует быстрее, чем кора.
        </p>
        <p className="text-stone-500 max-w-xl mx-auto mb-8">
          Когнитивные искажения — это эволюционные эвристики. Быстрые, дешёвые, когда-то спасавшие жизнь. 
          В современном мире они дают систематическую ошибку. Давай посмотрим, как это работает.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/tests"
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-green-200 hover:shadow-xl"
          >
            <Brain size={20} />
            Начать тесты
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
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-2xl p-4 border border-stone-200 text-center">
            <div className="text-3xl font-bold text-green-600">{totalTests}</div>
            <div className="text-sm text-stone-500 mt-1">Тестов пройдено</div>
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
      )}

      {/* Test categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">Что исследуем</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TestCard
            icon={<Target size={24} />}
            title="Эффект якоря"
            description="Первое число, которое ты видишь, влияет на оценку. Даже если оно случайное."
            color="bg-blue-50 text-blue-700 border-blue-200"
            link="/test/anchoring"
          />
          <TestCard
            icon={<Shield size={24} />}
            title="Склонность к подтверждению"
            description="Мы ищем подтверждения тому, во что уже верим, и игнорируем противоречия."
            color="bg-purple-50 text-purple-700 border-purple-200"
            link="/test/confirmation"
          />
          <TestCard
            icon={<Eye size={24} />}
            title="Эффект «я так и знал!»"
            description="После того, как узнал результат, кажется, что предсказал бы."
            color="bg-amber-50 text-amber-700 border-amber-200"
            link="/test/hindsight"
          />
          <TestCard
            icon={<TrendingUp size={24} />}
            title="Калибровка уверенности"
            description="Насколько точна твоя самооценка? Уверенность vs правильность."
            color="bg-green-50 text-green-700 border-green-200"
            link="/test/calibration"
          />
          <TestCard
            icon={<Puzzle size={24} />}
            title="Статистическая интуиция"
            description="Base rate fallacy, Монти Холл — задачи, где интуиция подводит."
            color="bg-rose-50 text-rose-700 border-rose-200"
            link="/test/statistical"
          />
          <TestCard
            icon={<Brain size={24} />}
            title="Иллюзии восприятия"
            description="Мозг достраивает реальность. Посмотрим, как именно."
            color="bg-cyan-50 text-cyan-700 border-cyan-200"
            link="/test/illusion"
          />
          <TestCard
            icon={<DollarSign size={24} />}
            title="Ошибка невозвратных затрат"
            description="Продолжать ли то, во что уже вложено много ресурсов?"
            color="bg-orange-50 text-orange-700 border-orange-200"
            link="/test/sunk-cost"
          />
          <TestCard
            icon={<MessageSquare size={24} />}
            title="Эффект формулировки"
            description="Одна и та же информация в разной подаче меняет решение."
            color="bg-pink-50 text-pink-700 border-pink-200"
            link="/test/framing"
          />
          <TestCard
            icon={<Search size={24} />}
            title="Эффект доступности"
            description="Оценка вероятности по тому, что легко вспомнить."
            color="bg-teal-50 text-teal-700 border-teal-200"
            link="/test/availability"
          />
          <TestCard
            icon={<Clock size={24} />}
            title="Ошибка планирования"
            description="Оценка времени задач vs реальность. Раптор слишком оптимистичен."
            color="bg-violet-50 text-violet-700 border-violet-200"
            link="/test/planning-fallacy"
          />
        </div>
      </section>

      {/* About */}
      <section className="bg-gradient-to-br from-stone-50 to-green-50 rounded-3xl p-8 md:p-12 border border-stone-200">
        <h2 className="text-2xl font-bold text-stone-800 mb-4">Как это работает</h2>
        <div className="grid md:grid-cols-2 gap-6 text-stone-600">
          <div>
            <p className="mb-3">
              Каждый тест показывает, как работают когнитивные искажения — быстрые эвристики, 
              которые когда-то помогали выживать, а теперь дают систематические ошибки.
            </p>
            <p>
              После каждого теста — разбор: что произошло, почему мозг так решил, 
              и как заметить эту ловушку в следующий раз.
            </p>
          </div>
          <div>
            <p className="mb-3">
              Профиль показывает, где ты хорошо калиброван, а где раптор берёт верх. 
              Прогресс отслеживает динамику во времени.
            </p>
            <p>
              Метапознание — способность видеть, <em>как</em> ты думаешь. 
              Это навык, который можно тренировать.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TestCard({ icon, title, description, color, link }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  link: string;
}) {
  return (
    <Link
      to={link}
      className={`block p-5 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-md ${color}`}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </Link>
  );
}
