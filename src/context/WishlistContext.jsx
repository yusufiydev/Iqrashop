/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('book_market_wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('book_market_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (book) => {
        setWishlist((prev) => {
            if (prev.find((item) => item.id === book.id)) return prev;
            return [...prev, book];
        });
    };

    const removeFromWishlist = (bookId) => {
        setWishlist((prev) => prev.filter((item) => item.id !== bookId));
    };

    const isInWishlist = (bookId) => {
        return wishlist.some((item) => item.id === bookId);
    };

    const toggleWishlist = (book) => {
        if (isInWishlist(book.id)) {
            removeFromWishlist(book.id);
        } else {
            addToWishlist(book);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
