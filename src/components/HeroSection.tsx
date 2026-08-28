import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ALL_PRODUCTS } from '../data/products';

export const HeroSection: React.FC = () => {
  const { navigateToCategory, navigateToProduct } = useShop();
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      id: 'slide-1',
      title: 'FEEL THE VIBES',
      heading: 'Get ready for new\nseason with Loco',
      subheading: 'Loco brings something new this season, specially designed for every style you need.',
      badgeText: 'SEASON 2026',
      // High fashion model in vibrant yellow jacket
      modelImage: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop',
      bgGradient: 'from-[#ff4112] via-[#ff6a00] to-[#ff9100]',
      floatingCard1: {
        product: ALL_PRODUCTS.find((p) => p.id === 'daisy-shirt') || ALL_PRODUCTS[0],
        title: 'Daisy Shirt',
        price: '$58.00',
        badge: 'New Arrival',
        image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=300&auto=format&fit=crop',
      },
      floatingCard2: {
        product: ALL_PRODUCTS.find((p) => p.id === 'rei-blue-jacket') || ALL_PRODUCTS[1],
        title: 'Rei Blue Jacket',
        price: '$67.00',
        badge: 'New Arrival',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=300&auto=format&fit=crop',
      },
    },
    {
      id: 'slide-2',
      title: 'STREET ATTITUDE',
      heading: 'High Energy\nSummer Essentials',
      subheading: 'Engineered lightweight garments and vivid statements tailored for urban mobility.',
      badgeText: 'LIMITED DROP',
      modelImage: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
      bgGradient: 'from-[#e11d48] via-[#ea580c] to-[#f59e0b]',
      floatingCard1: {
        product: ALL_PRODUCTS.find((p) => p.id === 'popstar-neon-jacket') || ALL_PRODUCTS[3],
        title: 'PopStar Neon',
        price: '$70.00',
        badge: 'Trending',
        image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=300&auto=format&fit=crop',
      },
      floatingCard2: {
        product: ALL_PRODUCTS.find((p) => p.id === 'molly-jacket') || ALL_PRODUCTS[2],
        title: 'Molly Jacket',
        price: '$48.00',
        badge: 'Best Seller',
        image: 'https://lh3.googleusercontent.com/d/1MwSm6Ie9cMaW9gSZV9C7y68uqvoSYveF',
      },
    },
    {
      id: 'slide-3',
      title: 'ICONIC SILHOUETTE',
      heading: 'Sculpted Layers\nRefined Modernity',
      subheading: 'Clean proportions and tactile textures that celebrate timeless individual expression.',
      badgeText: 'STUDIO EDIT',
      modelImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
      bgGradient: 'from-[#c2410c] via-[#f97316] to-[#fbbf24]',
      floatingCard1: {
        product: ALL_PRODUCTS.find((p) => p.id === 'rozz-jacket') || ALL_PRODUCTS[2],
        title: 'Rozz Jacket',
        price: '$55.00',
        badge: 'New Arrival',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop',
      },
      floatingCard2: {
        product: ALL_PRODUCTS.find((p) => p.id === 'gaby-half-zipped') || ALL_PRODUCTS[4],
        title: 'Gaby Half-Zipped',
        price: '$45.00',
        badge: 'Best Seller',
        image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=300&auto=format&fit=crop',
      },
    },
  ];

  const current = heroSlides[activeSlide];

  return (
    <section id="hero-section" className="w-full flex flex-col shrink-0">
      {/* 1. Large Editorial Headline: "Feel the Vibes" */}
      <div className="h-[75px] sm:h-[90px] lg:h-[95px] flex items-center justify-center shrink-0 px-4 select-none">
        <h1
          id="hero-editorial-title"
          className="text-4xl sm:text-6xl lg:text-[70px] xl:text-[76px] font-black uppercase tracking-tighter leading-none m-0 text-center text-black"
        >
          {current.title}
        </h1>
      </div>

      {/* 2. Black Promotional Ticker Bar */}
      <div
        id="hero-scrolling-ticker"
        className="h-[26px] sm:h-[28px] bg-black flex items-center overflow-hidden whitespace-nowrap shrink-0 border-y border-neutral-900"
      >
        <div className="animate-marquee flex items-center gap-12 text-[11px] font-bold text-white uppercase tracking-widest">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 whitespace-nowrap">
              <span>Catch the style</span>
              <span className="text-[#ff4500] text-sm">✦</span>
              <span>New Arrivals Live</span>
              <span className="text-[#ff7b00] text-sm">✦</span>
              <span>Feel the vibes</span>
              <span className="text-[#ff4500] text-sm">✦</span>
              <span>Season 2026 Drop</span>
              <span className="text-[#ff7b00] text-sm">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Editorial Magazine Hero Banner */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3">
        <div
          id="hero-banner-card"
          className={`min-h-[360px] sm:min-h-[390px] lg:h-[390px] rounded-2xl sm:rounded-3xl bg-gradient-to-br ${current.bgGradient} relative overflow-hidden flex flex-col md:flex-row shrink-0 shadow-lg text-white transition-all duration-700`}
        >
          {/* Subtle noise/glow background layers */}
          <div className="absolute inset-0 bg-radial-at-t from-white/20 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Headline copy & Explore button */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-end relative z-10">
            <h2
              id="hero-tagline-heading"
              className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-tight mb-3 sm:mb-4 tracking-tight whitespace-pre-line"
            >
              {current.heading}
            </h2>

            <p className="text-white/85 text-xs sm:text-sm max-w-sm mb-5 sm:mb-6 font-medium leading-relaxed">
              {current.subheading}
            </p>

            <div className="flex items-center gap-3">
              <button
                id="hero-explore-items-btn"
                onClick={() => navigateToCategory('featured')}
                className="bg-black text-white hover:bg-neutral-900 px-7 sm:px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest w-fit shadow-md transition-all duration-200 flex items-center gap-2 group focus:outline-none"
              >
                <span>Explore items</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                id="hero-new-arrivals-btn"
                onClick={() => navigateToCategory('new-arrivals')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all border border-white/30 focus:outline-none"
              >
                New In
              </button>
            </div>
          </div>

          {/* Right Column: Model Centerpiece with Yellow Aura Card */}
          <div className="relative md:absolute right-4 lg:right-16 bottom-0 top-0 w-full md:w-96 flex items-end justify-center overflow-visible py-4 md:py-0">
            {/* White Aura Glow */}
            <div className="w-72 h-[120%] bg-white/20 rounded-t-full absolute bottom-0 blur-3xl pointer-events-none" />

            {/* Stylized Centerpiece Card */}
            <div className="relative z-20 w-56 sm:w-64 h-[280px] sm:h-[330px] lg:h-[360px] bg-yellow-400 rounded-[36px] sm:rounded-[40px] shadow-2xl flex items-center justify-center border-4 border-white/30 overflow-hidden group">
              {/* Background Watermark */}
              <span className="text-black/15 font-black text-8xl sm:text-9xl select-none absolute tracking-tighter">
                LOCO
              </span>

              {/* Model Photography Layer */}
              <img
                id="hero-model-image"
                src={current.modelImage}
                alt="Loco campaign model in yellow jacket"
                className="h-[105%] w-full object-cover object-top relative z-10 filter drop-shadow-xl transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Floating Product Card 1 (Top Left) */}
            <div
              id="hero-floating-card-1"
              onClick={() => navigateToProduct(current.floatingCard1.product)}
              className="absolute top-6 sm:top-10 left-2 sm:-left-8 bg-white p-2 rounded-xl shadow-xl w-24 sm:w-28 flex flex-col gap-1 border border-neutral-100 z-30 cursor-pointer hover:scale-105 transition-all duration-300 group"
            >
              <div className="w-full h-14 rounded-lg overflow-hidden bg-neutral-100">
                <img
                  src={current.floatingCard1.image}
                  alt={current.floatingCard1.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[8px] sm:text-[9px] font-bold text-red-500 uppercase tracking-wider">
                {current.floatingCard1.badge}
              </span>
              <p className="text-[10px] font-bold text-neutral-900 leading-tight truncate">
                {current.floatingCard1.title}
              </p>
              <p className="text-[10px] font-black text-black">
                {current.floatingCard1.price}
              </p>
            </div>

            {/* Floating Product Card 2 (Bottom Right) */}
            <div
              id="hero-floating-card-2"
              onClick={() => navigateToProduct(current.floatingCard2.product)}
              className="absolute bottom-8 sm:bottom-12 right-2 sm:-right-6 bg-white p-2 rounded-xl shadow-xl w-24 sm:w-28 flex flex-col gap-1 border border-neutral-100 z-30 cursor-pointer hover:scale-105 transition-all duration-300 group"
            >
              <div className="w-full h-14 rounded-lg overflow-hidden bg-neutral-100">
                <img
                  src={current.floatingCard2.image}
                  alt={current.floatingCard2.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-[8px] sm:text-[9px] font-bold text-red-500 uppercase tracking-wider">
                {current.floatingCard2.badge}
              </span>
              <p className="text-[10px] font-bold text-neutral-900 leading-tight truncate">
                {current.floatingCard2.title}
              </p>
              <p className="text-[10px] font-black text-black">
                {current.floatingCard2.price}
              </p>
            </div>
          </div>

          {/* Vertical Slide Indicators */}
          <div
            id="hero-pagination-indicators"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30"
          >
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                id={`hero-dot-${idx}`}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full focus:outline-none ${
                  activeSlide === idx
                    ? 'w-1 h-8 bg-white shadow-md'
                    : 'w-1 h-3 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
