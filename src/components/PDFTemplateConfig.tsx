import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import type { PDFTemplate } from '../types';
import { storageService } from '../services/storageService';

interface PDFTemplateConfigProps {
  onTemplateChange?: (template: PDFTemplate) => void;
}

export const PDFTemplateConfig: React.FC<PDFTemplateConfigProps> = ({ onTemplateChange }) => {
  const [templates, setTemplates] = useState<PDFTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [currentTemplate, setCurrentTemplate] = useState<PDFTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const data = storageService.getPDFTemplates();
    setTemplates(data);
    if (data.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(data[0].id);
      setCurrentTemplate(data[0]);
      onTemplateChange?.(data[0]);
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
    if (!currentTemplate) return;

    storageService.updatePDFTemplate(currentTemplate.id, currentTemplate);
    loadTemplates();
    alert('Template saved successfully!');
  };

  const handleCreateNew = () => {
    const newTemplate: PDFTemplate = {
      id: `template-${Date.now()}`,
      name: `Template ${templates.length + 1}`,
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
    storageService.addPDFTemplate(newTemplate);
    loadTemplates();
    setSelectedTemplateId(newTemplate.id);
    setCurrentTemplate(newTemplate);
    onTemplateChange?.(newTemplate);
  };

  if (!currentTemplate) return null;

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          PDF Template Configuration
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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
          <Button variant="outlined" onClick={handleCreateNew}>
            Create New Template
          </Button>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Template Name"
          value={currentTemplate.name}
          onChange={(e) =>
            setCurrentTemplate({ ...currentTemplate, name: e.target.value })
          }
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Page Size</InputLabel>
            <Select
              value={currentTemplate.pageSize}
              label="Page Size"
              onChange={(e) =>
                setCurrentTemplate({
                  ...currentTemplate,
                  pageSize: e.target.value as 'A4' | 'Letter' | 'A5',
                })
              }
            >
              <MenuItem value="A4">A4</MenuItem>
              <MenuItem value="Letter">Letter</MenuItem>
              <MenuItem value="A5">A5</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Orientation</InputLabel>
            <Select
              value={currentTemplate.orientation}
              label="Orientation"
              onChange={(e) =>
                setCurrentTemplate({
                  ...currentTemplate,
                  orientation: e.target.value as 'portrait' | 'landscape',
                })
              }
            >
              <MenuItem value="portrait">Portrait</MenuItem>
              <MenuItem value="landscape">Landscape</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Typography variant="subtitle2">QR Code Settings</Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            type="number"
            label="QR Code Size (mm)"
            value={currentTemplate.qrCodeSize}
            onChange={(e) =>
              setCurrentTemplate({
                ...currentTemplate,
                qrCodeSize: Number(e.target.value),
              })
            }
          />
          <TextField
            fullWidth
            type="number"
            label="X Position (mm)"
            value={currentTemplate.qrCodeX}
            onChange={(e) =>
              setCurrentTemplate({ ...currentTemplate, qrCodeX: Number(e.target.value) })
            }
          />
          <TextField
            fullWidth
            type="number"
            label="Y Position (mm)"
            value={currentTemplate.qrCodeY}
            onChange={(e) =>
              setCurrentTemplate({ ...currentTemplate, qrCodeY: Number(e.target.value) })
            }
          />
        </Box>

        <Typography variant="subtitle2">Title Settings</Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            type="number"
            label="Font Size"
            value={currentTemplate.titleFontSize}
            onChange={(e) =>
              setCurrentTemplate({
                ...currentTemplate,
                titleFontSize: Number(e.target.value),
              })
            }
          />
          <TextField
            fullWidth
            type="number"
            label="X Position (mm)"
            value={currentTemplate.titleX}
            onChange={(e) =>
              setCurrentTemplate({ ...currentTemplate, titleX: Number(e.target.value) })
            }
          />
          <TextField
            fullWidth
            type="number"
            label="Y Position (mm)"
            value={currentTemplate.titleY}
            onChange={(e) =>
              setCurrentTemplate({ ...currentTemplate, titleY: Number(e.target.value) })
            }
          />
        </Box>

        <Typography variant="subtitle2">Subtitle Settings</Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            type="number"
            label="Font Size"
            value={currentTemplate.subtitleFontSize}
            onChange={(e) =>
              setCurrentTemplate({
                ...currentTemplate,
                subtitleFontSize: Number(e.target.value),
              })
            }
          />
          <TextField
            fullWidth
            type="number"
            label="X Position (mm)"
            value={currentTemplate.subtitleX}
            onChange={(e) =>
              setCurrentTemplate({ ...currentTemplate, subtitleX: Number(e.target.value) })
            }
          />
          <TextField
            fullWidth
            type="number"
            label="Y Position (mm)"
            value={currentTemplate.subtitleY}
            onChange={(e) =>
              setCurrentTemplate({ ...currentTemplate, subtitleY: Number(e.target.value) })
            }
          />
        </Box>

        <TextField
          fullWidth
          type="number"
          label="Items Per Page"
          value={currentTemplate.itemsPerPage}
          onChange={(e) =>
            setCurrentTemplate({
              ...currentTemplate,
              itemsPerPage: Number(e.target.value),
            })
          }
        />

        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
          Save Template
        </Button>
      </Box>
    </Paper>
  );
};
