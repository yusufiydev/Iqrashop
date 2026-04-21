// Mock Data

export const GENRES = [
    { id: 'roman', name: 'Roman', color: 'bg-emerald-100', text: 'text-emerald-700' },
    { id: 'sheriyat', name: 'She\'riyat', color: 'bg-pink-100', text: 'text-pink-700' },
    { id: 'ilmiy', name: 'Ilmiy', color: 'bg-emerald-100', text: 'text-emerald-700' },
    { id: 'fantastika', name: 'Fantastika', color: 'bg-purple-100', text: 'text-purple-700' },
    { id: 'tarix', name: 'Tarix', color: 'bg-amber-100', text: 'text-amber-700' },
    { id: 'biznes', name: 'Biznes', color: 'bg-emerald-100', text: 'text-emerald-700' },
    { id: 'bolalar', name: 'Bolalar adabiyoti', color: 'bg-orange-100', text: 'text-orange-700' },
];

export const VENDORS = [
    { id: 1, name: "Ziyo Uz", rating: 4.8, deliveryTime: "1-3 kun", minDeliveryPrice: "15 000 so'm" },
    { id: 2, name: "Iqrashop Official", rating: 4.9, deliveryTime: "2-4 soat", minDeliveryPrice: "Bepul" },
    { id: 3, name: "Kitoblar Olami", rating: 4.6, deliveryTime: "1 kun", minDeliveryPrice: "20 000 so'm" }
];

const SEED_BOOKS = [
    { id: 101, title: "O'tkan kunlar", author: "Abdulla Qodiriy", price: 45000, oldPrice: 50000, image: "https://placehold.co/400x600/e0e7ff/4f46e5?text=O'tkan+kunlar", genre: 'roman', vendorId: 1, rating: 4.9, reviews: 124, isNew: false, isBestSeller: true },
    { id: 102, title: "Yulduzli tunlar", author: "Pirimqul Qodirov", price: 55000, oldPrice: null, image: "https://placehold.co/400x600/f3e8ff/7c3aed?text=Yulduzli+tunlar", genre: 'roman', vendorId: 2, rating: 4.8, reviews: 89, isNew: false, isBestSeller: true },
    { id: 103, title: "Alkimyogar", author: "Paulo Koelo", price: 35000, oldPrice: 40000, image: "https://placehold.co/400x600/ecfccb/4d7c0f?text=Alkimyogar", genre: 'roman', vendorId: 1, rating: 4.7, reviews: 210, isNew: false, isBestSeller: true },
    { id: 201, title: "Steve Jobs", author: "Walter Isaacson", price: 120000, oldPrice: 150000, image: "https://placehold.co/400x600/f1f5f9/334155?text=Steve+Jobs", genre: 'biznes', vendorId: 2, rating: 5.0, reviews: 45, isNew: true, isBestSeller: false },
    { id: 202, title: "Zero to One", author: "Peter Thiel", price: 95000, oldPrice: null, image: "https://placehold.co/400x600/fff7ed/ea580c?text=Zero+to+One", genre: 'biznes', vendorId: 3, rating: 4.6, reviews: 32, isNew: false, isBestSeller: false },
    { id: 301, title: "Garri Potter", author: "J.K. Rowling", price: 180000, oldPrice: 200000, image: "https://placehold.co/400x600/fff1f2/be123c?text=Garri+Potter", genre: 'fantastika', vendorId: 2, rating: 4.9, reviews: 530, isNew: false, isBestSeller: true },
    { id: 302, title: "Dune", author: "Frank Herbert", price: 110000, oldPrice: null, image: "https://placehold.co/400x600/ecfeff/0e7490?text=Dune", genre: 'fantastika', vendorId: 1, rating: 4.8, reviews: 112, isNew: true, isBestSeller: false },
    { id: 401, title: "Sariq devni minib", author: "Xudoyberdi To'xtaboyev", price: 25000, oldPrice: 30000, image: "https://placehold.co/400x600/ffedd5/c2410c?text=Sariq+dev", genre: 'bolalar', vendorId: 3, rating: 4.9, reviews: 150, isNew: false, isBestSeller: true },
    { id: 402, title: "Shum bola", author: "G'afur G'ulom", price: 30000, oldPrice: null, image: "https://placehold.co/400x600/f0fdf4/15803d?text=Shum+bola", genre: 'bolalar', vendorId: 1, rating: 4.8, reviews: 98, isNew: false, isBestSeller: false },
    { id: 501, title: "Temur Tuzuklari", author: "Amir Temur", price: 60000, oldPrice: 75000, image: "https://placehold.co/400x600/fffbeb/b45309?text=Temur+Tuzuklari", genre: 'tarix', vendorId: 2, rating: 5.0, reviews: 200, isNew: false, isBestSeller: true }
];

const LS_KEY = 'bookshop_books';

const getStoredBooks = () => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LS_KEY, JSON.stringify(SEED_BOOKS));
    return SEED_BOOKS;
};

const saveBooks = (books) => {
    localStorage.setItem(LS_KEY, JSON.stringify(books));
};

const attachVendor = (book) => {
    const vendor = VENDORS.find((v) => v.id === book.vendorId) || VENDORS[0];
    return { ...book, vendor };
};

export const getAllBooksInstant = () => getStoredBooks().map(attachVendor);

export const getBooksByGenreInstant = (genreId) =>
    getStoredBooks().filter((book) => book.genre === genreId).map(attachVendor);

export const PROMOTIONS = [
    { id: 1, title: "Yozgi chegirmalar!", description: "Barcha badiiy kitoblarga 30% gacha chegirma", image: "https://placehold.co/1200x400/4f46e5/ffffff?text=Yozgi+Chegirmalar+-30%", color: "bg-emerald-600" },
    { id: 2, title: "Biznes kitoblar to'plami", description: "O'z biznesingizni rivojlantiring", image: "https://placehold.co/1200x400/059669/ffffff?text=Biznes+Kitoblar", color: "bg-emerald-600" },
    { id: 3, title: "Bolalar uchun eng yaxshisi", description: "Kelajak avlod uchun sara asarlar", image: "https://placehold.co/1200x400/ea580c/ffffff?text=Bolalar+Adabiyoti", color: "bg-orange-600" }
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
    getGenres: async () => {
        await delay(300);
        return GENRES;
    },

    getAllBooks: async () => {
        await delay(300);
        return getAllBooksInstant();
    },

    getBooksByGenre: async (genreId) => {
        await delay(300);
        return getBooksByGenreInstant(genreId);
    },

    getBestSellers: async () => {
        await delay(300);
        return getStoredBooks().filter((b) => b.isBestSeller).map(attachVendor);
    },

    getNewArrivals: async () => {
        await delay(300);
        return getStoredBooks().filter((b) => b.isNew).map(attachVendor);
    },

    getBookById: async (id) => {
        await delay(200);
        const book = getStoredBooks().find((b) => b.id === Number(id));
        if (!book) return null;
        return attachVendor(book);
    },

    getVendors: async () => {
        await delay(300);
        return VENDORS;
    },

    getPromotions: async () => {
        await delay(200);
        return PROMOTIONS;
    },

    addBook: async (bookData) => {
        await delay(400);
        const books = getStoredBooks();
        const newId = Math.max(...books.map((b) => b.id), 0) + 1;
        const newBook = {
            id: newId,
            vendorId: 1,
            rating: 0,
            reviews: 0,
            isNew: true,
            isBestSeller: false,
            oldPrice: null,
            ...bookData,
            price: Number(bookData.price),
        };
        saveBooks([...books, newBook]);
        return newBook;
    },

    updateBook: async (id, bookData) => {
        await delay(400);
        const books = getStoredBooks();
        const updated = books.map((b) =>
            b.id === Number(id)
                ? { ...b, ...bookData, price: Number(bookData.price), id: Number(id) }
                : b,
        );
        saveBooks(updated);
        return updated.find((b) => b.id === Number(id));
    },

    deleteBook: async (id) => {
        await delay(300);
        const books = getStoredBooks();
        saveBooks(books.filter((b) => b.id !== Number(id)));
        return true;
    },
};
