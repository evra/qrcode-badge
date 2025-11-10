import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import type { QRCodeEntry, QRCodeType } from '../types';
import { storageService } from '../services/storageService';

interface QRCodeTableProps {
  onDataChange?: () => void;
  onNotification?: (message: string, severity: 'success' | 'error' | 'warning' | 'info') => void;
}

export const QRCodeTable: React.FC<QRCodeTableProps> = ({ onDataChange, onNotification }) => {
  const [entries, setEntries] = useState<QRCodeEntry[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<QRCodeEntry | null>(null);
  const [formData, setFormData] = useState<Partial<QRCodeEntry>>({
    type: 'link',
    title: '',
    subtitle: '',
    link: '',
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const data = storageService.getQRCodeEntries();
    setEntries(data);
  };

  const handleAdd = () => {
    setEditingEntry(null);
    setFormData({
      type: 'link',
      title: '',
      subtitle: '',
      link: '',
    });
    setOpenDialog(true);
  };

  const handleEdit = (entry: QRCodeEntry) => {
    setEditingEntry(entry);
    setFormData(entry);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    storageService.deleteQRCodeEntry(id);
    loadEntries();
    onDataChange?.();
  };

  const handleSave = () => {
    if (!formData.title || !formData.type) {
      onNotification?.('Please fill in all required fields', 'warning');
      return;
    }

    if (formData.type === 'link' && !formData.link) {
      onNotification?.('Please provide a link', 'warning');
      return;
    }

    if (formData.type === 'email' && (!formData.email?.to || !formData.email?.subject)) {
      onNotification?.('Please provide email recipient and subject', 'warning');
      return;
    }

    const entry: QRCodeEntry = {
      id: editingEntry?.id || `qr-${Date.now()}`,
      type: formData.type as QRCodeType,
      title: formData.title || '',
      subtitle: formData.subtitle || '',
      link: formData.type === 'link' ? formData.link : undefined,
      email: formData.type === 'email' ? formData.email : undefined,
    };

    if (editingEntry) {
      storageService.updateQRCodeEntry(entry.id, entry);
    } else {
      storageService.addQRCodeEntry(entry);
    }

    loadEntries();
    setOpenDialog(false);
    onDataChange?.();
  };

  const handleTypeChange = (type: QRCodeType) => {
    setFormData({
      ...formData,
      type,
      link: type === 'link' ? '' : undefined,
      email: type === 'email' ? { to: '', subject: '', body: '' } : undefined,
    });
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">QR Code Entries</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Entry
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Subtitle</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.type}</TableCell>
                <TableCell>{entry.title}</TableCell>
                <TableCell>{entry.subtitle}</TableCell>
                <TableCell>
                  {entry.type === 'link' ? (
                    entry.link
                  ) : (
                    `To: ${entry.email?.to}, Subject: ${entry.email?.subject}`
                  )}
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(entry)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(entry.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No entries yet. Click "Add Entry" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingEntry ? 'Edit Entry' : 'Add Entry'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type || 'link'}
                label="Type"
                onChange={(e) => handleTypeChange(e.target.value as QRCodeType)}
              >
                <MenuItem value="link">Link</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <TextField
              fullWidth
              label="Subtitle"
              value={formData.subtitle || ''}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            />

            {formData.type === 'link' && (
              <TextField
                fullWidth
                label="Link URL"
                value={formData.link || ''}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
            )}

            {formData.type === 'email' && (
              <>
                <TextField
                  fullWidth
                  label="To (Email)"
                  value={formData.email?.to || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: { ...formData.email!, to: e.target.value },
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="CC (Optional)"
                  value={formData.email?.cc || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: { ...formData.email!, cc: e.target.value },
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="Subject"
                  value={formData.email?.subject || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: { ...formData.email!, subject: e.target.value },
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="Body"
                  multiline
                  rows={4}
                  value={formData.email?.body || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: { ...formData.email!, body: e.target.value },
                    })
                  }
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
