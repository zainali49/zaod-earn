import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/useAuthStore';

// Layouts
import MobileLayout from './components/layout/MobileLayout';

// Pages - Auth
import Splash from './pages/Splash';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Pages - User
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Wallet from './pages/Wallet';
import Withdraw from './pages/Withdraw';
import Referrals from './pages/Referrals';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Pages - Other
import Blocked from './pages/Blocked';

function AuthGuard({ children, requireAuth, requireRole }: { children: React.ReactNode, requireAuth?: boolean, requireRole?: 'user' | 'advertiser' }) {
  const { user, userData, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-[#0b1120] flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (requireAuth && !user) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  if (!requireAuth && user && userData?.isBlocked) {
      return <Navigate to="/blocked" replace />;
  }

  if (requireAuth && user && userData) {
    if (userData.isBlocked) {
      return <Navigate to="/blocked" replace />;
    }
    if (requireRole && userData.role !== requireRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  if (!requireAuth && user && (location.pathname === '/welcome' || location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/')) {
      return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { setUser, fetchUserData } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentAuthUser) => {
      setUser(currentAuthUser);
      if (currentAuthUser) {
        await fetchUserData(currentAuthUser.uid);
      } else {
        useAuthStore.getState().setUserData(null);
      }
      useAuthStore.setState({ loading: false });
    });

    return () => unsubscribe();
  }, [setUser, fetchUserData]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthGuard requireAuth={false}><Splash /></AuthGuard>} />
        <Route path="/welcome" element={<AuthGuard requireAuth={false}><Welcome /></AuthGuard>} />
        <Route path="/login" element={<AuthGuard requireAuth={false}><Login /></AuthGuard>} />
        <Route path="/signup" element={<AuthGuard requireAuth={false}><Signup /></AuthGuard>} />
        <Route path="/blocked" element={<Blocked />} />
        
        {/* Main App Routes - Wrapped in Mobile/Bottom Nav Layout */}
        <Route element={<AuthGuard requireAuth={true}><MobileLayout /></AuthGuard>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
