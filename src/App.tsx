import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  AppBar,
  Toolbar,
  Paper,
} from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { QRCodeTable } from './components/QRCodeTable';
import { CSVImport } from './components/CSVImport';
import { PDFmeTemplateDesigner } from './components/PDFmeTemplateDesigner';
import type { PDFTemplateWrapper } from './types';
import { storageService } from './services/storageService';
import { pdfService } from './services/pdfService';
import './App.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [currentTemplate, setCurrentTemplate] = useState<PDFTemplateWrapper | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDataChange = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleGeneratePDF = async () => {
    const entries = storageService.getQRCodeEntries();
    
    if (entries.length === 0) {
      alert('No QR code entries found. Please add some entries first.');
      return;
    }

    if (!currentTemplate) {
      alert('No template selected. Please configure a template first.');
      return;
    }

    setIsGenerating(true);
    try {
      await pdfService.generatePDF(entries, currentTemplate);
      alert('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            QR Code Badge Generator
          </Typography>
          <Button
            color="inherit"
            startIcon={<PdfIcon />}
            onClick={handleGeneratePDF}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate PDF'}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="main navigation tabs">
            <Tab label="QR Code Data" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="PDF Template" id="tab-1" aria-controls="tabpanel-1" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3 }}>
              <CSVImport onImportComplete={handleDataChange} />
            </Box>
            <QRCodeTable key={refreshKey} onDataChange={handleDataChange} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <PDFmeTemplateDesigner onTemplateChange={setCurrentTemplate} />
          </TabPanel>
        </Paper>

        <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            How to Use
          </Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>
                <strong>Add QR Code Data:</strong> Use the "QR Code Data" tab to manually add entries or
                import from a CSV file. Each entry can be either a link or an email message.
              </li>
              <li>
                <strong>Configure Template:</strong> Switch to the "PDF Template" tab to customize the
                layout, including page size, QR code position, and text formatting.
              </li>
              <li>
                <strong>Generate PDF:</strong> Click the "Generate PDF" button in the top right to create
                your printable PDF with all QR codes.
              </li>
            </ol>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              All data is stored locally in your browser. Your data will persist between sessions.
            </Typography>
          </Typography>
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'grey.200' }}
      >
        <Container maxWidth="xl">
          <Typography variant="body2" color="text.secondary" align="center">
            QR Code Badge Generator - All data is stored locally in your browser
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
