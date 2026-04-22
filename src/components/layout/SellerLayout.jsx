import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, BookOpen, LogOut, Menu, X, Store
} from 'lucide-react';
import { useAppSettings } from '../../context/AppSettingsContext';

const SellerSidebar = ({ navItems, onNavigate, onLogout, t, user }) => (
    <aside className="flex min-h-screen w-[min(82vw,280px)] shrink-0 flex-col border-r border-emerald-100 bg-white text-gray-900 sm:w-64">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-emerald-100 px-5 py-5 sm:px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600">
                <Store className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="text-sm font-bold leading-none text-gray-900">{t('seller.panel') || 'Seller Panel'}</p>
                <p className="mt-0.5 text-xs text-gray-500">Iqrashop</p>
            </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-3 py-5 sm:px-4 sm:py-6">
            {navItems.map(({ to, label, icon, end }) => {
                const IconComponent = icon;
                return (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                                : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`
                        }
                        onClick={onNavigate}
                    >
                        <IconComponent className="h-4 w-4 shrink-0" />
                        {label}
                    </NavLink>
                );
            })}
        </nav>

        {/* User info */}
        <div className="border-t border-emerald-100 px-3 py-4 sm:px-4">
            <div className="flex items-center gap-3 mb-3 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                    {user?.name?.[0]?.toUpperCase() || 'S'}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="truncate text-xs text-gray-500">{user?.email}</p>
                </div>
            </div>
            <button
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
            >
                <LogOut className="w-4 h-4" />
                {t('seller.logout') || 'Logout'}
            </button>
        </div>
    </aside>
);

const SellerLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const { t } = useAppSettings();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navItems = [
        { to: '/seller', label: t('seller.dashboard') || 'Dashboard', icon: LayoutDashboard, end: true },
        { to: '/seller/books', label: t('seller.books') || 'My Books', icon: BookOpen },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-100">
            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:shrink-0">
                <SellerSidebar
                    navItems={navItems}
                    onNavigate={() => setSidebarOpen(false)}
                    onLogout={handleLogout}
                    t={t}
                    user={user}
                />
            </div>

            {/* Mobile sidebar overlay */}
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <button
                    type="button"
                    className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close seller menu"
                />
                <div className={`relative z-50 h-full transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="h-full">
                        <SellerSidebar
                            navItems={navItems}
                            onNavigate={() => setSidebarOpen(false)}
                            onLogout={handleLogout}
                            t={t}
                            user={user}
                        />
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-emerald-100 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 sm:py-4 lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-600 hover:text-emerald-700"
                    >
                        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <div className="flex items-center gap-2">
                        <Store className="h-5 w-5 text-emerald-600" />
                        <span className="text-sm font-semibold text-gray-900">{t('seller.panel') || 'Seller Panel'}</span>
                    </div>
                    <div className="w-6" />
                </header>

                <main className="flex-1 overflow-auto px-3 py-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;
