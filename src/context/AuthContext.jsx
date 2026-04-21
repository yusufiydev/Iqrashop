/* eslint-disable react-refresh/only-export-components */
import {
    createContext,
    useContext,
    useState,
} from 'react';

const AuthContext = createContext();
const STORAGE_KEY = 'book_market_auth';
const ADMIN_LOGIN = 'admin';
const ADMIN_PASSWORD = 'admin';
const SELLER_LOGIN = 'user';
const SELLER_PASSWORD = 'user';

export const useAuth = () => useContext(AuthContext);

const readStoredAuth = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);
        if (!parsed?.user) {
            return null;
        }

        return parsed;
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const storedAuth = readStoredAuth();
    const [user, setUser] = useState(storedAuth?.user || null);
    const [loading] = useState(false);

    const saveAuth = (nextUser) => {
        const payload = { user: nextUser };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        setUser(nextUser);
    };

    const clearAuth = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const login = async (email, password) => {
        const normalizedEmail = email.trim();
        const isAdmin = normalizedEmail === ADMIN_LOGIN && password === ADMIN_PASSWORD;
        const isSeller = normalizedEmail === SELLER_LOGIN && password === SELLER_PASSWORD;

        const nextUser = {
            id: isAdmin ? 'admin-local' : isSeller ? 'seller-local' : `buyer-${Date.now()}`,
            name: isAdmin ? 'Admin' : isSeller ? 'Seller User' : (normalizedEmail || 'Buyer'),
            email: normalizedEmail || 'user@local',
            role: isAdmin ? 'admin' : isSeller ? 'seller' : 'buyer',
        };

        saveAuth(nextUser);
        return nextUser;
    };

    const logout = () => {
        clearAuth();
    };

    const value = {
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
