import {
    BookMarked,
    BookOpen,
    BriefcaseBusiness,
    CircleHelp,
    FlaskConical,
    Landmark,
    Rocket,
    ScrollText,
    Settings,
    Baby,
    X,
} from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { GENRES } from '../../services/mockApi';
import { useAppSettings } from '../../context/AppSettingsContext';
import ContactModal from './ContactModal';
import BrandLogo from '../common/BrandLogo';

const genreIcons = {
    roman: ScrollText,
    sheriyat: BookOpen,
    ilmiy: FlaskConical,
    fantastika: Rocket,
    tarix: Landmark,
    biznes: BriefcaseBusiness,
    bolalar: Baby,
};

const navItemClass = (isDark) => ({ isActive }) => `
    group flex items-center justify-start gap-3 rounded-none px-5 py-3 text-sm font-medium transition-colors duration-200
    ${isActive
        ? isDark
            ? 'bg-[#123129] text-[#6ee7b7] shadow-[inset_4px_0_0_0_#10B981]'
            : 'bg-[#dcfce7] text-[#047857] shadow-[inset_4px_0_0_0_#10B981]'
        : isDark
            ? 'text-[#9ca9c7] hover:bg-[#182240] hover:text-[#d1dbf6]'
            : 'text-[#54607a] hover:bg-[#eef2fb] hover:text-[#2f3a5f]'}
`;

const SidebarPanel = ({
    isDark,
    t,
    onClose,
    onHelpClick,
    showCloseButton = false,
}) => (
    <>
        <div className={`flex h-[80px] items-center px-7 ${isDark ? 'border-b border-[#253154]' : 'border-b border-[#dce2ef]'}`}>
            <Link
                to="/"
                onClick={onClose}
                className="inline-flex items-center"
            >
                <BrandLogo
                    textClassName={isDark ? 'text-[#34d399]' : 'text-[#10B981]'}
                    textSizeClass="text-[36px]"
                />
            </Link>

            {showCloseButton ? (
                <button
                    type="button"
                    onClick={onClose}
                    className={`ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${isDark ? 'text-[#c8d4f0] hover:bg-[#1b2c51]' : 'text-[#54607a] hover:bg-[#eef2fb]'}`}
                    aria-label="Close menu"
                >
                    <X className="h-5 w-5" />
                </button>
            ) : null}
        </div>

        <div className="px-7 pb-3 pt-4">
            <p className={`text-[34px] font-semibold leading-none ${isDark ? 'text-[#6ee7b7]' : 'text-[#059669]'}`}>
                {t('sidebar.sections')}
            </p>
            <p className={`pt-1 text-[13px] ${isDark ? 'text-[#7585ac]' : 'text-[#7f89a3]'}`}>{t('sidebar.exploreGenres')}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-0 pb-3">
            <div className="space-y-1">
                <NavLink to="/" end className={navItemClass(isDark)} onClick={onClose}>
                    {({ isActive }) => (
                        <>
                            <BookMarked className={`h-5 w-5 ${isActive ? (isDark ? 'text-[#6ee7b7]' : 'text-[#047857]') : (isDark ? 'text-[#8c9bbb] group-hover:text-[#cad7f5]' : 'text-[#5b6782] group-hover:text-[#3f4a68]')}`} />
                            <span>{t('sidebar.allBooks')}</span>
                        </>
                    )}
                </NavLink>

                {GENRES.map((genre) => {
                    const Icon = genreIcons[genre.id] || BookOpen;

                    return (
                        <NavLink key={genre.id} to={`/genre/${genre.id}`} className={navItemClass(isDark)} onClick={onClose}>
                            {({ isActive }) => (
                                <>
                                    <Icon className={`h-5 w-5 ${isActive ? (isDark ? 'text-[#6ee7b7]' : 'text-[#047857]') : (isDark ? 'text-[#8c9bbb] group-hover:text-[#cad7f5]' : 'text-[#5b6782] group-hover:text-[#3f4a68]')}`} />
                                    <span>{t(`genres.${genre.id}`)}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>

        <div className={`h-[124px] space-y-1 border-t px-0 py-4 ${isDark ? 'border-[#253154]' : 'border-[#dce2ef]'}`}>
            <Link
                to="/profile"
                onClick={onClose}
                className={`group flex w-full items-center justify-start gap-3 px-5 py-3 text-sm font-medium transition-colors ${isDark ? 'text-[#9ca9c7] hover:bg-[#182240] hover:text-[#d1dbf6]' : 'text-[#5d6982] hover:bg-[#eef2fb] hover:text-[#2f3a5f]'}`}
            >
                <Settings className={`h-5 w-5 ${isDark ? 'text-[#8c9bbb] group-hover:text-[#cad7f5]' : 'text-[#5b6782] group-hover:text-[#3f4a68]'}`} />
                <span>{t('sidebar.settings')}</span>
            </Link>

            <button
                type="button"
                onClick={onHelpClick}
                className={`group flex w-full items-center justify-start gap-3 px-5 py-3 text-sm font-medium transition-colors ${isDark ? 'text-[#9ca9c7] hover:bg-[#182240] hover:text-[#d1dbf6]' : 'text-[#5d6982] hover:bg-[#eef2fb] hover:text-[#2f3a5f]'}`}
            >
                <CircleHelp className={`h-5 w-5 ${isDark ? 'text-[#8c9bbb] group-hover:text-[#cad7f5]' : 'text-[#5b6782] group-hover:text-[#3f4a68]'}`} />
                <span>{t('sidebar.help')}</span>
            </button>
        </div>
    </>
);

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
    const { t, theme } = useAppSettings();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const isDark = theme === 'dark';

    const handleHelpClick = () => {
        setIsContactModalOpen(true);
        onClose();
    };

    return (
        <>
            <aside className={`fixed left-0 top-0 z-30 hidden h-full w-[312px] flex-col lg:flex ${isDark ? 'border-r border-[#253154] bg-[#101a33]' : 'border-r border-[#dce2ef] bg-white'}`}>
                <SidebarPanel
                    isDark={isDark}
                    t={t}
                    onClose={() => {}}
                    onHelpClick={handleHelpClick}
                />
            </aside>

            <div className={`fixed inset-0 z-40 lg:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <button
                    type="button"
                    onClick={onClose}
                    className={`absolute inset-0 bg-black/55 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    aria-label="Close menu overlay"
                />

                <aside className={`absolute left-0 top-0 z-50 flex h-full w-[290px] max-w-[86vw] flex-col ${isDark ? 'border-r border-[#253154] bg-[#101a33]' : 'border-r border-[#dce2ef] bg-white'} transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SidebarPanel
                        isDark={isDark}
                        t={t}
                        onClose={onClose}
                        onHelpClick={handleHelpClick}
                        showCloseButton
                    />
                </aside>
            </div>

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </>
    );
};

export default Sidebar;
