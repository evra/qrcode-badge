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

export interface PDFTemplate {
  id: string;
  name: string;
  pageSize: 'A4' | 'Letter' | 'A5';
  orientation: 'portrait' | 'landscape';
  qrCodeSize: number; // in mm
  qrCodeX: number; // position in mm
  qrCodeY: number; // position in mm
  titleX: number;
  titleY: number;
  titleFontSize: number;
  subtitleX: number;
  subtitleY: number;
  subtitleFontSize: number;
  itemsPerPage: number;
}

export const DEFAULT_TEMPLATE: PDFTemplate = {
  id: 'default',
  name: 'Default Template',
  pageSize: 'A4',
  orientation: 'portrait',
  qrCodeSize: 50,
  qrCodeX: 30,
  qrCodeY: 40,
  titleX: 30,
  titleY: 100,
  titleFontSize: 16,
  subtitleX: 30,
  subtitleY: 110,
  subtitleFontSize: 12,
  itemsPerPage: 1,
};
