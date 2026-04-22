import {
    Search,
    ShoppingCart,
    Bell,
    User,
    Sun,
    Moon,
    Globe,
    ChevronDown,
    Check,
    Menu,
    X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppSettings } from '../../context/AppSettingsContext';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { toast } from '../common/Toast';

const SEARCH_DEBOUNCE_MS = 450;

const TopHeader = ({ onMenuToggle, isSidebarOpen = false }) => {
    const { user } = useAuth();
    const { totalItems } = useCart();
    const { language, setLanguage, theme, toggleTheme, t } = useAppSettings();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const languageMenuRef = useRef(null);

    const queryFromUrl = useMemo(() => searchParams.get('q') || '', [searchParams]);
    const [searchValue, setSearchValue] = useState(queryFromUrl);
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

    useEffect(() => {
        setSearchValue(queryFromUrl);
    }, [queryFromUrl]);

    useEffect(() => {
        const normalizedValue = searchValue.trim();
        const normalizedQuery = queryFromUrl.trim();

        if (normalizedValue === normalizedQuery) {
            return undefined;
        }

        const timerId = window.setTimeout(() => {
            if (!normalizedValue) {
                setSearchParams({});
                if (location.pathname === '/') {
                    return;
                }

                navigate('/');
                return;
            }

            if (location.pathname !== '/') {
                navigate(`/?q=${encodeURIComponent(normalizedValue)}`);
                return;
            }

            setSearchParams({ q: normalizedValue });
        }, SEARCH_DEBOUNCE_MS);

        return () => window.clearTimeout(timerId);
    }, [location.pathname, navigate, queryFromUrl, searchValue, setSearchParams]);

    useEffect(() => {
        if (!isLanguageMenuOpen) {
            return undefined;
        }

        const handleDocumentClick = (event) => {
            if (!languageMenuRef.current?.contains(event.target)) {
                setIsLanguageMenuOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsLanguageMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isLanguageMenuOpen]);

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleNotificationsClick = () => {
        toast.success(t('header.notifications'));
    };

    const isDark = theme === 'dark';
    const selectedLanguageLabel = t(`languageNames.${language}`);

    return (
        <header className={`sticky top-0 z-[70] isolate shadow-sm ${isDark ? 'bg-[#111d38]' : 'bg-white'}`}>
            <div className={`flex h-[80px] items-center gap-3 px-3 sm:gap-4 sm:px-5 ${isDark ? 'border-b border-[#253154]' : 'border-b border-[#dce2ef]'}`}>
                <div className="flex flex-1 items-center gap-2 sm:gap-3">
                    {onMenuToggle ? (
                        <button
                            type="button"
                            onClick={onMenuToggle}
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden ${isDark ? 'text-[#dce7ff] hover:bg-[#1b2c51]' : 'text-[#4f596f] hover:bg-[#e9ece8]'}`}
                            aria-label="Toggle menu"
                        >
                            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    ) : null}

                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={handleSearchChange}
                            placeholder={t('header.searchPlaceholder')}
                            className={`h-10 w-full rounded-full pl-5 pr-11 text-sm font-medium outline-none transition-colors focus:ring-2 sm:h-11 ${isDark ? 'border border-[#32466f] bg-[#162848] text-[#eef3ff] placeholder:text-[#90a4cd] focus:border-[#4fdfab] focus:ring-[#4fdfab]/25' : 'border border-[#d5deeb] bg-white text-[#1f2937] placeholder:text-[#7d8798] focus:border-[#10B981] focus:ring-[#10B981]/20'}`}
                        />
                        <Search className={`pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 ${isDark ? 'text-[#91a2c7]' : 'text-[#6b778d]'}`} />
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2.5">
                    <div className="relative hidden md:block" ref={languageMenuRef}>
                        <button
                            type="button"
                            onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
                            className={`inline-flex h-9 items-center gap-2 rounded-full px-3 transition-colors ${isDark ? 'text-[#dce7ff] hover:bg-[#1b2c51]' : 'text-[#4f596f] hover:bg-[#e9ece8]'}`}
                            aria-expanded={isLanguageMenuOpen}
                            aria-haspopup="menu"
                            aria-label={t('header.language')}
                            title={t('header.language')}
                        >
                            <Globe className={`h-4 w-4 ${isDark ? 'text-[#8da0c9]' : 'text-[#525d72]'}`} />
                            <span className="hidden text-sm font-medium sm:inline">{selectedLanguageLabel}</span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isLanguageMenuOpen ? (
                            <div
                                className={`absolute right-0 top-11 z-30 min-w-[170px] rounded-2xl border p-1.5 shadow-xl ${isDark ? 'border-[#2f3e63] bg-[#111d38]' : 'border-[#dce2ef] bg-white'}`}
                                role="menu"
                            >
                                {SUPPORTED_LANGUAGES.map((langCode) => {
                                    const isActive = langCode === language;

                                    return (
                                        <button
                                            key={langCode}
                                            type="button"
                                            onClick={() => {
                                                setLanguage(langCode);
                                                setIsLanguageMenuOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? (isDark ? 'bg-[#1f3157] text-[#f2f6ff]' : 'bg-[#e8f8f2] text-[#0b7b56]') : (isDark ? 'text-[#c8d4f0] hover:bg-[#1b2c51]' : 'text-[#4f596f] hover:bg-[#f1f4f9]')}`}
                                            role="menuitem"
                                        >
                                            <span>{t(`languageNames.${langCode}`)}</span>
                                            {isActive ? <Check className="h-4 w-4" /> : null}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`relative hidden sm:flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isDark ? 'text-[#8ea0c8] hover:bg-[#1b2c51]' : 'text-[#616b7f] hover:bg-[#e9ece8]'}`}
                        title={t('header.toggleTheme')}
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    <button
                        type="button"
                        onClick={handleNotificationsClick}
                        className={`relative hidden sm:flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isDark ? 'text-[#8ea0c8] hover:bg-[#1b2c51]' : 'text-[#616b7f] hover:bg-[#e9ece8]'}`}
                        title={t('header.notifications')}
                    >
                        <Bell className="h-5 w-5" />
                    </button>

                    <Link
                        to="/cart"
                        className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-colors ${isDark ? 'text-[#34d399] hover:bg-[#1b2c51]' : 'text-[#10B981] hover:bg-[#e9ece8]'}`}
                        title={t('header.cart')}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {totalItems > 0 && (
                            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#10B981] px-1 text-[10px] font-bold leading-none text-white shadow-sm">
                                {totalItems > 9 ? '9+' : totalItems}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/profile"
                        title={user?.name ? t('header.profileWithName', { name: user.name }) : t('header.profile')}
                        className="inline-flex items-center"
                    >
                        <span className={`relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border text-white ${isDark ? 'border-[#2b5f55] bg-[#0f1830]' : 'border-[#9ad9c4] bg-[#def7ec]'}`}>
                            <User className={`${isDark ? 'h-5 w-5 text-white' : 'h-5 w-5 text-[#2c4d5f]'}`} />
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default TopHeader;
