import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    navigateToProduct,
  } = useShop();

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  if (!quickViewProduct) return null;

  const isFavorited = isInWishlist(quickViewProduct.id);

  const handleAdd = () => {
    addToCart(
      quickViewProduct,
      selectedSize,
      quickViewProduct.colors[selectedColorIndex]
    );
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-100 animate-in zoom-in-95 duration-200">
        <div className="relative grid grid-cols-1 sm:grid-cols-2">
          {/* Close Button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full text-neutral-400 hover:text-black shadow-md focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left: Image */}
          <div className="aspect-[3/4] bg-neutral-100 relative">
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {quickViewProduct.badge && (
              <span className="absolute top-4 left-4 text-[10px] font-extrabold uppercase tracking-wider bg-black text-white px-2.5 py-1 rounded-full">
                {quickViewProduct.badge}
              </span>
            )}
          </div>

          {/* Right: Info */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff4500]">
                {quickViewProduct.subcategory}
              </span>
              <h3 className="font-editorial text-2xl font-bold text-black leading-tight">
                {quickViewProduct.name}
              </h3>

              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-neutral-500 font-medium">{quickViewProduct.reviewsText}</span>
              </div>

              <div className="text-xl font-extrabold text-black">
                {formatPrice(quickViewProduct.price)}
              </div>

              <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                {quickViewProduct.description}
              </p>

              {/* Sizes */}
              <div>
                <span className="block text-xs font-semibold text-neutral-700 mb-1.5">Size</span>
                <div className="flex gap-1.5">
                  {quickViewProduct.sizes.slice(0, 5).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                        selectedSize === s
                          ? 'bg-black text-white'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <button
                onClick={handleAdd}
                className="w-full bg-black text-white text-xs font-bold py-3 rounded-full hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => {
                  navigateToProduct(quickViewProduct);
                  setQuickViewProduct(null);
                }}
                className="w-full text-center text-xs font-semibold text-neutral-600 hover:text-black py-1.5 underline"
              >
                View Full Product Specs & Reviews &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
