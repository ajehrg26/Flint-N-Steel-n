import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    clearCart,
    cartSubtotal,
    formatPrice,
    setActivePage,
  } = useShop();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');

  // Form states
  const [email, setEmail] = useState('style.enthusiast@example.com');
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Morgan');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('New York');
  const [postalCode, setPostalCode] = useState('10001');
  const [country, setCountry] = useState('United States');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'google'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  if (!isCheckoutOpen) return null;

  const shippingCost = shippingMethod === 'express' ? 14.0 : cartSubtotal >= 75 ? 0 : 9.0;
  const tax = cartSubtotal * 0.08;
  const grandTotal = cartSubtotal + shippingCost + tax;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedOrder = `LC-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(generatedOrder);
      setStep('confirmation');
      clearCart();

      // Launch celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff4500', '#ff8c00', '#ffd700', '#000000'],
        });
      } catch (err) {
        console.error(err);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-[#fafafa]">
          <div className="flex items-center space-x-2">
            <span className="font-brand text-2xl font-extrabold tracking-tighter text-black">LOCO</span>
            <span className="text-neutral-300">|</span>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              {step === 'confirmation' ? 'Order Confirmed' : 'Secure Checkout'}
            </span>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on step */}
        <div className="p-6 sm:p-8">
          {/* STEP 1: Shipping Details */}
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-black mb-1">1. Contact & Delivery Address</h3>
                <p className="text-xs text-neutral-500">Where should we deliver your LOCO package?</p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Speed Selector */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="block font-bold text-xs text-neutral-800">Delivery Speed</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setShippingMethod('standard')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      shippingMethod === 'standard'
                        ? 'border-black bg-neutral-50 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-black">Standard Courier</span>
                      <span className="text-xs font-bold text-emerald-700">
                        {cartSubtotal >= 75 ? 'FREE' : formatPrice(9.0)}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500 mt-1">2-4 Business Days</span>
                  </div>

                  <div
                    onClick={() => setShippingMethod('express')}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      shippingMethod === 'express'
                        ? 'border-black bg-neutral-50 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-black">Next-Day Priority</span>
                      <span className="text-xs font-bold text-black">{formatPrice(14.0)}</span>
                    </div>
                    <span className="text-[11px] text-neutral-500 mt-1">Guaranteed 24-Hour Express</span>
                  </div>
                </div>
              </div>

              {/* Continue button */}
              <button
                type="submit"
                className="w-full bg-black text-white hover:bg-neutral-800 text-sm font-bold py-3.5 rounded-full transition-all flex items-center justify-center space-x-2"
              >
                <span>Continue to Payment</span>
                <span className="text-xs opacity-75">({formatPrice(grandTotal)})</span>
              </button>
            </form>
          )}

          {/* STEP 2: Payment */}
          {step === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-black">2. Payment & Authorization</h3>
                  <p className="text-xs text-neutral-500">All transactions are encrypted with 256-bit SSL.</p>
                </div>
                <button
                  onClick={() => setStep('details')}
                  className="text-xs font-semibold text-neutral-500 hover:text-black flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'card'
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'apple'
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('google')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'google'
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Google Pay</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3 text-xs bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4242 •••• •••• 4242"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none bg-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">CVC / Security Code</label>
                      <input
                        type="text"
                        defaultValue="888"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary Recap */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Items ({cart.length})</span>
                  <span className="font-semibold text-black">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Delivery</span>
                  <span className="font-semibold text-black">
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Estimated Sales Tax</span>
                  <span className="font-semibold text-black">{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-black pt-2 border-t border-neutral-200">
                  <span>Grand Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Authorize Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-black text-white hover:bg-neutral-800 disabled:bg-neutral-400 text-sm font-bold py-4 rounded-full transition-all flex items-center justify-center space-x-2 shadow-xl"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment...
                  </span>
                ) : (
                  <span>Authorize & Pay {formatPrice(grandTotal)}</span>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: Order Confirmation */}
          {step === 'confirmation' && (
            <div className="text-center py-6 space-y-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="font-editorial text-2xl sm:text-3xl font-extrabold text-black">
                  Thank You for Your Order!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600">
                  Order <strong>#{orderNumber}</strong> has been received and sent to our fulfillment studio.
                </p>
                <p className="text-xs text-neutral-400">
                  A receipt & delivery tracking confirmation has been sent to <strong>{email}</strong>.
                </p>
              </div>

              <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-100 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between font-medium">
                  <span className="text-neutral-500">Estimated Delivery:</span>
                  <span className="font-bold text-black">
                    {shippingMethod === 'express' ? 'Tomorrow by 6:00 PM' : '3-4 Business Days'}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-neutral-500">Shipping Address:</span>
                  <span className="font-bold text-black">{address}, {city}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-neutral-500">Payment Status:</span>
                  <span className="text-emerald-700 font-bold">Paid in Full ({formatPrice(grandTotal)})</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setActivePage('home');
                  }}
                  className="bg-black text-white text-xs font-bold px-8 py-3.5 rounded-full hover:bg-neutral-800 transition-colors shadow-md"
                >
                  Continue Exploring LOCO
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
