/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const { book, quantity } = action.payload;
            const existingItem = state.items.find((item) => item.id === book.id);
            const safeQuantity = Math.max(1, Number(quantity) || 1);

            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map((item) =>
                        item.id === book.id
                            ? { ...item, quantity: item.quantity + safeQuantity }
                            : item,
                    ),
                };
            }

            return {
                ...state,
                items: [...state.items, { ...book, quantity: safeQuantity }],
            };
        }

        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter((item) => item.id !== action.payload),
            };

        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: Math.max(1, action.payload.quantity) }
                        : item,
                ),
            };

        case 'CLEAR_CART':
            return { ...state, items: [] };

        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [] }, (initial) => {
        const persisted = localStorage.getItem('book_market_cart');
        return persisted ? JSON.parse(persisted) : initial;
    });

    useEffect(() => {
        localStorage.setItem('book_market_cart', JSON.stringify(state));
    }, [state]);

    const addToCart = (book, quantity = 1) => dispatch({ type: 'ADD_ITEM', payload: { book, quantity } });
    const removeFromCart = (bookId) => dispatch({ type: 'REMOVE_ITEM', payload: bookId });
    const updateQuantity = (bookId, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: bookId, quantity } });
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });

    const totalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems: state.items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
