import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useAuth } from './store';
import { authAPI } from './services/api';

// Layout Components
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudyMaterial from './pages/StudyMaterial';
import ContentViewer from './pages/ContentViewer';
import DoubtsPage from './pages/DoubtsPage';
import DoubtDetail from './pages/DoubtDetail';
import CreateDoubt from './pages/CreateDoubt';
import TestsPage from './pages/TestsPage';
import TestViewer from './pages/TestViewer';
import AITools from './pages/AITools';
import PYQAnalyzer from './pages/PYQAnalyzer';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route component (redirect to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { setUser, setToken, setLoading, logout } = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setLoading(true);
        try {
          const response = await authAPI.getMe();
          setUser(response.data.data.user);
          setToken(token);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          logout();
        } finally {
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, [setUser, setToken, setLoading, logout]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <AuthLayout>
                  <LoginPage />
                </AuthLayout>
              </PublicRoute>
            } />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/study" element={
              <ProtectedRoute>
                <Layout>
                  <StudyMaterial />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/study/:id" element={
              <ProtectedRoute>
                <Layout>
                  <ContentViewer />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/doubts" element={
              <ProtectedRoute>
                <Layout>
                  <DoubtsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/doubts/create" element={
              <ProtectedRoute>
                <Layout>
                  <CreateDoubt />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/doubts/:id" element={
              <ProtectedRoute>
                <Layout>
                  <DoubtDetail />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/tests" element={
              <ProtectedRoute>
                <Layout>
                  <TestsPage />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/tests/:id" element={
              <ProtectedRoute>
                <Layout>
                  <TestViewer />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/ai-tools" element={
              <ProtectedRoute>
                <Layout>
                  <AITools />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/pyq-analyzer" element={
              <ProtectedRoute>
                <Layout>
                  <PYQAnalyzer />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Layout>
                  <Leaderboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#059669',
                },
              },
              error: {
                style: {
                  background: '#DC2626',
                },
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
