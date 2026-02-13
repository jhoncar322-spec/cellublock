import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { Device } from '../../../types';

interface DeviceListProps {
  devices: Device[];
  onView: (deviceId: string) => void;
  onBlock: (deviceId: string) => void;
  onUnblock: (deviceId: string) => void;
  onDelete: (deviceId: string) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  onView,
  onBlock,
  onUnblock,
  onDelete
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Device ID</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>OS</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Enrolled</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell>{device.id}</TableCell>
              <TableCell>{device.brand}</TableCell>
              <TableCell>{device.model}</TableCell>
              <TableCell>{device.os}</TableCell>
              <TableCell>
                <Chip
                  label={device.status.toUpperCase()}
                  color={device.status === 'active' ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {new Date(device.enrolledAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Tooltip title="View Details">
                  <IconButton size="small" onClick={() => onView(device.id)}>
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                {device.status === 'active' ? (
                  <Tooltip title="Block Device">
                    <IconButton size="small" color="error" onClick={() => onBlock(device.id)}>
                      <BlockIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Unblock Device">
                    <IconButton size="small" color="success" onClick={() => onUnblock(device.id)}>
                      <UnblockIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete Device">
                  <IconButton size="small" color="error" onClick={() => onDelete(device.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DeviceList;
