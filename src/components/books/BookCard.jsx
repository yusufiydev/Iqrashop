import { useMemo } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Link } from 'react-router-dom';
import { useAppSettings } from '../../context/AppSettingsContext';

const createPlaceholderImage = (title) => {
    const safeTitle = String(title || 'Kitob').slice(0, 24);
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#dbeafe'/><stop offset='100%' stop-color='#e2e8f0'/></linearGradient></defs><rect width='400' height='600' fill='url(#g)'/><rect x='24' y='24' width='352' height='552' rx='20' fill='#ffffff' fill-opacity='0.74'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='22' fill='#334155'>${safeTitle}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const BookCard = ({ book }) => {
    const { id, title, author, price, oldPrice, image } = book;
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { t, theme } = useAppSettings();
    const isDark = theme === 'dark';

    const placeholderImage = useMemo(() => createPlaceholderImage(title), [title]);
    const isLiked = isInWishlist(id);
    const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;
    const genreLabel = t(`genres.${book.genre}`) !== `genres.${book.genre}`
        ? t(`genres.${book.genre}`)
        : t('genres.book');

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(book);
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        toggleWishlist(book);
    };

    return (
        <div className={`group relative flex h-full flex-col rounded-2xl p-2.5 transition-all duration-300 sm:p-3 ${isDark ? 'bg-[#1a2747] hover:bg-[#22345d]' : 'border border-[#e9edf5] bg-white hover:bg-white'}`}>
            <Link to={`/book/${id}`} className={`relative block overflow-hidden rounded-[18px] ${isDark ? 'bg-[#233765]' : 'bg-white'}`}>
                <div className="absolute left-2 top-2 z-10 flex flex-col gap-1 sm:left-2.5 sm:top-2.5">
                    {discount ? (
                        <span className="rounded-lg bg-[#c66314] px-2.5 py-1 text-xs font-bold leading-none text-white">
                            -{discount}%
                        </span>
                    ) : null}
                    {book.isNew ? (
                        <span className="rounded-lg bg-[#10B981] px-2.5 py-1 text-xs font-bold leading-none text-white">
                            {t('bookCard.new')}
                        </span>
                    ) : null}
                </div>

                <button
                    onClick={handleToggleWishlist}
                    className={`absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105 hover:text-[#f3526b] ${isDark ? 'bg-[#152240] text-[#90a2cc]' : 'bg-[#eaedf3] text-[#6e778d]'}`}
                    title={t('bookCard.wishlist')}
                >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-[#f3526b] text-[#f3526b]' : ''}`} />
                </button>

                <img
                    src={image || placeholderImage}
                    alt={title}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                        event.currentTarget.src = placeholderImage;
                    }}
                    className="h-[210px] w-full object-cover sm:h-[250px] lg:h-[300px]"
                />
            </Link>

            <div className="flex flex-1 flex-col px-1 pb-1 pt-3 sm:pt-4">
                <span className={`mb-1 text-[12px] font-bold uppercase tracking-wide ${isDark ? 'text-[#8ea0c7]' : 'text-[#555f74]'}`}>
                    {genreLabel}
                </span>
                <Link to={`/book/${id}`} className="min-h-[50px] sm:min-h-[56px]">
                    <h3 className={`line-clamp-2 text-[15px] font-semibold leading-[1.25] transition-colors group-hover:text-[#10B981] sm:text-[18px] ${isDark ? 'text-[#f1f5ff]' : 'text-[#202632]'}`}>
                        {title}
                    </h3>
                </Link>
                <p className={`mt-1 line-clamp-1 text-[13px] ${isDark ? 'text-[#9daacc]' : 'text-[#5a6274]'}`}>{author}</p>

                <div className="mt-3 flex items-end justify-between gap-2 pt-2">
                    <div className="min-w-0">
                        {oldPrice ? (
                            <p className={`truncate text-[13px] font-medium line-through ${isDark ? 'text-[#7f8fb5]' : 'text-[#6b7384]'}`}>
                                {oldPrice.toLocaleString()} {t('common.sum')}
                            </p>
                        ) : null}
                        <p className={`truncate text-[16px] font-bold leading-[1.1] sm:text-[18px] ${isDark ? 'text-[#34d399]' : 'text-[#059669]'}`}>
                            {price.toLocaleString()}<br />{t('common.sum')}
                        </p>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition hover:text-[#047857] sm:h-11 sm:w-11 ${isDark ? 'bg-[#17284d] text-[#34d399] hover:bg-[#203563]' : 'bg-[#e1e3e8] text-[#059669] hover:bg-[#d4d9ea]'}`}
                        title={t('bookCard.addToCart')}
                    >
                        <ShoppingCart className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;
