import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Check,
    ChevronDown,
    Eye,
    EyeOff,
    Globe,
    Moon,
    Sun,
} from 'lucide-react';
import { useAppSettings } from '../context/AppSettingsContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
    const languageMenuRef = useRef(null);
    const { login } = useAuth();
    const { t, language, setLanguage, theme, toggleTheme } = useAppSettings();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await login(email.trim(), password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'seller') {
                navigate('/seller');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || t('login.errorFallback'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = (event) => {
        event.preventDefault();
        setError("Seller uchun: user / user. Admin uchun: admin / admin. Qolgan login/parol buyer sifatida kiradi.");
    };

    const loginSubmitLabel = isLoading ? t('login.submitting') : t('login.submit');
    const selectedLanguageLabel = t(`languageNames.${language}`);

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

    return (
        <div className="auth-book-page">
            <div className="auth-book-controls">
                <div className="relative" ref={languageMenuRef}>
                    <button
                        type="button"
                        onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
                        className={`inline-flex h-9 items-center gap-2 rounded-full px-3 transition-colors ${theme === 'dark' ? 'text-[#dce7ff] hover:bg-[#1b2c51]' : 'text-[#4f596f] hover:bg-[#e9ece8]'}`}
                        aria-expanded={isLanguageMenuOpen}
                        aria-haspopup="menu"
                        aria-label={t('header.language')}
                        title={t('header.language')}
                    >
                        <Globe className={`h-4 w-4 ${theme === 'dark' ? 'text-[#8da0c9]' : 'text-[#525d72]'}`} />
                        <span className="text-sm font-medium">{selectedLanguageLabel}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isLanguageMenuOpen ? (
                        <div
                            className={`absolute right-0 top-11 z-30 min-w-[170px] rounded-2xl border p-1.5 shadow-xl ${theme === 'dark' ? 'border-[#2f3e63] bg-[#111d38]' : 'border-[#dce2ef] bg-white'}`}
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
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition ${isActive ? (theme === 'dark' ? 'bg-[#1f3157] text-[#f2f6ff]' : 'bg-[#e8f8f2] text-[#0b7b56]') : (theme === 'dark' ? 'text-[#c8d4f0] hover:bg-[#1b2c51]' : 'text-[#4f596f] hover:bg-[#f1f4f9]')}`}
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
                    className="auth-book-circle-button"
                    title={t('header.toggleTheme')}
                    aria-label={t('header.toggleTheme')}
                >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
            </div>

            <div className="auth-book-layout">
                <section className="auth-book-hero">
                    <div className="auth-book-brand">
                        <span className="auth-book-logo-word" aria-label="Iqrashop">
                            <span className="auth-book-logo-text">Iqrashop</span>
                        </span>
                    </div>

                    <div className="auth-book-hero__copy">
                        <p className="auth-book-hero__eyebrow">{t('login.heroBadge')}</p>
                        <h1 className="auth-book-hero__title whitespace-pre-line">
                            {t('login.heroTitle')}
                        </h1>
                        <p className="auth-book-hero__subtitle">{t('login.heroSubtitle')}</p>
                    </div>
                </section>

                <section className="auth-book-panel-wrap">
                    <div aria-hidden="true" className="auth-book-panel-shadow" />
                    <div className="auth-book-panel">
                        <div className="auth-book-panel__header">
                            <h2>{t('login.title')}</h2>

                        </div>

                        <div className="auth-book-form-shell">
                            <form className="auth-book-form" onSubmit={handleSubmit}>
                                <label className="sr-only" htmlFor="login-email">
                                    {t('login.emailPlaceholder')}
                                </label>
                                <div className="auth-book-field">
                                    <input
                                        id="login-email"
                                        type="text"
                                        required
                                        autoComplete="username"
                                        placeholder={t('login.emailPlaceholder')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <label className="sr-only" htmlFor="login-password">
                                    {t('login.passwordPlaceholder')}
                                </label>
                                <div className="auth-book-field">
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        placeholder={t('login.passwordPlaceholder')}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="auth-book-field__toggle"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        title={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                                        aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>

                                {error ? (
                                    <div className="auth-book-error" role="alert">
                                        {error}
                                    </div>
                                ) : null}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="auth-book-submit"
                                >
                                    {loginSubmitLabel}
                                </button>

                                <div className="auth-book-links">
                                    <button
                                        type="button"
                                        className="auth-book-link-button"
                                        onClick={handleForgotPassword}
                                    >
                                        {t('login.forgotPassword')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </section>
            </div>
        </div>
    );
};

export default Login;
