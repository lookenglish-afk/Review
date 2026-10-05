export interface StudentInfo {
  fullName: string;
  studentClass: string;
  studentId: string;
}

export interface QuizResult {
  id: string;
  student: StudentInfo;
  score: number; // 0 to 10 scale (or e.g. 10/10)
  correctCount: number;
  totalQuestions: number;
  percentage: number;
  timeSpentSeconds: number;
  completedAt: string;
  answers: Record<number, string>;
  badges: string[];
}

export interface SavedQuizProgress {
  student: StudentInfo;
  currentIndex: number;
  answers: Record<number, string>;
  timeSpentSeconds: number;
  lastUpdated: string;
}

const STORAGE_KEYS = {
  CURRENT_STUDENT: 'UNIT1_CURRENT_STUDENT',
  LEADERBOARD: 'UNIT1_LEADERBOARD_V1',
  PROGRESS: 'UNIT1_QUIZ_IN_PROGRESS',
};

export const StorageService = {
  // Student Profile
  getSavedStudent(): StudentInfo | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveStudent(student: StudentInfo): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(student));
    } catch (e) {
      console.error('Failed to save student info to localStorage', e);
    }
  },

  clearStudent(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
    } catch (e) {
      console.error(e);
    }
  },

  // Leaderboard & Results History
  getAllResults(): QuizResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (!data) return [];
      const parsed: QuizResult[] = JSON.parse(data);
      // Sort descending by score, then ascending by time spent
      return parsed.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.timeSpentSeconds - b.timeSpentSeconds;
      });
    } catch {
      return [];
    }
  },

  saveResult(result: QuizResult): void {
    try {
      const existing = this.getAllResults();
      // Add new result to beginning or leaderboard
      const updated = [result, ...existing.filter(r => r.id !== result.id)];
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(updated));
      // Once finished, clear progress
      this.clearProgress();
    } catch (e) {
      console.error('Failed to save result to localStorage', e);
    }
  },

  deleteResult(id: string): void {
    try {
      const existing = this.getAllResults();
      const updated = existing.filter(r => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  },

  clearAllResults(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    } catch (e) {
      console.error(e);
    }
  },

  // In-progress quiz persistence (prevents data loss on reload)
  getSavedProgress(): SavedQuizProgress | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveProgress(progress: SavedQuizProgress): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  },

  clearProgress(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    } catch (e) {
      console.error(e);
    }
  },

  // Export results to CSV for teacher/grading
  exportToCSV(results: QuizResult[]): void {
    if (results.length === 0) return;
    const headers = ['Họ và Tên', 'Lớp', 'MSSV', 'Điểm Số (Thang 10)', 'Số Câu Đúng', 'Tổng Số Câu', 'Thời Gian (giây)', 'Ngày Giờ Nộp', 'Huy Hiệu'];
    const rows = results.map(r => [
      `"${r.student.fullName.replace(/"/g, '""')}"`,
      `"${r.student.studentClass.replace(/"/g, '""')}"`,
      `"${r.student.studentId.replace(/"/g, '""')}"`,
      r.score.toFixed(1),
      r.correctCount,
      r.totalQuestions,
      r.timeSpentSeconds,
      `"${r.completedAt}"`,
      `"${r.badges.join(', ')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bang_Diem_Unit1_Computers_Today_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
