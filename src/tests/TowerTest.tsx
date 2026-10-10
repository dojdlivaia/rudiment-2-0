import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile, addTestResult } from '../store';
import { ArrowLeft, Info, RotateCcw } from 'lucide-react';

interface Props {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

type Peg = number[];

const DISK_COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#ef4444', '#22c55e'];

export default function TowerTest({ profile, setProfile }: Props) {
  const [diskCount, setDiskCount] = useState(3);
  const [pegs, setPegs] = useState<Peg[]>([[3, 2, 1], [], []]);
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);

  const minMoves = Math.pow(2, diskCount) - 1;

  const startGame = (disks: number) => {
    setDiskCount(disks);
    const initialPegs: Peg[] = [[], [], []];
    for (let i = disks; i >= 1; i--) {
      initialPegs[0].push(i);
    }
    setPegs(initialPegs);
    setSelectedPeg(null);
    setMoves(0);
    setFinished(false);
    setStarted(true);
  };

  const handlePegClick = useCallback((pegIdx: number) => {
    if (finished) return;

    if (selectedPeg === null) {
      if (pegs[pegIdx].length > 0) {
        setSelectedPeg(pegIdx);
      }
    } else {
      if (pegIdx === selectedPeg) {
        setSelectedPeg(null);
        return;
      }
      const fromPeg = pegs[selectedPeg];
      const toPeg = pegs[pegIdx];
      const disk = fromPeg[fromPeg.length - 1];

      if (toPeg.length === 0 || toPeg[toPeg.length - 1] > disk) {
        const newPegs = pegs.map(p => [...p]);
        newPegs[selectedPeg] = fromPeg.slice(0, -1);
        newPegs[pegIdx] = [...toPeg, disk];
        setPegs(newPegs);
        setMoves(moves + 1);
        setSelectedPeg(null);

        if (newPegs[2].length === diskCount) {
          setFinished(true);
          const efficiency = minMoves / moves;
          const score = Math.round(Math.min(1, efficiency) * diskCount);
          
          const result = {
            id: Date.now().toString(),
            testType: 'planning',
            date: new Date().toISOString(),
            score,
            maxScore: diskCount,
            details: { moves, minMoves, diskCount, efficiency },
          };
          setProfile(addTestResult(profile, result));
        }
      } else {
        setSelectedPeg(null);
      }
    }
  }, [selectedPeg, pegs, moves, finished, diskCount, minMoves, profile, setProfile]);

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <Link to="/tests" className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 mb-6">
          <ArrowLeft size={16} /> Назад к тестам
        </Link>

        <h1 className="text-2xl font-bold text-stone-800 mb-4">Башня Ханоя</h1>
        <p className="text-stone-600 mb-6">
          Перемести все диски с первого стержня на третий. 
          Правила: за один ход переносишь один диск, нельзя класть больший на меньший.
        </p>

        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <h3 className="font-semibold text-stone-800 mb-3">Выбери сложность:</h3>
          <div className="grid grid-cols-3 gap-3">
            {[3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => startGame(n)}
                className="p-4 rounded-xl border border-stone-200 hover:border-indigo-300 hover:bg-indigo-50 
                           text-center transition-all"
              >
                <div className="text-2xl font-bold text-stone-800">{n}</div>
                <div className="text-xs text-stone-500 mt-1">дисков</div>
                <div className="text-xs text-stone-400 mt-1">мин. {Math.pow(2, n) - 1} ходов</div>
              <div className="text-xs text-stone-400 mt-1">2<sup>{n}</sup> − 1</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2">Что это тестирует</h3>
              <p className="text-sm text-indigo-700">
                Башня Ханоя — классический тест на <strong>исполнительные функции</strong> (executive functions): 
                планирование, рабочую память и когнитивную гибкость. Нужно удерживать в голове 
                несколько шагов вперёд и адаптировать стратегию.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    const efficiency = minMoves / moves;
    const rating = efficiency >= 0.9 ? 'Отлично!' : efficiency >= 0.7 ? 'Хорошо' : efficiency >= 0.5 ? 'Нормально' : 'Можно лучше';
    
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-stone-800 mb-6">Результат: Башня Ханоя</h1>
        
        <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-stone-800">{moves}</div>
            <p className="text-stone-500 mt-1">ходов (минимум: {minMoves})</p>
            <p className="text-lg font-medium text-indigo-600 mt-2">{rating}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-stone-50 rounded-xl p-3">
              <div className="text-lg font-bold text-stone-800">{moves}</div>
              <div className="text-xs text-stone-500">Твои ходы</div>
            </div>
            <div className="bg-stone-50 rounded-xl p-3">
              <div className="text-lg font-bold text-stone-800">{minMoves}</div>
              <div className="text-xs text-stone-500">Оптимум</div>
            </div>
            <div className="bg-stone-50 rounded-xl p-3">
              <div className="text-lg font-bold text-stone-800">{Math.round(efficiency * 100)}%</div>
              <div className="text-xs text-stone-500">Эффективность</div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-2xl border border-indigo-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-indigo-800 mb-2">Что это значит</h3>
              <p className="text-sm text-indigo-700 mb-2">
                Башня Ханоя тестирует планирование и рабочую память — ключевые <strong>исполнительные функции</strong> (executive functions). 
                Оптимальная стратегия для N дисков: 2<sup>N</sup> − 1 ходов. Это рекурсивная задача: 
                чтобы переместить N дисков, сначала перемести N−1 на вспомогательный стержень, 
                потом перенеси самый большой, потом верни N−1.
              </p>
              <p className="text-sm text-indigo-700 mb-4">
                <strong>Совет:</strong> Тренируй планирование, разбивая большие задачи на подзадачи. 
                Визуализация зависимостей помогает мозгу удерживать структуру.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 mb-6">
          <h3 className="font-semibold text-stone-800 mb-2">📚 Историческая справка</h3>
          <p className="text-sm text-stone-600 mb-2">
            Задача «Башня Ханоя» была придумана французским математиком <strong>Эдуардом Люка</strong> в 1883 году. 
            Легенда гласит, что в храме города Ханой монахи перемещают 64 золотых диска на трёх алмазных стержнях. 
            Когда они завершат задачу, мир закончится. При 64 дисках это займёт 2⁶⁴ − 1 = 18 446 744 073 709 551 615 ходов — 
            примерно 585 миллиардов лет!
          </p>
          <p className="text-sm text-stone-600">
            В когнитивной психологии эта задача используется с 1960-х годов как тест на <strong>исполнительные функции</strong> (executive functions) — 
            высшие когнитивные процессы, управляющие целенаправленным поведением.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setStarted(false); }}
            className="flex-1 text-center bg-stone-100 text-stone-700 px-4 py-3 rounded-xl font-medium"
          >
            Ещё раз
          </button>
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
        <h1 className="text-xl font-bold text-stone-800">Башня Ханоя ({diskCount} дисков)</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-stone-500">Ходы: {moves}</span>
          <button onClick={() => startGame(diskCount)} className="p-1 hover:bg-stone-100 rounded">
            <RotateCcw size={16} className="text-stone-500" />
          </button>
        </div>
      </div>

      <p className="text-sm text-stone-500 mb-4">
        Нажми на стержень, чтобы выбрать верхний диск, затем на стержень, куда переместить.
      </p>

      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {pegs.map((peg, pegIdx) => (
            <button
              key={pegIdx}
              onClick={() => handlePegClick(pegIdx)}
              className={`relative flex flex-col-reverse items-center p-2 min-h-[200px] rounded-xl border-2 transition-all
                ${selectedPeg === pegIdx ? 'border-indigo-400 bg-indigo-50' : 'border-stone-200 hover:border-stone-300'}`}
            >
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-stone-300 rounded" />
              
              {peg.map((disk, diskIdx) => (
                <div
                  key={diskIdx}
                  className="rounded-lg mb-1 transition-all"
                  style={{
                    width: `${30 + disk * 15}%`,
                    height: '24px',
                    backgroundColor: DISK_COLORS[disk - 1],
                    opacity: selectedPeg === pegIdx && diskIdx === peg.length - 1 ? 0.7 : 1,
                  }}
                />
              ))}

              <div className="absolute top-1 text-xs text-stone-400">
                {['A', 'B', 'C'][pegIdx]}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-stone-500">
        Минимальное количество ходов: {minMoves}
      </div>
    </div>
  );
}
