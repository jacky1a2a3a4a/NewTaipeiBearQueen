// React
import { useState, useEffect, useMemo } from 'react';

// Icons
import {
  MdPlayArrow,
  MdCheck,
  MdClose,
  MdBarChart,
  MdHome,
  MdPerson,
  MdMusicNote,
  MdDelete,
  MdWarning,
  MdVideogameAsset,
  MdPlace,
  MdChat,
} from 'react-icons/md';

// Config
import {
  USERS,
  RAW_QUIZ_DATA_V2,
  QUIZ_EXPLANATIONS_V2,
  type QuizQuestion,
} from './config';

// 洗牌選項 (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- Components ---

type RadarChartProps = {
  scores: {
    tsao: number;
    chang: number;
    hsu: number;
    wei: number;
  };
};

// 友誼雷達圖元件
const RadarChart = ({ scores }: RadarChartProps) => {
  const size = 200;
  const center = size / 2;
  const radius = 80;

  const keys = ['tsao', 'chang', 'hsu', 'wei'] as const;
  const points = keys
    .map((_, i) => {
      const angle = (Math.PI / 2) * i - Math.PI / 2;
      const value = (scores[keys[i]] || 0) * radius;
      const x = center + Math.cos(angle) * value;
      const y = center + Math.sin(angle) * value;
      return `${x},${y}`;
    })
    .join(' ');

  const fullPoints = keys.map((_, i) => {
    const angle = (Math.PI / 2) * i - Math.PI / 2;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    return { x, y };
  });

  return (
    <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-neutral-800/50 to-neutral-900/50 rounded-xl mb-6 border border-neutral-700">
      <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
        <MdBarChart size={20} className="text-green-500" /> 友誼雷達 Friendship
        Radar
      </h3>
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {[0.25, 0.5, 0.75, 1].map((r, i) => (
            <polygon
              key={i}
              points={keys
                .map((_, idx) => {
                  const angle = (Math.PI / 2) * idx - Math.PI / 2;
                  const val = r * radius;
                  return `${center + Math.cos(angle) * val},${
                    center + Math.sin(angle) * val
                  }`;
                })
                .join(' ')}
              fill="none"
              stroke="#404040"
              strokeWidth="1"
            />
          ))}
          {fullPoints.map((p, i) => (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="#404040"
            />
          ))}
          <polygon
            points={points}
            fill="rgba(34, 197, 94, 0.5)"
            stroke="#22c55e"
            strokeWidth="2"
          />

          <text
            x={center}
            y={center - radius - 15}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            曹
          </text>
          <text
            x={center + radius + 20}
            y={center}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            張
          </text>
          <text
            x={center}
            y={center + radius + 20}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            許福
          </text>
          <text
            x={center - radius - 20}
            y={center}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            威
          </text>
        </svg>
      </div>
      <p className="text-xs text-neutral-400 mt-4 text-center px-8">
        完成所有題組以解鎖完整形狀。
        <br />
        越飽滿代表你越是這個群組的核心八卦王！
      </p>
    </div>
  );
};

type QuizCardProps = {
  question: QuizQuestion;
  total: number;
  index: number;
  onAnswer: (isCorrect: boolean) => void;
};

// 問答卡片元件
const QuizCard = ({ question, total, index, onAnswer }: QuizCardProps) => {
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Side Effects
  useEffect(() => {
    const opts = Array.isArray(question.o) ? question.o : [question.o];
    const allOptions = [question.a, ...opts];
    setShuffledOptions(shuffleArray(allOptions));
    setSelectedOption(null);
    setIsAnswered(false);
  }, [question]);

  // Event Handler Functions
  // 處理選項點擊
  const handleOptionClick = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === question.a;

    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };

  // Constants and Configuration
  const isGameQuestion = question.q.includes('【激鬥峽谷】');
  const isTravelQuestion = question.year === 2023;
  const isDigitalQuestion = question.year === 2025;

  let cardBgClass =
    'bg-gradient-to-br from-neutral-800 to-neutral-900 border-neutral-700';
  let iconColorClass = 'text-green-500';
  let blurColorClass = 'bg-white/5';
  let IconComponent = MdMusicNote;

  if (isGameQuestion) {
    cardBgClass = 'bg-indigo-900 border-indigo-500';
    iconColorClass = 'text-indigo-300';
    blurColorClass = 'bg-indigo-500/20';
    IconComponent = MdVideogameAsset;
  } else if (isTravelQuestion) {
    cardBgClass = 'bg-emerald-900 border-emerald-500';
    iconColorClass = 'text-emerald-300';
    blurColorClass = 'bg-emerald-500/20';
    IconComponent = MdPlace;
  } else if (isDigitalQuestion) {
    cardBgClass = 'bg-rose-900 border-rose-500';
    iconColorClass = 'text-rose-300';
    blurColorClass = 'bg-rose-500/20';
    IconComponent = MdChat;
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto w-full p-4">
      {/* Progress Bar */}
      <div className="w-full bg-neutral-700 h-1 rounded-full mb-6 mt-2 relative">
        <div
          className="bg-green-500 h-1 rounded-full absolute top-0 left-0 transition-all duration-500"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        ></div>
        <div className="flex justify-between text-xs text-neutral-400 mt-2 font-mono">
          <span>
            {index + 1 < 10 ? `0${index + 1}` : index + 1}:{question.year}
          </span>
          <span>
            -
            {total - index - 1 < 10
              ? `0${total - index - 1}`
              : total - index - 1}
            :00
          </span>
        </div>
      </div>

      {/* Question Container */}
      <div className="flex-grow flex flex-col items-center justify-center mb-6">
        <div
          className={`w-full aspect-square max-h-64 rounded-lg shadow-2xl flex items-center justify-center p-6 border relative overflow-hidden transition-all duration-500 ${cardBgClass}`}
        >
          <div className="text-center z-10">
            <p
              className={`${iconColorClass} text-xs font-bold mb-4 uppercase tracking-widest flex items-center justify-center gap-2`}
            >
              <IconComponent size={14} />
              {question.year} • TRACK {index + 1}
            </p>
            <h2 className="text-white text-xl font-bold leading-tight">
              {question.q}
            </h2>
          </div>
          {/* Decorative background */}
          <div
            className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-2xl ${blurColorClass}`}
          ></div>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-8">
        {shuffledOptions.map((option, i) => {
          let buttonClass =
            'bg-neutral-800 border-transparent hover:bg-neutral-700 text-neutral-300';

          if (isAnswered) {
            if (option === question.a) {
              buttonClass =
                'bg-green-500/20 border-green-500 text-green-500 font-bold';
            } else if (option === selectedOption) {
              buttonClass = 'bg-red-500/20 border-red-500 text-red-500';
            } else {
              buttonClass = 'bg-neutral-900 text-neutral-600 opacity-50';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleOptionClick(option)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-md text-left text-sm transition-all duration-200 border ${buttonClass} flex justify-between items-center group`}
            >
              <span className="truncate pr-4">
                {i + 1}. {option}
              </span>
              {isAnswered && option === question.a && <MdCheck size={16} />}
              {isAnswered &&
                option === selectedOption &&
                option !== question.a && <MdClose size={16} />}
            </button>
          );
        })}
      </div>

      <p className="text-center text-neutral-500 text-xs">
        {isAnswered ? '跳轉中...' : '請選擇正確答案'}
      </p>
    </div>
  );
};

// --- Confirmation Modal Component ---

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

// 確認刪除彈出視窗元件
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 max-w-sm w-full shadow-2xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <MdWarning className="text-red-500" size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-neutral-400 text-sm">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-full bg-neutral-800 text-white font-bold text-sm hover:bg-neutral-700 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-full bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  );
};

// 主應用程式元件
const App = () => {
  const [view, setView] = useState<'home' | 'quiz' | 'result'>('home');
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Side Effects
  useEffect(() => {
    const saved = localStorage.getItem('friendship-blend-scores');
    if (saved) {
      setScores(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (view === 'result' && activeSetId) {
      const score = getNormalizedScore(activeSetId);
      saveScore(activeSetId, score);
    }
  }, [view, activeSetId, answers]);

  // Data Fetching Functions
  // 儲存分數到本地儲存
  const saveScore = (setId: string, score: number) => {
    const newScores = { ...scores, [setId]: score };
    setScores(newScores);
    localStorage.setItem('friendship-blend-scores', JSON.stringify(newScores));
  };

  // 取得正規化分數
  const getNormalizedScore = (setId: string): number => {
    const setQuestions = RAW_QUIZ_DATA_V2[setId];
    if (!setQuestions) return 0;

    const setAns = answers[setId] || {};
    const correctCount = Object.values(setAns).filter(Boolean).length;
    return correctCount / setQuestions.length;
  };

  // Event Handler Functions
  // 處理清除紀錄
  const handleClearRecords = () => {
    localStorage.removeItem('friendship-blend-scores');
    setScores({});
    setAnswers({});
    setShowResetConfirm(false);
  };

  // 開始問答
  const startQuiz = (setId: string) => {
    setActiveSetId(setId);
    setCurrentQuestionIndex(0);
    setView('quiz');
  };

  // 處理答案
  const handleAnswer = (isCorrect: boolean) => {
    if (!activeSetId) return;
    const currentSet = RAW_QUIZ_DATA_V2[activeSetId];
    const question = currentSet[currentQuestionIndex];

    setAnswers((prev) => ({
      ...prev,
      [activeSetId]: {
        ...(prev[activeSetId] || {}),
        [question.id]: isCorrect,
      },
    }));

    if (currentQuestionIndex < currentSet.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      calculateAndShowResult();
    }
  };

  // 計算並顯示結果
  const calculateAndShowResult = () => {
    setView('result');
  };

  // Constants and Configuration
  const totalStats = useMemo(() => {
    const normalized = {
      tsao: scores.tsao || 0,
      chang: scores.chang || 0,
      hsu: scores.hsu || 0,
      wei: scores.wei || 0,
    };
    return normalized;
  }, [scores]);

  // --- Views ---

  // 首頁視圖
  const HomeView = () => {
    const hour = new Date().getHours();
    let greeting = '早安';
    if (hour >= 12 && hour < 18) greeting = '午安';
    if (hour >= 18) greeting = '晚安';

    return (
      <div className="p-4 pb-24 space-y-8 animate-in fade-in duration-500 relative">
        {/* Header */}
        <div className="flex justify-between items-end">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {greeting}
          </h1>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="text-xs text-neutral-400 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <MdDelete size={12} /> 清除紀錄
          </button>
        </div>

        {/* Stats Summary */}
        <RadarChart scores={totalStats} />

        {/* Playlists (Quiz Sets) */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">
            為您推薦的精選友誼專輯
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.values(USERS).map((user) => {
              const isComplete = scores[user.id] !== undefined;
              const scorePercent = isComplete
                ? Math.round(scores[user.id] * 100)
                : 0;

              return (
                <div
                  key={user.id}
                  onClick={() => startQuiz(user.id)}
                  className="bg-neutral-800/60 hover:bg-neutral-800 transition-colors rounded-md p-3 group cursor-pointer flex flex-col gap-3 relative overflow-hidden"
                >
                  <div
                    className={`w-full aspect-square bg-gradient-to-br ${user.color} rounded-md shadow-lg flex items-center justify-center text-4xl font-bold text-white relative overflow-hidden`}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.icon
                    )}
                    {isComplete && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-xl font-bold text-green-400">
                          {scorePercent}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold truncate">
                      {user.nickname} {user.name}
                    </h3>
                    <p className="text-neutral-400 text-xs truncate">
                      由{' '}
                      <span className="font-bold text-neutral-300">
                        {user.name}
                      </span>{' '}
                      建立 • 包含 {user.content}
                    </p>
                  </div>

                  {/* Play Button Hover Effect */}
                  <div className="absolute bottom-12 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-xl">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black">
                      <MdPlayArrow size={20} className="ml-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="text-center text-neutral-500 text-xs pt-8 pb-4">
          <p>Friendship Blend • Made for TS, Chang, Hsu, Wei</p>
        </div>

        {/* Custom Confirmation Modal */}
        <ConfirmModal
          isOpen={showResetConfirm}
          onClose={() => setShowResetConfirm(false)}
          onConfirm={handleClearRecords}
          title="清除所有紀錄？"
          message="這將會刪除您所有答題進度與雷達圖數據，此動作無法復原。"
        />
      </div>
    );
  };

  // 結果視圖
  const ResultView = () => {
    const [showExplanations, setShowExplanations] = useState(false);
    if (!activeSetId) return null;
    const setQuestions = RAW_QUIZ_DATA_V2[activeSetId];
    const setAns = answers[activeSetId] || {};
    const correctCount = Object.values(setAns).filter(Boolean).length;
    const score = Math.round((correctCount / setQuestions.length) * 100);
    const user = USERS[activeSetId];

    let message = '塑膠朋友';
    if (score > 40) message = '點頭之交';
    if (score > 70) message = '換帖兄弟';
    if (score === 100) message = '靈魂伴侶';

    if (showExplanations) {
      return (
        <div className="p-4 pb-24 space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">題目解析</h2>
            <button
              onClick={() => setShowExplanations(false)}
              className="text-neutral-400 hover:text-white text-sm"
            >
              返回結果
            </button>
          </div>
          <div className="space-y-6">
            {setQuestions.map((question, index) => {
              const explanation = QUIZ_EXPLANATIONS_V2[question.id];
              const isCorrect = setAns[question.id] === true;

              return (
                <div
                  key={question.id}
                  className="bg-neutral-800/60 rounded-lg p-4 border border-neutral-700"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        isCorrect
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-neutral-400 mb-1">
                        第 {index + 1} 題 • {question.year} 年度
                      </div>
                      <h3 className="text-white font-bold mb-3">
                        {question.q}
                      </h3>
                      <div className="space-y-2">
                        <div className="bg-green-500/10 border border-green-500/30 rounded p-2">
                          <div className="text-xs text-green-400 mb-1">
                            正確答案
                          </div>
                          <div className="text-white text-sm">{question.a}</div>
                        </div>
                        {explanation && (
                          <div className="bg-neutral-900/50 rounded p-3 border border-neutral-700">
                            <div className="text-xs text-neutral-400 mb-1">
                              解析
                            </div>
                            <div className="text-neutral-300 text-sm leading-relaxed">
                              {explanation.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setView('home')}
            className="w-full bg-white text-black font-bold py-3 px-12 rounded-full hover:scale-105 transition-transform"
          >
            回到首頁
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative mb-6">
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-5xl font-bold text-white shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden`}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user.icon
            )}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-black font-bold text-lg px-4 py-1 rounded-full whitespace-nowrap">
            {score}%
          </div>
        </div>

        <h2 className="text-green-500 text-sm font-bold tracking-widest uppercase mb-2">
          Friendship Match
        </h2>
        <h1 className="text-4xl font-bold text-white mb-2">{message}</h1>
        <p className="text-neutral-400 mb-8 max-w-xs">
          你對 {user.name} 的了解程度超越了全世界 {score}% 的人。
        </p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-xs text-left mb-8">
          <div className="bg-neutral-800 p-4 rounded-lg">
            <span className="text-xs text-neutral-400 block mb-1">
              答對題數
            </span>
            <span className="text-xl text-white font-bold">
              {correctCount} / {setQuestions.length}
            </span>
          </div>
          <div className="bg-neutral-800 p-4 rounded-lg">
            <span className="text-xs text-neutral-400 block mb-1">
              友誼年份
            </span>
            <span className="text-xl text-white font-bold">2023-2025</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => setShowExplanations(true)}
            className="bg-green-500 text-white font-bold py-3 px-12 rounded-full hover:scale-105 transition-transform"
          >
            查看解析
          </button>
          <button
            onClick={() => setView('home')}
            className="bg-white text-black font-bold py-3 px-12 rounded-full hover:scale-105 transition-transform"
          >
            回到首頁
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans select-none overflow-x-hidden">
      {/* Navbar (Mobile) */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-neutral-800">
        {view === 'home' ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <MdPerson className="text-black" size={20} />
            </div>
            <span className="font-bold text-sm">Friendship Blend</span>
          </div>
        ) : (
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white"
          >
            <MdHome size={20} /> <span className="text-sm font-bold">首頁</span>
          </button>
        )}
        {activeSetId && view === 'quiz' && (
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            PLAYING {USERS[activeSetId].name}
          </span>
        )}
      </div>

      <div className="max-w-md mx-auto min-h-[calc(100vh-60px)]">
        {view === 'home' && <HomeView />}
        {view === 'quiz' && activeSetId && (
          <QuizCard
            question={RAW_QUIZ_DATA_V2[activeSetId][currentQuestionIndex]}
            total={RAW_QUIZ_DATA_V2[activeSetId].length}
            index={currentQuestionIndex}
            onAnswer={handleAnswer}
          />
        )}
        {view === 'result' && <ResultView />}
      </div>
    </div>
  );
};

export default App;
