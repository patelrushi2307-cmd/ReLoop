import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Shell & Navigation
import Navbar from './components/Navbar';
import RoleSwitcher from './components/RoleSwitcher';

// Auth Pages
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Onboarding from './pages/Auth/Onboarding';

// Main Application Pages
import Dashboard from './pages/Dashboard/Dashboard';
import ListingsBrowse from './pages/Listings/ListingsBrowse';
import ListingNew from './pages/Listings/ListingNew';
import ListingDetail from './pages/Listings/ListingDetail';
import RequirementsList from './pages/Requirements/RequirementsList';
import RequirementNew from './pages/Requirements/RequirementNew';
import MatchesInbox from './pages/Matches/MatchesInbox';
import MatchDetail from './pages/Matches/MatchDetail';
import TradesList from './pages/Trades/TradesList';
import TradeDetail from './pages/Trades/TradeDetail';
import LogisticsHub from './pages/Logistics/LogisticsHub';
import DriverExecution from './pages/Logistics/DriverExecution';
import TruckLoadStudio from './pages/Logistics/TruckLoadStudio';
import NetworkGlobe from './pages/Network/NetworkGlobe';
import ImpactReporting from './pages/Impact/ImpactReporting';
import AdminPanel from './pages/Admin/AdminPanel';
import OrgSettings from './pages/Settings/OrgSettings';

// Layout wrapper to conditionally show Navbar
function AppShell() {
  const location = useLocation();
  const isAuthPage = ['/signup', '/login', '/onboarding'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-black flex flex-col font-sans selection:bg-[#7201FF] selection:text-white">
      {!isAuthPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Auth & Onboarding */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Listings */}
          <Route path="/listings" element={<ListingsBrowse />} />
          <Route path="/listings/new" element={<ListingNew />} />
          <Route path="/listings/:id" element={<ListingDetail />} />

          {/* Requirements */}
          <Route path="/requirements" element={<RequirementsList />} />
          <Route path="/requirements/new" element={<RequirementNew />} />

          {/* Matches */}
          <Route path="/matches" element={<MatchesInbox />} />
          <Route path="/matches/:id" element={<MatchDetail />} />

          {/* Trades */}
          <Route path="/trades" element={<TradesList />} />
          <Route path="/trades/:id" element={<TradeDetail />} />

          {/* Logistics */}
          <Route path="/logistics" element={<LogisticsHub />} />
          <Route path="/logistics/:shipmentId" element={<DriverExecution />} />
          <Route path="/logistics/load/:shipmentId" element={<TruckLoadStudio />} />

          {/* 3D Visual Surfaces & Reporting */}
          <Route path="/network" element={<NetworkGlobe />} />
          <Route path="/impact" element={<ImpactReporting />} />

          {/* Admin & Settings */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/settings/organisation" element={<OrgSettings />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>

      {/* Floating Interactive Role & Capability Switcher */}
      <RoleSwitcher />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  );
}
