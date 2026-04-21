/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
    DEFAULT_LANGUAGE,
    DEFAULT_THEME,
    getStoredLanguage,
    getStoredTheme,
    normalizeLanguage,
    translate,
} from '../i18n/translations';

const AppSettingsContext = createContext(null);

export const useAppSettings = () => useContext(AppSettingsContext);

export const AppSettingsProvider = ({ children }) => {
    const [language, setLanguageState] = useState(() => getStoredLanguage());
    const [theme, setThemeState] = useState(() => getStoredTheme());

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const normalized = normalizeLanguage(language);
        localStorage.setItem('book_market_language', normalized);
    }, [language]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        localStorage.setItem('book_market_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const setLanguage = (nextLanguage) => {
        setLanguageState(normalizeLanguage(nextLanguage));
    };

    const toggleTheme = () => {
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const t = useCallback((key, params) => translate(key, language, params), [language]);

    const value = useMemo(() => ({
        language,
        setLanguage,
        theme,
        toggleTheme,
        t,
    }), [language, theme, t]);

    return (
        <AppSettingsContext.Provider value={value}>
            {children}
        </AppSettingsContext.Provider>
    );
};
