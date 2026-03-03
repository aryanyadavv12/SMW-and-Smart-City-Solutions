import React from 'react';
import { useQuery } from 'react-query';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  CircularProgress,
} from '@mui/material';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const { isAdmin } = useAuth();

  const { data: users, isLoading } = useQuery(
    'users',
    () => api.get('/users').then((res) => res.data.data),
    { enabled: isAdmin }
  );

  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Access denied. Admin only.
        </Typography>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'collector':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Users
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {users?.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Chip
                    label={user.role?.toUpperCase()}
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </Box>
                {user.phone && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {user.phone}
                  </Typography>
                )}
                {user.address?.city && (
                  <Typography variant="body2">
                    <strong>Location:</strong> {user.address.city}, {user.address.state}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {users?.length === 0 && (
        <Box textAlign="center" sx={{ py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No users found
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Users;

