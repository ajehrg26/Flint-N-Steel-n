import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    formatPrice,
    setIsCheckoutOpen,
    navigateToProduct,
    showToast,
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCode, setAppliedCode] = useState('');

  if (!isCartOpen) return null;

  const freeShippingThreshold = 75;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const shippingCost = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 9.0;
  const finalTotal = cartSubtotal - discountAmount + shippingCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'LOCO10' || promoCode.trim().toUpperCase() === 'VIBES10') {
      setDiscountPercent(10);
      setAppliedCode(promoCode.trim().toUpperCase());
      showToast('Promo Code Applied', '10% discount applied to your order!', 'success');
      setPromoCode('');
    } else if (promoCode.trim().toUpperCase() === 'GENZ20') {
      setDiscountPercent(20);
      setAppliedCode('GENZ20');
      showToast('VIP Promo Applied', '20% VIP discount applied!', 'success');
      setPromoCode('');
    } else {
      showToast('Invalid Promo Code', 'Try using code "LOCO10" or "GENZ20"', 'info');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="font-editorial text-xl font-bold text-black">
                Shopping Bag ({cart.reduce((acc, item) => acc + item.quantity, 0)})
              </h2>
            </div>
            <button
              id="close-cart-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  You've unlocked Complimentary Express Delivery!
                </span>
              ) : (
                <span className="text-neutral-700">
                  Add <strong>{formatPrice(remainingForFreeShipping)}</strong> for Free Express Delivery
                </span>
              )}
              <span className="text-neutral-500 font-bold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-neutral-100">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex space-x-4">
                  {/* Item Image */}
                  <div
                    onClick={() => {
                      navigateToProduct(item.product);
                      setIsCartOpen(false);
                    }}
                    className="w-20 h-24 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 cursor-pointer border border-neutral-100"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4
                          onClick={() => {
                            navigateToProduct(item.product);
                            setIsCartOpen(false);
                          }}
                          className="font-semibold text-sm text-black hover:text-neutral-600 cursor-pointer line-clamp-1"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-red-500 p-1 focus:outline-none transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-neutral-500 mt-1">
                        <span>Size: <strong className="text-black">{item.size}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          {item.color.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-neutral-200 rounded-full bg-neutral-50 px-2 py-0.5 space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-xs font-bold text-neutral-600 hover:text-black w-4 text-center"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold text-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-xs font-bold text-neutral-600 hover:text-black w-4 text-center"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-extrabold text-sm text-black">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-black">Your bag is currently empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Explore our seasonal campaign drops and add your favorite silhouettes.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-black text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-neutral-50/70 space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code: LOCO10"
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-neutral-200 uppercase font-medium focus:outline-none focus:border-black bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>

              {appliedCode && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg font-medium">
                  <span>Code <strong>{appliedCode}</strong> applied ({discountPercent}% off)</span>
                  <button onClick={() => { setDiscountPercent(0); setAppliedCode(''); }} className="text-xs font-bold">✕</button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">{formatPrice(cartSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-black">
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-black pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="cart-checkout-btn"
                onClick={handleProceedToCheckout}
                className="w-full bg-black text-white hover:bg-neutral-800 text-sm font-bold py-3.5 px-6 rounded-full transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg focus:outline-none"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-neutral-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Guaranteed safe & secure encrypted checkout
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
