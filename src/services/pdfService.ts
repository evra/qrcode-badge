import { generate } from '@pdfme/generator';
import { text, image, barcodes } from '@pdfme/schemas';
import type { QRCodeEntry, PDFTemplateWrapper } from '../types';

export const pdfService = {
  /**
   * Generate a PDF with QR codes based on the pdfme template
   */
  generatePDF: async (entries: QRCodeEntry[], template: PDFTemplateWrapper): Promise<void> => {
    // Prepare inputs for pdfme - one input per entry
    const inputs = await Promise.all(
      entries.map(async (entry) => {
        // Generate QR code content
        let qrContent = '';
        if (entry.type === 'link' && entry.link) {
          qrContent = entry.link;
        } else if (entry.type === 'email' && entry.email) {
          const mailto = `mailto:${entry.email.to}`;
          const params = new URLSearchParams();
          if (entry.email.cc) params.append('cc', entry.email.cc);
          if (entry.email.subject) params.append('subject', entry.email.subject);
          if (entry.email.body) params.append('body', entry.email.body);
          const queryString = params.toString();
          qrContent = queryString ? `${mailto}?${queryString}` : mailto;
        }

        return {
          qrcode: qrContent,
          title: entry.title,
          subtitle: entry.subtitle,
        };
      })
    );

    // Generate PDF using pdfme
    const pdf = await generate({
      template: template.pdfmeTemplate,
      inputs,
      options: {
        font: {
          Roboto: {
            data: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
            fallback: true,
          },
        },
      },
      plugins: {
        text,
        image,
        qrcode: barcodes.qrcode,
      },
    });

    // Convert to blob and download
    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-codes.pdf';
    a.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Preview a single QR code entry
   */
  previewEntry: async (entry: QRCodeEntry, template: PDFTemplateWrapper): Promise<Blob> => {
    // Generate QR code content
    let qrContent = '';
    if (entry.type === 'link' && entry.link) {
      qrContent = entry.link;
    } else if (entry.type === 'email' && entry.email) {
      const mailto = `mailto:${entry.email.to}`;
      const params = new URLSearchParams();
      if (entry.email.cc) params.append('cc', entry.email.cc);
      if (entry.email.subject) params.append('subject', entry.email.subject);
      if (entry.email.body) params.append('body', entry.email.body);
      const queryString = params.toString();
      qrContent = queryString ? `${mailto}?${queryString}` : mailto;
    }

    const inputs = [
      {
        qrcode: qrContent,
        title: entry.title,
        subtitle: entry.subtitle,
      },
    ];

    // Generate PDF using pdfme
    const pdf = await generate({
      template: template.pdfmeTemplate,
      inputs,
      options: {
        font: {
          Roboto: {
            data: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
            fallback: true,
          },
        },
      },
      plugins: {
        text,
        image,
        qrcode: barcodes.qrcode,
      },
    });

    return new Blob([pdf.buffer], { type: 'application/pdf' });
  },
};
