import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import MainLayout from './components/layout/MainLayout';
import SellerLayout from './components/layout/SellerLayout';
import SuperAdminLayout from './components/layout/SuperAdminLayout';
import Login from './pages/Login';
import Marketplace from './pages/Marketplace';
import GenrePage from './pages/GenrePage';
import BookDetails from './pages/BookDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';
import BookReviews from './pages/BookReviews';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import SellerProfile from './pages/admin/SellerProfile';
import SellerDashboard from './pages/seller/SellerDashboard';
import SellerBooks from './pages/seller/SellerBooks';
import { ToastContainer } from './components/common/Toast';
import { AppSettingsProvider } from './context/AppSettingsContext';
import InfoPage from './pages/InfoPage';

function App() {
    return (
        <AppSettingsProvider>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <BrowserRouter>
                            <ToastContainer />
                            <Routes>
                                <Route path="/login" element={<Login />} />

                                <Route
                                    path="/admin"
                                    element={(
                                        <RoleRoute allowedRoles={['admin']}>
                                            <SuperAdminLayout />
                                        </RoleRoute>
                                    )}
                                >
                                    <Route index element={<SuperAdminDashboard />} />
                                    <Route path="sellers/:sellerId" element={<SellerProfile />} />
                                </Route>

                                <Route
                                    path="/seller"
                                    element={(
                                        <RoleRoute allowedRoles={['seller']}>
                                            <SellerLayout>
                                                <SellerDashboard />
                                            </SellerLayout>
                                        </RoleRoute>
                                    )}
                                />
                                <Route
                                    path="/seller/books"
                                    element={(
                                        <RoleRoute allowedRoles={['seller']}>
                                            <SellerLayout>
                                                <SellerBooks />
                                            </SellerLayout>
                                        </RoleRoute>
                                    )}
                                />

                                <Route
                                    path="/"
                                    element={(
                                        <ProtectedRoute>
                                            <MainLayout />
                                        </ProtectedRoute>
                                    )}
                                >
                                    <Route index element={<Marketplace />} />
                                    <Route path="genre/:genreId" element={<GenrePage />} />
                                    <Route path="book/:id" element={<BookDetails />} />
                                    <Route path="book/:id/reviews" element={<BookReviews />} />
                                    <Route path="cart" element={<Cart />} />
                                    <Route path="wishlist" element={<Wishlist />} />
                                    <Route path="profile" element={<Profile />} />
                                    <Route path="about" element={<InfoPage type="about" />} />
                                    <Route path="terms" element={<InfoPage type="terms" />} />
                                    <Route path="privacy" element={<InfoPage type="privacy" />} />
                                    <Route path="contact" element={<InfoPage type="contact" />} />
                                </Route>

                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </BrowserRouter>
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </AppSettingsProvider>
    );
}

export default App;
