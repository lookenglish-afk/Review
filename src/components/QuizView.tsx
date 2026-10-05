import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../data/questions';
import { StudentInfo, StorageService, SavedQuizProgress } from '../utils/storage';
import { sounds } from '../utils/sound';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Flame,
  Volume2,
  VolumeX,
  Languages,
  BookOpen,
  Timer as TimerIcon,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface QuizViewProps {
  questions: Question[];
  student: StudentInfo;
  resumeProgress?: SavedQuizProgress;
  onFinishQuiz: (
    answers: Record<number, string>,
    timeSpentSeconds: number,
    correctCount: number
  ) => void;
  onExitToLogin: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  questions,
  student,
  resumeProgress,
  onFinishQuiz,
  onExitToLogin,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(
    resumeProgress ? Math.min(resumeProgress.currentIndex, questions.length - 1) : 0
  );
  const [answers, setAnswers] = useState<Record<number, string>>(
    resumeProgress ? resumeProgress.answers : {}
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [soundActive, setSoundActive] = useState<boolean>(sounds.isEnabled());
  const [seconds, setSeconds] = useState<number>(
    resumeProgress ? resumeProgress.timeSpentSeconds : 0
  );

  const currentQ = questions[currentIndex];
  const timerRef = useRef<number | null>(null);

  // Live timer
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // When current question changes, restore answered state if already answered
  useEffect(() => {
    const existing = answers[currentQ.id];
    if (existing) {
      setSelectedOption(existing);
      setIsAnswered(true);
    } else {
      setSelectedOption(null);
      setIsAnswered(false);
      setShowTranslation(false);
    }
  }, [currentIndex, currentQ.id, answers]);

  // Auto save progress to localStorage
  useEffect(() => {
    StorageService.saveProgress({
      student,
      currentIndex,
      answers,
      timeSpentSeconds: seconds,
      lastUpdated: new Date().toISOString(),
    });
  }, [student, currentIndex, answers, seconds]);

  const handleSelectOption = (option: string) => {
    if (isAnswered) return; // Prevent re-selection once answered in this instant mode

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option.toLowerCase() === currentQ.correctAnswer.toLowerCase();
    const newAnswers = { ...answers, [currentQ.id]: option };
    setAnswers(newAnswers);

    if (isCorrect) {
      sounds.playCorrect();
      setStreak((prev) => prev + 1);
    } else {
      sounds.playIncorrect();
      setStreak(0);
    }
  };

  const handleNext = () => {
    sounds.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate final score
      let correctCount = 0;
      questions.forEach((q) => {
        if (answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()) {
          correctCount++;
        }
      });
      onFinishQuiz(answers, seconds, correctCount);
    }
  };

  const toggleSound = () => {
    const newState = sounds.toggle();
    setSoundActive(newState);
  };

  // Format seconds to mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Compute live correct count
  const liveCorrectCount = Object.entries(answers).filter(([qId, ans]) => {
    const question = questions.find((q) => q.id === Number(qId));
    return question && question.correctAnswer.toLowerCase() === ans.toLowerCase();
  }).length;

  const isCorrect =
    selectedOption &&
    selectedOption.toLowerCase() === currentQ.correctAnswer.toLowerCase();

  const progressPercentage = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Bar: Student Info, Timer, Score, Sound */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        {/* Student info badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
            {student.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white leading-tight">
                {student.fullName}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">
                {student.studentId}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Lớp: <span className="text-slate-300">{student.studentClass}</span>
            </div>
          </div>
        </div>

        {/* Live Metrics: Streak, Timer, Score, Sound */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Streak indicator */}
          {streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streak} chuỗi</span>
            </div>
          )}

          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-200 text-xs font-mono">
            <TimerIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatTime(seconds)}</span>
          </div>

          {/* Live Score */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-medium">
            <span className="text-slate-400">Đúng:</span>
            <span className="font-bold text-emerald-400">{liveCorrectCount}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-300">{questions.length}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              soundActive
                ? 'bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={soundActive ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Exit / Pause Button */}
          <button
            onClick={onExitToLogin}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tạm dừng và về trang chính (tiến trình được lưu tự động)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar & Question Counter */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
          <span className="flex items-center gap-2">
            <span className="text-white font-bold">Câu hỏi {currentIndex + 1}</span>
            <span>trên {questions.length}</span>
          </span>
          <span className="font-mono text-cyan-400">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden mb-6">
        {/* Category Badge & Translation Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/70 border border-cyan-500/30 text-cyan-300">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            {currentQ.category}
          </span>

          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-slate-800"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{showTranslation ? 'Ẩn bản dịch tiếng Việt' : 'Xem bản dịch tiếng Việt'}</span>
          </button>
        </div>

        {/* English Question Text */}
        <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-relaxed mb-3">
          {currentQ.question}
        </h2>

        {/* Vietnamese Translation Box (Collapsible / Toggleable) */}
        {showTranslation && (
          <div className="mb-6 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-cyan-200/90 flex items-start gap-2.5 animate-fadeIn">
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase shrink-0 mt-0.5">
              Dịch nghĩa
            </span>
            <p className="italic leading-relaxed">{currentQ.vietnameseMeaning}</p>
          </div>
        )}

        {/* Options Grid (4 Multiple Choice Options) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
          {currentQ.options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isSelected = selectedOption === option;
            const isAnswerOptionCorrect =
              option.toLowerCase() === currentQ.correctAnswer.toLowerCase();

            // Dynamic Option Styling depending on state
            let optionStyle =
              'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-cyan-500/50 hover:bg-slate-900';
            let badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';

            if (isAnswered) {
              if (isAnswerOptionCorrect) {
                // Correct answer always highlighted in green
                optionStyle =
                  'bg-emerald-950/60 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30 font-semibold';
                badgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold';
              } else if (isSelected && !isAnswerOptionCorrect) {
                // Student chose wrong answer highlighted in red
                optionStyle =
                  'bg-rose-950/60 border-rose-500 text-rose-200 ring-2 ring-rose-500/30';
                badgeStyle = 'bg-rose-500 text-white border-rose-400 font-bold';
              } else {
                optionStyle = 'bg-slate-950/30 border-slate-800/60 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isAnswered}
                onClick={() => handleSelectOption(option)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-3.5 relative group ${optionStyle} ${
                  !isAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs shrink-0 transition-colors ${badgeStyle}`}
                >
                  {letter}
                </span>

                <span className="text-sm sm:text-base leading-snug pt-0.5 flex-1">{option}</span>

                {/* Instant Feedback Status Icon */}
                {isAnswered && isAnswerOptionCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 animate-bounce-short" />
                )}
                {isAnswered && isSelected && !isAnswerOptionCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Feedback Explanation Box */}
        {isAnswered && (
          <div
            className={`mt-6 p-4 sm:p-5 rounded-xl border transition-all duration-300 animate-fadeIn ${
              isCorrect
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-100'
                : 'bg-rose-950/20 border-rose-500/30 text-rose-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 font-bold text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Chính xác! Xuất sắc!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-rose-400">
                    Chưa chính xác! Đáp án đúng là:{' '}
                    <strong className="underline text-emerald-400">
                      {currentQ.correctAnswer}
                    </strong>
                  </span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
              {currentQ.explanation}
            </p>

            {/* Grammar / Vocabulary Tip */}
            <div className="pt-3 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              {currentQ.grammarNote && (
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    <strong className="text-amber-300">Lưu ý ngữ pháp:</strong>{' '}
                    {currentQ.grammarNote}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls / Next Button */}
      <div className="flex items-center justify-between gap-4">
        {/* Quick Question Jump Indicators */}
        <div className="hidden sm:flex items-center gap-1.5">
          {questions.map((q, idx) => {
            const hasAns = answers[q.id];
            const isRight =
              hasAns && hasAns.toLowerCase() === q.correctAnswer.toLowerCase();
            const isCurrent = idx === currentIndex;

            let dotClass = 'bg-slate-800 border-slate-700 text-slate-500';
            if (isCurrent) {
              dotClass = 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 ring-2 ring-cyan-500/30';
            } else if (hasAns) {
              dotClass = isRight
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/40';
            }

            return (
              <button
                key={q.id}
                onClick={() => {
                  sounds.playClick();
                  setCurrentIndex(idx);
                }}
                className={`w-7 h-7 rounded-lg border text-xs flex items-center justify-center transition-all cursor-pointer ${dotClass}`}
                title={`Câu ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Action Button: Next or Submit */}
        <div className="w-full sm:w-auto flex items-center justify-end">
          {isAnswered ? (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {currentIndex < questions.length - 1
                  ? 'Câu Tiếp Theo'
                  : 'Nộp Bài & Xem Điểm Số'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic py-2">
              <HelpCircle className="w-4 h-4" />
              <span>Hãy chọn 1 đáp án phía trên để xem kết quả & tiếp tục</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
