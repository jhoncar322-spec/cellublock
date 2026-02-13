import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert
} from '@mui/material';
import DeviceList from '../components/Dashboard/DeviceList';
import api from '../services/api';
import { Device } from '../types';

const Devices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'block' | 'unblock' | 'delete' | null;
    deviceId: string;
  }>({ open: false, action: null, deviceId: '' });
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const fetchDevices = async () => {
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const response = await api.getDevices(params);
      setDevices(response.devices);
    } catch (error) {
      console.error('Failed to fetch devices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [statusFilter, search]);

  const handleView = async (deviceId: string) => {
    try {
      const response = await api.getDeviceById(deviceId);
      setSelectedDevice(response.device);
      setDialogOpen(true);
    } catch (error) {
      console.error('Failed to fetch device details:', error);
    }
  };

  const handleAction = async () => {
    setError('');
    try {
      if (actionDialog.action === 'block') {
        await api.blockDevice(actionDialog.deviceId, reason || 'No reason provided');
      } else if (actionDialog.action === 'unblock') {
        await api.unblockDevice(actionDialog.deviceId, reason || 'No reason provided');
      } else if (actionDialog.action === 'delete') {
        await api.deleteDevice(actionDialog.deviceId);
      }
      setActionDialog({ open: false, action: null, deviceId: '' });
      setReason('');
      fetchDevices();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Action failed');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Devices
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
          placeholder="Search by ID, brand, or model"
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <DeviceList
          devices={devices}
          onView={handleView}
          onBlock={(deviceId) => setActionDialog({ open: true, action: 'block', deviceId })}
          onUnblock={(deviceId) => setActionDialog({ open: true, action: 'unblock', deviceId })}
          onDelete={(deviceId) => setActionDialog({ open: true, action: 'delete', deviceId })}
        />
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Device Details</DialogTitle>
        <DialogContent>
          {selectedDevice && (
            <Box>
              <Typography><strong>Device ID:</strong> {selectedDevice.id}</Typography>
              <Typography><strong>Brand:</strong> {selectedDevice.brand}</Typography>
              <Typography><strong>Model:</strong> {selectedDevice.model}</Typography>
              <Typography><strong>OS:</strong> {selectedDevice.os} {selectedDevice.osVersion}</Typography>
              <Typography><strong>Status:</strong> {selectedDevice.status}</Typography>
              <Typography><strong>IMEI:</strong> {selectedDevice.imei || 'N/A'}</Typography>
              <Typography><strong>Serial Number:</strong> {selectedDevice.serialNumber || 'N/A'}</Typography>
              <Typography><strong>Enrolled At:</strong> {new Date(selectedDevice.enrolledAt).toLocaleString()}</Typography>
              <Typography><strong>Last Activity:</strong> {new Date(selectedDevice.lastActivity).toLocaleString()}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, action: null, deviceId: '' })}>
        <DialogTitle>
          {actionDialog.action === 'block' && 'Block Device'}
          {actionDialog.action === 'unblock' && 'Unblock Device'}
          {actionDialog.action === 'delete' && 'Delete Device'}
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {actionDialog.action !== 'delete' && (
            <TextField
              fullWidth
              label="Reason"
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
          {actionDialog.action === 'delete' && (
            <Typography>Are you sure you want to delete this device?</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog({ open: false, action: null, deviceId: '' })}>
            Cancel
          </Button>
          <Button onClick={handleAction} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Devices;
