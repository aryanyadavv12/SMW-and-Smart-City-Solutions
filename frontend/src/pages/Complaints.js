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
  Grid,
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const Complaints = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');

  const { data: complaints, isLoading } = useQuery(
    ['complaints', statusFilter],
    () =>
      api
        .get('/complaints', { params: statusFilter ? { status: statusFilter } : {} })
        .then((res) => res.data.data),
    { enabled: !!user }
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'success';
      case 'in-progress':
        return 'info';
      case 'open':
        return 'warning';
      default:
        return 'default';
    }
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
          Complaints
        </Typography>
        <Box display="flex" gap={2}>
          {user?.role === 'citizen' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/complaints/create')}
            >
              New Complaint
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {complaints?.map((complaint) => (
          <Grid item xs={12} md={6} key={complaint._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {complaint.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {complaint.category?.replace('-', ' ').toUpperCase()}
                    </Typography>
                  </Box>
                  <Chip
                    label={complaint.status}
                    color={getStatusColor(complaint.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  {complaint.description}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Priority:</strong> {complaint.priority}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Submitted:</strong>{' '}
                  {format(new Date(complaint.createdAt), 'MMM dd, yyyy')}
                </Typography>
                {complaint.resolution && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Resolution:
                    </Typography>
                    <Typography variant="body2">{complaint.resolution}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {complaints?.length === 0 && (
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No complaints found
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Complaints;

