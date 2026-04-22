import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/mockApi';
import {
    BookOpen, TrendingUp, DollarSign, ShoppingCart, ArrowRight, Plus
} from 'lucide-react';
import { useAppSettings } from '../../context/AppSettingsContext';

const StatCard = ({ icon, label, value, color, bg }) => {
    const IconComponent = icon;

    return (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:gap-5 sm:p-6">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} sm:h-12 sm:w-12`}>
                <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${color}`} />
            </div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-0.5 text-xl font-bold text-gray-900 sm:text-2xl">{value}</p>
            </div>
        </div>
    );
};

const SellerDashboard = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useAppSettings();

    useEffect(() => {
        api.getAllBooks().then(data => {
            setBooks(data);
            setLoading(false);
        });
    }, []);

    const totalValue = books.reduce((sum, b) => sum + b.price, 0);
    const totalBooks = books.length;
    const bestSellers = books.filter(b => b.isBestSeller).length;

    const formatPrice = (p) => `${new Intl.NumberFormat('uz-UZ').format(p)} ${t('common.sum') || 'so\'m'}`;

    return (
        <div className="min-w-0">
            {/* Header */}
            <div className="mb-6 min-w-0 sm:mb-8">
                <h1 className="break-words text-xl font-bold text-gray-900 sm:text-2xl">{t('seller.dashboard') || 'Dashboard'}</h1>
                <p className="mt-1 text-sm text-gray-500">{t('seller.welcomeText') || 'Manage your bookstore and track sales'}</p>
            </div>

            {/* Stats */}
            {loading ? (
                <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 animate-pulse rounded-2xl border border-emerald-100 bg-white p-6" />
                    ))}
                </div>
            ) : (
                <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                    <StatCard
                        icon={BookOpen}
                        label={t('seller.myBooks') || 'Total Books'}
                        value={totalBooks}
                        color="text-emerald-600"
                        bg="bg-emerald-100"
                    />
                    <StatCard
                        icon={ShoppingCart}
                        label={t('seller.bestSellers') || 'Best Sellers'}
                        value={bestSellers}
                        color="text-green-600"
                        bg="bg-green-100"
                    />
                    <StatCard
                        icon={DollarSign}
                        label={t('seller.totalInventory') || 'Total Value'}
                        value={formatPrice(totalValue)}
                        color="text-amber-600"
                        bg="bg-amber-100"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label={t('seller.sales') || 'Sales'}
                        value="View"
                        color="text-purple-600"
                        bg="bg-purple-100"
                    />
                </div>
            )}

            {/* Quick actions */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:gap-4 md:grid-cols-2">
                <Link
                    to="/seller/books"
                    className="group flex items-center justify-between rounded-2xl border border-emerald-100 bg-white p-4 transition-all hover:border-emerald-300 sm:p-6"
                >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                            <BookOpen className="h-5 w-5 text-emerald-700" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{t('seller.manageBooks') || 'Manage Books'}</p>
                            <p className="text-xs text-gray-500">{t('seller.addEditBooks') || 'Add, edit, or remove books'}</p>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 transition-all group-hover:text-emerald-700 group-hover:translate-x-1" />
                </Link>

                <Link
                    to="/seller/books"
                    className="group flex items-center justify-between rounded-2xl border border-emerald-100 bg-white p-4 transition-all hover:border-emerald-300 sm:p-6"
                >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                            <Plus className="h-5 w-5 text-emerald-700" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{t('seller.addNewBook') || 'Add New Book'}</p>
                            <p className="text-xs text-gray-500">{t('seller.listNewBook') || 'List a new book for sale'}</p>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 transition-all group-hover:text-emerald-700 group-hover:translate-x-1" />
                </Link>
            </div>

            {/* Recent books */}
            {!loading && books.length > 0 && (
                <div className="rounded-2xl border border-emerald-100 bg-white">
                    <div className="border-b border-emerald-100 px-5 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">{t('seller.recentBooks') || 'Your Recent Books'}</h2>
                    </div>
                    <div className="divide-y divide-emerald-50">
                        {books.slice(0, 5).map((book) => (
                            <div key={book.id} className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-emerald-50 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
                                <div className="flex min-w-0 items-center gap-3 sm:flex-1 sm:gap-4">
                                <img src={book.image} alt={book.title} className="h-16 w-12 shrink-0 rounded object-cover" />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-gray-900">{book.title}</p>
                                    <p className="text-sm text-gray-500">{book.author}</p>
                                </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 pl-15 sm:justify-end sm:pl-0">
                                    <p className="text-sm font-semibold text-emerald-700">
                                        {new Intl.NumberFormat('uz-UZ').format(book.price)} so'm
                                    </p>
                                    {book.isBestSeller && (
                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
                                            ⭐ {t('seller.bestSeller') || 'Best Seller'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-emerald-100 px-5 py-3">
                        <Link to="/seller/books" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                            {t('seller.viewAll') || 'View all books'} →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;
