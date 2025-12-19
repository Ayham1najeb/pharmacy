import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    const menuItems = [
        { name: 'لوحة التحكم', path: '/admin/dashboard' },
        { name: 'الصيدليات', path: '/admin/pharmacies' },
        { name: 'المناوبات', path: '/admin/schedule' },
        { name: 'المستخدمين', path: '/admin/users' },
        { name: 'الأحياء', path: '/admin/neighborhoods' },
        { name: 'الإعدادات', path: '/admin/settings' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 right-4 z-[60] p-3 bg-blue-900 text-white rounded-lg shadow-lg"
            >
                {isOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`h-screen w-72 lg:w-80 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white flex flex-col fixed right-0 top-0 shadow-2xl z-50 border-l border-blue-800 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                {/* Logo/Header */}
                <div className="p-6 lg:p-8 border-b border-blue-800/50">
                    <div className="text-center">
                        <h1 className="text-lg lg:text-xl font-black mb-1 tracking-wide">
                            صيدليات معرة النعمان
                        </h1>
                        <p className="text-xs text-blue-300 font-medium">لوحة تحكم المدير</p>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-4 lg:py-6 px-3 lg:px-4">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 lg:px-6 py-3 mb-1 rounded-lg transition-all duration-200 text-sm font-semibold ${isActive(item.path)
                                ? 'bg-white text-blue-950 shadow-lg'
                                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 lg:p-6 border-t border-blue-800/50">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 lg:px-6 py-3 bg-red-700 hover:bg-red-800 rounded-lg transition-all duration-200 font-semibold text-sm shadow-lg"
                    >
                        تسجيل خروج
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
