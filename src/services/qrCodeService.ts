import QRCode from 'qrcode';
import type { QRCodeEntry } from '../types';

/**
 * Encode a string for use in mailto URLs according to RFC 6068
 * This properly handles UTF-8 characters without over-encoding
 */
const encodeMailtoParam = (value: string): string => {
  // Use encodeURIComponent but keep it readable where possible
  // RFC 6068 allows UTF-8 characters in mailto URLs
  return encodeURIComponent(value)
    .replace(/%20/g, '%20') // Keep spaces as %20 (not +)
    .replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
};

export const qrCodeService = {
  /**
   * Generate a QR code data URL from a QR code entry
   */
  generateQRCode: async (entry: QRCodeEntry): Promise<string> => {
    let content = '';

    if (entry.type === 'link' && entry.link) {
      content = entry.link;
    } else if (entry.type === 'email' && entry.email) {
      // Create mailto: link with email parameters using RFC 6068 encoding
      const mailto = `mailto:${entry.email.to}`;
      const params: string[] = [];

      // Email addresses in CC should NOT be percent-encoded, only subject/body
      if (entry.email.cc) {
        params.push(`cc=${entry.email.cc}`);
      }
      if (entry.email.subject) {
        params.push(`subject=${encodeMailtoParam(entry.email.subject)}`);
      }
      if (entry.email.body) {
        params.push(`body=${encodeMailtoParam(entry.email.body)}`);
      }

      content = params.length > 0 ? `${mailto}?${params.join('&')}` : mailto;
    }

    if (!content) {
      throw new Error('No content to generate QR code');
    }

    try {
      console.log('Generating QR code for content (length: ' + content.length + '):', content.substring(0, 100) + '...');
      
      // Generate QR code as data URL with UTF-8 support
      const dataUrl = await QRCode.toDataURL(content, {
        width: 300,
        margin: 1,
        errorCorrectionLevel: 'H', // Use high error correction for better reliability with UTF-8
        type: 'image/png',
      });
      
      console.log('QR code generated successfully, data URL length:', dataUrl.length);
      return dataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      console.error('Content that failed (length: ' + content.length + '):', content);
      throw error;
    }
  },

  /**
   * Generate multiple QR codes in batch
   */
  generateBatch: async (entries: QRCodeEntry[]): Promise<Map<string, string>> => {
    const results = new Map<string, string>();

    for (const entry of entries) {
      try {
        const dataUrl = await qrCodeService.generateQRCode(entry);
        results.set(entry.id, dataUrl);
      } catch (error) {
        console.error(`Error generating QR code for entry ${entry.id}:`, error);
      }
    }

    return results;
  },
};
