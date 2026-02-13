import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

interface QRDisplayProps {
  qrCode: string;
  enrollmentToken: string;
  expiresAt: string;
  onDownload?: () => void;
}

const QRDisplay: React.FC<QRDisplayProps> = ({
  qrCode,
  enrollmentToken,
  expiresAt,
  onDownload
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `enrollment-qr-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onDownload) onDownload();
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(enrollmentToken);
    alert('Token copied to clipboard!');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Enrollment QR Code
        </Typography>
        <Box sx={{ textAlign: 'center', my: 2 }}>
          <img src={qrCode} alt="Enrollment QR Code" style={{ maxWidth: '100%' }} />
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Enrollment Token:
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            bgcolor: 'grey.100',
            p: 1,
            borderRadius: 1,
            cursor: 'pointer',
            wordBreak: 'break-all'
          }}
          onClick={handleCopyToken}
        >
          {enrollmentToken}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Expires: {new Date(expiresAt).toLocaleString()}
        </Typography>
        <Button
          fullWidth
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{ mt: 2 }}
        >
          Download QR Code
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRDisplay;
