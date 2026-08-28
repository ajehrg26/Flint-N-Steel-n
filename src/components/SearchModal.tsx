import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, Clock, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ALL_PRODUCTS } from '../data/products';
import { Product } from '../types';

export const SearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    navigateToProduct,
    navigateToCategory,
    addToCart,
    formatPrice,
  } = useShop();

  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  // Filtered live results
  const searchResults = ALL_PRODUCTS.filter((product) => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return false;
    return (
      product.name.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      product.subcategory.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      (product.tagline && product.tagline.toLowerCase().includes(q))
    );
  });

  const suggestions = [
    'Daisy Shirt',
    'Rei Blue Jacket',
    'Rozz Jacket',
    'Molly Jacket',
    'PopStar Neon',
    'Gaby Half-Zipped',
    'Smith Sweatshirt',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addRecentSearch(inputValue.trim());
    }
  };

  const handleSelectProduct = (product: Product) => {
    addRecentSearch(product.name);
    navigateToProduct(product);
    setIsSearchOpen(false);
  };

  const handleSelectKeyword = (keyword: string) => {
    setInputValue(keyword);
    addRecentSearch(keyword);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-start justify-center p-4 sm:p-8">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-neutral-100 animate-in slide-in-from-top-4 duration-200 mt-6 sm:mt-12">
        {/* Search Input Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center gap-4 bg-white">
          <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" />
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search garments, jackets, shirts, styles..."
              className="w-full text-base sm:text-lg font-medium text-black placeholder:text-neutral-400 focus:outline-none bg-transparent"
            />
          </form>
          {inputValue && (
            <button
              onClick={() => setInputValue('')}
              className="text-xs font-semibold text-neutral-400 hover:text-black"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-8">
          {/* Live Search Results if typing */}
          {inputValue.trim() ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Search Results ({searchResults.length})
                </span>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {searchResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className="flex items-center space-x-3 p-3 rounded-2xl border border-neutral-100 hover:border-black hover:bg-neutral-50 transition-all cursor-pointer group"
                    >
                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-[#ff4500]">
                          {prod.subcategory}
                        </span>
                        <h4 className="font-bold text-sm text-black truncate group-hover:text-neutral-700">
                          {prod.name}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-extrabold text-xs text-black">
                            {formatPrice(prod.price)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(prod);
                            }}
                            className="text-[11px] font-semibold text-black bg-neutral-200 hover:bg-black hover:text-white px-2.5 py-1 rounded-full transition-colors flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-neutral-400 space-y-2">
                  <p className="text-sm font-semibold text-black">No products match "{inputValue}"</p>
                  <p className="text-xs">Try searching for "Jacket", "Shirt", or "Sweatshirt"</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Popular Suggestions */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                  Trending Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((sug) => (
                    <button
                      key={sug}
                      onClick={() => handleSelectKeyword(sug)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 hover:bg-black hover:text-white transition-all flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#ff4500]" />
                      <span>{sug}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs font-semibold text-neutral-400 hover:text-black"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((rec) => (
                      <button
                        key={rec}
                        onClick={() => handleSelectKeyword(rec)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors flex items-center space-x-1.5"
                      >
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>{rec}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Quick Shortcuts */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                  Browse by Category
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { name: 'Men', cat: 'men' },
                    { name: 'Women', cat: 'women' },
                    { name: 'Kids', cat: 'kids' },
                    { name: 'Featured Drops', cat: 'featured' },
                  ].map((item) => (
                    <button
                      key={item.cat}
                      onClick={() => {
                        navigateToCategory(item.cat);
                        setIsSearchOpen(false);
                      }}
                      className="p-3 rounded-2xl bg-neutral-50 hover:bg-black hover:text-white text-black text-xs font-bold transition-all text-left flex items-center justify-between border border-neutral-100"
                    >
                      <span>{item.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
