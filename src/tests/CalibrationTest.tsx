import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserProfile, addCalibrationPoint } from '../store';
import { ArrowLeft, Info } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

// Большой пул вопросов
const allQuestions = [
  { q: 'Столица Австралии?', options: ['Сидней', 'Мельбурн', 'Канберра', 'Брисбен'], correct: 2 },
  { q: 'Сколько костей в теле взрослого человека?', options: ['186', '206', '226', '256'], correct: 1 },
  { q: 'В каком году пала Берлинская стена?', options: ['1987', '1989', '1991', '1985'], correct: 1 },
  { q: 'Какая планета самая большая в Солнечной системе?', options: ['Сатурн', 'Нептун', 'Юпитер', 'Уран'], correct: 2 },
  { q: 'Кто написал «Войну и мир»?', options: ['Достоевский', 'Чехов', 'Толстой', 'Тургенев'], correct: 2 },
  { q: 'Какой элемент имеет атомный номер 79?', options: ['Серебро', 'Золото', 'Платина', 'Медь'], correct: 1 },
  { q: 'Сколько хромосом у человека?', options: ['23', '44', '46', '48'], correct: 2 },
  { q: 'Какой океан самый глубокий?', options: ['Атлантический', 'Индийский', 'Тихий', 'Северный Ледовитый'], correct: 2 },
  { q: 'В каком году человек впервые полетел в космос?', options: ['1957', '1961', '1965', '1969'], correct: 1 },
  { q: 'Сколько зубов у взрослого человека?', options: ['28', '30', '32', '34'], correct: 2 },
  { q: 'Какая самая длинная река в мире?', options: ['Амазонка', 'Нил', 'Миссисипи', 'Янцзы'], correct: 1 },
  { q: 'Кто открыл пенициллин?', options: ['Пастер', 'Флеминг', 'Кох', 'Дженнер'], correct: 1 },
  { q: 'Сколько планет в Солнечной системе?', options: ['7', '8', '9', '10'], correct: 1 },
  { q: 'В каком году началась Вторая мировая война?', options: ['1937', '1939', '1941', '1945'], correct: 1 },
  { q: 'Какой химический символ у железа?', options: ['Ir', 'Fe', 'In', 'Fr'], correct: 1 },
  { q: 'Сколько камер в сердце человека?', options: ['2', '3', '4', '5'], correct: 2 },
  { q: 'Кто нарисовал «Мону Лизу»?', options: ['Микеланджело', 'Рафаэль', 'Да Винчи', 'Ботичелли'], correct: 2 },
  { q: 'Какая страна самая большая по площади?', options: ['Канада', 'Китай', 'США', 'Россия'], correct: 3 },
  { q: 'В каком году был изобретён интернет (ARPANET)?', options: ['1965', '1969', '1975', '1983'], correct: 1 },
  { q: 'Сколько костей в кисти руки?', options: ['19', '23', '27', '31'], correct: 2 },
];

// Функция для получения вопросов, которые пользователь ещё не видел
function getUnseenQuestions(profile: UserProfile, count: number) {
  // Получаем вопросы, которые уже были в прошлых тестах
  const seenQuestions = new Set<string>();
  profile.testResults.forEach(result => {
    if (result.testType === 'calibration' && result.details.seenQuestions) {
      result.details.seenQuestions.forEach((q: string) => seenQuestions.add(q));
    }
  });

  // Фильтруем вопросы, которые ещё не были показаны
  const unseen = allQuestions.filter(q => !seenQuestions.has(q.q));
  
  // Если все вопросы уже были показаны, начинаем заново
  const pool = unseen.length >= count ? unseen : allQuestions;
  
  // Перемешиваем и берём нужное количество
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function CalibrationTest({ profile, setProfile }: Props) {
  const [questions] = useState(() => getUnseenQuestions(profile, 8));
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<'question' | 'confidence'>('question');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [confidence, setConfidence] = useState(50);
  const [answers, setAnswers] = useState<{ selected: number; confidence: number; correct: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  const currentQ = questions[step];

  const handleAnswerSelect = (idx: number) => {
    setSelectedAnswer(idx);
  };

  const handleContinueToConfidence = () => {
    if (selectedAnswer === null) return;
    setPhase('confidence');
  };

  const handleConfidenceSubmit = () => {
    if (selectedAnswer === null) return;
    
    const correct = selectedAnswer === currentQ.correct;
    const newAnswers = [...answers, { selected: selectedAnswer, confidence, correct }];
    setAnswers(newAnswers);

    const point = {
      confidence,
      correct,
      date: new Date().toISOString().split('T')[0],
    };
    setProfile(addCalibrationPoint(profile, point));

    if (step === questions.length - 1) {
      setFinished(true);
      // Сохраняем список показанных вопросов
      const seenQuestions = questions.map(q => q.q);
      const result = {
        id: Date.now().toString(),
        testType: 'calibration',
        date: new Date().toISOString(),
        score: newAnswers.filter(a => a.correct).length,
        maxScore: questions.length,
        details: { answers: newAnswers, seenQuestions },
      };
      // Сначала добавляем calibration point, потом test result
      const profileWithPoint = addCalibrationPoint(profile, point);
      const finalProfile = {
        ...profileWithPoint,
        testResults: [...profileWithPoint.testResults, result],
      };
      setProfile(finalProfile);
    } else {
      setStep(step + 1);
      setPhase('question');
      setSelectedAnswer(null);
      setConfidence(50);
    }
  };

  if (finished) {
    const correctCount = answers.filter(a => a.correct).length;
    const avgConfidence = Math.round(answers.reduce((a, b) => a + b.confidence, 0) / answers.length);
    const accuracy = Math.round((correctCount / answers.length) * 100);
    const calibrationGap = avgConfidence - accuracy;

    const chartData = answers.map((a, i) => ({
      question: `Q${i + 1}`,
      confidence: a.confidence,
      correct: a.correct ? 100 : 0,
    }));

    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
          <p className="text-sm text-green-700 mb-2">Это был эксперимент на</p>
          <h1 className="text-3xl font-bold text-green-800 mb-2">Калибровку уверенности</h1>
          <p className="text-stone-600">Насколько точно твоя уверенность соответствует реальности?</p>
        </div>
        
        <h2 className="text-xl font-bold text-stone-800 mb-4">Твои результаты</h2>
        
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
            <div className="text-2xl font-bold text-stone-800">{correctCount}/{questions.length}</div>
            <div className="text-xs text-stone-500 mt-1">Правильных</div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
            <div className="text-2xl font-bold text-stone-800">{avgConfidence}%</div>
            <div className="text-xs text-stone-500 mt-1">Ср. уверенность</div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
            <div className={`text-2xl font-bold ${Math.abs(calibrationGap) < 15 ? 'text-green-600' : 'text-amber-600'}`}>
              {calibrationGap > 0 ? '+' : ''}{calibrationGap}%
            </div>
            <div className="text-xs text-stone-500 mt-1">Калибровка</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <h3 className="font-semibold text-stone-800 mb-4">Уверенность vs Результат</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
                <XAxis dataKey="question" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="confidence" stroke="#f59e0b" strokeWidth={2} name="Уверенность %" />
                <Line type="monotone" dataKey="correct" stroke="#22c55e" strokeWidth={2} name="Правильно" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-green-50 rounded-2xl border border-green-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-800 mb-2">Что это значит 🦖</h3>
              <p className="text-sm text-green-700 mb-2">
                {calibrationGap > 15 && 'Ты склонен к сверхуверенности. Уверенность выше, чем реальная точность. Твой раптор слишком уверен в себе — типично для экспертов в знакомых областях.'}
                {calibrationGap < -15 && 'Ты склонен к неуверенности. Твоя точность выше, чем ты думаешь. Раптор сомневается, хотя кора знает ответ. Это бывает у людей с синдромом самозванца.'}
                {Math.abs(calibrationGap) <= 15 && 'Отличная калибровка! Твоя уверенность примерно соответствует реальности. Раптор и кора работают в гармонии — это редкий и ценный навык.'}
              </p>
              <p className="text-sm text-green-700">
                <strong>Совет:</strong> Калибровка — это способность коры головного мозга оценивать, 
                насколько прав раптор. Тренируемый навык. После каждого решения 
                спрашивай: «Насколько я уверен?» и потом проверяй. Со временем мозг учится точнее оценивать себя.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 mb-6">
          <h3 className="font-semibold text-stone-800 mb-2">📚 Историческая справка</h3>
          <p className="text-sm text-stone-600 mb-2">
            Концепция калибровки уверенности была разработана психологами <strong>Филипом Тетлоком</strong> и 
            <strong>Барбарой Меллорс</strong> в 1990-х годах. Тетлок показал, что «суперпрогнозисты» — люди, 
            чьи предсказания сбываются чаще среднего — обладают именно хорошей калибровкой, а не особыми знаниями.
          </p>
          <p className="text-sm text-stone-600">
            <strong>Книга:</strong> Филип Тетлок «Суперпрогнозирование: Искусство и наука предсказания» (2015)
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
        <h1 className="text-xl font-bold text-stone-800">Эксперимент №2</h1>
        <span className="text-sm text-stone-500">{step + 1} / {questions.length}</span>
      </div>

      <div className="w-full bg-stone-200 rounded-full h-2 mb-8">
        <div
          className="bg-green-500 h-2 rounded-full transition-all"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        {phase === 'question' ? (
          <>
            <p className="text-lg font-medium text-stone-800 mb-6">{currentQ.q}</p>
            
            <div className="space-y-2 mb-6">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerSelect(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedAnswer === idx
                      ? 'bg-green-50 border-green-400 text-green-800'
                      : 'border-stone-200 hover:border-green-300 hover:bg-green-50 text-stone-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={handleContinueToConfidence}
              disabled={selectedAnswer === null}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-stone-300 text-white px-4 py-3 rounded-xl font-medium transition-colors"
            >
              Далее →
            </button>
          </>
        ) : (
          <>
            <div className="mb-4 p-3 bg-stone-50 rounded-xl">
              <p className="text-sm text-stone-500">Твой ответ:</p>
              <p className="font-medium text-stone-800">{currentQ.options[selectedAnswer!]}</p>
            </div>

            <p className="text-stone-700 mb-2">Насколько ты уверен в этом ответе?</p>
            <p className="text-xs text-stone-400 mb-4">0% — совсем не уверен, 100% — абсолютно уверен</p>
            
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidence}
                  onChange={e => setConfidence(Number(e.target.value))}
                  className="flex-1 accent-green-500"
                />
                <span className="text-lg font-bold text-stone-700 w-14 text-right">{confidence}%</span>
              </div>
              <div className="flex justify-between text-xs text-stone-400 mt-1">
                <span>Не уверен</span>
                <span>Абсолютно уверен</span>
              </div>
            </div>

            <button
              onClick={handleConfidenceSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium transition-colors"
            >
              {step === questions.length - 1 ? 'Завершить' : 'Следующий вопрос →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
