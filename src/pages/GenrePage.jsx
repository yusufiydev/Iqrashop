import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/mockApi';
import { openLibrary } from '../services/openLibrary';
import BookCard from '../components/books/BookCard';
import { Filter } from 'lucide-react';
import { useAppSettings } from '../context/AppSettingsContext';

const PAGE_SIZE = 20;

const mergeUniqueBooks = (currentBooks, nextBooks) => {
    const seenIds = new Set(currentBooks.map((book) => String(book.id)));
    const mergedBooks = [...currentBooks];

    nextBooks.forEach((book) => {
        const bookId = String(book.id);

        if (!seenIds.has(bookId)) {
            seenIds.add(bookId);
            mergedBooks.push(book);
        }
    });

    return mergedBooks;
};

const GenrePage = () => {
    const { genreId } = useParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [loadingMore, setLoadingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [source, setSource] = useState('openLibrary');
    const [hasMore, setHasMore] = useState(true);
    const { t } = useAppSettings();

    useEffect(() => {
        let ignore = false;

        const fetchBooks = async () => {
            setLoading(true);
            setActiveTab('all');

            try {
                const openLibraryBooks = await openLibrary.getBooksBySubject(genreId, PAGE_SIZE, 0);

                if (openLibraryBooks.length > 0) {
                    if (!ignore) {
                        setBooks(openLibraryBooks);
                        setOffset(openLibraryBooks.length);
                        setSource('openLibrary');
                        setHasMore(openLibraryBooks.length === PAGE_SIZE);
                    }
                    return;
                }

                const mockBooks = await api.getBooksByGenre(genreId);

                if (!ignore) {
                    setBooks(mockBooks.slice(0, PAGE_SIZE));
                    setOffset(Math.min(PAGE_SIZE, mockBooks.length));
                    setSource('mock');
                    setHasMore(mockBooks.length > PAGE_SIZE);
                }
            } catch (error) {
                console.error('Failed to fetch books', error);
                const mockBooks = await api.getBooksByGenre(genreId);

                if (!ignore) {
                    setBooks(mockBooks.slice(0, PAGE_SIZE));
                    setOffset(Math.min(PAGE_SIZE, mockBooks.length));
                    setSource('mock');
                    setHasMore(mockBooks.length > PAGE_SIZE);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        if (genreId) {
            fetchBooks();
        }

        return () => {
            ignore = true;
        };
    }, [genreId]);

    const handleLoadMore = async () => {
        setLoadingMore(true);

        try {
            let nextBooks = [];

            if (source === 'openLibrary') {
                nextBooks = await openLibrary.getBooksBySubject(genreId, PAGE_SIZE, offset);
            } else {
                const mockBooks = await api.getBooksByGenre(genreId);
                nextBooks = mockBooks.slice(offset, offset + PAGE_SIZE);
            }

            if (nextBooks.length > 0) {
                setBooks((prev) => mergeUniqueBooks(prev, nextBooks));
                setOffset((prev) => prev + nextBooks.length);
                setHasMore(nextBooks.length === PAGE_SIZE);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load more', error);
            setHasMore(false);
        } finally {
            setLoadingMore(false);
        }
    };

    const vendors = useMemo(() => {
        const uniqueVendors = [];
        const vendorIds = new Set();

        books.forEach((book) => {
            if (book.vendor && !vendorIds.has(book.vendor.id)) {
                vendorIds.add(book.vendor.id);
                uniqueVendors.push(book.vendor);
            }
        });

        return uniqueVendors;
    }, [books]);

    const filteredBooks = useMemo(() => {
        if (activeTab === 'all') {
            return books;
        }

        return books.filter((book) => book.vendor?.id === activeTab);
    }, [activeTab, books]);

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-10 w-32 rounded-full bg-gray-200 animate-pulse" />)}
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="aspect-[2/3] rounded bg-gray-100 animate-pulse" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-2 sm:pt-4">
            <div className="space-y-5 sm:space-y-6">
                <div className="sticky top-[80px] z-10 rounded-2xl border border-gray-100 bg-white/90 px-3 py-3 backdrop-blur-xl transition-all duration-300 sm:px-4 md:static md:z-0 md:border-none md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none">
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-hide sm:gap-3">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors duration-200 sm:px-6 ${activeTab === 'all' ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                        >
                            {t('common.all')}
                        </button>

                        {vendors.map((vendor) => (
                            <button
                                key={vendor.id}
                                onClick={() => setActiveTab(vendor.id)}
                                className={`px-4 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors duration-200 sm:px-6 ${activeTab === vendor.id ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}
                            >
                                {vendor.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="min-h-[400px]">
                    {filteredBooks.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:gap-6 animate-fade-in-up md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {filteredBooks.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                                <Filter className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">{t('genrePage.noBooksTitle')}</h3>
                            <p className="text-gray-500">{t('genrePage.noBooksSubtitle')}</p>
                        </div>
                    )}

                    {activeTab === 'all' && filteredBooks.length > 0 && hasMore && (
                        <div className="mb-6 mt-10 flex justify-center sm:mb-8 sm:mt-12">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="flex items-center gap-2 rounded-full border border-emerald-600 bg-white px-8 py-3 font-semibold text-emerald-600 shadow-sm transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loadingMore ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                                        {t('common.loading')}
                                    </>
                                ) : (
                                    t('genrePage.loadMore')
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenrePage;
