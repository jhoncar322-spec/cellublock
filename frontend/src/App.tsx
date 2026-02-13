import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Devices from './pages/Devices';
import EnrollDevice from './pages/EnrollDevice';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2'
    },
    secondary: {
      main: '#dc004e'
    }
  }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Box sx={{ display: 'flex' }}>
                      <Sidebar />
                      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/devices" element={<Devices />} />
                          <Route path="/enroll" element={<EnrollDevice />} />
                          <Route path="/" element={<Navigate to="/dashboard" />} />
                        </Routes>
                      </Box>
                    </Box>
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
