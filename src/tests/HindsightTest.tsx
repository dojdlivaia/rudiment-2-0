import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, addTestResult } from '../store';
import { ArrowLeft, Info } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

const allScenarios = [
  {
    id: 1,
    event: 'Компания А выпустила новый смартфон',
    outcome: 'Смартфон провалился на рынке — продажи на 70% ниже прогноза',
  },
  {
    id: 2,
    event: 'Сборная Б вышла в финал чемпионата',
    outcome: 'Сборная Б проиграла финал со счётом 1:4',
  },
  {
    id: 3,
    event: 'Стартап В получил инвестиции $10M',
    outcome: 'Через год стартап В закрылся',
  },
  {
    id: 4,
    event: 'Учёные объявили о новой вакцине',
    outcome: 'Вакцина показала эффективность 95%',
  },
  {
    id: 5,
    event: 'Политик обещал снизить налоги',
    outcome: 'Налоги выросли через год после выборов',
  },
  {
    id: 6,
    event: 'Фильм получил 10 номинаций на Оскар',
    outcome: 'Фильм не получил ни одной награды',
  },
  {
    id: 7,
    event: 'Компания Г запустила новую соцсеть',
    outcome: 'Через полгода соцсеть закрылась из-за отсутствия пользователей',
  },
  {
    id: 8,
    event: 'Спортсмен установил мировой рекорд',
    outcome: 'На следующих соревнованиях он показал результат на 15% хуже',
  },
  {
    id: 9,
    event: 'Ресторан открылся в центре города с новым меню',
    outcome: 'Ресторан закрылся через 3 месяца из-за отсутствия клиентов',
  },
  {
    id: 10,
    event: 'Учёные предсказали мощное землетрясение',
    outcome: 'Землетрясение произошло точно в предсказанное время и месте',
  },
  {
    id: 11,
    event: 'Книга стала бестселлером в первую неделю',
    outcome: 'Через месяц книга исчезла из списков бестселлеров',
  },
  {
    id: 12,
    event: 'Город построил новую станцию метро',
    outcome: 'Станция оказалась невостребованной — пассажиропоток в 5 раз ниже прогноза',
  },
];

// Функция для получения сценариев, которые пользователь ещё не видел
function getUnseenScenarios(profile: UserProfile, count: number) {
  const seenScenarios = new Set<number>();
  profile.testResults.forEach(result => {
    if (result.testType === 'hindsight' && result.details.seenIds) {
      result.details.seenIds.forEach((id: number) => seenScenarios.add(id));
    }
  });

  const unseen = allScenarios.filter(s => !seenScenarios.has(s.id));
  const pool = unseen.length >= count ? unseen : allScenarios;
  
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function HindsightTest({ profile, setProfile }: Props) {
  const [scenarios] = useState(() => getUnseenScenarios(profile, 6));
  const [step, setStep] = useState(0);
  const [ratings, setRatings] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  const currentScenario = scenarios[step];

  const handleRate = (rating: number) => {
    const newRatings = [...ratings, rating];
    setRatings(newRatings);

    if (step === scenarios.length - 1) {
      setFinished(true);
      const avg = newRatings.reduce((a, b) => a + b, 0) / newRatings.length;
      const biasScore = Math.min(100, Math.max(0, (avg - 1) / 6 * 100));
      const score = Math.round((1 - biasScore / 100) * scenarios.length);
      
      const seenIds = scenarios.map(s => s.id);
      const result = {
        id: Date.now().toString(),
        testType: 'hindsight',
        date: new Date().toISOString(),
        score,
        maxScore: scenarios.length,
        details: { ratings: newRatings, average: avg, seenIds },
      };
      setProfile(addTestResult(profile, result));
    } else {
      setStep(step + 1);
    }
  };

  if (finished) {
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    const biasLevel = avg > 5 ? 'высокий' : avg > 3.5 ? 'умеренный' : 'низкий';
    
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
          <p className="text-sm text-amber-700 mb-2">Это был эксперимент на</p>
          <h1 className="text-3xl font-bold text-amber-800 mb-2">Эффект «я так и знал!»</h1>
          <p className="text-stone-600">После того, как узнал результат, кажется, что предсказал бы. Но это иллюзия.</p>
        </div>
        
        <h2 className="text-xl font-bold text-stone-800 mb-4">Твои результаты</h2>
        
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-stone-800">{avg.toFixed(1)}</div>
            <p className="text-stone-500 mt-1">средняя «предсказуемость» (из 7)</p>
            <p className={`text-sm mt-2 font-medium ${avg > 5 ? 'text-red-500' : avg > 3.5 ? 'text-amber-500' : 'text-green-600'}`}>
              Уровень hindsight bias: {biasLevel}
            </p>
          </div>
          
          <div className="space-y-3">
            {scenarios.map((s, i) => (
              <div key={i} className="p-3 bg-stone-50 rounded-xl">
                <p className="text-sm text-stone-600">{s.event}</p>
                <p className="text-sm text-stone-800 font-medium mt-1">→ {s.outcome}</p>
                <p className="text-xs text-stone-500 mt-1">Твоя оценка предсказуемости: {ratings[i]}/7</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-2">Как это работает 🦖</h3>
              <p className="text-sm text-amber-700 mb-2">
                Эффект «я так и знал!» — после того как мы узнали результат, 
                наш рептильный мозг переписывает память, делая событие более «предсказуемым», 
                чем оно было на самом деле. Раптор не любит неопределённость — ему проще 
                верить, что он всё знал заранее.
              </p>
              <p className="text-sm text-amber-700 mb-2">
                В саванне это помогало: «Я знал, что за кустом лев» → уверенность → быстрее реагируешь. 
                Но в современном мире это создаёт иллюзию понимания. Если всё «очевидно» 
                задним числом, мы перестаём учиться на ошибках.
              </p>
              <p className="text-sm text-amber-700">
                <strong>Совет:</strong> Перед важными событиями записывай свои прогнозы. 
                Потом сравнивай с реальностью. Это единственный способ увидеть, как раптор переписывает историю.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 mb-6">
          <h3 className="font-semibold text-stone-800 mb-2">📚 Историческая справка</h3>
          <p className="text-sm text-stone-600 mb-2">
            Hindsight bias был исследован <strong>Барухом Фишхоффом</strong> в 1975 году. 
            В своём классическом эксперименте он давал участникам описание исторических событий 
            и просил оценить вероятность различных исходов. После того как участники узнавали реальный исход, 
            они задним числом оценивали его как гораздо более вероятный.
          </p>
          <p className="text-sm text-stone-600">
            Этот эффект особенно опасен в медицине и юриспруденции, где задним числом ошибки кажутся «очевидными», 
            хотя на момент принятия решения они были неочевидны.
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
        <h1 className="text-xl font-bold text-stone-800">Эксперимент №9</h1>
        <span className="text-sm text-stone-500">{step + 1} / {scenarios.length}</span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-amber-500 h-2 rounded-full transition-all"
          style={{ width: `${((step + 1) / scenarios.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="mb-4">
          <p className="text-sm text-stone-500 mb-1">Событие:</p>
          <p className="text-lg font-medium text-stone-800">{currentScenario.event}</p>
        </div>
        
        <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-sm text-amber-600 mb-1">Результат:</p>
          <p className="text-stone-800 font-medium">{currentScenario.outcome}</p>
        </div>

        <p className="text-stone-700 mb-2">Насколько предсказуемым тебе кажется этот результат СЕЙЧАС?</p>
        <p className="text-xs text-stone-400 mb-4">1 = полная неожиданность, 7 = совершенно очевидно</p>

        <div className="grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map(n => (
            <button
              key={n}
              onClick={() => handleRate(n)}
              className="aspect-square rounded-xl border-2 border-stone-200 hover:border-amber-400 hover:bg-amber-50 
                         flex items-center justify-center font-bold text-stone-700 transition-all"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
