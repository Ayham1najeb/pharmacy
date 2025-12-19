import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout, isAdmin, isPharmacist } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        if (isAdmin()) return '/admin/dashboard';
        if (isPharmacist()) return '/pharmacist/dashboard';
        return '/';
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
                            صيدليات معرة النعمان
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6">
                        <Link
                            to="/"
                            className={`text-base font-medium transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'}`}
                        >
                            الرئيسية
                        </Link>
                        <Link
                            to="/schedule"
                            className={`text-base font-medium transition-colors ${isActive('/schedule') ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'}`}
                        >
                            جدول المناوبات
                        </Link>
                        <Link
                            to="/map"
                            className={`text-base font-medium transition-colors ${isActive('/map') ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'}`}
                        >
                            الخريطة
                        </Link>
                        <Link
                            to="/pharmacies"
                            className={`text-base font-medium transition-colors ${isActive('/pharmacies') ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'}`}
                        >
                            الصيدليات
                        </Link>
                        <Link
                            to="/about"
                            className={`text-base font-medium transition-colors ${isActive('/about') ? 'text-blue-600' : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'}`}
                        >
                            من نحن
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Auth Buttons - Desktop */}
                        {isAuthenticated ? (
                            <div className="hidden lg:flex items-center gap-2">
                                <Link
                                    to={getDashboardLink()}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-lg transition-colors"
                                >
                                    لوحة التحكم
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-base font-medium rounded-lg transition-colors"
                                >
                                    خروج
                                </button>
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center gap-2">
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-base font-medium rounded-lg transition-colors"
                                >
                                    تسجيل صيدلية
                                </Link>
                                <Link
                                    to="/admin/login"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-lg transition-colors"
                                >
                                    دخول
                                </Link>
                            </div>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            aria-label="تبديل الوضع"
                        >
                            {theme === 'light' ? (
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            )}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="lg:hidden py-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col gap-1">
                            <Link
                                to="/"
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-3 rounded-lg text-base font-medium ${isActive('/') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                الرئيسية
                            </Link>
                            <Link
                                to="/schedule"
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-3 rounded-lg text-base font-medium ${isActive('/schedule') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                جدول المناوبات
                            </Link>
                            <Link
                                to="/map"
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-3 rounded-lg text-base font-medium ${isActive('/map') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                الخريطة
                            </Link>
                            <Link
                                to="/pharmacies"
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-3 rounded-lg text-base font-medium ${isActive('/pharmacies') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                الصيدليات
                            </Link>
                            <Link
                                to="/about"
                                onClick={() => setIsMenuOpen(false)}
                                className={`px-4 py-3 rounded-lg text-base font-medium ${isActive('/about') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                من نحن
                            </Link>

                            {/* Mobile Auth */}
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to={getDashboardLink()}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="px-4 py-3 bg-blue-600 text-white text-base font-medium rounded-lg text-center"
                                        >
                                            لوحة التحكم
                                        </Link>
                                        <button
                                            onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                            className="px-4 py-3 bg-red-500 text-white text-base font-medium rounded-lg"
                                        >
                                            تسجيل الخروج
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="px-4 py-3 bg-green-600 text-white text-base font-medium rounded-lg text-center"
                                        >
                                            تسجيل صيدلية
                                        </Link>
                                        <Link
                                            to="/admin/login"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="px-4 py-3 bg-blue-600 text-white text-base font-medium rounded-lg text-center"
                                        >
                                            تسجيل الدخول
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
