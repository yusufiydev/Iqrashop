import { VENDORS, api, getAllBooksInstant } from './mockApi';

const BUYERS_SEED = [
    { id: 'buyer-1', name: 'Aziza Karimova', email: 'aziza@mail.uz' },
    { id: 'buyer-2', name: 'Sardor Islomov', email: 'sardor@mail.uz' },
    { id: 'buyer-3', name: 'Laylo Nematova', email: 'laylo@mail.uz' },
];

const SELLERS_SEED = VENDORS.map((vendor) => ({
    id: String(vendor.id),
    name: vendor.name,
    email: `${vendor.name.toLowerCase().replace(/\s+/g, '.')}@bookshop.uz`,
    rating: vendor.rating,
}));

const SELLERS_KEY = 'bookshop_sellers';
const BUYERS_KEY = 'bookshop_buyers';

const readStorage = (key, seed) => {
    const raw = localStorage.getItem(key);
    if (raw) {
        return JSON.parse(raw);
    }
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
};

const writeStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const profileApi = {
    getSellers: async () => {
        await delay(150);
        return readStorage(SELLERS_KEY, SELLERS_SEED);
    },
    getBuyers: async () => {
        await delay(150);
        return readStorage(BUYERS_KEY, BUYERS_SEED);
    },
    getSellerById: async (id) => {
        await delay(100);
        const sellers = readStorage(SELLERS_KEY, SELLERS_SEED);
        return sellers.find((seller) => seller.id === String(id)) || null;
    },
    getSellerBooks: async (sellerId) => {
        await delay(200);
        return getAllBooksInstant().filter((book) => String(book.vendorId) === String(sellerId));
    },
    deleteSeller: async (sellerId) => {
        await delay(150);
        const sellers = readStorage(SELLERS_KEY, SELLERS_SEED);
        writeStorage(
            SELLERS_KEY,
            sellers.filter((seller) => seller.id !== String(sellerId)),
        );
    },
    deleteBuyer: async (buyerId) => {
        await delay(150);
        const buyers = readStorage(BUYERS_KEY, BUYERS_SEED);
        writeStorage(
            BUYERS_KEY,
            buyers.filter((buyer) => buyer.id !== String(buyerId)),
        );
    },
    deleteSellerBook: async (bookId) => {
        await api.deleteBook(bookId);
    },
};
