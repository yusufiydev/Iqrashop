import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSettings } from '../context/AppSettingsContext';
import { toast } from '../components/common/Toast';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
    const { t } = useAppSettings();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!cartItems.length) return;
        clearCart();
        toast.success(t('cart.checkout'));
        navigate('/profile');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{t('cart.emptyTitle')}</h2>
                <p className="max-w-sm text-sm text-gray-500 sm:text-base">{t('cart.emptySubtitle')}</p>
                <Link to="/" className="w-full max-w-xs px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors sm:w-auto">
                    {t('cart.startShopping')}
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="mb-5 text-xl font-bold text-gray-900 sm:mb-8 sm:text-2xl">{t('cart.title', { count: totalItems })}</h1>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8">
                <div className="space-y-3 sm:space-y-4 lg:col-span-2">
                    {cartItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm sm:p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                                <div className="w-16 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden sm:w-20 sm:h-28">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                                    <p className="text-sm text-gray-500 mb-1">{item.author}</p>
                                    <p className="text-xs text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded">{item.vendor?.name}</p>

                                    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex items-center gap-2.5 sm:gap-3">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-medium w-6 text-center">{item.quantity}</span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="font-bold text-gray-900 text-base sm:text-lg">
                                            {(item.price * item.quantity).toLocaleString()} {t('common.sum')}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors self-end sm:self-start"
                                    title={t('common.delete')}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:sticky lg:top-24 sm:p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('cart.orderSummary')}</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm text-gray-600 sm:text-base">
                                <span>{t('cart.products', { count: totalItems })}</span>
                                <span>{totalPrice.toLocaleString()} {t('common.sum')}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 sm:text-base">
                                <span>{t('cart.delivery')}</span>
                                <span className="text-green-600">{t('common.free')}</span>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex justify-between text-lg font-bold text-gray-900 sm:text-xl">
                                <span>{t('cart.total')}</span>
                                <span>{totalPrice.toLocaleString()} {t('common.sum')}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleCheckout}
                            className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {t('cart.checkout')} <ArrowRight className="w-5 h-5" />
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            {t('cart.termsNote')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
