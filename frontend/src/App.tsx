import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import { RequireAuth } from './components/RequireAuth';
import { ErrorBoundary } from './components/ErrorBoundary';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { MaterialDetailsPage } from './pages/MaterialDetailsPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { LogisticsPage } from './pages/LogisticsPage';
import { ImpactDashboardPage } from './pages/ImpactDashboardPage';
import { OrganizationPage } from './pages/OrganizationPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/materials/:id" element={<MaterialDetailsPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/create-listing"
              element={
                <RequireAuth>
                  <CreateListingPage />
                </RequireAuth>
              }
            />
            <Route
              path="/my-listings"
              element={
                <RequireAuth>
                  <MyListingsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireAuth>
                  <OrdersPage />
                </RequireAuth>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <RequireAuth>
                  <OrderDetailsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/logistics"
              element={
                <RequireAuth>
                  <LogisticsPage />
                </RequireAuth>
              }
            />
            <Route
              path="/impact"
              element={
                <RequireAuth>
                  <ImpactDashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="/organization"
              element={
                <RequireAuth>
                  <OrganizationPage />
                </RequireAuth>
              }
            />

            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
};
