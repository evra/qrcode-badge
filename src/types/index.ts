import type { Template } from '@pdfme/common';

export type QRCodeType = 'link' | 'email';

export interface EmailData {
  to: string;
  cc?: string;
  subject: string;
  body: string;
}

export interface QRCodeEntry {
  id: string;
  type: QRCodeType;
  title: string;
  subtitle: string;
  // For link type
  link?: string;
  // For email type
  email?: EmailData;
}

export interface PDFTemplateWrapper {
  id: string;
  name: string;
  pdfmeTemplate: Template;
}

// Default pdfme template for QR code badges
export const DEFAULT_PDFME_TEMPLATE: Template = {
  basePdf: { width: 210, height: 297, padding: [10, 10, 10, 10] }, // A4 in mm
  schemas: [
    [
      {
        type: 'qrcode',
        name: 'qrcode',
        position: { x: 30, y: 40 },
        width: 50,
        height: 50,
      },
      {
        type: 'text',
        name: 'title',
        position: { x: 30, y: 100 },
        width: 150,
        height: 10,
        fontSize: 16,
      },
      {
        type: 'text',
        name: 'subtitle',
        position: { x: 30, y: 115 },
        width: 150,
        height: 8,
        fontSize: 12,
      },
    ],
  ],
};

export const DEFAULT_TEMPLATE: PDFTemplateWrapper = {
  id: 'default',
  name: 'Default Template',
  pdfmeTemplate: DEFAULT_PDFME_TEMPLATE,
};
