export type ProductCategory = 'men' | 'women' | 'kids' | 'featured' | 'new-arrivals' | 'best-sellers';

export interface ProductColor {
  name: string;
  hex: string;
  class?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline?: string;
  category: ProductCategory;
  subcategory: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  reviewsText: string;
  image: string;
  gallery: string[];
  description: string;
  colors: ProductColor[];
  sizes: string[];
  badge?: 'New Arrival' | 'Best Seller' | 'Hot' | 'Trending';
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  bgGradientStyle?: 'warm-sunset' | 'fire-orange' | 'amber-glow' | 'coral-pop' | 'clean-gray';
  modelDescription?: string;
  details: {
    material: string;
    fit: string;
    care: string;
    origin: string;
  };
  reviewsList?: ProductReview[];
}

export interface CartItem {
  id: string; // unique item id based on product.id + size + color
  product: Product;
  size: string;
  color: ProductColor;
  quantity: number;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  sortBy: 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating';
  searchQuery: string;
}

export type ActivePage = 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'wishlist';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'cart' | 'wishlist';
  title: string;
  description?: string;
  product?: Product;
}
