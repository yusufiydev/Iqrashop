import Modal from '../common/Modal';
import { Phone, Send } from 'lucide-react';
import { useAppSettings } from '../../context/AppSettingsContext';

const ContactModal = ({ isOpen, onClose }) => {
    const { t } = useAppSettings();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('contactModal.title')}>
            <div className="space-y-4">
                <p className="text-gray-600 text-sm mb-6">
                    {t('contactModal.description')}
                </p>

                <a
                    href="tel:+998903685453"
                    className="flex items-center gap-4 w-full p-4 bg-gray-50 hover:bg-emerald-50 border border-gray-100 rounded-2xl transition-all duration-200 group"
                >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                        <Phone className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t('contactModal.call')}</p>
                        <p className="text-lg font-bold text-gray-900">+998 90 368 54 53</p>
                    </div>
                </a>

                <a
                    href="https://t.me/iqrashop_support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 w-full p-4 bg-gray-50 hover:bg-emerald-50 border border-gray-100 rounded-2xl transition-all duration-200 group"
                >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                        <Send className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{t('contactModal.telegram')}</p>
                        <p className="text-lg font-bold text-gray-900">@iqrashop_support</p>
                    </div>
                </a>

                <div className="pt-4">
                    <button
                        onClick={onClose}
                        className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ContactModal;
