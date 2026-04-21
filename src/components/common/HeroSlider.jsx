import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/mockApi';
import { useAppSettings } from '../../context/AppSettingsContext';

const slideBackgrounds = [
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1500&q=80',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1500&q=80',
    'https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=1500&q=80',
];

const HeroSlider = () => {
    const [promotions, setPromotions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { t } = useAppSettings();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const data = await api.getPromotions();
                setPromotions(data);
            } catch (error) {
                console.error('Failed to load promotions', error);
            }
        };
        fetchPromotions();
    }, []);

    useEffect(() => {
        if (promotions.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % promotions.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [promotions]);

    const handleShopNow = () => {
        const section = document.getElementById('best-sellers-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleDetails = (promoTitle) => {
        navigate(`/?q=${encodeURIComponent(promoTitle)}`);
    };

    if (!promotions.length) return <div className="mb-8 h-[210px] animate-pulse rounded-[22px] bg-[#d9ddf8] sm:mb-10 sm:h-[300px] lg:h-[420px]" />;

    return (
        <div className="group relative mb-8 h-[210px] w-full overflow-hidden rounded-[22px] sm:mb-10 sm:h-[300px] lg:h-[420px]">
            {promotions.map((promo, index) => (
                <div
                    key={promo.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
                >
                    <div
                        className="relative flex h-full items-center px-4 py-6 text-white sm:px-8 sm:py-8 lg:px-[70px]"
                        style={{
                            backgroundImage: `linear-gradient(100deg, rgba(6,95,70,0.95) 0%, rgba(4,120,87,0.93) 45%, rgba(16,185,129,0.9) 100%), url('${slideBackgrounds[index % slideBackgrounds.length]}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_56%_100%,rgba(255,255,255,0.16),transparent_52%)]" />
                        <div className="absolute inset-y-0 right-0 hidden w-[20%] bg-[#047857]/55 lg:block" />

                        <div className="relative max-w-[720px]">
                            <span className="mb-4 inline-flex rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] backdrop-blur-sm sm:mb-5 sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.16em]">
                                {t('hero.badge')}
                            </span>
                            <h2 className="mb-3 text-[26px] font-bold leading-[1.08] sm:mb-4 sm:text-[40px] lg:text-[60px]">
                                {promo.title}
                            </h2>
                            <p className="mb-5 max-w-[700px] text-sm leading-relaxed text-white/84 sm:mb-8 sm:text-base lg:text-[18px]">
                                {promo.description}. {t('hero.extraDescription')}
                            </p>
                            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={handleShopNow}
                                    className="w-full rounded-full bg-white px-6 py-3 text-sm font-bold text-[#047857] shadow-[0_10px_24px_-14px_rgba(255,255,255,0.9)] transition hover:translate-y-[-1px] sm:w-auto sm:px-8 sm:py-3.5 sm:text-[17px]"
                                >
                                    {t('hero.buyNow')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDetails(promo.title)}
                                    className="w-full rounded-full border border-white/35 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 sm:w-auto sm:px-8 sm:py-3.5 sm:text-[17px]"
                                >
                                    {t('hero.details')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default HeroSlider;
