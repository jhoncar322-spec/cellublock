import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box
} from '@mui/material';
import {
  Devices as DevicesIcon,
  CheckCircle as ActiveIcon,
  Block as BlockedIcon
} from '@mui/icons-material';
import { Statistics as StatsType } from '../../../types';

interface StatisticsProps {
  statistics: StatsType;
}

const Statistics: React.FC<StatisticsProps> = ({ statistics }) => {
  const stats = [
    {
      title: 'Total Devices',
      value: statistics.totalDevices,
      icon: <DevicesIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2'
    },
    {
      title: 'Active Devices',
      value: statistics.activeDevices,
      icon: <ActiveIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32'
    },
    {
      title: 'Blocked Devices',
      value: statistics.blockedDevices,
      icon: <BlockedIcon sx={{ fontSize: 40 }} />,
      color: '#d32f2f'
    }
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat) => (
        <Grid item xs={12} md={4} key={stat.title}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4">
                    {stat.value}
                  </Typography>
                </Box>
                <Box sx={{ color: stat.color }}>
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Statistics;
