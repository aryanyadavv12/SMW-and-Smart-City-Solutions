import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WasteRequests from './pages/WasteRequests';
import CreateRequest from './pages/CreateRequest';
import CollectionRoutes from './pages/CollectionRoutes';
import Complaints from './pages/Complaints';
import CreateComplaint from './pages/CreateComplaint';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Users from './pages/Users';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/waste-requests"
            element={
              <PrivateRoute>
                <WasteRequests />
              </PrivateRoute>
            }
          />
          <Route
            path="/waste-requests/create"
            element={
              <PrivateRoute>
                <CreateRequest />
              </PrivateRoute>
            }
          />
          <Route
            path="/collection-routes"
            element={
              <PrivateRoute>
                <CollectionRoutes />
              </PrivateRoute>
            }
          />
          <Route
            path="/complaints"
            element={
              <PrivateRoute>
                <Complaints />
              </PrivateRoute>
            }
          />
          <Route
            path="/complaints/create"
            element={
              <PrivateRoute>
                <CreateComplaint />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute>
                <Analytics />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </AuthProvider>
  );
}

export default App;

