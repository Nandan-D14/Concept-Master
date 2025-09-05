import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import StudyMaterial from './pages/StudyMaterial';
import DoubtsPage from './pages/DoubtsPage';
import CreateDoubt from './pages/CreateDoubt';
import DoubtDetail from './pages/DoubtDetail';
import TestsPage from './pages/TestsPage';
import TestInterface from './pages/TestInterface';
import TestViewer from './pages/TestViewer';
import AIStudio from './pages/AIStudio';
import PYQAnalyzer from './pages/PYQAnalyzer';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ContentViewer from './pages/ContentViewer';
import NotFound from './pages/NotFound';

import { useAuth } from './store';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />

        {/* Protected routes wrapped with Layout */}
        <Route path="" element={<Layout><div /></Layout>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="study" element={<ProtectedRoute><StudyMaterial /></ProtectedRoute>} />
          <Route path="content/:id" element={<ProtectedRoute><ContentViewer /></ProtectedRoute>} />
          <Route path="doubts" element={<ProtectedRoute><DoubtsPage /></ProtectedRoute>} />
          <Route path="doubts/new" element={<ProtectedRoute><CreateDoubt /></ProtectedRoute>} />
          <Route path="doubts/:id" element={<ProtectedRoute><DoubtDetail /></ProtectedRoute>} />
          <Route path="tests" element={<ProtectedRoute><TestsPage /></ProtectedRoute>} />
          <Route path="tests/:id" element={<ProtectedRoute><TestInterface /></ProtectedRoute>} />
          <Route path="tests/view/:id" element={<ProtectedRoute><TestViewer /></ProtectedRoute>} />
          <Route path="ai-tools" element={<ProtectedRoute><AIStudio /></ProtectedRoute>} />
          <Route path="pyq-analyzer" element={<ProtectedRoute><PYQAnalyzer /></ProtectedRoute>} />
          <Route path="leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
