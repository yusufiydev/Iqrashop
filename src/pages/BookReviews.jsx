import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft } from 'lucide-react';
import { useAppSettings } from '../context/AppSettingsContext';

const createDefaultReviews = (t) => ([
    {
        id: 1,
        user: "Anvar Olimov",
        rating: 5,
        text: t('reviews.defaultReview1'),
        date: "2024-02-10",
        avatarColor: "bg-emerald-100 text-emerald-700"
    },
    {
        id: 2,
        user: "Malika Karimova",
        rating: 4,
        text: t('reviews.defaultReview2'),
        date: "2024-02-11",
        avatarColor: "bg-pink-100 text-pink-700"
    }
]);

const BookReviews = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newReview, setNewReview] = useState('');
    const [newRating, setNewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [, setRefreshKey] = useState(0);
    const { t } = useAppSettings();

    const storageKey = `book_reviews_${id}`;
    const getReviews = () => {
        const savedReviews = localStorage.getItem(storageKey);
        if (savedReviews) {
            try {
                return JSON.parse(savedReviews);
            } catch {
                return createDefaultReviews(t);
            }
        }

        return createDefaultReviews(t);
    };

    const reviews = getReviews();

    const handleSubmitReview = () => {
        if (!newReview.trim()) return;

        const highestId = reviews.reduce((maxId, reviewItem) => {
            const reviewId = Number(reviewItem.id) || 0;
            return reviewId > maxId ? reviewId : maxId;
        }, 0);

        const review = {
            id: highestId + 1,
            user: t('reviews.user'),
            rating: newRating,
            text: newReview,
            date: new Date().toISOString().split('T')[0],
            avatarColor: "bg-gray-100 text-gray-700"
        };

        const updatedReviews = [review, ...reviews];
        localStorage.setItem(storageKey, JSON.stringify(updatedReviews));
        setRefreshKey((prev) => prev + 1);
        setNewReview('');
        setNewRating(5);
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="max-w-3xl mx-auto min-h-screen px-1 py-4 sm:px-3 sm:py-6 lg:px-6 lg:py-8">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{t('reviews.title')}</h1>
            </div>

            {/* Rating Summary */}
            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900 sm:text-4xl">{averageRating}</span>
                        <span className="text-gray-500">/ 5</span>
                    </div>
                    <div className="flex text-yellow-400 my-1">
                        {'★'.repeat(Math.round(averageRating))}
                        {'☆'.repeat(5 - Math.round(averageRating))}
                    </div>
                    <p className="text-sm text-gray-500">{t('reviews.count', { count: reviews.length })}</p>
                </div>
                {/* Visual bars could go here */}
            </div>

            {/* Reviews List */}
            <div className="mb-10 space-y-4 sm:mb-12 sm:space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm sm:p-6">
                        <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${review.avatarColor || 'bg-gray-100 text-gray-700'}`}>
                                    {review.user.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{review.user}</h4>
                                    <p className="text-xs text-gray-400">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex text-yellow-400">
                                {'★'.repeat(review.rating)}
                                {'☆'.repeat(5 - review.rating)}
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{review.text}</p>
                    </div>
                ))}
            </div>

            {/* Add Review Box */}
            <div className="sticky bottom-0 -mx-1 border-t border-gray-100 bg-white p-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sm:relative sm:bottom-auto sm:mx-0 sm:rounded-2xl sm:border sm:p-6 sm:shadow-none">
                <h4 className="font-bold text-gray-900 mb-4">{t('reviews.leaveReview')}</h4>

                {/* Rating Input */}
                <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setNewRating(star)}
                            className="p-1 focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                className={`h-7 w-7 sm:h-8 sm:w-8 ${star <= (hoverRating || newRating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-200 fill-current'
                                    }`}
                            />
                        </button>
                    ))}
                </div>

                <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-4 text-base focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all placeholder-gray-400 bg-gray-50 mb-3"
                    rows="3"
                    placeholder={t('reviews.placeholder')}
                ></textarea>
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmitReview}
                        disabled={!newReview.trim()}
                        className="w-full rounded-xl bg-gray-900 px-6 py-2.5 font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                    >
                        {t('reviews.submit')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookReviews;
