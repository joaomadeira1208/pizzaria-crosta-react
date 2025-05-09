import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from './hooks/useAuth';
import { AuthProvider } from './contexts/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Layout components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AccountPage from './pages/AccountPage';
import EditAccountPage from './pages/EditAccountPage';
import NotFoundPage from './pages/NotFoundPage';
import PerfilPage from './pages/PerfilPage';

const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_PK_TEST!);

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <ToastContainer position="top-right" autoClose={3000} />

            <Header />

            <main className="flex-grow">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <Navigate to="/menu" replace />
                  }
                />

                <Route
                  path="/menu"
                  element={
                    <MenuPage />
                  }
                />

                <Route
                  path="/cart"
                  element={
                    <CartPage />
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/pedidos"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/track-order/:orderId"
                  element={
                    <ProtectedRoute>
                      <TrackOrderPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <PerfilPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/perfil/editar"
                  element={
                    <ProtectedRoute>
                      <EditAccountPage />
                    </ProtectedRoute>
                  }
                />

                {/* 404 route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </Elements>
  );
};

export default App;