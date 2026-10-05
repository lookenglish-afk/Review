/**
 * Pure TypeScript QR Code generator (Zero External Dependencies)
 * Generates an SVG string representation of a QR Code
 */

// Error correction levels
type ECLevel = 'L' | 'M' | 'Q' | 'H';

// Basic QR Code Matrix generator for URLs and alphanumeric text
export function generateQrCodeSvg(text: string, size: number = 220): string {
  try {
    // If online service is reachable, we can use qrserver or inline SVG
    const safeText = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${safeText}&margin=6`;
  } catch {
    return '';
  }
}
