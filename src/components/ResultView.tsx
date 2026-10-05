import React, { useEffect, useState } from 'react';
import { Question } from '../data/questions';
import { StudentInfo, QuizResult, StorageService } from '../utils/storage';
import { sounds } from '../utils/sound';
import { triggerConfetti } from '../utils/confetti';
import {
  Trophy,
  RotateCcw,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Zap,
  Target,
  Cpu,
  Database,
  ArrowRight,
} from 'lucide-react';

interface ResultViewProps {
  questions: Question[];
  student: StudentInfo;
  answers: Record<number, string>;
  timeSpentSeconds: number;
  correctCount: number;
  onRetake: () => void;
  onOpenLeaderboard: () => void;
  onChangeStudent: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  questions,
  student,
  answers,
  timeSpentSeconds,
  correctCount,
  onRetake,
  onOpenLeaderboard,
  onChangeStudent,
}) => {
  const [showDetailedReview, setShowDetailedReview] = useState<boolean>(true);
  const [resultRecord, setResultRecord] = useState<QuizResult | null>(null);

  const totalQuestions = questions.length;
  const score = (correctCount / totalQuestions) * 10;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Determine badges
  const badges: string[] = [];
  if (score === 10) badges.push('Điểm 10 Tuyệt Đối 🎯');
  if (timeSpentSeconds <= 90 && score >= 7) badges.push('Tốc Độ Ánh Sáng ⚡');
  if (score >= 8) badges.push('Bậc Thầy Phần Cứng 🏆');

  // Check specific categories
  const cpuQuestions = questions.filter((q) => q.category === 'CPU & Bộ vi xử lý');
  const allCpuRight = cpuQuestions.every(
    (q) => answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()
  );
  if (allCpuRight && cpuQuestions.length > 0) badges.push('Chuyên Gia CPU & ALU 🧠');

  const memoryQuestions = questions.filter(
    (q) => q.category.includes('Bộ nhớ') || q.category.includes('Số nhị phân')
  );
  const allMemoryRight = memoryQuestions.every(
    (q) => answers[q.id]?.toLowerCase() === q.correctAnswer.toLowerCase()
  );
  if (allMemoryRight && memoryQuestions.length > 0) badges.push('Kỹ Sư Bộ Nhớ & Dữ Liệu 💾');

  if (badges.length === 0) badges.push('Chiến Binh Cần Cù 🏅');

  useEffect(() => {
    // Play sound & Confetti
    if (score >= 5) {
      sounds.playVictory();
      triggerConfetti();
    } else {
      sounds.playClick();
    }

    // Save to persistent storage once
    const newRecord: QuizResult = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      student,
      score,
      correctCount,
      totalQuestions,
      percentage,
      timeSpentSeconds,
      completedAt: new Date().toLocaleString('vi-VN'),
      answers,
      badges,
    };

    StorageService.saveResult(newRecord);
    setResultRecord(newRecord);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins} phút ${secs} giây`;
  };

  const getEvaluation = () => {
    if (score >= 9) return { rank: 'Xuất Sắc', color: 'text-emerald-400', desc: 'Kiến thức Tiếng Anh Chuyên Ngành Unit 1 cực kỳ vững vàng!' };
    if (score >= 8) return { rank: 'Giỏi', color: 'text-cyan-400', desc: 'Nắm rất tốt các khái niệm CPU, ALU, thiết bị ngoại vi và bộ nhớ.' };
    if (score >= 6.5) return { rank: 'Khá', color: 'text-blue-400', desc: 'Đạt yêu cầu môn học, hãy xem lại các câu sai để hoàn thiện hơn.' };
    if (score >= 5) return { rank: 'Trung Bình / Đạt', color: 'text-amber-400', desc: 'Đạt chuẩn cơ bản. Cần luyện tập thêm từ vựng chuyên ngành.' };
    return { rank: 'Cần Ôn Tập Lại', color: 'text-rose-400', desc: 'Hãy đọc kỹ phần giải thích chi tiết bên dưới và làm lại để cải thiện điểm.' };
  };

  const evaluation = getEvaluation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Printable Area Wrapper */}
      <div id="quiz-result-card" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4 shadow-lg">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            KẾT QUẢ ÔN TẬP UNIT 1
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Môn học: Tiếng Anh Chuyên Ngành Tin Học (Computers Today)
          </p>
        </div>

        {/* Student Credential Strip */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400">Sinh viên: </span>
              <strong className="text-white text-base font-bold">{student.fullName}</strong>
            </div>
          </div>
          <div>
            <span className="text-slate-400">Lớp: </span>
            <strong className="text-cyan-300 font-semibold">{student.studentClass}</strong>
          </div>
          <div>
            <span className="text-slate-400">MSSV: </span>
            <strong className="text-white font-mono">{student.studentId}</strong>
          </div>
          <div>
            <span className="text-slate-400">Thời gian: </span>
            <strong className="text-slate-300">{formatTime(timeSpentSeconds)}</strong>
          </div>
        </div>

        {/* Score & Evaluation Big Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Box 1: Score 10-scale */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 text-center flex flex-col justify-center items-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Điểm Số (Thang 10)
            </span>
            <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400 tabular-nums">
              {score.toFixed(1)}
            </div>
            <span className="text-xs text-slate-400 mt-1">
              Đúng {correctCount}/{totalQuestions} câu ({percentage}%)
            </span>
          </div>

          {/* Box 2: Rank & Evaluation */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 text-center flex flex-col justify-center items-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Xếp Loại Kết Quả
            </span>
            <div className={`text-2xl sm:text-3xl font-black ${evaluation.color}`}>
              {evaluation.rank}
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-[200px] leading-tight">
              {evaluation.desc}
            </p>
          </div>

          {/* Box 3: Time & Speed */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 text-center flex flex-col justify-center items-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Thời Gian Làm Bài
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-1.5 tabular-nums">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>{timeSpentSeconds}s</span>
            </div>
            <span className="text-xs text-slate-400 mt-1">
              Trung bình ~{(timeSpentSeconds / totalQuestions).toFixed(1)}s / câu
            </span>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="mb-8">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Huy Hiệu Đã Đạt Được
          </div>
          <div className="flex flex-wrap gap-2.5">
            {badges.map((b, i) => (
              <span
                key={i}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onRetake}
            className="flex-1 min-w-[160px] py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm Lại Bài Thi</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="flex-1 min-w-[160px] py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Xem Bảng Xếp Hạng</span>
          </button>

          <button
            onClick={() => window.print()}
            className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white text-sm border border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            title="In hoặc lưu phiếu điểm thành file PDF"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">In Phiếu Điểm</span>
          </button>

          <button
            onClick={onChangeStudent}
            className="py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-400 text-sm border border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Đăng xuất sinh viên hiện tại"
          >
            <span>Đổi Sinh Viên</span>
          </button>
        </div>
      </div>

      {/* Accordion: Detailed Question Breakdown & Explanations */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
        <button
          onClick={() => setShowDetailedReview(!showDetailedReview)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Chi Tiết Bài Làm & Lời Giải Từng Câu
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Xem lại đáp án đã chọn, đáp án chuẩn và phân tích ngữ pháp chuyên ngành
            </p>
          </div>
          <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
            {showDetailedReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showDetailedReview && (
          <div className="mt-6 space-y-4 pt-6 border-t border-slate-800">
            {questions.map((q, idx) => {
              const studentAnswer = answers[q.id];
              const isCorrectAnswer =
                studentAnswer?.toLowerCase() === q.correctAnswer.toLowerCase();

              return (
                <div
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-xl border transition-all ${
                    isCorrectAnswer
                      ? 'bg-slate-950/60 border-emerald-500/30'
                      : 'bg-rose-950/10 border-rose-500/30'
                  }`}
                >
                  {/* Question header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {q.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold shrink-0">
                      {isCorrectAnswer ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Đúng (+1.0 điểm)
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Sai (0 điểm)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question content */}
                  <p className="text-sm sm:text-base font-semibold text-white mb-2 leading-snug">
                    {q.question}
                  </p>

                  <p className="text-xs text-slate-400 italic mb-3">
                    Dịch: {q.vietnameseMeaning}
                  </p>

                  {/* Answers comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block mb-0.5">Bạn đã chọn:</span>
                      <span
                        className={`font-semibold ${
                          isCorrectAnswer ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {studentAnswer || '(Chưa chọn đáp án)'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                      <span className="text-slate-400 block mb-0.5">Đáp án chính xác:</span>
                      <span className="font-semibold text-emerald-300">
                        {q.correctAnswer}
                      </span>
                    </div>
                  </div>

                  {/* Explanation & notes */}
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                    <div className="font-semibold text-cyan-300 mb-1">Giải thích chi tiết:</div>
                    <p className="leading-relaxed mb-1.5">{q.explanation}</p>
                    {q.grammarNote && (
                      <p className="text-amber-300/90 italic">
                        <strong>Lưu ý:</strong> {q.grammarNote}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
