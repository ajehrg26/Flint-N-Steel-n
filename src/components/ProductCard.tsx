import React from 'react';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
  variant?: 'standard' | 'framed-warm';
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'standard',
}) => {
  const {
    navigateToProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
  } = useShop();

  const isFavorited = isInWishlist(product.id);

  // Gradient presets for framed-warm variant matching the reference
  const getFramedGradient = (style?: string) => {
    switch (style) {
      case 'warm-sunset':
        return 'from-[#f97316] via-[#fb923c] to-[#fed7aa]';
      case 'fire-orange':
        return 'from-[#ef4444] via-[#f97316] to-[#fbbf24]';
      case 'amber-glow':
        return 'from-[#ea580c] via-[#f59e0b] to-[#fde68a]';
      case 'coral-pop':
        return 'from-[#e11d48] via-[#fb7185] to-[#fecdd3]';
      default:
        return 'from-[#ea580c] via-[#f97316] to-[#fed7aa]';
    }
  };

  const handleCardClick = () => {
    navigateToProduct(product);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  if (variant === 'framed-warm') {
    return (
      <div
        id={`bestseller-card-${product.id}`}
        onClick={handleCardClick}
        className="group cursor-pointer flex flex-col transition-all duration-300 select-none"
      >
        {/* Rounded rectangular frame with warm red/orange background */}
        <div
          className={`relative aspect-[3/4] w-full rounded-xl sm:rounded-2xl bg-gradient-to-b ${getFramedGradient(
            product.bgGradientStyle
          )} p-2.5 sm:p-3 overflow-hidden shadow-xs group-hover:shadow-lg transition-all duration-300 flex items-center justify-center`}
        >
          {/* Wishlist button */}
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={handleWishlistToggle}
            aria-label="Add to wishlist"
            className="absolute top-2.5 right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-700 hover:text-black hover:bg-white transition-all shadow-xs focus:outline-none"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-700'
              }`}
            />
          </button>

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 z-20 text-[9px] font-extrabold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full shadow-xs">
              {product.badge}
            </span>
          )}

          {/* Fashion Model Image inside warm frame */}
          <div className="relative w-full h-full rounded-lg sm:rounded-xl overflow-hidden flex items-center justify-center bg-white/30">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Hover Action Bar */}
          <div className="absolute inset-x-2.5 bottom-2.5 z-20 flex items-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button
              id={`quick-add-${product.id}`}
              onClick={handleQuickAdd}
              className="flex-1 bg-black text-white text-[11px] font-bold py-2 px-2.5 rounded-full hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1 shadow-md focus:outline-none"
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Add</span>
            </button>
            <button
              id={`quick-view-${product.id}`}
              onClick={handleQuickView}
              aria-label="Quick preview"
              className="w-7 h-7 bg-white text-black rounded-full flex items-center justify-center hover:bg-neutral-100 shadow-md focus:outline-none transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-neutral-800" />
            </button>
          </div>
        </div>

        {/* Product Info below image */}
        <div className="mt-2.5 space-y-0.5 text-left">
          <div className="flex items-baseline justify-between gap-1">
            <h3 className="font-bold text-xs sm:text-[13px] text-black group-hover:text-neutral-600 transition-colors leading-tight truncate">
              {product.name}
            </h3>
            <span className="font-black text-xs sm:text-[13px] text-black shrink-0">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Star Rating & Review Count */}
          <div className="flex items-center space-x-1 text-[10px] text-neutral-500">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 fill-yellow-400 text-yellow-400 ${
                    i >= Math.floor(product.rating) ? 'opacity-30' : ''
                  }`}
                />
              ))}
            </div>
            <span className="font-medium text-[10px] text-neutral-500">{product.reviewsText}</span>
          </div>
        </div>
      </div>
    );
  }

  // Standard Variant (New Arrivals & Catalog Grid)
  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group cursor-pointer flex flex-col select-none"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center p-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out rounded-lg"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-std-${product.id}`}
          onClick={handleWishlistToggle}
          aria-label="Add to wishlist"
          className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-700 hover:text-black hover:bg-white transition-all shadow-xs focus:outline-none"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-colors ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-700'
            }`}
          />
        </button>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 z-20 text-[9px] font-extrabold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded-full shadow-xs">
            {product.badge}
          </span>
        )}

        {/* Quick actions on hover */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-20 flex items-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            id={`std-quick-add-${product.id}`}
            onClick={handleQuickAdd}
            className="flex-1 bg-black text-white text-[11px] font-bold py-2 px-2.5 rounded-full hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1 shadow-md focus:outline-none"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Add</span>
          </button>
          <button
            id={`std-quick-view-${product.id}`}
            onClick={handleQuickView}
            aria-label="Quick preview"
            className="w-7 h-7 bg-white text-black rounded-full flex items-center justify-center hover:bg-neutral-100 shadow-md focus:outline-none transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-800" />
          </button>
        </div>
      </div>

      {/* Product Metadata */}
      <div className="mt-2.5 space-y-0.5 text-left">
        <div className="flex items-baseline justify-between gap-1">
          <h3 className="font-bold text-xs sm:text-[13px] text-black group-hover:text-neutral-600 transition-colors leading-tight truncate">
            {product.name}
          </h3>
          <span className="font-black text-xs sm:text-[13px] text-black shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Star Rating & Reviews */}
        <div className="flex items-center space-x-1 text-[10px] text-neutral-500">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-2.5 h-2.5 fill-yellow-400 text-yellow-400 ${
                  i >= Math.floor(product.rating) ? 'opacity-30' : ''
                }`}
              />
            ))}
          </div>
          <span className="font-medium text-[10px] text-neutral-500">{product.reviewsText}</span>
        </div>
      </div>
    </div>
  );
};
