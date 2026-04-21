import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { openLibrary } from '../services/openLibrary';
import { getAllBooksInstant } from '../services/mockApi';
import BookCard from '../components/books/BookCard';
import HeroSlider from '../components/common/HeroSlider';
import { useAppSettings } from '../context/AppSettingsContext';
import { toast } from '../components/common/Toast';

const PAGE_SIZE = 20;
const DEFAULT_SUBJECT = 'roman';

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

const normalizeQuery = (query) => query.trim().toLowerCase();

const matchesQuery = (book, query) => {
    const searchableFields = [book.title, book.author, book.genre];
    return searchableFields.some((value) => String(value || '').toLowerCase().includes(query));
};

const getInstantBooksPage = (query, page) => {
    const books = getAllBooksInstant();
    const normalizedQuery = normalizeQuery(query);
    const filteredBooks = normalizedQuery ? books.filter((book) => matchesQuery(book, normalizedQuery)) : books;
    const startIndex = (page - 1) * PAGE_SIZE;

    return filteredBooks.slice(startIndex, startIndex + PAGE_SIZE);
};

const getRemoteBooksPage = async (query, page) => {
    if (query) {
        return openLibrary.searchBooks(query, PAGE_SIZE, page);
    }

    return openLibrary.getBooksBySubject(DEFAULT_SUBJECT, PAGE_SIZE, (page - 1) * PAGE_SIZE);
};

const Marketplace = () => {
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [searchParams] = useSearchParams();
    const { t, theme } = useAppSettings();
    const isDark = theme === 'dark';
    const query = searchParams.get('q')?.trim() || '';

    useEffect(() => {
        let ignore = false;
        const instantBooks = getInstantBooksPage(query, 1);

        setFilteredBooks(instantBooks);
        setPage(1);
        setLoading(instantBooks.length === 0);

        const fetchData = async () => {
            try {
                const remoteBooks = await getRemoteBooksPage(query, 1);

                if (!ignore && remoteBooks.length > 0) {
                    setFilteredBooks(remoteBooks);
                }
            } catch (error) {
                console.error('Failed to fetch remote books', error);
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            ignore = true;
        };
    }, [query]);

    const handleLoadMore = async () => {
        setLoadingMore(true);
        const nextPage = page + 1;

        try {
            let newBooks = await getRemoteBooksPage(query, nextPage);

            if (newBooks.length === 0) {
                newBooks = getInstantBooksPage(query, nextPage);
            }

            if (newBooks.length > 0) {
                setFilteredBooks((prev) => mergeUniqueBooks(prev, newBooks));
                setPage(nextPage);
            }
        } catch (error) {
            console.error('Failed to load more books', error);
            const fallbackBooks = getInstantBooksPage(query, nextPage);

            if (fallbackBooks.length > 0) {
                setFilteredBooks((prev) => mergeUniqueBooks(prev, fallbackBooks));
                setPage(nextPage);
            }
        } finally {
            setLoadingMore(false);
        }
    };

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!newsletterEmail.trim()) {
            toast.warning(t('marketplace.emailPlaceholder'));
            return;
        }

        toast.success(t('marketplace.subscribe'));
        setNewsletterEmail('');
    };

    const handleViewAllClick = () => {
        const section = document.getElementById('best-sellers-grid');
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const featuredBooks = filteredBooks.slice(0, 5);

    if (loading && filteredBooks.length === 0) {
        return (
            <div className="space-y-6 sm:space-y-8">
                <div className="h-[210px] animate-pulse rounded-[22px] bg-[#d9ddf8] sm:h-[300px] lg:h-[420px]" />
                <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-5">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-[360px] sm:h-[460px] animate-pulse rounded-2xl bg-[#e8edf8]" />
                    ))}
                </div>
            </div>
        );
    }

    if (query) {
        return (
            <div className="space-y-6 pb-8 sm:space-y-7 sm:pb-10">
                <h1 className={`text-xl font-black sm:text-3xl ${isDark ? 'text-[#e7ecfb]' : 'text-slate-900'}`}>
                    {t('marketplace.searchResults', { query })}
                </h1>
                {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {filteredBooks.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className={`rounded-2xl px-5 py-20 text-center ${isDark ? 'border border-[#2f3f64] bg-[#111b33]' : 'border border-[#e4e9f4] bg-white'}`}>
                        <p className={`${isDark ? 'text-[#aeb8cf]' : 'text-slate-500'}`}>{t('marketplace.notFound')}</p>
                    </div>
                )}

                {filteredBooks.length > 0 && (
                    <div className="flex justify-center pt-2">
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="rounded-full border border-[#a7f3d0] bg-white px-6 py-3 text-sm font-bold text-[#047857] transition hover:bg-[#ecfdf5] disabled:opacity-60"
                        >
                            {loadingMore ? t('common.loading') : t('marketplace.loadMore')}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-0 sm:space-y-10 lg:space-y-12">
            <HeroSlider />

            <section id="best-sellers-section">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div>
                        <h2 className={`text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-[42px] ${isDark ? 'text-[#e7ecfb]' : 'text-[#1f2531]'}`}>{t('marketplace.bestSellers')}</h2>
                        <p className={`mt-2 text-sm sm:text-base ${isDark ? 'text-[#9aa7c7]' : 'text-[#5f6778]'}`}>{t('marketplace.bestSellersSubtitle')}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleViewAllClick}
                        className={`inline-flex h-10 self-start items-center justify-center gap-2 rounded-full px-4 text-base font-semibold transition sm:h-11 sm:self-auto sm:text-[18px] ${isDark ? 'text-[#6ee7b7] hover:bg-[#17314e] hover:text-[#a7f3d0]' : 'text-[#059669] hover:bg-emerald-50 hover:text-[#047857]'}`}
                    >
                        <span>{t('common.viewAll')}</span>
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>

                <div id="best-sellers-grid" className="rounded-md bg-transparent p-3">
                    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {featuredBooks.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                </div>
            </section>

            <section className={`rounded-[24px] px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12 ${isDark ? 'bg-[#111b33]' : 'bg-[#e8eaef]'}`}>
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-[620px]">
                        <h3 className={`text-2xl font-bold leading-tight sm:text-3xl lg:text-[42px] ${isDark ? 'text-[#e9efff]' : 'text-[#202632]'}`}>
                            {t('marketplace.newsletterTitle')}
                        </h3>
                        <p className={`mt-3 text-sm sm:mt-4 sm:text-base lg:text-[18px] ${isDark ? 'text-[#a4b0cc]' : 'text-[#545d70]'}`}>
                            {t('marketplace.newsletterSubtitle')}
                        </p>
                    </div>

                    <form className="flex w-full max-w-[620px] flex-col gap-3 sm:flex-row sm:items-center" onSubmit={handleNewsletterSubmit}>
                        <input
                            type="email"
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            placeholder={t('marketplace.emailPlaceholder')}
                            className={`h-[52px] flex-1 rounded-full border px-5 text-sm outline-none sm:h-[64px] sm:px-7 sm:text-base lg:h-[76px] lg:text-[18px] ${isDark ? 'border-[#2d3d63] bg-[#172648] text-[#dae3fb] placeholder:text-[#8d9cbe] focus:border-[#34d399]' : 'border-transparent bg-[#f4f6fa] text-[#333a49] placeholder:text-[#7f8797] focus:border-[#86efac]'}`}
                        />
                        <button
                            type="submit"
                            className="h-[52px] rounded-full bg-[#10B981] px-6 text-sm font-semibold text-white transition hover:bg-[#059669] sm:h-[64px] sm:px-8 sm:text-base lg:h-[76px] lg:px-10 lg:text-[18px]"
                        >
                            {t('marketplace.subscribe')}
                        </button>
                    </form>
                </div>
            </section>

            <footer className={`flex min-h-[96px] items-center justify-center border-t px-2 py-5 sm:h-[124px] sm:justify-end sm:py-0 ${isDark ? 'border-[#253154]' : 'border-[#dce2ef]'}`}>
                <nav className={`flex flex-wrap items-center justify-center gap-4 text-sm font-medium sm:gap-7 sm:text-[16px] ${isDark ? 'text-[#9eacd0]' : 'text-[#70809d]'}`}>
                    <Link to="/about" className={`${isDark ? 'hover:text-[#a7f3d0]' : 'hover:text-[#059669]'}`}>{t('marketplace.footerAbout')}</Link>
                    <Link to="/terms" className={`${isDark ? 'hover:text-[#a7f3d0]' : 'hover:text-[#059669]'}`}>{t('marketplace.footerTerms')}</Link>
                    <Link to="/privacy" className={`${isDark ? 'hover:text-[#a7f3d0]' : 'hover:text-[#059669]'}`}>{t('marketplace.footerPrivacy')}</Link>
                    <Link to="/contact" className={`${isDark ? 'hover:text-[#a7f3d0]' : 'hover:text-[#059669]'}`}>{t('marketplace.footerContact')}</Link>
                </nav>
            </footer>
        </div>
    );
};

export default Marketplace;
