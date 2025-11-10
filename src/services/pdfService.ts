import { generate } from '@pdfme/generator';
import { text, image, barcodes } from '@pdfme/schemas';
import type { QRCodeEntry, PDFTemplateWrapper } from '../types';

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

export const pdfService = {
  /**
   * Generate a PDF with QR codes based on the pdfme template
   */
  generatePDF: async (entries: QRCodeEntry[], template: PDFTemplateWrapper): Promise<void> => {
    // Collect all field names from the template schema
    const fieldNames = new Set<string>();
    template.pdfmeTemplate.schemas.forEach((schema) => {
      schema.forEach((field: any) => {
        if (field.name) {
          fieldNames.add(field.name);
        }
      });
    });

    // Prepare inputs for pdfme - one input per entry
    const inputs = await Promise.all(
      entries.map(async (entry) => {
        // Generate QR code content
        let qrContent = '';
        if (entry.type === 'link' && entry.link) {
          qrContent = entry.link;
        } else if (entry.type === 'email' && entry.email) {
          const mailto = `mailto:${entry.email.to}`;
          const params: string[] = [];
          // Email addresses in CC should NOT be percent-encoded, only subject/body
          if (entry.email.cc) params.push(`cc=${entry.email.cc}`);
          if (entry.email.subject) params.push(`subject=${encodeMailtoParam(entry.email.subject)}`);
          if (entry.email.body) params.push(`body=${encodeMailtoParam(entry.email.body)}`);
          qrContent = params.length > 0 ? `${mailto}?${params.join('&')}` : mailto;
        }

        // Create input object with all template fields
        // Start with our core data fields
        const input: Record<string, string> = {
          qrcode: qrContent,
          title: entry.title,
          subtitle: entry.subtitle,
        };

        // Add empty strings for any other fields in the template
        // This allows static images and text fields to be rendered
        fieldNames.forEach((fieldName) => {
          if (!(fieldName in input)) {
            input[fieldName] = '';
          }
        });

        return input;
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
    // Collect all field names from the template schema
    const fieldNames = new Set<string>();
    template.pdfmeTemplate.schemas.forEach((schema) => {
      schema.forEach((field: any) => {
        if (field.name) {
          fieldNames.add(field.name);
        }
      });
    });

    // Generate QR code content
    let qrContent = '';
    if (entry.type === 'link' && entry.link) {
      qrContent = entry.link;
    } else if (entry.type === 'email' && entry.email) {
      const mailto = `mailto:${entry.email.to}`;
      const params: string[] = [];
      // Email addresses in CC should NOT be percent-encoded, only subject/body
      if (entry.email.cc) params.push(`cc=${entry.email.cc}`);
      if (entry.email.subject) params.push(`subject=${encodeMailtoParam(entry.email.subject)}`);
      if (entry.email.body) params.push(`body=${encodeMailtoParam(entry.email.body)}`);
      qrContent = params.length > 0 ? `${mailto}?${params.join('&')}` : mailto;
    }

    // Create input object with all template fields
    const input: Record<string, string> = {
      qrcode: qrContent,
      title: entry.title,
      subtitle: entry.subtitle,
    };

    // Add empty strings for any other fields in the template
    fieldNames.forEach((fieldName) => {
      if (!(fieldName in input)) {
        input[fieldName] = '';
      }
    });

    const inputs = [input];

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
