import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

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
        { name: 'التقييمات', path: '/admin/reviews' },
        { name: 'الإعدادات', path: '/admin/settings' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="h-screen w-80 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white flex flex-col fixed right-0 top-0 shadow-2xl z-50 border-l border-blue-800">
            {/* Logo/Header */}
            <div className="p-8 border-b border-blue-800/50">
                <div className="text-center">
                    <h1 className="text-xl font-black mb-1 tracking-wide">
                        صيدليات معرة النعمان
                    </h1>
                    <p className="text-xs text-blue-300 font-medium">لوحة تحكم المدير</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto py-6 px-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`block px-6 py-3 mb-1 rounded-lg transition-all duration-200 text-sm font-semibold ${isActive(item.path)
                                ? 'bg-white text-blue-950 shadow-lg'
                                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                            }`}
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-6 border-t border-blue-800/50">
                <button
                    onClick={handleLogout}
                    className="w-full px-6 py-3 bg-red-700 hover:bg-red-800 rounded-lg transition-all duration-200 font-semibold text-sm shadow-lg"
                >
                    تسجيل خروج
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
