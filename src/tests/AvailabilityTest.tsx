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
    id: 1,
    question: 'Что убивает больше людей в год?',
    optionA: 'Акулы',
    optionB: 'Коровы (от бодания/падения)',
    correct: 'B',
    statsA: '~5-10 человек',
    statsB: '~20-25 человек',
    explanation: 'Правильный ответ — коровы. В мире от акул погибает около 5-10 человек в год, а от коров — около 20-25 человек (от бодания, падения или несчастных случаев на фермах). Но мы чаще слышим про акул в новостях и фильмах (вспомни «Челюсти»), поэтому раптор думает, что они опаснее. Это эффект доступности: то, что легче вспомнить, кажется более вероятным.',
  },
  {
    id: 2,
    question: 'Что происходит чаще?',
    optionA: 'Авиакатастрофа',
    optionB: 'Автокатастрофа',
    correct: 'B',
    statsA: '~1 погибший на 10 млн рейсов',
    statsB: '~1 погибший на 100 млн км',
    explanation: 'Правильный ответ — автокатастрофа. Вероятность погибнуть в автокатастрофе в сотни раз выше, чем в авиакатастрофе. Самолёт — самый безопасный вид транспорта. Но авиакатастрофы получают огромное внимание в СМИ, они драматичнее и запоминаются лучше. Раптор оценивает риск по тому, насколько легко вспомнить примеры.',
  },
  {
    id: 3,
    question: 'Что чаще становится причиной смерти?',
    optionA: 'Террористический акт',
    optionB: 'Сердечное заболевание',
    correct: 'B',
    statsA: '~26 000 человек в год (мировой терроризм)',
    statsB: '~18 миллионов человек в год',
    explanation: 'Правильный ответ — сердечные заболевания. В мире от болезней сердца умирает около 18 миллионов человек в год (это ~30% всех смертей), а от терроризма — менее 26 000. Разница в 700 раз! Но террористические акты получают огромное внимание в СМИ, создавая иллюзию высокой вероятности. Раптор реагирует на драматичные, яркие события.',
  },
  {
    id: 4,
    question: 'Что опаснее для здоровья?',
    optionA: 'Курение',
    optionB: 'Радиация от АЭС (при нормальной работе)',
    correct: 'A',
    statsA: '~8 миллионов смертей в год',
    statsB: '~100 смертей в год (при нормальной работе)',
    explanation: 'Правильный ответ — курение. Курение убивает около 8 миллионов человек в год во всём мире (это ~15% всех смертей). Радиация от нормально работающих АЭС практически безопасна и вызывает менее 100 смертей в год (в основном работники АЭС). Но аварии на АЭС (Чернобыль, Фукусима) так драматичны, что раптор переоценивает риск в тысячи раз.',
  },
  {
    id: 5,
    question: 'Что чаще встречается в русском языке?',
    optionA: 'Слово, начинающееся на букву "К"',
    optionB: 'Слово, где "К" стоит на третьей позиции',
    correct: 'B',
    statsA: '~5% слов',
    statsB: '~8% слов',
    explanation: 'Правильный ответ — слова с "К" на третьей позиции. В русском языке таких слов действительно больше (около 8% против 5% для первой позиции). Но нам легче вспомнить слова, начинающиеся на "К", потому что мы ищем их по первой букве — это естественный способ поиска в памяти. Раптор оценивает частоту по тому, насколько легко прийти в голову примеры, а не по реальной статистике.',
  },
];

export default function AvailabilityTest({ profile, setProfile }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[step];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
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
        testType: 'availability',
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
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 mb-6">
          <p className="text-sm text-teal-700 mb-2">Это был эксперимент на</p>
          <h1 className="text-3xl font-bold text-teal-800 mb-2">Эффект доступности</h1>
          <p className="text-stone-600">Мы оцениваем вероятность по тому, что легко вспомнить. Но это не всегда правда.</p>
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
                <p className="text-sm font-medium text-stone-800">{q.question}</p>
                <p className="text-xs text-stone-600 mt-1">
                  {answers[i] === q.correct ? '✓ Верно' : `Твой ответ: ${answers[i] === 'A' ? q.optionA : q.optionB} → Верно: ${q.correct === 'A' ? q.optionA : q.optionB}`}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-teal-50 rounded-2xl border border-teal-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-teal-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-teal-800 mb-2">Как это работает 🦖</h3>
              <p className="text-sm text-teal-700 mb-2">
                Эффект доступности (availability heuristic) — наш рептильный мозг оценивает вероятность события 
                по тому, насколько легко вспомнить примеры. Раптор думает: «Если я легко могу представить 
                авиакатастрофу, значит это часто происходит». Но это не так — мы просто чаще видим их в новостях.
              </p>
              <p className="text-sm text-teal-700 mb-2">
                В саванне это помогало: если ты видел льва вчера, значит львы рядом, надо быть осторожным. 
                Но в современном мире СМИ показывают нам драматичные, редкие события (теракты, авиакатастрофы), 
                и раптор переоценивает их вероятность.
              </p>
              <p className="text-sm text-teal-700">
                <strong>Совет:</strong> Когда оцениваешь риск, спрашивай: «Это реально часто происходит или просто 
                часто показывают в новостях?» Ищи статистику, а не полагайся на то, что легко вспомнить.
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
        <h1 className="text-xl font-bold text-stone-800">Оценка рисков</h1>
        <span className="text-sm text-stone-500">{step + 1} / {questions.length}</span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-teal-500 h-2 rounded-full transition-all"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">{currentQuestion.question}</h2>
        
        {!showExplanation ? (
          <div className="space-y-2">
            <button
              onClick={() => handleAnswer('A')}
              className="w-full text-left p-4 rounded-xl border border-stone-200 hover:border-teal-300 hover:bg-teal-50 
                         text-stone-700 transition-all"
            >
              <span className="font-medium">{currentQuestion.optionA}</span>
            </button>
            <button
              onClick={() => handleAnswer('B')}
              className="w-full text-left p-4 rounded-xl border border-stone-200 hover:border-teal-300 hover:bg-teal-50 
                         text-stone-700 transition-all"
            >
              <span className="font-medium">{currentQuestion.optionB}</span>
            </button>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className={`p-4 rounded-xl mb-4 ${answers[step] === currentQuestion.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="font-medium text-sm mb-2">
                {answers[step] === currentQuestion.correct ? '✓ Верно!' : '✗ Не совсем...'}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-blue-700 font-medium">{currentQuestion.optionA}</p>
                  <p className="text-stone-600 mt-1">{currentQuestion.statsA}</p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <p className="text-purple-700 font-medium">{currentQuestion.optionB}</p>
                  <p className="text-stone-600 mt-1">{currentQuestion.statsB}</p>
                </div>
              </div>
              <p className="text-sm text-stone-700">{currentQuestion.explanation}</p>
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
            >
              {step === questions.length - 1 ? 'Завершить' : 'Далее →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
