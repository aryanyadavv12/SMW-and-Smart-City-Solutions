import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import {
  Delete,
  Route,
  Analytics,
  Report,
  Speed,
  Recycling,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Delete fontSize="large" color="primary" />,
      title: 'Waste Collection',
      description:
        'Request waste pickup services and track collection status in real-time.',
    },
    {
      icon: <Route fontSize="large" color="primary" />,
      title: 'Route Optimization',
      description:
        'Efficient collection routes optimized for time and fuel savings.',
    },
    {
      icon: <Analytics fontSize="large" color="primary" />,
      title: 'Analytics & Reports',
      description:
        'Comprehensive analytics and insights for better waste management.',
    },
    {
      icon: <Report fontSize="large" color="primary" />,
      title: 'Complaint Management',
      description:
        'Report issues and track complaint resolution status.',
    },
    {
      icon: <Speed fontSize="large" color="primary" />,
      title: 'Real-time Tracking',
      description:
        'Track waste collection vehicles and requests in real-time.',
    },
    {
      icon: <Recycling fontSize="large" color="secondary" />,
      title: 'Smart Recycling',
      description:
        'Eco-friendly and sustainable waste management solutions.',
    },
  ];

  return (
    <Box>
      {/* HERO SECTION */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Solid Waste Management
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Smart City Solutions
          </Typography>
          <Typography
            variant="body1"
            sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
          >
            A comprehensive platform for efficient waste management,
            route optimization, and sustainable city solutions.
          </Typography>

          {!isAuthenticated && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={Link}
                to="/register"
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                component={Link}
                to="/login"
                sx={{ borderColor: 'white', color: 'white' }}
              >
                Login
              </Button>
            </Box>
          )}

          {isAuthenticated && (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to="/dashboard"
            >
              Go to Dashboard
            </Button>
          )}
        </Container>
      </Box>

      {/* FEATURES SECTION */}
      <Container sx={{ py: 8 }}>
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
        >
          Key Features
        </Typography>

        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Everything you need for efficient waste management
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
