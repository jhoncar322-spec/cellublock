import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import Statistics from '../components/Dashboard/Statistics';
import api from '../services/api';
import { Statistics as StatsType } from '../types';

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.getStatistics();
        setStatistics(response.statistics);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (!statistics) return <Typography>Failed to load statistics</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Statistics statistics={statistics} />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {statistics.recentActivity.slice(0, 5).map((activity, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={activity.action}
                    secondary={`${activity.adminEmail || 'System'} - ${new Date(
                      activity.timestamp
                    ).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Dashboard;
