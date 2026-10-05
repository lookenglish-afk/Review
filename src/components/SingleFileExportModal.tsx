import React, { useState } from 'react';
import { generateSingleFileHtml } from '../utils/singleFileHtmlGenerator';
import { sounds } from '../utils/sound';
import {
  X,
  Download,
  Copy,
  Check,
  FileCode,
  ExternalLink,
  Laptop,
  CheckCircle,
} from 'lucide-react';

interface SingleFileExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SingleFileExportModal: React.FC<SingleFileExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const htmlContent = generateSingleFileHtml();

  const handleDownload = () => {
    sounds.playClick();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unit1_computers_today_quiz.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    sounds.playClick();
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = htmlContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Mã Nguồn File HTML Đơn Lẻ (Single-File HTML)
              </h2>
              <p className="text-xs text-slate-400">
                Chạy 100% độc lập, không cần cài đặt Node.js hay web server
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải File .HTML Về Máy</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Đã Sao Chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-300" />
                  <span>Sao Chép Toàn Bộ Mã</span>
                </>
              )}
            </button>
          </div>

          {/* Quick instructions */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs text-slate-300">
            <div className="font-bold text-white flex items-center gap-2">
              <Laptop className="w-4 h-4 text-cyan-400" />
              Hướng Dẫn Sử Dụng File Độc Lập:
            </div>
            <ul className="space-y-1.5 pl-5 list-disc text-slate-400">
              <li>
                <strong>Mở trực tiếp trên máy:</strong> Nháy đúp vào file{' '}
                <code className="text-cyan-300">unit1_computers_today_quiz.html</code> để mở
                trực tiếp trong Google Chrome, Cốc Cốc, MS Edge hoặc Safari.
              </li>
              <li>
                <strong>Nộp bài lên hệ thống trường:</strong> Giảng viên hoặc sinh viên có thể
                đính kèm file này gửi lên LMS, Moodle, Google Classroom hoặc Zalo nhóm lớp.
              </li>
              <li>
                <strong>Triển khai miễn phí:</strong> Kéo thả file lên GitHub Pages, Vercel,
                hoặc Netlify Drop để có ngay đường link web công khai trong 30 giây.
              </li>
            </ul>
          </div>

          {/* Code preview snippet */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Xem trước cấu trúc file:</span>
              <span className="font-mono text-cyan-400">HTML + Tailwind + JS</span>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 overflow-x-auto max-h-48 custom-scroll">
              {htmlContent.slice(0, 1000)}
              {'\n... [Toàn bộ 10 câu hỏi, âm thanh Web Audio và lưu trữ localStorage] ...'}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Đóng Cửa Sổ
          </button>
        </div>
      </div>
    </div>
  );
};
