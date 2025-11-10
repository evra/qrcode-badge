import QRCode from 'qrcode';
import type { QRCodeEntry } from '../types';

export const qrCodeService = {
  /**
   * Generate a QR code data URL from a QR code entry
   */
  generateQRCode: async (entry: QRCodeEntry): Promise<string> => {
    let content = '';

    if (entry.type === 'link' && entry.link) {
      content = entry.link;
    } else if (entry.type === 'email' && entry.email) {
      // Create mailto: link with email parameters
      const mailto = `mailto:${entry.email.to}`;
      const params = new URLSearchParams();

      if (entry.email.cc) {
        params.append('cc', entry.email.cc);
      }
      if (entry.email.subject) {
        params.append('subject', entry.email.subject);
      }
      if (entry.email.body) {
        params.append('body', entry.email.body);
      }

      const queryString = params.toString();
      content = queryString ? `${mailto}?${queryString}` : mailto;
    }

    if (!content) {
      throw new Error('No content to generate QR code');
    }

    try {
      // Generate QR code as data URL
      const dataUrl = await QRCode.toDataURL(content, {
        width: 300,
        margin: 1,
        errorCorrectionLevel: 'M',
      });
      return dataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
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
