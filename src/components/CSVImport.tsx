import React, { useRef } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Papa from 'papaparse';
import type { QRCodeEntry } from '../types';
import { storageService } from '../services/storageService';

interface CSVImportProps {
  onImportComplete: () => void;
  onNotification?: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

interface CSVRow {
  type?: string;
  title?: string;
  subtitle?: string;
  link?: string;
  email_to?: string;
  email_cc?: string;
  email_subject?: string;
  email_body?: string;
}

export const CSVImport: React.FC<CSVImportProps> = ({ onImportComplete, onNotification }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const entries: QRCodeEntry[] = results.data
          .filter((row) => row.type && row.title)
          .map((row, index) => {
            const entry: QRCodeEntry = {
              id: `csv-import-${Date.now()}-${index}`,
              type: row.type === 'email' ? 'email' : 'link',
              title: row.title || '',
              subtitle: row.subtitle || '',
            };

            if (entry.type === 'link') {
              entry.link = row.link || '';
            } else {
              entry.email = {
                to: row.email_to || '',
                cc: row.email_cc,
                subject: row.email_subject || '',
                body: row.email_body || '',
              };
            }

            return entry;
          });

        // Save all imported entries
        const existingEntries = storageService.getQRCodeEntries();
        storageService.saveQRCodeEntries([...existingEntries, ...entries]);

        onNotification?.(t('notifications.importSuccess', { count: entries.length }), 'success');
        onImportComplete();

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      error: (error) => {
        onNotification?.(t('notifications.importError', { message: error.message }), 'error');
      },
    });
  };

  const handleDownloadTemplate = () => {
    const csvContent = `type,title,subtitle,link,email_to,email_cc,email_subject,email_body
link,Example Link,Visit our website,https://example.com,,,
email,Example Email,Contact us,,contact@example.com,cc@example.com,Hello,This is the email body`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={() => fileInputRef.current?.click()}
      >
        {t('csvImport.import')}
      </Button>
      <Button variant="text" size="small" onClick={handleDownloadTemplate}>
        {t('csvImport.downloadTemplate')}
      </Button>
      <Typography variant="caption" color="text.secondary">
        {t('csvImport.format')}
      </Typography>
    </Box>
  );
};
