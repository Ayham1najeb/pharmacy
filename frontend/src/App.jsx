import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Public Pages
import Home from './pages/public/Home';
import Schedule from './pages/public/Schedule';
import Map from './pages/public/Map';
import AllPharmacies from './pages/public/AllPharmacies';
import PharmacyDetails from './pages/public/PharmacyDetails';
import Search from './pages/public/Search';
import About from './pages/public/About';
import Register from './pages/public/Register';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import Terms from './pages/public/Terms';

// Pharmacist Pages
import PharmacistDashboard from './pages/pharmacist/Dashboard';
import PharmacistProfile from './pages/pharmacist/Profile';
import MySchedule from './pages/pharmacist/MySchedule';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import PharmaciesManagement from './pages/admin/PharmaciesManagement';
import ScheduleManagement from './pages/admin/ScheduleManagement';
import NeighborhoodsManagement from './pages/admin/NeighborhoodsManagement';
import ReviewsManagement from './pages/admin/ReviewsManagement';
import Settings from './pages/admin/Settings';
import UsersManagement from './pages/admin/UsersManagement';

// Components
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import { usePageTracking } from './hooks/usePageTracking';

function AppContent() {
  const { theme } = useTheme();
  const location = useLocation();
  usePageTracking();

  useEffect(() => {
    // Apply dark mode class to html element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Check if current route is admin or pharmacist page
  const isAdminPage = location.pathname.startsWith('/admin');
  const isPharmacistPage = location.pathname.startsWith('/pharmacist');
  const shouldHideHeaderFooter = isAdminPage || isPharmacistPage;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Only show Header if NOT admin/pharmacist page */}
      {!shouldHideHeaderFooter && <Header />}

      <main className={shouldHideHeaderFooter ? '' : 'flex-grow'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/map" element={<Map />} />
          <Route path="/pharmacies" element={<AllPharmacies />} />
          <Route path="/pharmacy/:id" element={<PharmacyDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Pharmacist Routes */}
          <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
          <Route path="/pharmacist/profile" element={<PharmacistProfile />} />
          <Route path="/pharmacist/schedule" element={<MySchedule />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/pharmacies" element={<PharmaciesManagement />} />
          <Route path="/admin/schedule" element={<ScheduleManagement />} />
          <Route path="/admin/neighborhoods" element={<NeighborhoodsManagement />} />
          <Route path="/admin/reviews" element={<ReviewsManagement />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/users" element={<UsersManagement />} />
        </Routes>
      </main>

      {/* Only show Footer if NOT admin/pharmacist page */}
      {!shouldHideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
