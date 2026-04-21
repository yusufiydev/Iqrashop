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
            toast.warning(t('admin.fillAllFields'));
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

    const inputCls = "w-full bg-gray-950 border border-gray-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500 transition-all";
    const labelCls = "block text-sm text-gray-400 mb-1.5 font-medium";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-800 bg-gray-950 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-white font-semibold">{isEdit ? t('admin.editBook') : t('admin.createBook')}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className={labelCls}>{t('admin.bookName')}</label>
                            <input name="title" value={form.title} onChange={handleChange} placeholder={t('admin.bookNamePlaceholder')} className={inputCls} required />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>{t('admin.author')}</label>
                            <input name="author" value={form.author} onChange={handleChange} placeholder={t('admin.authorPlaceholder')} className={inputCls} required />
                        </div>
                        <div>
                            <label className={labelCls}>{t('admin.price')}</label>
                            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="45000" className={inputCls} required />
                        </div>
                        <div>
                            <label className={labelCls}>{t('admin.genre')}</label>
                            <select name="genre" value={form.genre} onChange={handleChange} className={inputCls}>
                                {GENRES.map(g => (
                                    <option key={g.id} value={g.id}>{t(`genres.${g.id}`)}</option>
                                ))}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>{t('admin.imageUrl')}</label>
                            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." className={inputCls} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className={labelCls}>{t('admin.description')}</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder={t('admin.descriptionPlaceholder')} className={`${inputCls} resize-none`} />
                        </div>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox" name="isNew" checked={form.isNew} onChange={handleChange} className="w-4 h-4 rounded accent-emerald-600" />
                            <span className="text-sm text-gray-400">{t('admin.isNew')}</span>
                        </label>
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input type="checkbox" name="isBestSeller" checked={form.isBestSeller} onChange={handleChange} className="w-4 h-4 rounded accent-emerald-600" />
                            <span className="text-sm text-gray-400">{t('admin.isBestSeller')}</span>
                        </label>
                    </div>

                    <div className="flex flex-col gap-2.5 pt-2 sm:flex-row sm:gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 text-sm font-medium transition-all">
                            {t('common.cancel')}
                        </button>
                        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-medium transition-all flex items-center justify-center gap-2">
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEdit ? t('admin.save') : t('admin.create')}
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
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-gray-950 border border-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                <div className="w-12 h-12 bg-red-900/40 rounded-xl flex items-center justify-center mb-4">
                    <Trash2 className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{t('admin.deleteBook')}</h3>
                <p className="text-gray-400 text-sm mb-5">
                    {t('admin.deleteConfirm', { title: book.title })}
                </p>
                <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white text-sm font-medium transition-all">
                        {t('common.cancel')}
                    </button>
                    <button onClick={handleConfirm} disabled={deleting} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium transition-all flex items-center justify-center gap-2">
                        {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t('common.delete')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main AdminBooks Page ──────────────────────────────────────────────────────
const AdminBooks = () => {
    const [searchParams] = useSearchParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [genreFilter, setGenreFilter] = useState('');
    const [modal, setModal] = useState(() => (
        searchParams.get('action') === 'add' ? { type: 'add' } : null
    )); // { type: 'add'|'edit'|'delete', book? }
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
        toast.success(t('admin.addSuccess'));
    };

    const handleEdit = async (form) => {
        await api.updateBook(modal.book.id, form);
        loadBooks();
        toast.success(t('admin.updateSuccess'));
    };

    const handleDelete = async () => {
        await api.deleteBook(modal.book.id);
        loadBooks();
        toast.success(t('admin.deleteSuccess'));
    };

    const inputCls = "bg-gray-950 border border-gray-800 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500 transition-all";

    const formatPrice = (p) => `${new Intl.NumberFormat('uz-UZ').format(p)} ${t('common.sum')}`;

    return (
        <div>
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
            <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-white sm:text-2xl">{t('admin.books')}</h1>
                    <p className="text-gray-400 text-sm mt-1">{t('admin.availableBooks', { count: books.length })}</p>
                </div>
                <button
                    id="add-book-btn"
                    onClick={() => setModal({ type: 'add' })}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-900/30 transition-all hover:bg-emerald-700 sm:w-auto"
                >
                    <Plus className="w-4 h-4" />
                    {t('admin.addBook')}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        className={`${inputCls} w-full pl-10`}
                        placeholder={t('admin.searchPlaceholder')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <select
                    value={genreFilter}
                    onChange={e => setGenreFilter(e.target.value)}
                    className={`${inputCls} w-full sm:w-auto sm:min-w-[170px]`}
                >
                    <option value="">{t('admin.allGenres')}</option>
                    {GENRES.map(g => <option key={g.id} value={g.id}>{t(`genres.${g.id}`)}</option>)}
                </select>
            </div>

            {/* Table */}
            <div className="bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center gap-3 text-gray-500">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                        <span className="text-sm">{t('admin.loading')}</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 flex flex-col items-center gap-3 text-gray-500">
                        <BookOpen className="w-10 h-10" />
                        <p className="text-sm">{t('admin.noBooks')}</p>
                    </div>
                ) : (
                    <>
                        <div className="divide-y divide-gray-800 md:hidden">
                            {filtered.map((book, idx) => {
                                const genre = GENRES.find(g => g.id === book.genre);
                                return (
                                    <div key={book.id} className="p-4">
                                        <div className="mb-3 flex items-start gap-3">
                                            <span className="pt-1 text-xs text-gray-500">{idx + 1}</span>
                                            {book.image ? (
                                                <img src={book.image} alt={book.title} className="h-16 w-12 rounded-lg object-cover" />
                                            ) : (
                                                <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-gray-900">
                                                    <ImageOff className="h-4 w-4 text-gray-500" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="line-clamp-1 text-sm font-medium text-white">{book.title}</p>
                                                <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">{book.author}</p>
                                                {genre ? (
                                                    <span className="mt-1.5 inline-flex rounded-lg bg-gray-900 px-2 py-1 text-[11px] font-medium text-gray-300">
                                                        {t(`genres.${genre.id}`)}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="mb-3 flex flex-wrap gap-1.5">
                                            {book.isBestSeller && (
                                                <span className="rounded-md bg-amber-900/40 px-2 py-0.5 text-xs text-amber-400">{t('admin.tagBestSeller')}</span>
                                            )}
                                            {book.isNew && (
                                                <span className="rounded-md bg-emerald-900/40 px-2 py-0.5 text-xs text-emerald-400">{t('admin.tagNew')}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-sm font-semibold text-emerald-400">{formatPrice(book.price)}</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setModal({ type: 'edit', book })}
                                                    className="rounded-lg p-2 text-gray-400 transition-all hover:bg-emerald-900/30 hover:text-emerald-400"
                                                    title={t('common.edit')}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => setModal({ type: 'delete', book })}
                                                    className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-900/30 hover:text-red-400"
                                                    title={t('common.delete')}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="text-left text-gray-400 font-medium px-5 py-3.5">{t('admin.tableIndex')}</th>
                                        <th className="text-left text-gray-400 font-medium px-5 py-3.5 w-16">{t('admin.tableImage')}</th>
                                        <th className="text-left text-gray-400 font-medium px-5 py-3.5">{t('admin.tableBook')}</th>
                                        <th className="text-left text-gray-400 font-medium px-5 py-3.5 hidden lg:table-cell">{t('admin.tableGenre')}</th>
                                        <th className="text-left text-gray-400 font-medium px-5 py-3.5">{t('admin.tablePrice')}</th>
                                        <th className="text-left text-gray-400 font-medium px-5 py-3.5 hidden lg:table-cell">{t('admin.tableTags')}</th>
                                        <th className="text-right text-gray-400 font-medium px-5 py-3.5">{t('admin.tableActions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {filtered.map((book, idx) => {
                                        const genre = GENRES.find(g => g.id === book.genre);
                                        return (
                                            <tr key={book.id} className="group transition-colors hover:bg-gray-900/60">
                                                <td className="px-5 py-3 text-gray-500">{idx + 1}</td>
                                                <td className="px-5 py-3">
                                                    {book.image ? (
                                                        <img src={book.image} alt={book.title} className="w-10 h-14 object-cover rounded-lg" />
                                                    ) : (
                                                        <div className="w-10 h-14 bg-gray-900 rounded-lg flex items-center justify-center">
                                                            <ImageOff className="w-4 h-4 text-gray-500" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <p className="line-clamp-1 text-white font-medium">{book.title}</p>
                                                    <p className="text-gray-400 text-xs mt-0.5">{book.author}</p>
                                                </td>
                                                <td className="px-5 py-3 hidden lg:table-cell">
                                                    {genre && (
                                                        <span className="px-2.5 py-1 rounded-lg bg-gray-900 text-gray-300 text-xs font-medium">
                                                            {t(`genres.${genre.id}`)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className="text-emerald-400 font-semibold">{formatPrice(book.price)}</span>
                                                </td>
                                                <td className="px-5 py-3 hidden lg:table-cell">
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {book.isBestSeller && (
                                                            <span className="px-2 py-0.5 rounded-md bg-amber-900/40 text-amber-400 text-xs">{t('admin.tagBestSeller')}</span>
                                                        )}
                                                        {book.isNew && (
                                                            <span className="px-2 py-0.5 rounded-md bg-emerald-900/40 text-emerald-400 text-xs">{t('admin.tagNew')}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setModal({ type: 'edit', book })}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-900/30 transition-all"
                                                            title={t('common.edit')}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setModal({ type: 'delete', book })}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/30 transition-all"
                                                            title={t('common.delete')}
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

export default AdminBooks;
