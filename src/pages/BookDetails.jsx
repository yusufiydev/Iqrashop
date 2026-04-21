import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/mockApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import BookAssistant from '../components/books/BookAssistant';
import {
    Star,
    Truck,
    ShieldCheck,
    Heart,
    ArrowRight,
    ChevronLeft,
    Share2,
    Minus,
    Plus,
} from 'lucide-react';
import { openLibrary } from '../services/openLibrary';
import { useAppSettings } from '../context/AppSettingsContext';
import { toast } from '../components/common/Toast';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { t, language } = useAppSettings();

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const savedReviews = localStorage.getItem(`book_reviews_${id}`);
        if (savedReviews) {
            setReviews(JSON.parse(savedReviews));
        } else {
            setReviews([
                {
                    id: 1,
                    user: 'Anvar Olimov',
                    rating: 5,
                    text: t('bookDetails.defaultReview1'),
                    date: '2024-02-10',
                    avatarColor: 'bg-emerald-100 text-emerald-700',
                },
                {
                    id: 2,
                    user: 'Malika Karimova',
                    rating: 4,
                    text: t('bookDetails.defaultReview2'),
                    date: '2024-02-11',
                    avatarColor: 'bg-pink-100 text-pink-700',
                },
            ]);
        }
    }, [id, t]);

    useEffect(() => {
        let ignore = false;

        const fetchBook = async () => {
            setLoading(true);

            try {
                const isMockId = /^\d+$/.test(id);
                const found = isMockId ? await api.getBookById(id) : await openLibrary.getBookDetails(id);

                if (!ignore) {
                    setBook(found || null);
                }
            } catch (error) {
                console.error('Failed to fetch book', error);
                if (!ignore) {
                    setBook(null);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchBook();

        return () => {
            ignore = true;
        };
    }, [id]);

    const handleAddToCart = () => {
        if (!book) return;
        addToCart(book, quantity);
        toast.success(t('bookDetails.addToCart'));
    };

    const handleToggleWishlist = () => {
        if (!book) return;
        toggleWishlist(book);
        toast.success(t('bookDetails.favorites'));
    };

    const handleShare = async () => {
        if (!book) return;

        const shareData = {
            title: book.title,
            text: `${book.title} - ${book.author || t('common.unknown')}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return;
            } catch (error) {
                console.error('Share cancelled or failed', error);
            }
        }

        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success(t('bookDetails.share'));
        } catch {
            toast.warning(window.location.href);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('bookDetails.notFoundTitle')}</h2>
                <button type="button" onClick={() => navigate(-1)} className="text-emerald-600 hover:underline">{t('bookDetails.back')}</button>
            </div>
        );
    }

    const liked = isInWishlist(book.id);
    const genreLabel = t(`genres.${book.genre}`) !== `genres.${book.genre}`
        ? t(`genres.${book.genre}`)
        : t('genres.book');
    const authorName = book.author || t('common.unknown');
    const price = Number(book.price || 0);
    const oldPrice = book.oldPrice ? Number(book.oldPrice) : null;
    const vendorName = book.vendor?.name || t('common.unknown');
    const vendorDelivery = book.vendor?.deliveryTime || t('common.unknown');
    const vendorMinDelivery = book.vendor?.minDeliveryPrice || t('common.free');
    const vendorRating = book.vendor?.rating || book.rating || 0;
    const reviewsCount = Number(book.reviews || reviews.length || 0);
    const previewReview = reviews[0]?.text || t('bookDetails.defaultReview1');

    return (
        <div className="mx-auto w-full max-w-7xl px-1 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="group mb-5 flex items-center text-gray-500 transition-colors hover:text-gray-900 sm:mb-8"
            >
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center mr-2 transition-colors">
                    <ChevronLeft className="h-4 w-4" />
                </div>
                <span className="font-medium">{t('bookDetails.back')}</span>
            </button>

            <div className="space-y-8">
                <section className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-7">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px),1fr] xl:grid-cols-[minmax(0,360px),1fr]">
                        <div className="space-y-4">
                            <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-md sm:max-w-[360px]">
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="aspect-[2/3] h-full w-full object-cover"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={handleToggleWishlist}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                                >
                                    <Heart className={`h-5 w-5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                                    {t('bookDetails.favorites')}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 bg-white"
                                >
                                    <Share2 className="h-5 w-5" />
                                    {t('bookDetails.share')}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                                    {genreLabel}
                                </span>
                                <h1 className="mb-2 text-2xl font-bold leading-tight text-gray-900 sm:text-4xl">
                                    {book.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 text-base text-gray-600 sm:text-lg">
                                    <span>{t('bookDetails.author')}</span>
                                    <Link
                                        to={`/?q=${encodeURIComponent(authorName)}`}
                                        className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                                    >
                                        {authorName}
                                    </Link>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <span className="text-xl font-bold text-gray-900">{book.rating}</span>
                                    <span className="text-gray-400">/ 5</span>
                                </div>

                                <div className="hidden h-6 w-px bg-gray-200 sm:block" />

                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-gray-900">{reviewsCount}</span>
                                    <span className="text-gray-500">{t('bookDetails.reviewsCount', { count: reviewsCount })}</span>
                                </div>

                                <div className="hidden h-6 w-px bg-gray-200 sm:block" />

                                <div className="flex items-center gap-2 text-green-600 font-medium">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span>{t('bookDetails.original')}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                    <div className="mb-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                                        <p className="font-bold text-gray-900">{t('bookDetails.reviews', { count: reviews.length })}</p>
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/book/${id}/reviews`)}
                                            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-[#059669] transition hover:bg-emerald-50 hover:text-[#047857]"
                                        >
                                            <span>{t('common.viewAll')}</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="line-clamp-3 text-sm text-gray-600">
                                        {previewReview}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-6 rounded-3xl border border-gray-100 bg-gray-50 p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">{t('bookDetails.specialPrice')}</p>
                            <div className="flex flex-wrap items-baseline gap-3">
                                <span className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                                    {price.toLocaleString()}
                                    <span className="ml-1 text-xl font-medium text-gray-500 sm:text-3xl">{t('common.sum')}</span>
                                </span>
                                {oldPrice ? (
                                    <span className="text-xl text-gray-400 line-through decoration-2">
                                        {oldPrice.toLocaleString()}
                                    </span>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white p-1 sm:w-fit">
                            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                                <Minus className="h-5 w-5" />
                            </button>
                            <span className="w-12 text-center font-bold text-gray-900 text-lg">{quantity}</span>
                            <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50">
                                <Plus className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full py-4 px-8 bg-gray-900 text-white text-lg font-bold rounded-2xl shadow-lg shadow-gray-200 hover:bg-black hover:shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <Truck className="w-6 h-6" />
                        {t('bookDetails.addToCart')}
                    </button>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-gray-900">{t('bookDetails.delivery')}</p>
                                <p className="text-gray-500">{vendorDelivery}</p>
                                <p className="text-xs text-gray-400">{vendorMinDelivery}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                            <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-gray-900">{t('bookDetails.seller')}</p>
                                <p className="text-gray-500">{vendorName}</p>
                                <p className="text-xs text-gray-400">{vendorRating} / 5</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <BookAssistant
                        book={book}
                        reviews={reviews}
                        language={language}
                        t={t}
                    />
                </section>
            </div>
        </div>
    );
};

export default BookDetails;
