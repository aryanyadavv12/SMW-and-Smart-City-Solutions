import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { Add, CheckCircle, PlayArrow } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const CollectionRoutes = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [createDialog, setCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    scheduledDate: '',
    vehicleInfo: '',
  });

  const { data: routes, isLoading } = useQuery(
    'collectionRoutes',
    () => api.get('/collection-routes').then((res) => res.data.data),
    { enabled: !!user }
  );

  const createMutation = useMutation(
    (data) => api.post('/collection-routes', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('collectionRoutes');
        toast.success('Collection route created successfully');
        setCreateDialog(false);
        setFormData({ name: '', scheduledDate: '', vehicleInfo: '' });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create route');
      },
    }
  );

  const statusMutation = useMutation(
    ({ routeId, status }) => api.put(`/collection-routes/${routeId}`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('collectionRoutes');
        toast.success('Route status updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update route');
      },
    }
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'scheduled':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleCreate = () => {
    if (!formData.name || !formData.scheduledDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Collection Routes
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialog(true)}
        >
          New Route
        </Button>
      </Box>

      <Grid container spacing={3}>
        {routes?.map((route) => (
          <Grid item xs={12} md={6} key={route._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {route.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Collector: {route.collector?.name || 'N/A'}
                    </Typography>
                  </Box>
                  <Chip
                    label={route.status}
                    color={getStatusColor(route.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Scheduled:</strong>{' '}
                  {format(new Date(route.scheduledDate), 'MMM dd, yyyy')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Requests:</strong> {route.requests?.length || 0}
                </Typography>
                {route.distance > 0 && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Distance:</strong> {route.distance.toFixed(2)} km
                  </Typography>
                )}
                {route.vehicleInfo && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Vehicle:</strong> {route.vehicleInfo}
                  </Typography>
                )}

                <Box display="flex" gap={1} sx={{ mt: 2 }}>
                  {route.status === 'scheduled' && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<PlayArrow />}
                      onClick={() =>
                        statusMutation.mutate({ routeId: route._id, status: 'in-progress' })
                      }
                    >
                      Start
                    </Button>
                  )}
                  {route.status === 'in-progress' && (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircle />}
                      onClick={() =>
                        statusMutation.mutate({ routeId: route._id, status: 'completed' })
                      }
                    >
                      Complete
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {routes?.length === 0 && (
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No collection routes found
          </Typography>
        </Box>
      )}

      <Dialog open={createDialog} onClose={() => setCreateDialog(false)}>
        <DialogTitle>Create Collection Route</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Route Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Scheduled Date"
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Vehicle Info"
            value={formData.vehicleInfo}
            onChange={(e) => setFormData({ ...formData, vehicleInfo: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={createMutation.isLoading}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CollectionRoutes;

