import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { profileApi } from '../../services/profileApi';

const SuperAdminDashboard = () => {
    const [sellers, setSellers] = useState([]);
    const [buyers, setBuyers] = useState([]);

    const load = async () => {
        const [sellerData, buyerData] = await Promise.all([
            profileApi.getSellers(),
            profileApi.getBuyers(),
        ]);
        setSellers(sellerData);
        setBuyers(buyerData);
    };

    useEffect(() => {
        let isMounted = true;

        Promise.all([
            profileApi.getSellers(),
            profileApi.getBuyers(),
        ]).then(([sellerData, buyerData]) => {
            if (!isMounted) {
                return;
            }

            setSellers(sellerData);
            setBuyers(buyerData);
        });

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDeleteSeller = async (sellerId) => {
        await profileApi.deleteSeller(sellerId);
        await load();
    };

    const handleDeleteBuyer = async (buyerId) => {
        await profileApi.deleteBuyer(buyerId);
        await load();
    };

    return (
        <div className="min-w-0 space-y-5 sm:space-y-6">
            <section className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                    <p className="text-sm text-gray-500">Sotuvchilar</p>
                    <p className="mt-1 text-3xl font-bold text-emerald-700">{sellers.length}</p>
                </div>
                <div className="rounded-2xl border border-cyan-100 bg-white p-5">
                    <p className="text-sm text-gray-500">Xaridorlar</p>
                    <p className="mt-1 text-3xl font-bold text-cyan-700">{buyers.length}</p>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                    <p className="text-sm text-gray-500">Umumiy profil</p>
                    <p className="mt-1 text-3xl font-bold text-emerald-700">{sellers.length + buyers.length}</p>
                </div>
            </section>

            <section className="rounded-2xl border border-emerald-100 bg-white">
                <div className="border-b border-emerald-100 px-5 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Sotuvchilar profili</h2>
                </div>
                <div className="divide-y divide-emerald-50">
                    {sellers.map((seller) => (
                        <div key={seller.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                            <div className="min-w-0">
                                <p className="truncate font-medium text-gray-900">{seller.name}</p>
                                <p className="truncate text-sm text-gray-500">{seller.email}</p>
                            </div>
                            <div className="grid gap-2 min-[420px]:grid-cols-2 sm:flex sm:items-center">
                                <Link
                                    to={`/admin/sellers/${seller.id}`}
                                    className="rounded-xl bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-700"
                                >
                                    Profilga o‘tish
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteSeller(seller.id)}
                                    className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                    O‘chirish
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded-2xl border border-cyan-100 bg-white">
                <div className="border-b border-cyan-100 px-5 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Xaridorlar profili</h2>
                </div>
                <div className="divide-y divide-cyan-50">
                    {buyers.map((buyer) => (
                        <div key={buyer.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                            <div className="min-w-0">
                                <p className="truncate font-medium text-gray-900">{buyer.name}</p>
                                <p className="truncate text-sm text-gray-500">{buyer.email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleDeleteBuyer(buyer.id)}
                                className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 sm:w-auto"
                            >
                                O‘chirish
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default SuperAdminDashboard;
