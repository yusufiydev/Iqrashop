import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SuperAdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-cyan-50">
            <header className="sticky top-0 z-[70] isolate border-b border-emerald-100 bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="rounded-xl bg-emerald-600 p-2 text-white">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm text-emerald-700">Boshqaruv markazi</p>
                            <p className="truncate font-semibold text-gray-900">Super Admin</p>
                        </div>
                    </div>

                    <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end">
                        <span className="min-w-0 truncate text-sm text-gray-600">{user?.email}</span>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                        >
                            <LogOut className="h-4 w-4" />
                            Chiqish
                        </button>
                    </div>
                </div>
            </header>

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-3 py-4 sm:px-6 sm:py-6">
                <nav className="flex overflow-x-auto rounded-2xl border border-emerald-100 bg-white p-2">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) => `inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ${
                            isActive ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
                        }`}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </NavLink>
                </nav>
                <Outlet />
            </div>
        </div>
    );
};

export default SuperAdminLayout;
