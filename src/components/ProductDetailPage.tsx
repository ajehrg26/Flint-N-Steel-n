import React, { useState } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  ArrowLeft,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Sparkles,
  Share2,
  Ruler,
  MessageSquare,
  ChevronDown,
} from 'lucide-react';
import { Product, ProductColor } from '../types';
import { useShop } from '../context/ShopContext';
import { ALL_PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

interface ProductDetailPageProps {
  product: Product;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    formatPrice,
    setActivePage,
    setIsCheckoutOpen,
    showToast,
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Standard', hex: '#000000' }
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'reviews'>('details');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // New review state
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewsList, setReviewsList] = useState(product.reviewsList || []);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  // Related products
  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.isFeatured)
  ).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out the ${product.name} on LOCO!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Link Copied', 'Product link copied to clipboard.', 'info');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: `user-rev-${Date.now()}`,
      author: newReviewAuthor,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rating: newReviewRating,
      date: 'Just now',
      title: newReviewTitle || 'Verified LOCO Review',
      comment: newReviewComment,
      verified: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    setShowReviewForm(false);
    showToast('Review Published', 'Thank you for sharing your feedback!', 'success');
  };

  return (
    <div id="product-detail-view" className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 text-xs sm:text-sm text-neutral-500">
        <button
          onClick={() => setActivePage('home')}
          className="flex items-center space-x-2 text-neutral-800 hover:text-black font-semibold focus:outline-none transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-black font-medium">{product.name}</span>
        </div>
      </div>

      {/* Main Product Display (2 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left Column: Gallery (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails list */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[580px] pb-2 sm:pb-0 scrollbar-none">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                id={`product-thumb-${idx}`}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 focus:outline-none ${
                  selectedImageIndex === idx
                    ? 'border-black shadow-md scale-95'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

          {/* Large Hero Image */}
          <div className="relative flex-1 aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-100 shadow-sm border border-neutral-100 group">
            <img
              id="main-product-image"
              src={gallery[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            {/* Badges on main image */}
            {product.badge && (
              <span className="absolute top-4 left-4 z-10 text-xs font-extrabold uppercase tracking-wider bg-black text-white px-3.5 py-1.5 rounded-full shadow-md">
                {product.badge}
              </span>
            )}

            {/* Share & Wishlist quick actions */}
            <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
              <button
                id="product-wishlist-toggle"
                onClick={() => toggleWishlist(product)}
                aria-label="Save to wishlist"
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-800 hover:bg-white shadow-md transition-transform active:scale-90"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorited ? 'fill-red-500 text-red-500' : 'text-neutral-800'
                  }`}
                />
              </button>
              <button
                id="product-share-btn"
                onClick={handleShare}
                aria-label="Share product"
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-neutral-800 hover:bg-white shadow-md transition-transform active:scale-90"
              >
                <Share2 className="w-4 h-4 text-neutral-800" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Purchase Controls (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Tagline & Subcategory */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff4500]">
                {product.subcategory || 'Loco Seasonal Edit'}
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                In Stock & Ready to Ship
              </span>
            </div>

            {/* Product Title */}
            <h1
              id="pdp-title"
              className="font-editorial text-3xl sm:text-4xl font-extrabold tracking-tight text-black"
            >
              {product.name}
            </h1>

            {/* Rating & Reviews overview */}
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="font-bold text-black">{product.rating.toFixed(1)}</span>
              <span className="text-neutral-400">•</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-neutral-600 hover:text-black font-medium underline underline-offset-4"
              >
                {reviewsList.length > 0 ? `${reviewsList.length} Customer Reviews` : product.reviewsText}
              </button>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline space-x-3 pt-1">
              <span id="pdp-price" className="text-3xl font-extrabold text-black">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-600 leading-relaxed pt-1">
              {product.description}
            </p>

            {product.modelDescription && (
              <p className="text-xs text-neutral-500 italic bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                Fit Note: {product.modelDescription}
              </p>
            )}

            {/* Color Swatches */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 mb-2">
                <span>Color: <strong className="text-black">{selectedColor.name}</strong></span>
              </div>
              <div className="flex items-center space-x-3">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    id={`color-swatch-${c.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setSelectedColor(c)}
                    aria-label={`Select color ${c.name}`}
                    className={`relative w-8 h-8 rounded-full transition-all duration-200 focus:outline-none flex items-center justify-center ${
                      selectedColor.name === c.name
                        ? 'ring-2 ring-black ring-offset-2 scale-110'
                        : 'opacity-80 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selectedColor.name === c.name && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          c.hex.toLowerCase() === '#ffffff' || c.hex.toLowerCase() === '#fafafa'
                            ? 'text-black'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 mb-2">
                <span>Select Size</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-neutral-500 hover:text-black flex items-center space-x-1 underline underline-offset-2"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    id={`size-btn-${s}`}
                    onClick={() => setSelectedSize(s)}
                    className={`py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 focus:outline-none ${
                      selectedSize === s
                        ? 'bg-black text-white shadow-md'
                        : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-3 space-y-3">
              <div className="flex items-center space-x-3">
                {/* Quantity */}
                <div className="flex items-center border border-neutral-200 rounded-full bg-neutral-50 p-1">
                  <button
                    id="qty-minus"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-neutral-800 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-black">{quantity}</span>
                  <button
                    id="qty-plus"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-neutral-800 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  id="pdp-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 bg-black text-white hover:bg-neutral-800 text-sm font-bold py-3.5 px-6 rounded-full transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl focus:outline-none"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                id="pdp-buy-now-btn"
                onClick={handleBuyNow}
                className="w-full bg-[#ff4500] hover:bg-[#e03d00] text-white text-sm font-bold py-3.5 px-6 rounded-full transition-all duration-200 shadow-md focus:outline-none flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Instant Checkout</span>
              </button>
            </div>

            {/* Assurances */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-black flex-shrink-0" />
                <span>Free delivery over $75</span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-black flex-shrink-0" />
                <span>30-Day Hassle Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details & Specifications & Reviews Accordion/Tabs */}
      <div className="mt-16 pt-10 border-t border-neutral-200">
        <div className="flex items-center space-x-8 border-b border-neutral-200 pb-4 text-sm sm:text-base font-semibold">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2 transition-all duration-200 relative focus:outline-none ${
              activeTab === 'details' ? 'text-black' : 'text-neutral-400 hover:text-black'
            }`}
          >
            Garment Specifications
            {activeTab === 'details' && (
              <span className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-black" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-2 transition-all duration-200 relative focus:outline-none ${
              activeTab === 'shipping' ? 'text-black' : 'text-neutral-400 hover:text-black'
            }`}
          >
            Delivery & Sustainability
            {activeTab === 'shipping' && (
              <span className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-black" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-2 transition-all duration-200 relative focus:outline-none ${
              activeTab === 'reviews' ? 'text-black' : 'text-neutral-400 hover:text-black'
            }`}
          >
            Reviews ({reviewsList.length})
            {activeTab === 'reviews' && (
              <span className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-black" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <h4 className="font-bold text-black text-base">Material & Composition</h4>
                <p className="text-neutral-600 leading-relaxed">{product.details.material}</p>
                <h4 className="font-bold text-black text-base pt-2">Fit Profile</h4>
                <p className="text-neutral-600 leading-relaxed">{product.details.fit}</p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-black text-base">Garment Care Instructions</h4>
                <p className="text-neutral-600 leading-relaxed">{product.details.care}</p>
                <h4 className="font-bold text-black text-base pt-2">Country of Origin</h4>
                <p className="text-neutral-600 leading-relaxed">{product.details.origin}</p>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="max-w-3xl space-y-4 text-sm text-neutral-600 leading-relaxed">
              <h4 className="font-bold text-black text-base">Global Express Logistics</h4>
              <p>
                All orders are prepared and dispatched from our European fulfillment hub within 24 hours. Standard transit arrives within 2-4 business days. Tracked courier notification provided via SMS/Email.
              </p>
              <h4 className="font-bold text-black text-base pt-2">100% Recyclable Packaging</h4>
              <p>
                Every LOCO garment is packed in biodegradable, FSC-certified compostable mailers with zero single-use plastic films.
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-extrabold text-black">{product.rating.toFixed(1)}</div>
                  <div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500">Based on {reviewsList.length} verified ratings</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors focus:outline-none"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              </div>

              {/* Review Submission Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleAddReview}
                  className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm space-y-4 animate-in fade-in duration-200"
                >
                  <h4 className="font-bold text-black text-base">Share your thoughts with LOCO community</h4>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-neutral-700">Your Rating:</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="focus:outline-none p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newReviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Review Headline</label>
                      <input
                        type="text"
                        value={newReviewTitle}
                        onChange={(e) => setNewReviewTitle(e.target.value)}
                        placeholder="e.g. Exceptional fit & fabric"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Review</label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="How does the garment fit? What do you think about the fabric feel and stitching?"
                      className="w-full text-xs p-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-black"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-black text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-neutral-800 transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="w-8 h-8 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-bold text-black flex items-center gap-1.5">
                            <span>{rev.author}</span>
                            {rev.verified && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                                Verified Buyer
                              </span>
                            )}
                          </p>
                          <span className="text-[11px] text-neutral-400">{rev.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${
                              idx < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <h5 className="text-sm font-bold text-black pt-1">{rev.title}</h5>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      <div className="mt-16 pt-12 border-t border-neutral-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff4500]">
              Complete The Look
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-black mt-1">
              You May Also Like
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} variant="standard" />
          ))}
        </div>
      </div>

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-editorial text-xl font-bold text-black">LOCO Fit & Sizing Matrix</h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-neutral-600">
              Measurements are in inches (standard body measurements). If between sizes, size up for an oversized Gen-Z aesthetic.
            </p>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-100 text-black font-bold">
                    <th className="p-2.5 rounded-l-lg">Size</th>
                    <th className="p-2.5">Chest</th>
                    <th className="p-2.5">Waist</th>
                    <th className="p-2.5 rounded-r-lg">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700 font-medium">
                  <tr>
                    <td className="p-2.5 font-bold text-black">XS</td>
                    <td className="p-2.5">34-36"</td>
                    <td className="p-2.5">28-30"</td>
                    <td className="p-2.5">26.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-black">S</td>
                    <td className="p-2.5">36-38"</td>
                    <td className="p-2.5">30-32"</td>
                    <td className="p-2.5">27.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-black">M</td>
                    <td className="p-2.5">38-40"</td>
                    <td className="p-2.5">32-34"</td>
                    <td className="p-2.5">28.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-black">L</td>
                    <td className="p-2.5">41-43"</td>
                    <td className="p-2.5">35-37"</td>
                    <td className="p-2.5">29.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-black">XL</td>
                    <td className="p-2.5">44-46"</td>
                    <td className="p-2.5">38-40"</td>
                    <td className="p-2.5">30.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full bg-black text-white text-xs font-bold py-3 rounded-full hover:bg-neutral-800 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
