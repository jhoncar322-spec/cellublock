import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip
} from '@mui/material';
import { Device } from '../../types';

interface DeviceCardProps {
  device: Device;
  onClick: () => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onClick }) => {
  return (
    <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }} onClick={onClick}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {device.brand} {device.model}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          ID: {device.id}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          OS: {device.os}
        </Typography>
        <Chip
          label={device.status.toUpperCase()}
          color={device.status === 'active' ? 'success' : 'error'}
          size="small"
          sx={{ mt: 1 }}
        />
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
