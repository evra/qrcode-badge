import type { QRCodeEntry, PDFTemplateWrapper } from '../types';
import { DEFAULT_TEMPLATE } from '../types';

const QRCODE_ENTRIES_KEY = 'qrcode_entries';
const PDF_TEMPLATES_KEY = 'pdf_templates';

export const storageService = {
  // QR Code Entries
  getQRCodeEntries: (): QRCodeEntry[] => {
    const data = localStorage.getItem(QRCODE_ENTRIES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveQRCodeEntries: (entries: QRCodeEntry[]): void => {
    localStorage.setItem(QRCODE_ENTRIES_KEY, JSON.stringify(entries));
  },

  addQRCodeEntry: (entry: QRCodeEntry): void => {
    const entries = storageService.getQRCodeEntries();
    entries.push(entry);
    storageService.saveQRCodeEntries(entries);
  },

  updateQRCodeEntry: (id: string, updatedEntry: QRCodeEntry): void => {
    const entries = storageService.getQRCodeEntries();
    const index = entries.findIndex((e) => e.id === id);
    if (index !== -1) {
      entries[index] = updatedEntry;
      storageService.saveQRCodeEntries(entries);
    }
  },

  deleteQRCodeEntry: (id: string): void => {
    const entries = storageService.getQRCodeEntries();
    const filtered = entries.filter((e) => e.id !== id);
    storageService.saveQRCodeEntries(filtered);
  },

  // PDF Templates
  getPDFTemplates: (): PDFTemplateWrapper[] => {
    const data = localStorage.getItem(PDF_TEMPLATES_KEY);
    if (!data) {
      // Initialize with default template
      const defaultTemplates = [DEFAULT_TEMPLATE];
      storageService.savePDFTemplates(defaultTemplates);
      return defaultTemplates;
    }
    
    try {
      const templates = JSON.parse(data);
      
      // Validate and migrate old format if needed
      const validTemplates = templates.filter((t: any) => {
        // Check if it's the old format (has pageSize, orientation, etc.)
        if (t.pageSize || t.orientation || !t.pdfmeTemplate) {
          console.warn('Old template format detected, skipping:', t);
          return false;
        }
        return t.pdfmeTemplate && t.id && t.name;
      });
      
      // If no valid templates, return default
      if (validTemplates.length === 0) {
        console.log('No valid templates found, using default');
        const defaultTemplates = [DEFAULT_TEMPLATE];
        storageService.savePDFTemplates(defaultTemplates);
        return defaultTemplates;
      }
      
      return validTemplates;
    } catch (error) {
      console.error('Error parsing templates:', error);
      const defaultTemplates = [DEFAULT_TEMPLATE];
      storageService.savePDFTemplates(defaultTemplates);
      return defaultTemplates;
    }
  },

  savePDFTemplates: (templates: PDFTemplateWrapper[]): void => {
    localStorage.setItem(PDF_TEMPLATES_KEY, JSON.stringify(templates));
  },

  addPDFTemplate: (template: PDFTemplateWrapper): void => {
    const templates = storageService.getPDFTemplates();
    templates.push(template);
    storageService.savePDFTemplates(templates);
  },

  updatePDFTemplate: (id: string, updatedTemplate: PDFTemplateWrapper): void => {
    const templates = storageService.getPDFTemplates();
    const index = templates.findIndex((t) => t.id === id);
    if (index !== -1) {
      templates[index] = updatedTemplate;
      storageService.savePDFTemplates(templates);
    }
  },

  deletePDFTemplate: (id: string): void => {
    const templates = storageService.getPDFTemplates();
    const filtered = templates.filter((t) => t.id !== id);
    storageService.savePDFTemplates(filtered);
  },
};
