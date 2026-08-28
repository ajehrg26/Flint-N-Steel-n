import React, { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ALL_PRODUCTS } from '../data/products';
import { useShop } from '../context/ShopContext';

export const NewArrivalSection: React.FC = () => {
  const { navigateToCategory } = useShop();
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter new arrival products
  const newArrivals = [
    ALL_PRODUCTS.find((p) => p.id === 'daisy-shirt') || ALL_PRODUCTS[0],
    ALL_PRODUCTS.find((p) => p.id === 'rei-blue-jacket') || ALL_PRODUCTS[1],
  ];

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="new-arrival-section" className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          id="new-arrival-title"
          className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-black m-0"
        >
          New Arrival
        </h3>

        <div className="flex items-center gap-2">
          {/* Carousel arrows */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              id="new-arrival-prev-btn"
              onClick={() => scrollCarousel('left')}
              className="w-7 h-7 rounded-full border border-gray-200 hover:border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors focus:outline-none"
              aria-label="Previous items"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              id="new-arrival-next-btn"
              onClick={() => scrollCarousel('right')}
              className="w-7 h-7 rounded-full border border-gray-200 hover:border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors focus:outline-none"
              aria-label="Next items"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Minimal Editorial See All pill */}
          <button
            id="new-arrival-see-all-btn"
            onClick={() => navigateToCategory('new-arrivals')}
            className="text-[10px] font-bold uppercase tracking-widest border border-black rounded-full px-4 py-1 hover:bg-black hover:text-white transition-colors focus:outline-none"
          >
            See All
          </button>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div
        ref={carouselRef}
        id="new-arrival-grid"
        className="grid grid-cols-2 gap-3.5 sm:gap-4"
      >
        {newArrivals.map((product) => (
          <div key={product.id} className="min-w-0">
            <ProductCard product={product} variant="standard" />
          </div>
        ))}
      </div>
    </section>
  );
};
