import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, GENRES } from '../../services/mockApi';
import { toast } from '../../components/common/Toast';
import {
    Plus, Pencil, Trash2, Search, X, BookOpen, Loader2, ImageOff
} from 'lucide-react';
import { useAppSettings } from '../../context/AppSettingsContext';

// ─── Book Form Modal ───────────────────────────────────────────────────────────
const EMPTY_FORM = {
    title: '', author: '', price: '', genre: 'roman',
    image: '', description: '', isNew: false, isBestSeller: false
};

const BookModal = ({ book, onClose, onSave }) => {
    const [form, setForm] = useState(book || EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const isEdit = !!book;
    const { t } = useAppSettings();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.author.trim() || !form.price) {
            toast.warning(t('seller.fillAllFields') || 'Please fill all required fields');
            return;
        }
        setSaving(true);
        try {
            await onSave(form);
            onClose();
        } finally {
            setSaving(false);
        }
    };

    const inputCls = "w-full border border-emerald-200 bg-white text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-400 transition-all";
    const labelCls = "block text-sm text-gray-700 mb-1.5 font-medium";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-emerald-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-100 bg-white px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-gray-900 font-semibold">{isEdit ? t('seller.editBook') || 'Edit Book' : t('seller.createBook') || 'Create Book'}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className={labelCls}>{t('seller.bookName') || 'Book Name'}</label>
                            <input name="title" value={form.title} onChange={handleChange} placeholder="Enter book title" className={inputCls} required />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>{t('seller.author') || 'Author'}</label>
                            <input name="author" value={form.author} onChange={handleChange} placeholder="Enter author name" className={inputCls} required />
                        </div>
                        <div>
                            <label className={labelCls}>{t('seller.price') || 'Price'}</label>
                            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="45000" className={inputCls} required />
                        </div>
                        <div>
                            <label className={labelCls}>{t('seller.genre') || 'Genre'}</label>
                            <select name="genre" value={form.genre} onChange={handleChange} className={inputCls}>
                                {GENRES.map(g => (
                                    <option key={g.id} value={g.id}>{t(`genres.${g.id}`)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>{t('seller.imageUrl') || 'Image URL'}</label>
                            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." className={inputCls} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>{t('seller.description') || 'Description'}</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Book description" className={`${inputCls} resize-none`} />
                        </div>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} className="w-4 h-4 rounded accent-emerald-600" />
                            <span className="text-sm text-gray-700">{t('seller.isNew') || 'Mark as New'}</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox" name="isBestSeller" checked={form.isBestSeller} onChange={handleChange} className="w-4 h-4 rounded accent-emerald-600" />
                            <span className="text-sm text-gray-700">{t('seller.isBestSeller') || 'Mark as Best Seller'}</span>
                        </label>
                    </div>

                    <div className="flex flex-col gap-2.5 pt-2 sm:flex-row sm:gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-emerald-200 text-gray-700 hover:bg-emerald-50 text-sm font-medium transition-all">
                            {t('common.cancel') || 'Cancel'}
                        </button>
                        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium transition-all flex items-center justify-center gap-2">
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? t('seller.save') || 'Save' : t('seller.create') || 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
const DeleteModal = ({ book, onClose, onConfirm }) => {
    const [deleting, setDeleting] = useState(false);
    const { t } = useAppSettings();
    const handleConfirm = async () => {
        setDeleting(true);
        await onConfirm();
        setDeleting(false);
        onClose();
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white border border-emerald-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                    <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">{t('seller.deleteBook') || 'Delete Book'}</h3>
                <p className="text-gray-600 text-sm mb-5">
                    {book.title} kitobni o'chirishni tasdiqlaysizmi? Bu amalni qaytarish mumkin emas.
                </p>
                <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-emerald-200 text-gray-700 hover:bg-emerald-50 text-sm font-medium transition-all">
                        {t('common.cancel') || 'Cancel'}
                    </button>
                    <button onClick={handleConfirm} disabled={deleting} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium transition-all flex items-center justify-center gap-2">
                        {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t('common.delete') || 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main SellerBooks Page ──────────────────────────────────────────────────
const SellerBooks = () => {
    const [searchParams] = useSearchParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [genreFilter, setGenreFilter] = useState('');
    const [modal, setModal] = useState(() => (
        searchParams.get('action') === 'add' ? { type: 'add' } : null
    ));
    const { t } = useAppSettings();

    const loadBooks = useCallback(() => {
        api.getAllBooks().then(data => {
            setBooks(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        loadBooks();
    }, [loadBooks]);

    const filtered = books.filter(b => {
        const matchSearch = !search ||
            b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.author.toLowerCase().includes(search.toLowerCase());
        const matchGenre = !genreFilter || b.genre === genreFilter;
        return matchSearch && matchGenre;
    });

    const handleAdd = async (form) => {
        await api.addBook(form);
        loadBooks();
        toast.success(t('seller.addSuccess') || 'Book added successfully');
    };

    const handleEdit = async (form) => {
        await api.updateBook(modal.book.id, form);
        loadBooks();
        toast.success(t('seller.updateSuccess') || 'Book updated successfully');
    };

    const handleDelete = async () => {
        await api.deleteBook(modal.book.id);
        loadBooks();
        toast.success(t('seller.deleteSuccess') || 'Book deleted successfully');
    };

    const inputCls = "border border-emerald-200 bg-white text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-400 transition-all";

    const formatPrice = (p) => `${new Intl.NumberFormat('uz-UZ').format(p)} ${t('common.sum') || 'so\'m'}`;

    return (
        <div className="min-w-0">
            {/* Modals */}
            {modal?.type === 'add' && (
                <BookModal onClose={() => setModal(null)} onSave={handleAdd} />
            )}
            {modal?.type === 'edit' && (
                <BookModal book={modal.book} onClose={() => setModal(null)} onSave={handleEdit} />
            )}
            {modal?.type === 'delete' && (
                <DeleteModal book={modal.book} onClose={() => setModal(null)} onConfirm={handleDelete} />
            )}

            {/* Header */}
            <div className="mb-5 flex min-w-0 flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className="break-words text-xl font-bold text-gray-900 sm:text-2xl">{t('seller.myBooks') || 'My Books'}</h1>
                    <p className="text-gray-600 text-sm mt-1">{t('seller.availableBooks') || `You have ${books.length} books`}</p>
                </div>
                <button
                    onClick={() => setModal({ type: 'add' })}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-700 sm:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    {t('seller.addBook') || 'Add Book'}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        className={`${inputCls} w-full pl-10`}
                        placeholder={t('seller.searchPlaceholder') || 'Search by title or author...'}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <select
                    value={genreFilter}
                    onChange={e => setGenreFilter(e.target.value)}
                    className={`${inputCls} w-full sm:w-auto sm:min-w-[170px]`}
                >
                    <option value="">{t('seller.allGenres') || 'All Genres'}</option>
                    {GENRES.map(g => <option key={g.id} value={g.id}>{t(`genres.${g.id}`)}</option>)}
                </select>
            </div>

            {/* Books Grid or Table */}
            <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white">
                {loading ? (
                    <div className="py-20 flex flex-col items-center gap-3 text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                        <span className="text-sm">{t('seller.loading') || 'Loading...'}</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-3 text-gray-500">
                        <BookOpen className="w-10 h-10" />
                        <p className="text-sm">{t('seller.noBooks') || 'No books found'}</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Cards */}
                        <div className="divide-y divide-emerald-100 md:hidden">
                            {filtered.map((book, idx) => {
                                const genre = GENRES.find(g => g.id === book.genre);
                                return (
                                    <div key={book.id} className="p-4">
                                        <div className="mb-3 flex items-start gap-3">
                                            <span className="pt-1 text-xs text-gray-500">{idx + 1}</span>
                                            {book.image ? (
                                                <img src={book.image} alt={book.title} className="h-16 w-12 rounded-lg object-cover" />
                                            ) : (
                                                <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-gray-100">
                                                    <ImageOff className="h-4 w-4 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="line-clamp-1 text-sm font-medium text-gray-900">{book.title}</p>
                                                <p className="mt-0.5 line-clamp-1 text-xs text-gray-600">{book.author}</p>
                                                {genre ? (
                                                    <span className="mt-1.5 inline-flex rounded-lg bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-700">
                                                        {t(`genres.${genre.id}`)}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="mb-3 flex flex-wrap gap-1.5">
                                            {book.isBestSeller && (
                                                <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs text-amber-700">⭐ {t('seller.bestSeller') || 'Best Seller'}</span>
                                            )}
                                            {book.isNew && (
                                                <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs text-green-700">✨ {t('seller.new') || 'New'}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-sm font-semibold text-emerald-600">{formatPrice(book.price)}</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setModal({ type: 'edit', book })}
                                                    className="rounded-lg p-2 text-gray-600 transition-all hover:bg-emerald-100 hover:text-emerald-600"
                                                    title={t('common.edit') || 'Edit'}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setModal({ type: 'delete', book })}
                                                    className="rounded-lg p-2 text-gray-600 transition-all hover:bg-red-100 hover:text-red-600"
                                                    title={t('common.delete') || 'Delete'}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-emerald-100 bg-emerald-50">
                                        <th className="text-left text-gray-700 font-semibold px-5 py-3.5">#</th>
                                        <th className="text-left text-gray-700 font-semibold px-5 py-3.5 w-16">{t('seller.image') || 'Image'}</th>
                                        <th className="text-left text-gray-700 font-semibold px-5 py-3.5">{t('seller.book') || 'Book'}</th>
                                        <th className="text-left text-gray-700 font-semibold px-5 py-3.5 hidden lg:table-cell">{t('seller.genre') || 'Genre'}</th>
                                        <th className="text-left text-gray-700 font-semibold px-5 py-3.5">{t('seller.price') || 'Price'}</th>
                                        <th className="text-left text-gray-700 font-semibold px-5 py-3.5 hidden lg:table-cell">{t('seller.tags') || 'Tags'}</th>
                                        <th className="text-right text-gray-700 font-semibold px-5 py-3.5">{t('seller.actions') || 'Actions'}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-emerald-100">
                                    {filtered.map((book, idx) => {
                                        const genre = GENRES.find(g => g.id === book.genre);
                                        return (
                                            <tr key={book.id} className="group transition-colors hover:bg-emerald-50">
                                                <td className="px-5 py-3 text-gray-600">{idx + 1}</td>
                                                <td className="px-5 py-3">
                                                    {book.image ? (
                                                        <img src={book.image} alt={book.title} className="w-10 h-14 object-cover rounded-lg" />
                                                    ) : (
                                                        <div className="w-10 h-14 bg-emerald-100 rounded-lg flex items-center justify-center">
                                                            <ImageOff className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <p className="line-clamp-1 text-gray-900 font-medium">{book.title}</p>
                                                    <p className="text-gray-600 text-xs mt-0.5">{book.author}</p>
                                                </td>
                                                <td className="px-5 py-3 hidden lg:table-cell">
                                                    {genre && (
                                                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium">
                                                            {t(`genres.${genre.id}`)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className="text-emerald-600 font-semibold">{formatPrice(book.price)}</span>
                                                </td>
                                                <td className="px-5 py-3 hidden lg:table-cell">
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {book.isBestSeller && (
                                                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-xs">⭐ Best Seller</span>
                                                        )}
                                                        {book.isNew && (
                                                            <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700 text-xs">✨ New</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setModal({ type: 'edit', book })}
                                                            className="p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-100 transition-all"
                                                            title={t('common.edit') || 'Edit'}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setModal({ type: 'delete', book })}
                                                            className="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-100 transition-all"
                                                            title={t('common.delete') || 'Delete'}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SellerBooks;
