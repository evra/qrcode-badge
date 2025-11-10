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
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { PictureAsPdf as PdfIcon, Language as LanguageIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [currentTemplate, setCurrentTemplate] = useState<PDFTemplateWrapper | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDataChange = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleGeneratePDF = async () => {
    const entries = storageService.getQRCodeEntries();
    
    if (entries.length === 0) {
      showSnackbar(t('notifications.noEntries'), 'warning');
      return;
    }

    if (!currentTemplate) {
      showSnackbar(t('notifications.noTemplate'), 'warning');
      return;
    }

    setIsGenerating(true);
    try {
      await pdfService.generatePDF(entries, currentTemplate);
      showSnackbar(t('notifications.pdfSuccess'), 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showSnackbar(t('notifications.pdfError'), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('app.title')}
          </Typography>
          <FormControl sx={{ minWidth: 120, mr: 2 }} size="small">
            <Select
              value={i18n.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' }, '.MuiSvgIcon-root': { color: 'white' } }}
              startAdornment={<LanguageIcon sx={{ mr: 1, color: 'white' }} />}
            >
              <MenuItem value="en">{t('language.en')}</MenuItem>
              <MenuItem value="de">{t('language.de')}</MenuItem>
            </Select>
          </FormControl>
          <Button
            color="inherit"
            startIcon={<PdfIcon />}
            onClick={handleGeneratePDF}
            disabled={isGenerating}
          >
            {isGenerating ? t('app.generating') : t('app.generatePDF')}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="main navigation tabs">
            <Tab label={t('tabs.qrCodeData')} id="tab-0" aria-controls="tabpanel-0" />
            <Tab label={t('tabs.pdfTemplate')} id="tab-1" aria-controls="tabpanel-1" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3 }}>
              <CSVImport onImportComplete={handleDataChange} onNotification={showSnackbar} />
            </Box>
            <QRCodeTable key={refreshKey} onDataChange={handleDataChange} onNotification={showSnackbar} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <PDFmeTemplateDesigner onTemplateChange={setCurrentTemplate} onNotification={showSnackbar} />
          </TabPanel>
        </Paper>

        <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            {t('howToUse.title')}
          </Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>
                <strong>{t('howToUse.step1.title')}</strong> {t('howToUse.step1.description')}
              </li>
              <li>
                <strong>{t('howToUse.step2.title')}</strong> {t('howToUse.step2.description')}
              </li>
              <li>
                <strong>{t('howToUse.step3.title')}</strong> {t('howToUse.step3.description')}
              </li>
            </ol>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              {t('howToUse.localStorageNote')}
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
            {t('footer.text')}
          </Typography>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
