import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { profileApi } from '../../services/profileApi';

const SellerProfile = () => {
    const { sellerId } = useParams();
    const [seller, setSeller] = useState(null);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const load = async () => {
            const [sellerData, booksData] = await Promise.all([
                profileApi.getSellerById(sellerId),
                profileApi.getSellerBooks(sellerId),
            ]);
            setSeller(sellerData);
            setBooks(booksData);
        };
        load();
    }, [sellerId]);

    const handleDeleteBook = async (bookId) => {
        await profileApi.deleteSellerBook(bookId);
        const booksData = await profileApi.getSellerBooks(sellerId);
        setBooks(booksData);
    };

    if (!seller) {
        return <div className="rounded-2xl border bg-white p-6">Sotuvchi topilmadi.</div>;
    }

    return (
        <div className="min-w-0 space-y-5">
            <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                <p className="text-sm text-gray-500">Sotuvchi</p>
                <h1 className="break-words text-xl font-bold text-gray-900 sm:text-2xl">{seller.name}</h1>
                <p className="break-words text-gray-500">{seller.email}</p>
                <Link to="/admin" className="mt-4 inline-block text-sm font-medium text-emerald-700 hover:text-emerald-800">
                    Orqaga
                </Link>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white">
                <div className="border-b border-emerald-100 px-5 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Sotuvchi joylagan kitoblar</h2>
                </div>
                <div className="divide-y divide-emerald-50">
                    {books.map((book) => (
                        <div key={book.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
                            <div className="flex min-w-0 items-center gap-3 sm:flex-1 sm:gap-4">
                            <img src={book.image} alt={book.title} className="h-16 w-12 shrink-0 rounded object-cover" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium text-gray-900">{book.title}</p>
                                <p className="truncate text-sm text-gray-500">{book.author}</p>
                            </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pl-15 sm:justify-end sm:pl-0">
                            <p className="text-sm font-semibold text-emerald-700">
                                {new Intl.NumberFormat('uz-UZ').format(book.price)} so'm
                            </p>
                            <button
                                type="button"
                                onClick={() => handleDeleteBook(book.id)}
                                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                                O‘chirish
                            </button>
                            </div>
                        </div>
                    ))}
                    {books.length === 0 ? (
                        <div className="px-5 py-6 text-sm text-gray-500">Bu sotuvchida hali kitob yo‘q.</div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default SellerProfile;
