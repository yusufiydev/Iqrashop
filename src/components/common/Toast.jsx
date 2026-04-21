/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
};

let addToast;

export const toast = {
    success: (msg) => addToast?.({ type: 'success', msg }),
    error: (msg) => addToast?.({ type: 'error', msg }),
    warning: (msg) => addToast?.({ type: 'warning', msg }),
};

let id = 0;

export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        addToast = ({ type, msg }) => {
            const toastId = ++id;
            setToasts(prev => [...prev, { id: toastId, type, msg }]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toastId));
            }, 3500);
        };
        return () => { addToast = null; };
    }, []);

    return createPortal(
        <div className="fixed left-3 right-3 top-4 z-[9999] flex flex-col gap-3 pointer-events-none sm:left-auto sm:right-5 sm:top-5 sm:max-w-[360px]">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white shadow-xl pointer-events-auto animate-slideIn sm:min-w-[280px]"
                >
                    {icons[t.type]}
                    <span className="flex-1">{t.msg}</span>
                    <button
                        onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>,
        document.body
    );
};
