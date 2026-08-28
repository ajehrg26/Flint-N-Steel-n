import React from 'react';
import { ArrowUpRight, ShieldCheck, Truck, RefreshCw, Sparkles, Award } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const EditorialFeatureSection: React.FC = () => {
  const { navigateToCategory } = useShop();

  const brandPerks = [
    {
      icon: Truck,
      title: 'Complimentary Express',
      description: 'Free courier delivery on all orders over $75 with carbon-neutral tracking.',
    },
    {
      icon: RefreshCw,
      title: '30-Day Easy Returns',
      description: 'Hassle-free doorstep exchanges and returns with pre-paid labels.',
    },
    {
      icon: ShieldCheck,
      title: 'Ethical Craftsmanship',
      description: 'GOTS-certified organic cottons and traceable European workshops.',
    },
    {
      icon: Award,
      title: 'LOCO Signature Guarantee',
      description: 'Engineered seam reinforcements and lifetime hardware repair support.',
    },
  ];

  const categoryCards = [
    {
      title: 'WOMEN',
      subtitle: 'Sculpted Silhouettes & Cropped Outerwear',
      tag: 'New Season',
      category: 'women',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'MEN',
      subtitle: 'Technical Layers & Heavyweight Cotton Fleece',
      tag: 'Essential Edit',
      category: 'men',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
    },
    {
      title: 'KIDS',
      subtitle: 'Playful Colorblock Puffers & Streetwear',
      tag: 'Junior Drop',
      category: 'kids',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <section id="editorial-brand-section" className="py-16 sm:py-20 w-full bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Visual Category Exploration Grid */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ff4500]">
                Explore Collections
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-black mt-1">
                Shop By Atmosphere
              </h2>
            </div>
            <p className="text-sm text-neutral-500 max-w-md mt-2 sm:mt-0">
              Curated styling universes designed to effortlessly layer into your daily rotation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryCards.map((cat, idx) => (
              <div
                key={idx}
                id={`category-card-${cat.category}`}
                onClick={() => navigateToCategory(cat.category)}
                className="group relative h-[380px] sm:h-[440px] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-6 sm:p-8 text-white"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />

                <div className="relative z-10 space-y-2">
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                    {cat.tag}
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                    {cat.subtitle}
                  </p>
                  <div className="pt-2">
                    <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-white group-hover:text-yellow-300 transition-colors">
                      Discover Collection &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Big Editorial Banner: "THE LOCO MANIFESTO" */}
        <div className="relative rounded-3xl bg-black text-white p-8 sm:p-14 overflow-hidden border border-neutral-800 shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-gradient-to-br from-[#ff4500]/30 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#ff4500]">
              <Sparkles className="w-4 h-4" />
              <span>LOCO Studio Edition</span>
            </div>
            
            <h3 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
              Engineered for the fearless generation.
            </h3>
            
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              We reject fast disposable fashion. Every silhouette in the LOCO laboratory is developed through heavy-gauge textiles, functional modularity, and high-saturation dyes made to endure.
            </p>
            
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigateToCategory('featured')}
                className="bg-white text-black hover:bg-neutral-200 text-sm font-bold px-7 py-3 rounded-full transition-colors flex items-center space-x-2 shadow-lg focus:outline-none"
              >
                <span>Read The Lookbook</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Brand Perks / Trust Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-neutral-200">
          {brandPerks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl bg-white border border-neutral-100 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0 text-black">
                  <Icon className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black">{perk.title}</h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{perk.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
