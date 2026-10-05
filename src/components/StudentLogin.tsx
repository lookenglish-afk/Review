import React, { useState, useEffect } from 'react';
import { StudentInfo, StorageService, SavedQuizProgress } from '../utils/storage';
import { sounds } from '../utils/sound';
import { User, Award, BookOpen, Clock, ArrowRight, RotateCcw, ShieldCheck, Cpu } from 'lucide-react';

interface StudentLoginProps {
  onStartQuiz: (student: StudentInfo, resumeProgress?: SavedQuizProgress) => void;
  onOpenLeaderboard: () => void;
  onOpenExportModal: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({
  onStartQuiz,
  onOpenLeaderboard,
  onOpenExportModal,
}) => {
  const [fullName, setFullName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [studentId, setStudentId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [savedStudent, setSavedStudent] = useState<StudentInfo | null>(null);
  const [unfinishedProgress, setUnfinishedProgress] = useState<SavedQuizProgress | null>(null);

  useEffect(() => {
    const student = StorageService.getSavedStudent();
    if (student) {
      setSavedStudent(student);
      setFullName(student.fullName || '');
      setStudentClass(student.studentClass || '');
      setStudentId(student.studentId || '');
    }

    const progress = StorageService.getSavedProgress();
    if (progress && Object.keys(progress.answers || {}).length > 0) {
      setUnfinishedProgress(progress);
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập Họ và tên sinh viên';
    }
    if (!studentClass.trim()) {
      newErrors.studentClass = 'Vui lòng nhập tên Lớp (VD: CNTT K18A, D21HT01)';
    }
    if (!studentId.trim()) {
      newErrors.studentId = 'Vui lòng nhập Mã số sinh viên (MSSV)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      sounds.playIncorrect();
      return;
    }

    const student: StudentInfo = {
      fullName: fullName.trim(),
      studentClass: studentClass.trim(),
      studentId: studentId.trim().toUpperCase(),
    };

    sounds.playClick();
    StorageService.saveStudent(student);
    onStartQuiz(student);
  };

  const handleResume = () => {
    if (!unfinishedProgress) return;
    sounds.playClick();
    onStartQuiz(unfinishedProgress.student, unfinishedProgress);
  };

  const handleDiscardProgress = () => {
    StorageService.clearProgress();
    setUnfinishedProgress(null);
    sounds.playClick();
  };

  const handleClearSaved = () => {
    StorageService.clearStudent();
    setSavedStudent(null);
    setFullName('');
    setStudentClass('');
    setStudentId('');
    sounds.playClick();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-4">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Tiếng Anh Chuyên Ngành Tin Học · Học Phần 1</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
          UNIT 1: COMPUTERS TODAY
        </h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Hệ thống trắc nghiệm ôn tập kiến thức phần cứng máy tính: CPU, ALU, thiết bị ngoại vi, bộ nhớ trong RAM/ROM và hệ thống số nhị phân.
        </p>
      </div>

      {/* Unfinished Quiz Alert (if any) */}
      {unfinishedProgress && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
              <RotateCcw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Bạn đang có bài làm dở chưa nộp!</p>
              <p className="text-xs text-amber-300/80">
                Sinh viên: <span className="font-semibold text-white">{unfinishedProgress.student.fullName}</span> ({unfinishedProgress.student.studentId}) · Đã trả lời {Object.keys(unfinishedProgress.answers).length}/10 câu.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleResume}
              className="flex-1 sm:flex-initial px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md"
            >
              Tiếp Tục Làm Bài
            </button>
            <button
              onClick={handleDiscardProgress}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors border border-slate-700"
              title="Hủy bài làm dở và làm mới từ đầu"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Form + Quick Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Login Form */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                Thông Tin Sinh Viên Dự Thi
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Vui lòng điền chính xác để lưu điểm vào hệ thống và bảng xếp hạng
              </p>
            </div>
            {savedStudent && (
              <button
                type="button"
                onClick={handleClearSaved}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                title="Xóa thông tin đã nhớ"
              >
                Nhập người khác
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Field: Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Họ và Tên <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className={`w-full px-4 py-3 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                    errors.fullName
                      ? 'border-rose-500 ring-1 ring-rose-500/40'
                      : 'border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.fullName}</p>
              )}
            </div>

            {/* Two Columns: Class & MSSV */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Lớp Sinh Hoạt / Chuyên Ngành <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={studentClass}
                  onChange={(e) => {
                    setStudentClass(e.target.value);
                    if (errors.studentClass) setErrors({ ...errors, studentClass: '' });
                  }}
                  placeholder="Ví dụ: CNTT K18A"
                  className={`w-full px-4 py-3 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none transition-all ${
                    errors.studentClass
                      ? 'border-rose-500 ring-1 ring-rose-500/40'
                      : 'border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                  }`}
                />
                {errors.studentClass && (
                  <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.studentClass}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Mã Số Sinh Viên (MSSV) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value);
                    if (errors.studentId) setErrors({ ...errors, studentId: '' });
                  }}
                  placeholder="Ví dụ: 2021600123"
                  className={`w-full px-4 py-3 bg-slate-950/80 border rounded-xl text-white placeholder-slate-500 text-sm font-mono uppercase focus:outline-none transition-all ${
                    errors.studentId
                      ? 'border-rose-500 ring-1 ring-rose-500/40'
                      : 'border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                  }`}
                />
                {errors.studentId && (
                  <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.studentId}</p>
                )}
              </div>
            </div>

            {/* Persistence Guarantee Note */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-950/50 border border-slate-800 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Dữ liệu được lưu an toàn tại <strong>localStorage</strong> của trình duyệt. Không lo mất điểm khi tải lại trang!
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full group py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Bắt Đầu Ôn Tập Ngay</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Quiz Info & Badges Preview */}
        <div className="lg:col-span-5 space-y-4">
          {/* Format Spec Box */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Quy Chế Ôn Tập & Cấu Trúc Đề
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  10
                </span>
                <span>
                  <strong>10 câu hỏi trắc nghiệm chuẩn</strong>: Phản hồi kết quả tức thì kèm giải thích ngữ pháp và từ vựng chuyên ngành.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  ⏱
                </span>
                <span>
                  <strong>Tính giờ làm bài</strong>: Càng trả lời nhanh và chính xác, điểm xếp hạng và huy hiệu càng cao.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 font-bold text-[10px]">
                  🏆
                </span>
                <span>
                  <strong>Hệ thống huy hiệu thành tích</strong>: Ghi nhận chuỗi đúng liên tiếp và phản xạ nhanh.
                </span>
              </li>
            </ul>
          </div>

          {/* Quick Access Card */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onOpenLeaderboard}
              type="button"
              className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 text-left transition-all group cursor-pointer"
            >
              <Award className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Bảng Xếp Hạng</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Xem thành tích lớp</div>
            </button>

            <button
              onClick={onOpenExportModal}
              type="button"
              className="p-4 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 border border-slate-800 text-left transition-all group cursor-pointer"
            >
              <Clock className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-bold text-white">Xuất File HTML</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Chạy offline độc lập</div>
            </button>
          </div>

          {/* Key Topics Badges */}
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs">
            <div className="font-semibold text-slate-300 mb-2">Chủ điểm cốt lõi Unit 1:</div>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-1 rounded bg-slate-800 text-cyan-300">Central Processing Unit (CPU)</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-blue-300">Arithmetic & Logic Unit (ALU)</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-emerald-300">RAM vs ROM vs Hard Disk</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-amber-300">Input / Output / Peripherals</span>
              <span className="px-2 py-1 rounded bg-slate-800 text-purple-300">Bits & Bytes Representation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
