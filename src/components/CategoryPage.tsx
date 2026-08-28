import React, { useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, Sparkles, Filter } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ALL_PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

export const CategoryPage: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    filterState,
    setFilterState,
    resetFilters,
    formatPrice,
  } = useShop();

  const categoryTitles: Record<string, { title: string; subtitle: string }> = {
    all: {
      title: 'Full Seasonal Catalog',
      subtitle: 'Explore the complete universe of LOCO garments and limited drop pieces.',
    },
    men: {
      title: "Men's Modern Wardrobe",
      subtitle: 'Technical windbreakers, heavy selvedge denim, and washed heavyweight fleece.',
    },
    women: {
      title: "Women's Collection",
      subtitle: 'Sculptural jackets, relaxed botanical shirts, and fluid linen trousers.',
    },
    kids: {
      title: 'Junior LOCO Drop',
      subtitle: 'Ultra-warm colorblock puffers and play-proof skate hoodies for young icons.',
    },
    featured: {
      title: 'Featured Campaigns',
      subtitle: 'High-voltage streetwear statements and experimental color palettes.',
    },
    'new-arrivals': {
      title: 'New Arrivals',
      subtitle: 'Fresh drops straight from the LOCO design studio. Catch them before they sell out.',
    },
    'best-sellers': {
      title: 'Best Sellers',
      subtitle: 'Our most-loved silhouettes with thousands of verified 5-star community reviews.',
    },
  };

  const currentMeta = categoryTitles[selectedCategory] || {
    title: `${selectedCategory.toUpperCase()} COLLECTION`,
    subtitle: 'Curated fashion pieces engineered for contemporary style.',
  };

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter((product) => {
      // Category match
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'new-arrivals' && !product.isNewArrival) return false;
        if (selectedCategory === 'best-sellers' && !product.isBestSeller) return false;
        if (
          selectedCategory !== 'new-arrivals' &&
          selectedCategory !== 'best-sellers' &&
          product.category !== selectedCategory &&
          !(selectedCategory === 'featured' && product.isFeatured)
        ) {
          return false;
        }
      }

      // Price filter
      if (product.price > filterState.priceRange[1]) return false;

      // Size filter
      if (
        filterState.sizes.length > 0 &&
        !product.sizes.some((s) => filterState.sizes.includes(s))
      ) {
        return false;
      }

      // Color filter
      if (
        filterState.colors.length > 0 &&
        !product.colors.some((c) => filterState.colors.includes(c.name))
      ) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'price-low') return a.price - b.price;
      if (filterState.sortBy === 'price-high') return b.price - a.price;
      if (filterState.sortBy === 'rating') return b.rating - a.rating;
      if (filterState.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return 0;
    });
  }, [selectedCategory, filterState]);

  const toggleSizeFilter = (size: string) => {
    setFilterState((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
  };

  const toggleColorFilter = (colorName: string) => {
    setFilterState((prev) => {
      const exists = prev.colors.includes(colorName);
      return {
        ...prev,
        colors: exists ? prev.colors.filter((c) => c !== colorName) : [...prev.colors, colorName],
      };
    });
  };

  const availableColors = [
    'Pure White',
    'Onyx Black',
    'Warm Biscuit Tan',
    'Electric Lime',
    'Cobalt Blue',
    'Crisp Off-White',
    'Terracotta Rust',
  ];

  const hasActiveFilters =
    filterState.sizes.length > 0 ||
    filterState.colors.length > 0 ||
    filterState.priceRange[1] < 200 ||
    filterState.sortBy !== 'featured';

  return (
    <div id="category-page-view" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Category Header */}
      <div className="mb-10 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-widest text-[#ff4500]">
          LOCO Collection Edit
        </span>
        <h1
          id="category-title"
          className="font-editorial text-3xl sm:text-5xl font-extrabold tracking-tight text-black mt-1"
        >
          {currentMeta.title}
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 max-w-2xl mt-2">
          {currentMeta.subtitle}
        </p>

        {/* Category switcher pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'men', label: 'Men' },
            { id: 'women', label: 'Women' },
            { id: 'kids', label: 'Kids' },
            { id: 'featured', label: 'Featured' },
            { id: 'new-arrivals', label: 'New Arrivals' },
            { id: 'best-sellers', label: 'Best Sellers' },
          ].map((cat) => (
            <button
              key={cat.id}
              id={`cat-pill-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 focus:outline-none ${
                selectedCategory === cat.id
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout with Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filter Column */}
        <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-neutral-100 shadow-xs h-fit">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div className="flex items-center space-x-2 font-bold text-sm text-black">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#ff4500] hover:underline font-semibold"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
              <span>Max Price</span>
              <span>{formatPrice(filterState.priceRange[1])}</span>
            </div>
            <input
              type="range"
              min="30"
              max="200"
              step="5"
              value={filterState.priceRange[1]}
              onChange={(e) =>
                setFilterState((prev) => ({
                  ...prev,
                  priceRange: [0, Number(e.target.value)],
                }))
              }
              className="w-full accent-black cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
              <span>{formatPrice(30)}</span>
              <span>{formatPrice(200)}</span>
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-100">
            <span className="block text-xs font-bold text-neutral-800">Size</span>
            <div className="grid grid-cols-4 gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSizeFilter(s)}
                  className={`py-2 text-xs font-bold rounded-xl transition-all ${
                    filterState.sizes.includes(s)
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-100">
            <span className="block text-xs font-bold text-neutral-800">Color Palette</span>
            <div className="flex flex-wrap gap-1.5">
              {availableColors.map((colorName) => {
                const active = filterState.colors.includes(colorName);
                return (
                  <button
                    key={colorName}
                    onClick={() => toggleColorFilter(colorName)}
                    className={`text-[11px] px-3 py-1.5 rounded-full font-medium transition-all ${
                      active
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {colorName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Grid Column: Sort Bar + Products */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-100">
            <p className="text-xs sm:text-sm text-neutral-600 font-medium">
              Showing <strong className="text-black">{filteredProducts.length}</strong> styles
            </p>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-neutral-500 font-medium">Sort by:</span>
              <select
                id="sort-select"
                value={filterState.sortBy}
                onChange={(e) =>
                  setFilterState((prev) => ({
                    ...prev,
                    sortBy: e.target.value as any,
                  }))
                }
                className="text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-black px-3.5 py-2 rounded-xl border-none focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured / Curated</option>
                <option value="newest">Newest Drops</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {filterState.sizes.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center text-xs bg-black text-white px-3 py-1 rounded-full gap-1.5"
                >
                  <span>Size: {s}</span>
                  <button onClick={() => toggleSizeFilter(s)}>✕</button>
                </span>
              ))}
              {filterState.colors.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center text-xs bg-black text-white px-3 py-1 rounded-full gap-1.5"
                >
                  <span>{c}</span>
                  <button onClick={() => toggleColorFilter(c)}>✕</button>
                </span>
              ))}
              {filterState.priceRange[1] < 200 && (
                <span className="inline-flex items-center text-xs bg-black text-white px-3 py-1 rounded-full gap-1.5">
                  <span>Under {formatPrice(filterState.priceRange[1])}</span>
                  <button
                    onClick={() =>
                      setFilterState((p) => ({ ...p, priceRange: [0, 200] }))
                    }
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div
              id="catalog-product-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant={
                    product.isBestSeller && selectedCategory === 'best-sellers'
                      ? 'framed-warm'
                      : 'standard'
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-neutral-100 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-black">No matching styles found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try widening your price range or clearing active size and color filters.
              </p>
              <button
                onClick={resetFilters}
                className="bg-black text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-neutral-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
