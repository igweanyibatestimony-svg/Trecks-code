import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Form from './components/Form';
import ThankYou from './components/ThankYou';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/admin/submissions', { withCredentials: true })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin/login" element={<AdminLogin onLogin={() => setIsAuthenticated(true)} />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/privacy.html" element={<Navigate to="/privacy.html" />} /> {/* optional static page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;