import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { QrCode2 as QrIcon } from '@mui/icons-material';
import QRDisplay from '../components/QRGenerator/QRDisplay';
import api from '../services/api';
import { QRCodeResponse } from '../types';

const EnrollDevice: React.FC = () => {
  const [qrData, setQrData] = useState<QRCodeResponse | null>(null);
  const [expiresIn, setExpiresIn] = useState('24h');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateQR = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await api.generateQR(expiresIn);
      setQrData(response);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Enroll New Device
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mt: 3, mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>QR Code Expiration</InputLabel>
          <Select
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            label="QR Code Expiration"
          >
            <MenuItem value="1h">1 Hour</MenuItem>
            <MenuItem value="24h">24 Hours</MenuItem>
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          startIcon={<QrIcon />}
          onClick={handleGenerateQR}
          disabled={loading}
          size="large"
        >
          {loading ? 'Generating...' : 'Generate QR Code'}
        </Button>
      </Box>

      {qrData && (
        <QRDisplay
          qrCode={qrData.qrCode}
          enrollmentToken={qrData.enrollmentToken}
          expiresAt={qrData.expiresAt}
        />
      )}

      <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Instructions
        </Typography>
        <Typography variant="body2" component="div">
          <ol>
            <li>Generate a QR code using the button above</li>
            <li>The device should scan the QR code</li>
            <li>The device will be automatically enrolled in the system</li>
            <li>You can then manage the device from the Devices page</li>
          </ol>
        </Typography>
      </Box>
    </Container>
  );
};

export default EnrollDevice;
