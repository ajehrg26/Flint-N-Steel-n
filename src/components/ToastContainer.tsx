import React from 'react';
import { CheckCircle2, Heart, ShoppingBag, Info, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, setIsCartOpen } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-black text-white p-4 rounded-2xl shadow-2xl border border-neutral-800 flex items-start space-x-3 animate-in slide-in-from-bottom-5 duration-200"
        >
          <div className="p-1 rounded-full bg-neutral-800 text-white flex-shrink-0 mt-0.5">
            {toast.type === 'cart' && <ShoppingBag className="w-4 h-4 text-[#ff4500]" />}
            {toast.type === 'wishlist' && <Heart className="w-4 h-4 text-red-500 fill-red-500" />}
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
          </div>

          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold leading-tight">{toast.title}</h5>
            {toast.description && (
              <p className="text-[11px] text-neutral-300 mt-0.5 leading-normal">
                {toast.description}
              </p>
            )}
            {toast.type === 'cart' && (
              <button
                onClick={() => {
                  dismissToast(toast.id);
                  setIsCartOpen(true);
                }}
                className="text-[11px] text-[#ff8c00] hover:underline font-bold mt-1.5 inline-block"
              >
                View Bag & Checkout &rarr;
              </button>
            )}
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-neutral-500 hover:text-white p-0.5 focus:outline-none"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
