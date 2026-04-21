import { useWishlist } from '../context/WishlistContext';
import BookCard from '../components/books/BookCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppSettings } from '../context/AppSettingsContext';

const Wishlist = () => {
    const { wishlist } = useWishlist();
    const { t } = useAppSettings();

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                    <Heart className="w-10 h-10 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{t('wishlist.emptyTitle')}</h2>
                <p className="max-w-sm text-sm text-gray-500 sm:text-base">{t('wishlist.emptySubtitle')}</p>
                <Link to="/" className="w-full max-w-xs px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors sm:w-auto">
                    {t('wishlist.browseBooks')}
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="mb-5 flex items-center gap-2 text-xl font-bold text-gray-900 sm:mb-6 sm:text-2xl">
                <Heart className="h-6 w-6 text-red-500 fill-current sm:h-7 sm:w-7" />
                {t('wishlist.title', { count: wishlist.length })}
            </h1>

            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {wishlist.map((book) => (
                    <BookCard key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
