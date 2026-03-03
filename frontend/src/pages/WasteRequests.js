import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Assignment,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const WasteRequests = () => {
  const { user, isAdmin, isCollector } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [assignDialog, setAssignDialog] = useState({ open: false, requestId: null });
  const [selectedCollector, setSelectedCollector] = useState('');

  const { data: requests, isLoading } = useQuery(
    ['wasteRequests', statusFilter],
    () =>
      api
        .get('/waste-requests', { params: statusFilter ? { status: statusFilter } : {} })
        .then((res) => res.data.data),
    { enabled: !!user }
  );

  const { data: collectors } = useQuery(
    'collectors',
    () => api.get('/users/collectors').then((res) => res.data.data),
    { enabled: (isAdmin || isCollector) && !!user }
  );

  const assignMutation = useMutation(
    ({ requestId, collectorId }) =>
      api.put(`/waste-requests/${requestId}/assign`, { collectorId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('wasteRequests');
        toast.success('Collector assigned successfully');
        setAssignDialog({ open: false, requestId: null });
        setSelectedCollector('');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to assign collector');
      },
    }
  );

  const statusMutation = useMutation(
    ({ requestId, status }) => api.put(`/waste-requests/${requestId}/status`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('wasteRequests');
        toast.success('Status updated successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update status');
      },
    }
  );

  const deleteMutation = useMutation(
    (requestId) => api.delete(`/waste-requests/${requestId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('wasteRequests');
        toast.success('Request deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete request');
      },
    }
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'assigned':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleAssign = () => {
    if (!selectedCollector) {
      toast.error('Please select a collector');
      return;
    }
    assignMutation.mutate({
      requestId: assignDialog.requestId,
      collectorId: selectedCollector,
    });
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
          Waste Requests
        </Typography>
        <Box display="flex" gap={2}>
          {user?.role === 'citizen' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/waste-requests/create')}
            >
              New Request
            </Button>
          )}
          <TextField
            select
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="assigned">Assigned</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {requests?.map((request) => (
          <Grid item xs={12} md={6} key={request._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {request.requestType?.toUpperCase()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {request.user?.name || 'N/A'}
                    </Typography>
                  </Box>
                  <Chip
                    label={request.status}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Description:</strong> {request.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Quantity:</strong> {request.quantity}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Scheduled:</strong>{' '}
                  {format(new Date(request.scheduledDate), 'MMM dd, yyyy')}
                </Typography>
                {request.assignedCollector && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Collector:</strong> {request.assignedCollector?.name}
                  </Typography>
                )}

                <Box display="flex" gap={1} sx={{ mt: 2 }}>
                  {(isAdmin || isCollector) && request.status === 'pending' && (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() =>
                        setAssignDialog({ open: true, requestId: request._id })
                      }
                    >
                      <Assignment />
                    </IconButton>
                  )}
                  {(isCollector || isAdmin) && request.status !== 'completed' && (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() =>
                        statusMutation.mutate({
                          requestId: request._id,
                          status: 'completed',
                        })
                      }
                    >
                      <CheckCircle />
                    </IconButton>
                  )}
                  {user?.role === 'citizen' && request.status === 'pending' && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteMutation.mutate(request._id)}
                    >
                      <Delete />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {requests?.length === 0 && (
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No waste requests found
          </Typography>
        </Box>
      )}

      <Dialog open={assignDialog.open} onClose={() => setAssignDialog({ open: false, requestId: null })}>
        <DialogTitle>Assign Collector</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Select Collector"
            value={selectedCollector}
            onChange={(e) => setSelectedCollector(e.target.value)}
            sx={{ mt: 2, minWidth: 300 }}
          >
            {collectors?.map((collector) => (
              <MenuItem key={collector._id} value={collector._id}>
                {collector.name} - {collector.email}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog({ open: false, requestId: null })}>Cancel</Button>
          <Button onClick={handleAssign} variant="contained" disabled={assignMutation.isLoading}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WasteRequests;

