import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, ActivePage, ToastMessage, FilterState, ProductColor } from '../types';
import { ALL_PRODUCTS } from '../data/products';

interface ShopContextType {
  // Navigation & Views
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Products catalog with dynamic image replacement
  products: Product[];
  updateProductImage: (
    productId: string,
    newImageUrl: string,
    targetSlot: 'current' | 'primary' | 'add',
    galleryIndex?: number
  ) => void;
  resetProductImages: (productId?: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size?: string, color?: ProductColor, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Media Folder & Product Dossier
  isMediaFolderOpen: boolean;
  setIsMediaFolderOpen: (open: boolean) => void;
  mediaFolderProductId: string | null;
  setMediaFolderProductId: (id: string | null) => void;
  openMediaFolder: (productId?: string) => void;

  // Checkout modal
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  // Notifications / Toast
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'cart' | 'wishlist', product?: Product) => void;
  dismissToast: (id: string) => void;

  // Localization / Currency
  currentLanguage: string;
  setCurrentLanguage: (lang: string) => void;
  currentCurrency: { code: string; symbol: string; rate: number };
  setCurrentCurrency: (currency: { code: string; symbol: string; rate: number }) => void;
  formatPrice: (usdPrice: number) => string;

  // Filter state for category view
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // Helper actions
  navigateToProduct: (product: Product) => void;
  navigateToCategory: (categoryName: string) => void;
}

const initialFilterState: FilterState = {
  category: 'all',
  priceRange: [0, 200],
  sizes: [],
  colors: [],
  sortBy: 'featured',
  searchQuery: '',
};

export const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1.0 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.79 },
  { code: 'JPY', symbol: '¥', rate: 155.0 },
];

export const LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'FR', name: 'Français' },
  { code: 'DE', name: 'Deutsch' },
  { code: 'ES', name: 'Español' },
  { code: 'JA', name: '日本語' },
];

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Localization
  const [currentLanguage, setCurrentLanguage] = useState<string>('EN');
  const [currentCurrency, setCurrentCurrency] = useState(CURRENCIES[0]);

  // Products Catalog with dynamic override support
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('loco_products_override');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with current ALL_PRODUCTS to keep newest data structure
        return ALL_PRODUCTS.map((prod) => {
          const custom = parsed.find((p: Product) => p.id === prod.id);
          return custom ? { ...prod, ...custom } : prod;
        });
      }
    } catch {
      // ignore
    }
    return ALL_PRODUCTS;
  });

  // Save customized product images
  useEffect(() => {
    try {
      localStorage.setItem('loco_products_override', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  const updateProductImage = (
    productId: string,
    newImageUrl: string,
    targetSlot: 'current' | 'primary' | 'add' = 'current',
    galleryIndex: number = 0
  ) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;

        let updatedGallery = [...prod.gallery];
        let updatedImage = prod.image;

        if (targetSlot === 'primary') {
          updatedImage = newImageUrl;
          if (updatedGallery.length > 0) {
            updatedGallery[0] = newImageUrl;
          } else {
            updatedGallery = [newImageUrl];
          }
        } else if (targetSlot === 'current') {
          if (galleryIndex >= 0 && galleryIndex < updatedGallery.length) {
            updatedGallery[galleryIndex] = newImageUrl;
          } else {
            updatedGallery.push(newImageUrl);
          }
          if (galleryIndex === 0) {
            updatedImage = newImageUrl;
          }
        } else if (targetSlot === 'add') {
          updatedGallery.push(newImageUrl);
        }

        const updatedProduct: Product = {
          ...prod,
          image: updatedImage,
          gallery: updatedGallery,
        };

        // Also update selectedProduct if currently viewing it
        if (selectedProduct && selectedProduct.id === productId) {
          setSelectedProduct(updatedProduct);
        }
        if (quickViewProduct && quickViewProduct.id === productId) {
          setQuickViewProduct(updatedProduct);
        }

        return updatedProduct;
      })
    );

    showToast('Picture Updated', 'New product image has been applied.', 'success');
  };

  const resetProductImages = (productId?: string) => {
    if (productId) {
      const defaultProd = ALL_PRODUCTS.find((p) => p.id === productId);
      if (defaultProd) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, image: defaultProd.image, gallery: defaultProd.gallery } : p))
        );
        if (selectedProduct && selectedProduct.id === productId) {
          setSelectedProduct(defaultProd);
        }
      }
    } else {
      setProducts(ALL_PRODUCTS);
      localStorage.removeItem('loco_products_override');
    }
    showToast('Restored Default', 'Original picture has been restored.', 'info');
  };

  // Cart State with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('loco_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State with localStorage
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('loco_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Media Folder & Product Dossier
  const [isMediaFolderOpen, setIsMediaFolderOpen] = useState(false);
  const [mediaFolderProductId, setMediaFolderProductId] = useState<string | null>(null);

  const openMediaFolder = (productId?: string) => {
    if (productId) {
      setMediaFolderProductId(productId);
    } else if (selectedProduct) {
      setMediaFolderProductId(selectedProduct.id);
    } else if (products.length > 0) {
      setMediaFolderProductId(products[0].id);
    }
    setIsMediaFolderOpen(true);
  };

  // Recent Searches
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('loco_recent_searches');
      return saved ? JSON.parse(saved) : ['Jacket', 'Daisy Shirt', 'Neon', 'Sweatshirt', 'Linen'];
    } catch {
      return ['Jacket', 'Daisy Shirt', 'Neon', 'Sweatshirt', 'Linen'];
    }
  });

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('loco_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('loco_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('loco_recent_searches', JSON.stringify(recentSearches));
    } catch (e) {
      console.error(e);
    }
  }, [recentSearches]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, selectedCategory, selectedProduct]);

  // Toast Handler
  const showToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'cart' | 'wishlist' = 'success',
    product?: Product
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type, product }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Operations
  const addToCart = (
    product: Product,
    size?: string,
    color?: ProductColor,
    quantity: number = 1
  ) => {
    const chosenSize = size || product.sizes[0] || 'M';
    const chosenColor = color || product.colors[0] || { name: 'Standard', hex: '#000000' };
    const cartItemId = `${product.id}-${chosenSize}-${chosenColor.name}`;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === cartItemId);
      if (existing) {
        return prevCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            product,
            size: chosenSize,
            color: chosenColor,
            quantity,
          },
        ];
      }
    });

    showToast(
      'Added to Bag',
      `${product.name} (${chosenSize}) has been added to your shopping bag.`,
      'cart',
      product
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Wishlist Operations
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast('Removed from Wishlist', `${product.name} removed from saved items.`, 'info');
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast('Saved to Wishlist', `${product.name} added to your wishlist.`, 'wishlist', product);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Recent searches
  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 8);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Currency Formatter
  const formatPrice = (usdPrice: number) => {
    const converted = usdPrice * currentCurrency.rate;
    if (currentCurrency.code === 'JPY') {
      return `${currentCurrency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${currentCurrency.symbol}${converted.toFixed(2)}`;
  };

  // Navigation helpers
  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product');
    setQuickViewProduct(null);
  };

  const navigateToCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setFilterState((prev) => ({ ...prev, category: categoryName }));
    setActivePage('category');
  };

  const resetFilters = () => {
    setFilterState(initialFilterState);
  };

  return (
    <ShopContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        quickViewProduct,
        setQuickViewProduct,
        products,
        updateProductImage,
        resetProductImages,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        isMediaFolderOpen,
        setIsMediaFolderOpen,
        mediaFolderProductId,
        setMediaFolderProductId,
        openMediaFolder,
        isCheckoutOpen,
        setIsCheckoutOpen,
        toasts,
        showToast,
        dismissToast,
        currentLanguage,
        setCurrentLanguage,
        currentCurrency,
        setCurrentCurrency,
        formatPrice,
        filterState,
        setFilterState,
        resetFilters,
        navigateToProduct,
        navigateToCategory,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
