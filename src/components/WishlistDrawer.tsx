import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    addToCart,
    formatPrice,
    navigateToProduct,
  } = useShop();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsWishlistOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="wishlist-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="font-editorial text-xl font-bold text-black">
                Saved Wishlist ({wishlist.length})
              </h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-neutral-100">
            {wishlist.length > 0 ? (
              wishlist.map((product) => (
                <div key={product.id} className="pt-4 first:pt-0 flex space-x-4">
                  {/* Item Image */}
                  <div
                    onClick={() => {
                      navigateToProduct(product);
                      setIsWishlistOpen(false);
                    }}
                    className="w-20 h-24 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 cursor-pointer border border-neutral-100"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4
                          onClick={() => {
                            navigateToProduct(product);
                            setIsWishlistOpen(false);
                          }}
                          className="font-semibold text-sm text-black hover:text-neutral-600 cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(product)}
                          className="text-neutral-400 hover:text-red-500 p-1 focus:outline-none transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500">{product.subcategory}</p>
                      <p className="text-sm font-bold text-black mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(product);
                        toggleWishlist(product);
                      }}
                      className="w-full bg-black text-white text-xs font-semibold py-2 rounded-full hover:bg-neutral-800 transition-colors flex items-center justify-center space-x-1.5 mt-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-black">Your wishlist is empty</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Click the heart icon on any garment to save it for future curation.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="bg-black text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-neutral-800 transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {wishlist.length > 0 && (
            <div className="p-6 border-t border-neutral-100 bg-neutral-50/70">
              <button
                onClick={() => {
                  wishlist.forEach((p) => addToCart(p));
                  setIsWishlistOpen(false);
                }}
                className="w-full bg-black text-white text-sm font-bold py-3.5 rounded-full hover:bg-neutral-800 transition-all flex items-center justify-center space-x-2"
              >
                <span>Move All to Bag</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
