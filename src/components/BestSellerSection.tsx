import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ALL_PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';

export const BestSellerSection: React.FC = () => {
  const { navigateToCategory, products } = useShop();

  // 3 Best Seller products for magazine split grid
  const bestSellers = [
    products.find((p) => p.id === 'molly-jacket') || products[3],
    products.find((p) => p.id === 'popstar-neon-jacket') || products[4],
    products.find((p) => p.id === 'gaby-half-zipped') || products[5],
  ];

  return (
    <section id="best-seller-section" className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          id="best-seller-title"
          className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-black m-0"
        >
          Best Seller
        </h3>

        <button
          id="best-seller-see-all-btn"
          onClick={() => navigateToCategory('best-sellers')}
          className="text-[10px] font-bold uppercase tracking-widest border border-black rounded-full px-4 py-1 hover:bg-black hover:text-white transition-colors focus:outline-none"
        >
          See All
        </button>
      </div>

      {/* Product Cards with Warm Red/Orange Framed Backgrounds */}
      <div
        id="best-seller-grid"
        className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4"
      >
        {bestSellers.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            variant="framed-warm"
          />
        ))}
      </div>
    </section>
  );
};
