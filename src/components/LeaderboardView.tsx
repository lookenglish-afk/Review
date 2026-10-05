import React, { useState, useEffect } from 'react';
import { QuizResult, StorageService } from '../utils/storage';
import { sounds } from '../utils/sound';
import {
  Trophy,
  Search,
  Download,
  Trash2,
  ArrowLeft,
  Medal,
  Clock,
  User,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface LeaderboardViewProps {
  onBack: () => void;
  onStartNewQuiz: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  onBack,
  onStartNewQuiz,
}) => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'score' | 'time' | 'date'>('score');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = StorageService.getAllResults();
    setResults(data);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài làm của "${name}"?`)) {
      StorageService.deleteResult(id);
      loadData();
      sounds.playClick();
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        'CẢNH BÁO: Thao tác này sẽ xóa toàn bộ lịch sử điểm số và bảng xếp hạng trên trình duyệt này. Bạn có chắc không?'
      )
    ) {
      StorageService.clearAllResults();
      loadData();
      sounds.playClick();
    }
  };

  const handleExportCSV = () => {
    sounds.playClick();
    StorageService.exportToCSV(results);
  };

  // Filter and sort
  const filtered = results.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.student.fullName.toLowerCase().includes(term) ||
      r.student.studentId.toLowerCase().includes(term) ||
      r.student.studentClass.toLowerCase().includes(term)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'score') {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSpentSeconds - b.timeSpentSeconds;
    }
    if (sortBy === 'time') {
      return a.timeSpentSeconds - b.timeSpentSeconds;
    }
    // 'date' (most recent first)
    return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
  });

  // Summary stats
  const totalSubmissions = results.length;
  const highestScore = results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0;
  const avgScore =
    results.length > 0
      ? (results.reduce((acc, curr) => acc + curr.score, 0) / results.length).toFixed(1)
      : '0';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            Bảng Vàng Thành Tích & Lịch Sử Điểm
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tổng hợp kết quả ôn tập Unit 1: Computers Today được lưu an toàn trong localStorage
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {results.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              title="Xuất danh sách điểm sang file CSV tương thích Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Excel / CSV</span>
            </button>
          )}

          <button
            onClick={onStartNewQuiz}
            className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            Làm Bài Mới
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Tổng Lượt Nộp Bài</div>
            <div className="text-2xl font-bold text-white tabular-nums">{totalSubmissions}</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
            <Medal className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Điểm Cao Nhất Lớp</div>
            <div className="text-2xl font-bold text-amber-400 tabular-nums">
              {highestScore.toFixed(1)} / 10
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Điểm Trung Bình</div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums">{avgScore} / 10</div>
          </div>
        </div>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo Tên, Lớp, MSSV..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Sort & Clear */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'time' | 'date')}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="score">Điểm cao nhất</option>
              <option value="time">Thời gian nhanh nhất</option>
              <option value="date">Gần đây nhất</option>
            </select>
          </div>

          {results.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded hover:bg-slate-800"
              title="Xóa toàn bộ kết quả"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
        {sorted.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-300">Chưa có kết quả nào được lưu</p>
            <p className="text-xs text-slate-500 mt-1">
              Hãy hoàn thành bài trắc nghiệm Unit 1 để ghi danh vào bảng vàng!
            </p>
            <button
              onClick={onStartNewQuiz}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Bắt Đầu Làm Bài Ngay
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">Hạng</th>
                  <th className="py-3.5 px-4">Sinh Viên</th>
                  <th className="py-3.5 px-4">Lớp</th>
                  <th className="py-3.5 px-4">MSSV</th>
                  <th className="py-3.5 px-4 text-center">Đúng</th>
                  <th className="py-3.5 px-4 text-center">Điểm (10)</th>
                  <th className="py-3.5 px-4 text-center">Thời Gian</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Ngày Nộp</th>
                  <th className="py-3.5 px-4 text-center w-12">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sorted.map((item, index) => {
                  const isTop1 = index === 0;
                  const isTop2 = index === 1;
                  const isTop3 = index === 2;

                  let rankBadge = (
                    <span className="font-mono text-slate-400 font-bold">#{index + 1}</span>
                  );
                  if (isTop1) {
                    rankBadge = (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs">
                        🥇
                      </span>
                    );
                  } else if (isTop2) {
                    rankBadge = (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-300 font-bold text-xs">
                        🥈
                      </span>
                    );
                  } else if (isTop3) {
                    rankBadge = (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-600 font-bold text-xs">
                        🥉
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isTop1 ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">{rankBadge}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{item.student.fullName}</div>
                        {item.badges.length > 0 && (
                          <div className="text-[10px] text-amber-300/90 truncate max-w-[180px] mt-0.5">
                            {item.badges[0]}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{item.student.studentClass}</td>
                      <td className="py-3.5 px-4 font-mono text-cyan-300">{item.student.studentId}</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-300 tabular-nums">
                        {item.correctCount}/{item.totalQuestions}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`font-black text-sm tabular-nums px-2.5 py-1 rounded-md ${
                            item.score >= 9
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : item.score >= 7
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : item.score >= 5
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {item.score.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-300 tabular-nums">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {item.timeSpentSeconds}s
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-xs hidden md:table-cell">
                        {item.completedAt}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleDelete(item.id, item.student.fullName)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Xóa bài này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
