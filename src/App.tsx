/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { NewArrivalSection } from './components/NewArrivalSection';
import { BestSellerSection } from './components/BestSellerSection';
import { EditorialFeatureSection } from './components/EditorialFeatureSection';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CategoryPage } from './components/CategoryPage';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activePage, selectedProduct } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-[#111111] antialiased selection:bg-black selection:text-white">
      {/* Sticky Header Navigation */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            {/* 1. Hero Section ("FEEL THE VIBES" + Scrolling Ticker + Red/Orange Hero + Floating Cards) */}
            <HeroSection />

            {/* 2. Magazine Editorial Split Showcase (New Arrival + Best Seller) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full flex flex-col lg:flex-row gap-8 lg:gap-10">
              <div className="lg:w-5/12">
                <NewArrivalSection />
              </div>
              <div className="lg:w-7/12">
                <BestSellerSection />
              </div>
            </div>

            {/* 3. Additional Editorial & Shopping Brand Sections */}
            <EditorialFeatureSection />
          </>
        )}

        {activePage === 'category' && <CategoryPage />}

        {activePage === 'product' && selectedProduct && (
          <ProductDetailPage product={selectedProduct} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <QuickViewModal />
      <CheckoutModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
