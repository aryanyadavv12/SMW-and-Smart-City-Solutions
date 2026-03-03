import React from 'react';
import { useQuery } from 'react-query';
import { Container, Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import {
  Delete,
  Route,
  Report,
  CheckCircle,
  Pending,
  Assignment,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user, isAdmin, isCollector } = useAuth();

  const { data: wasteStats, isLoading: wasteLoading } = useQuery(
    'wasteStats',
    () => api.get('/analytics/waste').then((res) => res.data.data),
    { enabled: !!user }
  );

  const { data: collectionStats, isLoading: collectionLoading } = useQuery(
    'collectionStats',
    () => api.get('/analytics/collection').then((res) => res.data.data),
    { enabled: (isAdmin || isCollector) && !!user }
  );

  const { data: complaintStats, isLoading: complaintLoading } = useQuery(
    'complaintStats',
    () => api.get('/analytics/complaints').then((res) => res.data.data),
    { enabled: !!user }
  );

  const { data: dashboardStats, isLoading: dashboardLoading } = useQuery(
    'dashboardStats',
    () => api.get('/analytics/dashboard').then((res) => res.data.data),
    { enabled: isAdmin && !!user }
  );

  if (wasteLoading || (isAdmin && dashboardLoading)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ icon, title, value, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: `${color}.main`, fontSize: 48 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome back, {user?.name}!
      </Typography>

      {isAdmin && dashboardStats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Delete />}
              title="Total Requests"
              value={dashboardStats.overview.totalRequests}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Pending />}
              title="Pending"
              value={dashboardStats.overview.pendingRequests}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<CheckCircle />}
              title="Completed"
              value={dashboardStats.overview.completedRequests}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Report />}
              title="Open Complaints"
              value={dashboardStats.overview.openComplaints}
              color="error"
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Waste Requests
              </Typography>
              {wasteStats && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {wasteStats.total}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="warning.main">
                      {wasteStats.pending}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      In Progress
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="info.main">
                      {wasteStats.inProgress}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      {wasteStats.completed}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>

        {(isAdmin || isCollector) && collectionStats && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Collection Routes
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {collectionStats.total}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Scheduled
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="info.main">
                      {collectionStats.scheduled}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      In Progress
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="warning.main">
                      {collectionStats.inProgress}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      {collectionStats.completed}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {complaintStats && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Complaints
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {complaintStats.total}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Open
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="error.main">
                      {complaintStats.open}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      In Progress
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="warning.main">
                      {complaintStats.inProgress}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Resolved
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="success.main">
                      {complaintStats.resolved}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;

