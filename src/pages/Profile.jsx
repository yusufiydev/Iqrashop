import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { Package, Heart, LogOut, Settings, User, Sun, Moon, Globe } from 'lucide-react';
import { useAppSettings } from '../context/AppSettingsContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';

const Profile = () => {
    const { user, logout } = useAuth();
    const { wishlist } = useWishlist();
    const { t, language, setLanguage, theme, toggleTheme } = useAppSettings();
    const [showSettings, setShowSettings] = useState(false);

    const purchaseHistory = [
        {
            id: 'ORD-7321',
            date: '2024-02-01',
            status: t('profile.delivered'),
            total: 100000,
            items: [
                { title: "O'tkan kunlar", price: 45000 },
                { title: 'Yulduzli tunlar', price: 55000 },
            ],
        },
        {
            id: 'ORD-6890',
            date: '2024-01-15',
            status: t('profile.delivered'),
            total: 120000,
            items: [{ title: 'Steve Jobs', price: 120000 }],
        },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{t('profile.title')}</h1>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-6">
                <div className="space-y-5 md:col-span-1 md:space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm sm:p-6">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:h-24 sm:w-24">
                            <User className="h-9 w-9 sm:h-10 sm:w-10" />
                        </div>
                        <h2 className="text-base font-bold text-gray-900 sm:text-lg">{user?.name}</h2>
                        <p className="text-sm text-gray-500 mb-4">{user?.email}</p>

                        <button
                            type="button"
                            onClick={() => setShowSettings((prev) => !prev)}
                            className="w-full py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-2"
                        >
                            <Settings className="w-4 h-4" /> {t('profile.settings')}
                        </button>

                        <button
                            type="button"
                            onClick={logout}
                            className="w-full py-2 mt-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2"
                        >
                            <LogOut className="w-4 h-4" /> {t('profile.logout')}
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sm:p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">{t('profile.stats')}</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-red-500" /> {t('profile.favorites')}
                                </span>
                                <span className="font-bold">{wishlist.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-emerald-500" /> {t('profile.orders')}
                                </span>
                                <span className="font-bold">{purchaseHistory.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-5 md:col-span-3 md:space-y-6">
                    {showSettings && (
                        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sm:p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('profile.settings')}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                    <p className="mb-3 text-sm font-medium text-gray-600 flex items-center gap-2">
                                        <Globe className="w-4 h-4" /> {t('header.language')}
                                    </p>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 outline-none"
                                    >
                                        {SUPPORTED_LANGUAGES.map((langCode) => (
                                            <option key={langCode} value={langCode}>
                                                {t(`languageNames.${langCode}`)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                                    <p className="mb-3 text-sm font-medium text-gray-600">{t('header.toggleTheme')}</p>
                                    <button
                                        type="button"
                                        onClick={toggleTheme}
                                        className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 flex items-center justify-center gap-2"
                                    >
                                        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                        {theme === 'dark' ? t('header.lightMode') : t('header.darkMode')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sm:p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('profile.history')}</h3>
                        <div className="space-y-4">
                            {purchaseHistory.map((order) => (
                                <div key={order.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                                    <div className="mb-2 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <span className="font-bold text-gray-900">{order.id}</span>
                                            <span className="ml-2 text-xs text-gray-500">{order.date}</span>
                                        </div>
                                        <span className="w-fit rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        {order.items.map((i) => i.title).join(', ')}
                                    </div>
                                    <div className="text-sm font-bold text-emerald-600">
                                        {order.total.toLocaleString()} {t('common.sum')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
