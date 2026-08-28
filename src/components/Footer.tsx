import React, { useState } from 'react';
import { ArrowRight, Instagram, Twitter, Youtube, Music, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { navigateToCategory, showToast } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      showToast(
        'Welcome to LOCO Club',
        '10% off your next order code (LOCO10) has been activated.',
        'success'
      );
      setNewsletterEmail('');
    }
  };

  return (
    <footer id="main-footer" className="bg-[#111111] text-white pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Newsletter & Brand statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-neutral-800">
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center space-x-1.5">
              <span className="font-brand text-4xl font-extrabold tracking-tighter text-white">
                LOCO
              </span>
              <span className="w-2 h-2 rounded-full bg-[#ff4500]" />
            </div>
            <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
              Loco brings something new this season, specially designed for every style you need. Reimagining everyday streetwear with bold palettes and tactile craft.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#ff4500]">
              Join The Loco Syndicate
            </h4>
            <p className="text-xs text-neutral-400">
              Receive secret drop alerts, VIP early access, and 10% off your inaugural order.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 text-xs px-4 py-3 rounded-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:border-white"
              />
              <button
                type="submit"
                className="bg-white text-black hover:bg-neutral-200 text-xs font-bold px-6 py-3 rounded-full transition-colors flex items-center space-x-1 flex-shrink-0"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Links Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Shop */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Collections</h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button
                  onClick={() => navigateToCategory('men')}
                  className="hover:text-white transition-colors"
                >
                  Men's Outerwear & Denim
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('women')}
                  className="hover:text-white transition-colors"
                >
                  Women's Tailored Tops & Skirts
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('kids')}
                  className="hover:text-white transition-colors"
                >
                  Junior LOCO Streetwear
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('new-arrivals')}
                  className="hover:text-white transition-colors"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('best-sellers')}
                  className="hover:text-white transition-colors"
                >
                  Best Sellers (3k+ Reviews)
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Customer Studio</h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a href="#hero-section" className="hover:text-white transition-colors">
                  Complimentary Express Shipping
                </a>
              </li>
              <li>
                <a href="#hero-section" className="hover:text-white transition-colors">
                  30-Day Hassle-Free Returns
                </a>
              </li>
              <li>
                <a href="#hero-section" className="hover:text-white transition-colors">
                  Garment Care & Sizing Matrix
                </a>
              </li>
              <li>
                <a href="#hero-section" className="hover:text-white transition-colors">
                  Track Package In Realtime
                </a>
              </li>
            </ul>
          </div>

          {/* Philosophy */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">About LOCO</h5>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a href="#editorial-brand-section" className="hover:text-white transition-colors">
                  The LOCO Manifesto
                </a>
              </li>
              <li>
                <a href="#editorial-brand-section" className="hover:text-white transition-colors">
                  100% GOTS Organic Cotton
                </a>
              </li>
              <li>
                <a href="#editorial-brand-section" className="hover:text-white transition-colors">
                  Zero Deadstock Initiative
                </a>
              </li>
              <li>
                <a href="#editorial-brand-section" className="hover:text-white transition-colors">
                  Studio Flagship Locations
                </a>
              </li>
            </ul>
          </div>

          {/* Community & Socials */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Community</h5>
            <p className="text-neutral-400 text-xs">
              Tag <strong>#FeelTheVibes</strong> and <strong>@LocoFashion</strong> to be featured on our official runway feed.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-white hover:text-black flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-white hover:text-black flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <Music className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-white hover:text-black flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} LOCO Studio Inc. All rights reserved. Designed for Gen-Z style lovers.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-neutral-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-neutral-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-neutral-300 cursor-pointer">Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
