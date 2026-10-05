import React, { useState } from 'react';
import { generateQrCodeSvg } from '../utils/qrGenerator';
import {
  X,
  Smartphone,
  Copy,
  Check,
  Share2,
  AlertCircle,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { sounds } from '../utils/sound';

interface MobileAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAccessModal: React.FC<MobileAccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  // App URL: Prefer shared public URL if available, or current origin
  const appUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('#')[0]
      : 'https://ais-pre-eoksl7xdseq572cwhdkp4b-868052471008.asia-southeast1.run.app';

  if (!isOpen) return null;

  const qrImageUrl = generateQrCodeSvg(appUrl, 260);

  const handleCopyLink = async () => {
    sounds.playClick();
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement('input');
      input.value = appUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    sounds.playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Unit 1: Computers Today - Trắc Nghiệm Tin Học',
          text: 'Vào ôn tập trắc nghiệm Tiếng Anh Tin Học Unit 1 (Computers Today) ngay trên điện thoại:',
          url: appUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-auto animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Chơi Game Trên Điện Thoại (iOS & Android)
              </h2>
              <p className="text-xs text-slate-400">
                Quét mã QR hoặc mở đường link trực tiếp trên trình duyệt di động
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Why downloading HTML on phone doesn't work alert */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">
                Vì sao điện thoại không bấm được khi mở trực tiếp file .html tải về?
              </strong>
              <span>
                Điện thoại iPhone (iOS) và Android khi tải file <code>.html</code> về máy thường tự mở bằng <strong>Trình xem tệp (Quick Look / HTML Viewer)</strong> chứ không mở bằng trình duyệt thật. Trình xem này bị chặn JavaScript và localStorage vì lý do an ninh.
              </span>
            </div>
          </div>

          {/* Solution 1: Scan QR or Open Link (Recommended) */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Cách Đơn Giản Nhất (Chạy Mượt 100% Trên Mọi Điện Thoại)
            </div>

            {/* QR Code Frame */}
            <div className="flex flex-col items-center justify-center">
              <div className="p-3 rounded-2xl bg-white shadow-xl border-4 border-cyan-500/30 inline-block mb-3">
                <img
                  src={qrImageUrl}
                  alt="Mã QR chơi game trên điện thoại"
                  className="w-48 h-48 sm:w-56 sm:h-56 block rounded-lg"
                  loading="eager"
                />
              </div>
              <p className="text-xs text-slate-300 font-medium">
                👉 Dùng <strong>Camera điện thoại</strong> hoặc <strong>Zalo (Quét mã)</strong> để vào chơi ngay!
              </p>
            </div>

            {/* Copy / Share Button */}
            <div className="mt-5 flex flex-col sm:flex-row items-center gap-2">
              <div className="w-full relative">
                <input
                  type="text"
                  readOnly
                  value={appUrl}
                  className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono pr-20 truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="absolute right-1 top-1 bottom-1 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-slate-950" />
                      <span>Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Chép Link</span>
                    </>
                  )}
                </button>
              </div>

              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Gửi Zalo/Lớp</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Guide: How to add to home screen like an app */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              Mẹo Cài Đặt Thành Ứng Dụng Trên Màn Hình Điện Thoại (Không Cần App Store):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-cyan-300 block mb-1">📱 Dành Cho iPhone (Safari):</strong>
                <span>
                  1. Mở link trên <strong>Safari</strong>.<br />
                  2. Bấm nút <strong>Chia sẻ</strong> (icon ô vuông có mũi tên lên).<br />
                  3. Chọn <strong>"Thêm vào MH chính" (Add to Home Screen)</strong>.
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <strong className="text-emerald-300 block mb-1">🤖 Dành Cho Android (Chrome):</strong>
                <span>
                  1. Mở link trên <strong>Google Chrome</strong>.<br />
                  2. Bấm dấu <strong>3 chấm dọc</strong> ở góc trên bên phải.<br />
                  3. Chọn <strong>"Thêm vào màn hình chính"</strong> hoặc <strong>"Cài đặt ứng dụng"</strong>.
                </span>
              </div>
            </div>
          </div>

          {/* Guide for opening raw .html on Android if offline */}
          <div className="border-t border-slate-800 pt-3">
            <button
              type="button"
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-xs text-slate-400 hover:text-cyan-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>
                {showExplanation
                  ? 'Thu gọn hướng dẫn mở file .html offline trên điện thoại'
                  : 'Nếu bạn bắt buộc muốn mở file .html offline trên điện thoại mà không dùng mạng?'}
              </span>
            </button>

            {showExplanation && (
              <div className="mt-2.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-2 animate-fadeIn">
                <p>
                  Nếu đã tải file <code>unit1_computers_today_quiz.html</code> về điện thoại:
                </p>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>
                    <strong>Trên Android:</strong> Vào ứng dụng <strong>Quản lý tệp (Files)</strong> &gt; Thư mục <strong>Downloads (Tải về)</strong> &gt; Nhấn giữ file HTML &gt; Chọn <strong>"Mở bằng..."</strong> &gt; Chọn trình duyệt <strong>Google Chrome</strong> (TUYỆT ĐỐI KHÔNG chọn "Trình xem HTML" của hệ thống).
                  </li>
                  <li>
                    <strong>Trên iPhone:</strong> Mở ứng dụng <strong>Chrome</strong> trên iPhone &gt; Nhập đường dẫn file, hoặc tải ứng dụng <strong>Documents by Readdle</strong> để mở file HTML có chạy JavaScript.
                  </li>
                  <li>
                    <strong>Tải lên web miễn phí trong 10 giây:</strong> Mở trang web <strong className="text-cyan-300">tiiny.host</strong> hoặc <strong className="text-cyan-300">netlify drop</strong> trên máy tính, kéo thả file HTML vào là bạn có ngay link web chia sẻ cho cả lớp mở trên điện thoại!
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Đã Hiểu, Đóng Lại
          </button>
        </div>
      </div>
    </div>
  );
};
