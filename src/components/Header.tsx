import React, { useState, useRef, useEffect } from 'react';
import { Globe, Search, Heart, ShoppingBag, Menu, X, ChevronDown, Sparkles, FolderOpen } from 'lucide-react';
import { useShop, CURRENCIES, LANGUAGES } from '../context/ShopContext';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    selectedCategory,
    navigateToCategory,
    setIsSearchOpen,
    setIsCartOpen,
    setIsWishlistOpen,
    openMediaFolder,
    cartCount,
    wishlist,
    currentLanguage,
    setCurrentLanguage,
    currentCurrency,
    setCurrentCurrency,
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Kids', value: 'kids' },
    { label: 'Featured', value: 'featured' },
  ];

  const handleNavClick = (value: string) => {
    navigateToCategory(value);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    setActivePage('home');
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-[52px] sm:h-[56px] flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            id="brand-logo-btn"
            onClick={handleLogoClick}
            className="group flex items-center gap-1 text-left focus:outline-none"
          >
            <span className="text-2xl sm:text-[26px] font-black tracking-tighter text-black group-hover:opacity-75 transition-opacity">
              LOCO
            </span>
          </button>
        </div>

        {/* Center Navigation: Desktop */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-[13px] font-medium uppercase tracking-widest" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive =
              activePage === 'category' && selectedCategory.toLowerCase() === link.value.toLowerCase();
            return (
              <button
                key={link.value}
                id={`nav-link-${link.value}`}
                onClick={() => handleNavClick(link.value)}
                className={`transition-colors duration-200 relative py-1 focus:outline-none ${
                  isActive
                    ? 'text-black font-bold'
                    : 'text-black hover:text-gray-500'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Language, Search, Wishlist, Cart */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Globe & Currency Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="language-currency-btn"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1 text-xs font-bold text-black hover:text-gray-600 transition-colors focus:outline-none"
            >
              <Globe className="w-4 h-4 text-black" />
              <span>{currentLanguage}</span>
              <ChevronDown
                className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${
                  isLangDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isLangDropdownOpen && (
              <div
                id="language-dropdown-menu"
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="mb-2">
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 px-2">
                    Select Language
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        id={`lang-select-${lang.code}`}
                        onClick={() => {
                          setCurrentLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`text-left px-2.5 py-1.5 text-xs rounded-md transition-colors ${
                          currentLanguage === lang.code
                            ? 'bg-black text-white font-medium'
                            : 'hover:bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5 px-2">
                    Currency
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {CURRENCIES.map((curr) => (
                      <button
                        key={curr.code}
                        id={`curr-select-${curr.code}`}
                        onClick={() => {
                          setCurrentCurrency(curr);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`text-left px-2.5 py-1.5 text-xs rounded-md transition-colors flex items-center justify-between ${
                          currentCurrency.code === curr.code
                            ? 'bg-black text-white font-medium'
                            : 'hover:bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        <span>{curr.code}</span>
                        <span className="text-[11px] opacity-75">{curr.symbol}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Trigger Button */}
          <button
            id="header-search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="text-black hover:text-gray-500 transition-colors focus:outline-none"
            aria-label="Search Catalog"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Product Media Folders & Dossier Trigger */}
          <button
            id="header-media-folder-btn"
            onClick={() => openMediaFolder()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-neutral-100 hover:bg-black hover:text-white text-neutral-800 transition-all border border-neutral-200/80 shadow-sm"
            title="Browse All 4 Product Pictures & Info Folders"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Media Folders</span>
          </button>

          {/* Wishlist Icon with count */}
          <button
            id="header-wishlist-btn"
            onClick={() => setIsWishlistOpen(true)}
            className="relative text-black hover:text-gray-500 transition-colors focus:outline-none"
            aria-label="View Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span
                id="wishlist-badge"
                className="absolute -top-1 -right-1 bg-red-600 text-[9px] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold"
              >
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Icon with count */}
          <button
            id="header-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative text-black hover:text-gray-500 transition-colors focus:outline-none"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                id="cart-count-badge"
                className="absolute -top-1 -right-1 bg-red-600 text-[9px] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold"
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1 text-black hover:text-gray-600 rounded-lg focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden fixed inset-x-0 top-20 bg-white border-b border-neutral-200 px-6 py-6 shadow-2xl z-40 animate-in slide-in-from-top duration-200"
        >
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.value}
                id={`mobile-nav-${link.value}`}
                onClick={() => handleNavClick(link.value)}
                className="text-left text-lg font-semibold uppercase tracking-wider py-2 border-b border-neutral-100 flex items-center justify-between text-neutral-900"
              >
                <span>{link.label}</span>
                <span className="text-xs text-neutral-400">Explore &rarr;</span>
              </button>
            ))}

            <button
              id="mobile-nav-new-arrivals"
              onClick={() => handleNavClick('new-arrivals')}
              className="text-left text-lg font-semibold uppercase tracking-wider py-2 border-b border-neutral-100 flex items-center justify-between text-neutral-900"
            >
              <span>New Arrivals</span>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">New</span>
            </button>

            <button
              id="mobile-nav-best-sellers"
              onClick={() => handleNavClick('best-sellers')}
              className="text-left text-lg font-semibold uppercase tracking-wider py-2 border-b border-neutral-100 flex items-center justify-between text-neutral-900"
            >
              <span>Best Sellers</span>
              <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-medium">Hot</span>
            </button>
          </nav>

          {/* Currency & Language selector on Mobile */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <Globe className="w-4 h-4" />
              <span>Language: {currentLanguage}</span>
            </div>
            <div className="flex space-x-1.5">
              {CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  id={`mobile-curr-${curr.code}`}
                  onClick={() => setCurrentCurrency(curr)}
                  className={`text-xs px-2.5 py-1 rounded font-medium ${
                    currentCurrency.code === curr.code
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {curr.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
