import { Link } from 'react-router-dom';
import { useAppSettings } from '../context/AppSettingsContext';

const localizedContent = {
    about: {
        uz: {
            title: 'Biz haqimizda',
            paragraphs: [
                'Iqrashop - o‘zbek va jahon adabiyotini qulay tarzda topish va xarid qilish uchun yaratilgan onlayn kitob maydoni.',
                'Bizning maqsadimiz kitobxon va kitobni bir-biriga tez, aniq va ishonchli bog‘lash.',
            ],
        },
        en: {
            title: 'About Us',
            paragraphs: [
                'Iqrashop is an online bookstore designed to help readers discover and buy books quickly and comfortably.',
                'Our mission is to connect readers with quality books through a simple and reliable experience.',
            ],
        },
        ru: {
            title: 'О нас',
            paragraphs: [
                'Iqrashop - это онлайн-площадка для удобного поиска и покупки книг.',
                'Наша цель - быстро и надежно соединять читателей с качественной литературой.',
            ],
        },
    },
    terms: {
        uz: {
            title: 'Foydalanish shartlari',
            paragraphs: [
                'Saytdan foydalanishda foydalanuvchi ma’lumotlarni to‘g‘ri kiritishi va qonuniy talablarga rioya qilishi shart.',
                'Buyurtma, to‘lov va yetkazib berish jarayonlari sayt qoidalari bo‘yicha amalga oshiriladi.',
            ],
        },
        en: {
            title: 'Terms of Service',
            paragraphs: [
                'Users are responsible for providing accurate information and following legal requirements while using the platform.',
                'Orders, payments, and deliveries are processed according to our marketplace rules.',
            ],
        },
        ru: {
            title: 'Условия использования',
            paragraphs: [
                'Пользователь обязан указывать корректные данные и соблюдать требования законодательства.',
                'Оформление заказов, оплата и доставка выполняются по правилам платформы.',
            ],
        },
    },
    privacy: {
        uz: {
            title: 'Maxfiylik siyosati',
            paragraphs: [
                'Shaxsiy ma’lumotlaringiz faqat buyurtma va xizmat sifatini yaxshilash maqsadida qayta ishlanadi.',
                'Biz foydalanuvchi ma’lumotlarini uchinchi tomonga ruxsatsiz uzatmaymiz.',
            ],
        },
        en: {
            title: 'Privacy Policy',
            paragraphs: [
                'Your personal data is processed only for order management and service quality improvement.',
                'We do not share user data with third parties without permission.',
            ],
        },
        ru: {
            title: 'Политика конфиденциальности',
            paragraphs: [
                'Ваши персональные данные обрабатываются только для оформления заказов и улучшения сервиса.',
                'Мы не передаем данные пользователя третьим лицам без согласия.',
            ],
        },
    },
    contact: {
        uz: {
            title: 'Aloqa',
            paragraphs: ['Savol yoki takliflaringiz bo‘lsa, biz bilan quyidagi kanallar orqali bog‘laning.'],
        },
        en: {
            title: 'Contact',
            paragraphs: ['For any questions or suggestions, contact us using the channels below.'],
        },
        ru: {
            title: 'Контакты',
            paragraphs: ['По вопросам и предложениям свяжитесь с нами по каналам ниже.'],
        },
    },
};

const InfoPage = ({ type }) => {
    const { language, theme, t } = useAppSettings();
    const isDark = theme === 'dark';

    const data = localizedContent[type]?.[language] || localizedContent[type]?.en;

    if (!data) return null;

    return (
        <div className="max-w-4xl mx-auto py-4">
            <div className={`rounded-3xl border p-8 sm:p-10 ${isDark ? 'border-[#2b395f] bg-[#111b33] text-[#dce6ff]' : 'border-[#dce2ef] bg-white text-[#1f2531]'}`}>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">{data.title}</h1>

                <div className="space-y-4 text-[16px] leading-7">
                    {data.paragraphs.map((text) => (
                        <p key={text}>{text}</p>
                    ))}
                </div>

                {type === 'contact' && (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <a
                            href="tel:+998903685453"
                            className={`rounded-2xl border px-5 py-4 font-semibold transition ${isDark ? 'border-[#32456f] bg-[#162442] hover:bg-[#1d2e52]' : 'border-[#dbe2f0] bg-[#f7f9fe] hover:bg-[#eef3ff]'}`}
                        >
                            +998 90 368 54 53
                        </a>
                        <a
                            href="https://t.me/iqrashop_support"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`rounded-2xl border px-5 py-4 font-semibold transition ${isDark ? 'border-[#32456f] bg-[#162442] hover:bg-[#1d2e52]' : 'border-[#dbe2f0] bg-[#f7f9fe] hover:bg-[#eef3ff]'}`}
                        >
                            @iqrashop_support
                        </a>
                    </div>
                )}

                <div className="mt-8">
                    <Link
                        to="/"
                        className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition ${isDark ? 'bg-[#134e4a] text-[#dce6ff] hover:bg-[#115e59]' : 'bg-[#ecfdf5] text-[#047857] hover:bg-[#d1fae5]'}`}
                    >
                        {t('bookDetails.back')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InfoPage;
