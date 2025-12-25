import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import LoadingSpinner from './components/common/LoadingSpinner';

// Components that need to load immediately (shared)
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import { usePageTracking } from './hooks/usePageTracking';

// Lazy load all page components for better performance
const Home = lazy(() => import('./pages/public/Home'));
const Schedule = lazy(() => import('./pages/public/Schedule'));
const Map = lazy(() => import('./pages/public/Map'));
const AllPharmacies = lazy(() => import('./pages/public/AllPharmacies'));
const PharmacyDetails = lazy(() => import('./pages/public/PharmacyDetails'));
const Search = lazy(() => import('./pages/public/Search'));
const About = lazy(() => import('./pages/public/About'));
const Register = lazy(() => import('./pages/public/Register'));
const PrivacyPolicy = lazy(() => import('./pages/public/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/public/Terms'));

// Pharmacist Pages
const PharmacistDashboard = lazy(() => import('./pages/pharmacist/Dashboard'));
const PharmacistProfile = lazy(() => import('./pages/pharmacist/Profile'));
const MySchedule = lazy(() => import('./pages/pharmacist/MySchedule'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const PharmaciesManagement = lazy(() => import('./pages/admin/PharmaciesManagement'));
const ScheduleManagement = lazy(() => import('./pages/admin/ScheduleManagement'));
const NeighborhoodsManagement = lazy(() => import('./pages/admin/NeighborhoodsManagement'));
const ReviewsManagement = lazy(() => import('./pages/admin/ReviewsManagement'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));

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
        <Suspense fallback={<LoadingSpinner fullScreen={true} />}>
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
        </Suspense>
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
        <HelmetProvider>
          <Router>
            <AppContent />
          </Router>
        </HelmetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
