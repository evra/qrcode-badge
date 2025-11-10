import jsPDF from 'jspdf';
import type { QRCodeEntry, PDFTemplate } from '../types';
import { qrCodeService } from './qrCodeService';

export const pdfService = {
  /**
   * Generate a PDF with QR codes based on the template
   */
  generatePDF: async (entries: QRCodeEntry[], template: PDFTemplate): Promise<void> => {
    // Generate all QR codes first
    const qrCodes = await qrCodeService.generateBatch(entries);

    // Create PDF with specified page size and orientation
    const pdf = new jsPDF({
      orientation: template.orientation,
      unit: 'mm',
      format: template.pageSize.toLowerCase() as 'a4' | 'letter' | 'a5',
    });

    let isFirstPage = true;

    // Process entries based on items per page
    for (let i = 0; i < entries.length; i += template.itemsPerPage) {
      if (!isFirstPage) {
        pdf.addPage();
      }
      isFirstPage = false;

      // Get entries for current page
      const pageEntries = entries.slice(i, i + template.itemsPerPage);

      // Calculate vertical spacing for multiple items per page
      const pageHeight = pdf.internal.pageSize.getHeight();
      const spacing = template.itemsPerPage > 1 
        ? pageHeight / template.itemsPerPage 
        : 0;

      // Add each entry to the page
      pageEntries.forEach((entry, index) => {
        const yOffset = spacing * index;
        const qrCodeDataUrl = qrCodes.get(entry.id);

        if (qrCodeDataUrl) {
          // Add QR code image
          pdf.addImage(
            qrCodeDataUrl,
            'PNG',
            template.qrCodeX,
            template.qrCodeY + yOffset,
            template.qrCodeSize,
            template.qrCodeSize
          );
        }

        // Add title
        pdf.setFontSize(template.titleFontSize);
        pdf.setFont('helvetica', 'bold');
        pdf.text(
          entry.title,
          template.titleX,
          template.titleY + yOffset
        );

        // Add subtitle
        pdf.setFontSize(template.subtitleFontSize);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          entry.subtitle,
          template.subtitleX,
          template.subtitleY + yOffset
        );
      });
    }

    // Save the PDF
    pdf.save('qr-codes.pdf');
  },

  /**
   * Preview a single QR code entry
   */
  previewEntry: async (entry: QRCodeEntry, template: PDFTemplate): Promise<Blob> => {
    const qrCodeDataUrl = await qrCodeService.generateQRCode(entry);

    const pdf = new jsPDF({
      orientation: template.orientation,
      unit: 'mm',
      format: template.pageSize.toLowerCase() as 'a4' | 'letter' | 'a5',
    });

    // Add QR code image
    pdf.addImage(
      qrCodeDataUrl,
      'PNG',
      template.qrCodeX,
      template.qrCodeY,
      template.qrCodeSize,
      template.qrCodeSize
    );

    // Add title
    pdf.setFontSize(template.titleFontSize);
    pdf.setFont('helvetica', 'bold');
    pdf.text(entry.title, template.titleX, template.titleY);

    // Add subtitle
    pdf.setFontSize(template.subtitleFontSize);
    pdf.setFont('helvetica', 'normal');
    pdf.text(entry.subtitle, template.subtitleX, template.subtitleY);

    return pdf.output('blob');
  },
};
