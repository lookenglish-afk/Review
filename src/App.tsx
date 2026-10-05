/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UNIT1_QUESTIONS } from './data/questions';
import { StudentInfo, SavedQuizProgress } from './utils/storage';
import { StudentLogin } from './components/StudentLogin';
import { QuizView } from './components/QuizView';
import { ResultView } from './components/ResultView';
import { LeaderboardView } from './components/LeaderboardView';
import { SingleFileExportModal } from './components/SingleFileExportModal';
import { sounds } from './utils/sound';
import {
  Cpu,
  Trophy,
  FileCode,
  Volume2,
  VolumeX,
  BookOpen,
} from 'lucide-react';

type ScreenState = 'login' | 'quiz' | 'result' | 'leaderboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('login');
  const [activeStudent, setActiveStudent] = useState<StudentInfo | null>(null);
  const [activeResumeProgress, setActiveResumeProgress] = useState<SavedQuizProgress | undefined>();
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sounds.isEnabled());

  // Result state
  const [finalAnswers, setFinalAnswers] = useState<Record<number, string>>({});
  const [finalTimeSpent, setFinalTimeSpent] = useState<number>(0);
  const [finalCorrectCount, setFinalCorrectCount] = useState<number>(0);

  const handleStartQuiz = (student: StudentInfo, resumeProgress?: SavedQuizProgress) => {
    setActiveStudent(student);
    setActiveResumeProgress(resumeProgress);
    setCurrentScreen('quiz');
  };

  const handleFinishQuiz = (
    answers: Record<number, string>,
    timeSpentSeconds: number,
    correctCount: number
  ) => {
    setFinalAnswers(answers);
    setFinalTimeSpent(timeSpentSeconds);
    setFinalCorrectCount(correctCount);
    setCurrentScreen('result');
  };

  const handleRetake = () => {
    if (activeStudent) {
      setActiveResumeProgress(undefined);
      setCurrentScreen('quiz');
    } else {
      setCurrentScreen('login');
    }
  };

  const toggleSound = () => {
    const newState = sounds.toggle();
    setSoundEnabled(newState);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Top Bar following Top Bar Contract: 3 zones */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentScreen('login');
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-white block leading-tight">
                UNIT 1: COMPUTERS TODAY
              </span>
              <span className="text-[10px] text-cyan-400 font-medium block">
                Tiếng Anh Chuyên Ngành Tin Học
              </span>
            </div>
          </button>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-400">
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentScreen('login');
              }}
              className={`hover:text-white transition-colors cursor-pointer ${
                currentScreen === 'login' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              Trang Chủ Ôn Tập
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setCurrentScreen('leaderboard');
              }}
              className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentScreen === 'leaderboard' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Bảng Xếp Hạng</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setIsExportModalOpen(true);
              }}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tải File HTML Đơn Lẻ</span>
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title={soundEnabled ? 'Tắt âm thanh trò chơi' : 'Bật âm thanh trò chơi'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setIsExportModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all whitespace-nowrap cursor-pointer hidden sm:flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Xuất HTML</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 w-full pb-12">
        {currentScreen === 'login' && (
          <StudentLogin
            onStartQuiz={handleStartQuiz}
            onOpenLeaderboard={() => setCurrentScreen('leaderboard')}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {currentScreen === 'quiz' && activeStudent && (
          <QuizView
            questions={UNIT1_QUESTIONS}
            student={activeStudent}
            resumeProgress={activeResumeProgress}
            onFinishQuiz={handleFinishQuiz}
            onExitToLogin={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'result' && activeStudent && (
          <ResultView
            questions={UNIT1_QUESTIONS}
            student={activeStudent}
            answers={finalAnswers}
            timeSpentSeconds={finalTimeSpent}
            correctCount={finalCorrectCount}
            onRetake={handleRetake}
            onOpenLeaderboard={() => setCurrentScreen('leaderboard')}
            onChangeStudent={() => {
              setActiveStudent(null);
              setCurrentScreen('login');
            }}
          />
        )}

        {currentScreen === 'leaderboard' && (
          <LeaderboardView
            onBack={() => setCurrentScreen('login')}
            onStartNewQuiz={() => {
              if (activeStudent) {
                setActiveResumeProgress(undefined);
                setCurrentScreen('quiz');
              } else {
                setCurrentScreen('login');
              }
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-5 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Hệ Thống Trắc Nghiệm Tin Học · Dữ liệu được lưu trữ tự động trong localStorage</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>10 Câu Hỏi Trọng Tâm Unit 1</span>
            <span>·</span>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="hover:text-cyan-400 transition-colors underline cursor-pointer"
            >
              Tải Mã Nguồn HTML Độc Lập
            </button>
          </div>
        </div>
      </footer>

      {/* Modal for single file HTML export/copy */}
      <SingleFileExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
