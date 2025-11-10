import React, { useEffect, useRef, useState } from 'react';
import { Designer } from '@pdfme/ui';
import type { Template } from '@pdfme/common';
import { text, image, barcodes } from '@pdfme/schemas';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import type { PDFTemplateWrapper } from '../types';
import { storageService } from '../services/storageService';

interface PDFmeTemplateDesignerProps {
  onTemplateChange?: (template: PDFTemplateWrapper) => void;
  onNotification?: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

export const PDFmeTemplateDesigner: React.FC<PDFmeTemplateDesignerProps> = ({
  onTemplateChange,
  onNotification,
}) => {
  const designerRef = useRef<HTMLDivElement>(null);
  const designerInstanceRef = useRef<Designer | null>(null);
  const [templates, setTemplates] = useState<PDFTemplateWrapper[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [currentTemplate, setCurrentTemplate] = useState<PDFTemplateWrapper | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (designerRef.current && currentTemplate?.pdfmeTemplate) {
      // Clean up existing designer
      if (designerInstanceRef.current) {
        designerInstanceRef.current.destroy();
      }

      try {
        // Create new designer instance
        const designer = new Designer({
          domContainer: designerRef.current,
          template: currentTemplate.pdfmeTemplate,
          options: {
            font: {
              // Using a publicly available font URL as fallback
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

        designerInstanceRef.current = designer;

        // Listen for template changes
        designer.onChangeTemplate((template: Template) => {
          if (currentTemplate) {
            const updatedTemplate: PDFTemplateWrapper = {
              ...currentTemplate,
              pdfmeTemplate: template,
            };
            setCurrentTemplate(updatedTemplate);
          }
        });
      } catch (error) {
        console.error('Error initializing PDFme designer:', error);
      }
    }

    return () => {
      if (designerInstanceRef.current) {
        designerInstanceRef.current.destroy();
        designerInstanceRef.current = null;
      }
    };
  }, [currentTemplate?.id]);

  const loadTemplates = () => {
    const data = storageService.getPDFTemplates();
    console.log('Loaded templates:', data);
    setTemplates(data);
    if (data.length > 0) {
      const templateToLoad = data[0];
      console.log('Template to load:', templateToLoad);
      console.log('Has pdfmeTemplate:', !!templateToLoad.pdfmeTemplate);
      console.log('pdfmeTemplate structure:', templateToLoad.pdfmeTemplate);
      setSelectedTemplateId(templateToLoad.id);
      setCurrentTemplate(templateToLoad);
      onTemplateChange?.(templateToLoad);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setCurrentTemplate(template);
      onTemplateChange?.(template);
    }
  };

  const handleSave = () => {
    if (!currentTemplate || !designerInstanceRef.current) return;

    const updatedTemplate: PDFTemplateWrapper = {
      ...currentTemplate,
      pdfmeTemplate: designerInstanceRef.current.getTemplate(),
    };

    storageService.updatePDFTemplate(updatedTemplate.id, updatedTemplate);
    loadTemplates();
    onTemplateChange?.(updatedTemplate);
    onNotification?.('Template saved successfully!', 'success');
  };

  const handleCreateNew = () => {
    const newTemplate: PDFTemplateWrapper = {
      id: `template-${Date.now()}`,
      name: `Template ${templates.length + 1}`,
      pdfmeTemplate: {
        basePdf: { width: 210, height: 297, padding: [10, 10, 10, 10] },
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
      },
    };
    storageService.addPDFTemplate(newTemplate);
    loadTemplates();
    setSelectedTemplateId(newTemplate.id);
    setCurrentTemplate(newTemplate);
    onTemplateChange?.(newTemplate);
  };

  const handleNameChange = (newName: string) => {
    if (currentTemplate) {
      setCurrentTemplate({
        ...currentTemplate,
        name: newName,
      });
    }
  };

  if (!currentTemplate || !currentTemplate.pdfmeTemplate) {
    console.log('Loading state - currentTemplate:', currentTemplate);
    console.log('Has pdfmeTemplate:', currentTemplate?.pdfmeTemplate);
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">Loading template designer...</Typography>
        <Typography variant="caption" color="text.secondary">
          Debug: {!currentTemplate ? 'No template' : 'No pdfmeTemplate property'}
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          PDF Template Designer (PDFme)
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Use the visual designer below to customize your PDF template. Drag and drop elements, resize them, and configure their properties.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Template</InputLabel>
            <Select
              value={selectedTemplateId}
              label="Select Template"
              onChange={(e) => handleTemplateSelect(e.target.value)}
            >
              {templates.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Template Name"
            value={currentTemplate?.name || ''}
            onChange={(e) => handleNameChange(e.target.value)}
            sx={{ flexGrow: 1 }}
          />

          <Button variant="outlined" onClick={handleCreateNew}>
            Create New
          </Button>

          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
            Save
          </Button>
        </Box>

        <Divider />

        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            <strong>Field Names:</strong> Use 'qrcode' for QR codes, 'title' for titles, and 'subtitle' for subtitles.
            The designer will automatically populate these fields when generating PDFs.
          </Typography>
        </Box>
      </Box>

      <Box
        ref={designerRef}
        sx={{
          width: '100%',
          height: '600px',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
    </Paper>
  );
};
