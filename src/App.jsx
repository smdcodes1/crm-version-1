import { useState, useEffect } from 'react';
import NavBar from './components/NavBar/NavBar';
import './App.css'
import Sidebar from './components/Sidebar/Sidebar';
import DashboardView from './pages/Dashboard/DashboardView';
import CustomersView from './pages/Customers/CustomersView';
import QuotationsView from "./pages/Quotations/QuotationsView";
import InvoicesView from './pages/Invoices/InvoicesView';
import CurrentProjectsView from './pages/Projects/CurrentProjectsView';
import SalesTrackerView from './pages/Tracker/SalesTrackerView';
import ReportsView from "./pages/Reports/ReportsView";
import SettingsView from './pages/Settings/SettingsView';
import SigninPage from './pages/Authentication/SigninPage/SigninPage';
import SignupPage from './pages/Authentication/SignupPage/SignupPage';
import StatCard from './components/StatCard/StatCard';

import BarChart from './components/BarChart/BarChart';
import { StatusBadge } from './components/StatusBadge/StatusBadge';
import { useCRM } from './context/CRMContext';
import { useAuth } from './context/AuthContext';
import { supabase } from './supabase/supabaseClient';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import NotFound from "./pages/NotFound/NotFound";
function App() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { activeTab } = useCRM();
  const { user, setUser } = useAuth();
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async (currentUser) => {
      if (currentUser) {
        // Query the profiles table filtering by this user's ID
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (data) {
          console.log("Username fetched:", data.full_name);
          setUser(data);
        } else {
          console.log("Error fetching profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    };

    // 1. Initial auth check
    supabase.auth.getUser().then(({ data: { user } }) => {
      fetchProfile(user);
    });

    // 2. Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'customers':
        return <CustomersView />;
      case 'quotations':
        return <QuotationsView />;
      case 'invoices':
        return <InvoicesView />;
      case 'projects':
        return <CurrentProjectsView />;
      case 'tracker':
        return <SalesTrackerView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
    }
  };
  const mainLayoutElement = (
    <div className="app-layout">
      <Sidebar mobileOpen={mobileSidebarOpen} onCloseMobile={(isOpen) => setMobileSidebarOpen(isOpen)} />
      <div className="main-content">
        <NavBar onOpenMobileMenu={() => setMobileSidebarOpen(true)} />
        <main>{renderActiveView()}</main>
      </div>
    </div>
  );

  // if (authLoading) {
  //   return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  // }

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute>
        {mainLayoutElement}
      </ProtectedRoute>} />
      <Route path="/login" element={!user ? <SigninPage /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <SignupPage /> : <Navigate to="/" replace />} />
      <Route path="/guest" element={mainLayoutElement} />
      <Route path="*" element={<NotFound />} />
    </Routes >
  );
}

export default App
