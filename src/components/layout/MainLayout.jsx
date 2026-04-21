import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { useAppSettings } from '../../context/AppSettingsContext';

const MainLayout = () => {
    const { theme } = useAppSettings();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isSidebarOpen) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isSidebarOpen]);

    return (
        <div className={`min-h-screen font-sans ${theme === 'dark' ? 'bg-[#0f1629] text-slate-100' : 'bg-white text-slate-900'}`}>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="min-h-screen pl-0 lg:pl-[312px]">
                <TopHeader
                    isSidebarOpen={isSidebarOpen}
                    onMenuToggle={() => setIsSidebarOpen((prev) => !prev)}
                />

                <main className="px-3 pb-8 pt-4 sm:px-5 sm:pt-6 lg:px-8">
                    <div className="w-full animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
