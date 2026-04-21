import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, GENRES } from '../../services/mockApi';
import {
    BookOpen, TrendingUp, DollarSign, Tag, ArrowRight, Plus
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

const AdminDashboard = () => {
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
    const genres = [...new Set(books.map(b => b.genre))].length;
    const bestSellers = books.filter(b => b.isBestSeller).length;

    const formatPrice = (p) => `${new Intl.NumberFormat('uz-UZ').format(p)} ${t('common.sum')}`;

    return (
        <div>
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{t('admin.dashboard')}</h1>
                <p className="mt-1 text-sm text-gray-500">{t('admin.subtitle')}</p>
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
                        label={t('admin.totalBooks')}
                        value={books.length}
                        color="text-emerald-600"
                        bg="bg-emerald-100"
                    />
                    <StatCard
                        icon={Tag}
                        label={t('admin.genresCount')}
                        value={genres}
                        color="text-purple-600"
                        bg="bg-purple-100"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label={t('admin.bestSeller')}
                        value={bestSellers}
                        color="text-emerald-600"
                        bg="bg-emerald-100"
                    />
                    <StatCard
                        icon={DollarSign}
                        label={t('admin.totalPrice')}
                        value={formatPrice(totalValue)}
                        color="text-amber-600"
                        bg="bg-amber-100"
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
                            <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">{t('admin.manageBooks')}</p>
                            <p className="text-sm text-gray-500">{t('admin.manageBooksHint')}</p>
                        </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 transition-colors group-hover:text-emerald-700" />
                </Link>

                <Link
                    to="/seller/books?action=add"
                    className="group flex items-center justify-between rounded-2xl bg-emerald-600 p-4 transition-all hover:bg-emerald-700 sm:p-6"
                >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white sm:text-base">{t('admin.addNewBook')}</p>
                            <p className="text-emerald-100 text-sm">{t('admin.addNewBookHint')}</p>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                </Link>
            </div>

            {/* Recent books */}
            <div className="rounded-2xl border border-emerald-100 bg-white">
                <div className="flex flex-col gap-2 border-b border-emerald-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <h2 className="font-semibold text-gray-900">{t('admin.latestBooks')}</h2>
                    <Link to="/seller/books" className="w-fit text-sm text-emerald-700 hover:text-emerald-800">
                        {t('admin.viewAll')}
                    </Link>
                </div>
                <div className="divide-y divide-emerald-50">
                    {loading
                        ? [...Array(5)].map((_, i) => (
                            <div key={i} className="px-6 py-3 flex items-center gap-3">
                                <div className="h-14 w-10 animate-pulse rounded-lg bg-emerald-50" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-40 animate-pulse rounded bg-emerald-50" />
                                    <div className="h-3 w-28 animate-pulse rounded bg-emerald-50" />
                                </div>
                            </div>
                          ))
                        : books.slice(0, 5).map(book => {
                            const genre = GENRES.find(g => g.id === book.genre);
                            return (
                                <div key={book.id} className="flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6">
                                    <img
                                        src={book.image}
                                        alt={book.title}
                                        className="h-14 w-10 shrink-0 rounded-lg object-cover"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900">{book.title}</p>
                                        <p className="text-xs text-gray-500">{book.author}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-semibold text-emerald-700 sm:text-sm">{formatPrice(book.price)}</p>
                                        {genre && (
                                            <span className="hidden text-xs text-gray-400 sm:inline">{t(`genres.${genre.id}`)}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
