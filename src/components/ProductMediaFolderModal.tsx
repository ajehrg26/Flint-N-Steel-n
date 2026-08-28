import React, { useState, useMemo } from 'react';
import {
  X,
  Folder,
  FolderOpen,
  Image as ImageIcon,
  Camera,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Search,
  Tag,
  Star,
  Info,
  Layers,
  FileCode,
  ArrowRight,
  Maximize2,
  Download,
  Palette,
  Ruler,
  ShoppingBag,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { ReplaceImageModal } from './ReplaceImageModal';

const PHOTO_SLOT_META = [
  {
    index: 0,
    slotName: '01_cover_front.jpg',
    role: 'Primary Hero / Studio Front View',
    desc: 'Main catalog listing cover and ecommerce card display',
    badge: 'Cover Photo',
  },
  {
    index: 1,
    slotName: '02_texture_angle.jpg',
    role: 'Texture, Fabric & Tailoring Angle',
    desc: 'Macro texture weave, buttons, stitching, and 3/4 drape',
    badge: 'Garment Angle',
  },
  {
    index: 2,
    slotName: '03_editorial_styling.jpg',
    role: 'Editorial Look & Silhouette',
    desc: 'High-fashion aesthetic styling, model portrait, and mood',
    badge: 'Editorial Look',
  },
  {
    index: 3,
    slotName: '04_lifestyle_back.jpg',
    role: 'Studio Profile / Full Outfit Pairing',
    desc: 'Full length silhouette and alternative colorway pairing',
    badge: 'Full Silhouette',
  },
];

export const ProductMediaFolderModal: React.FC = () => {
  const {
    isMediaFolderOpen,
    setIsMediaFolderOpen,
    mediaFolderProductId,
    setMediaFolderProductId,
    products,
    updateProductImage,
    resetProductImages,
    navigateToProduct,
    showToast,
    formatPrice,
  } = useShop();

  const [searchFilter, setSearchFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'photos' | 'specs' | 'fabric' | 'reviews' | 'json'>('photos');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [replaceTargetIndex, setReplaceTargetIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewLightboxUrl, setPreviewLightboxUrl] = useState<string | null>(null);

  // Active product
  const activeProduct: Product = useMemo(() => {
    if (mediaFolderProductId) {
      const found = products.find((p) => p.id === mediaFolderProductId);
      if (found) return found;
    }
    return products[0] || null;
  }, [mediaFolderProductId, products]);

  // Filtered product folders list
  const filteredProducts = useMemo(() => {
    if (!searchFilter.trim()) return products;
    const query = searchFilter.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.subcategory?.toLowerCase().includes(query)
    );
  }, [products, searchFilter]);

  if (!isMediaFolderOpen || !activeProduct) return null;

  // Ensure gallery has 4 photos
  const productPhotos = useMemo(() => {
    const list = [...(activeProduct.gallery || [])];
    while (list.length < 4) {
      list.push(activeProduct.image);
    }
    return list.slice(0, 4);
  }, [activeProduct]);

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('Copied to Clipboard', label, 'info');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleOpenReplace = (photoIndex: number) => {
    setReplaceTargetIndex(photoIndex);
    setIsReplaceModalOpen(true);
  };

  const handleViewInStore = () => {
    setIsMediaFolderOpen(false);
    navigateToProduct(activeProduct);
  };

  return (
    <div
      id="product-media-folder-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-7xl h-[92vh] max-h-[900px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-neutral-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center shadow-sm flex-shrink-0">
              <FolderOpen className="w-4 h-4 text-amber-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Product Media & Asset Folder
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  4 Pictures / Folder
                </span>
              </div>
              <p className="text-sm font-bold text-neutral-900 truncate font-mono">
                📁 /catalog/products/<span className="text-black underline">{activeProduct.id}</span>/
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              id="folder-view-in-store-btn"
              onClick={handleViewInStore}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>View in Store</span>
            </button>
            <button
              id="folder-close-btn"
              onClick={() => setIsMediaFolderOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-black flex items-center justify-center transition-colors"
              title="Close Folder"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content: Sidebar + Folder Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Sidebar: Product Folders Directory */}
          <div className="w-full md:w-72 lg:w-80 border-r border-neutral-200 bg-neutral-50/50 flex flex-col flex-shrink-0">
            {/* Search filter in folders */}
            <div className="p-3 border-b border-neutral-200 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="folder-search-input"
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter product folders..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-100 rounded-lg border border-transparent focus:border-black focus:bg-white outline-none transition-all"
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-neutral-500 px-1">
                <span>{filteredProducts.length} Product Folders</span>
                <span className="font-semibold text-neutral-700">52 Total Pictures</span>
              </div>
            </div>

            {/* Folder List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredProducts.map((prod) => {
                const isActive = prod.id === activeProduct.id;
                return (
                  <button
                    key={prod.id}
                    id={`folder-item-${prod.id}`}
                    onClick={() => {
                      setMediaFolderProductId(prod.id);
                      setSelectedPhotoIndex(null);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all group ${
                      isActive
                        ? 'bg-black text-white shadow-sm font-semibold'
                        : 'hover:bg-neutral-200/70 text-neutral-800'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className={`w-10 h-12 object-cover rounded-lg border ${
                          isActive ? 'border-neutral-700' : 'border-neutral-200'
                        }`}
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 text-[9px] font-bold px-1 rounded ${
                          isActive ? 'bg-amber-400 text-black' : 'bg-neutral-900 text-white'
                        }`}
                      >
                        4P
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate">{prod.name}</span>
                        <span
                          className={`text-[10px] font-mono ${
                            isActive ? 'text-amber-300' : 'text-neutral-500'
                          }`}
                        >
                          {formatPrice(prod.price)}
                        </span>
                      </div>
                      <p
                        className={`text-[10px] truncate ${
                          isActive ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        📁 {prod.id}/
                      </p>
                      <span
                        className={`inline-block text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded mt-0.5 ${
                          isActive
                            ? 'bg-neutral-800 text-neutral-200'
                            : 'bg-neutral-200 text-neutral-600'
                        }`}
                      >
                        {prod.category}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Main Panel: Folder Contents & All Information */}
          <div className="flex-1 flex flex-col overflow-y-auto bg-white">
            {/* Active Folder Header Banner */}
            <div className="p-4 sm:p-6 border-b border-neutral-100 bg-gradient-to-r from-neutral-50 to-white">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                      Folder: {activeProduct.id}
                    </span>
                    {activeProduct.badge && (
                      <span className="bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {activeProduct.badge}
                      </span>
                    )}
                    <span className="text-xs text-neutral-500 capitalize">
                      {activeProduct.category} · {activeProduct.subcategory}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                    {activeProduct.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-0.5">
                    {activeProduct.tagline}
                  </p>
                </div>

                {/* Quick actions for this folder */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    id="folder-copy-urls-btn"
                    onClick={() =>
                      handleCopy(
                        productPhotos.join('\n'),
                        'urls',
                        'All 4 Image URLs copied to clipboard'
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
                  >
                    {copiedKey === 'urls' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy 4 Photo URLs</span>
                  </button>

                  <button
                    id="folder-reset-photos-btn"
                    onClick={() => resetProductImages(activeProduct.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors"
                    title="Restore default catalog images"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Photos</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs for Folder View */}
              <div className="flex items-center gap-2 mt-5 border-b border-neutral-200 pb-2 overflow-x-auto text-xs font-semibold">
                <button
                  id="folder-tab-photos"
                  onClick={() => setActiveTab('photos')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'photos'
                      ? 'bg-black text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>4 Pictures in Folder ({productPhotos.length})</span>
                </button>

                <button
                  id="folder-tab-specs"
                  onClick={() => setActiveTab('specs')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'specs'
                      ? 'bg-black text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Specs & Pricing</span>
                </button>

                <button
                  id="folder-tab-fabric"
                  onClick={() => setActiveTab('fabric')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'fabric'
                      ? 'bg-black text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Fabric & Craft</span>
                </button>

                <button
                  id="folder-tab-reviews"
                  onClick={() => setActiveTab('reviews')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'reviews'
                      ? 'bg-black text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Reviews ({activeProduct.reviewsList?.length || 0})</span>
                </button>

                <button
                  id="folder-tab-json"
                  onClick={() => setActiveTab('json')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === 'json'
                      ? 'bg-black text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>JSON Dossier</span>
                </button>
              </div>
            </div>

            {/* Tab 1: 4 Pictures in One Folder */}
            {activeTab === 'photos' && (
              <div className="p-4 sm:p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                      <span>Organized Image Assets in Folder</span>
                      <span className="text-xs font-normal text-neutral-500 font-mono">
                        (4 High-Resolution Assets)
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Each picture is assigned to a specific camera angle and catalog slot. Click any
                      picture to replace, inspect, or preview.
                    </p>
                  </div>
                </div>

                {/* 4 Pictures Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {productPhotos.map((url, idx) => {
                    const meta = PHOTO_SLOT_META[idx] || {
                      index: idx,
                      slotName: `0${idx + 1}_photo.jpg`,
                      role: 'Product Image',
                      desc: 'Product gallery view',
                      badge: `Photo 0${idx + 1}`,
                    };

                    return (
                      <div
                        key={idx}
                        id={`folder-photo-card-${idx}`}
                        className="group bg-neutral-50 rounded-2xl p-3 border border-neutral-200 hover:border-neutral-400 transition-all flex flex-col"
                      >
                        {/* Slot label header */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold font-mono text-neutral-700 bg-white px-2 py-0.5 rounded border border-neutral-200">
                            {meta.slotName}
                          </span>
                          <span className="text-[9px] font-bold bg-neutral-900 text-white px-1.5 py-0.5 rounded">
                            {meta.badge}
                          </span>
                        </div>

                        {/* Image Preview */}
                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-200 shadow-inner mb-3">
                          <img
                            src={url}
                            alt={`${activeProduct.name} angle ${idx + 1}`}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />

                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                            <button
                              id={`folder-inspect-photo-${idx}`}
                              onClick={() => setPreviewLightboxUrl(url)}
                              className="p-2 bg-white rounded-full text-black hover:scale-110 transition-transform shadow"
                              title="Zoom / Inspect High-Res"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                            <button
                              id={`folder-replace-photo-${idx}`}
                              onClick={() => handleOpenReplace(idx)}
                              className="p-2 bg-black text-white rounded-full hover:scale-110 transition-transform shadow"
                              title="Replace this picture"
                            >
                              <Camera className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Slot Description */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs font-bold text-neutral-900 leading-tight">
                              {meta.role}
                            </p>
                            <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                              {meta.desc}
                            </p>
                          </div>

                          {/* Bottom Card Action Bar */}
                          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-neutral-200/80">
                            <button
                              id={`folder-card-replace-btn-${idx}`}
                              onClick={() => handleOpenReplace(idx)}
                              className="flex-1 py-1.5 bg-white hover:bg-neutral-900 hover:text-white text-neutral-800 text-[11px] font-bold rounded-lg border border-neutral-300 transition-colors flex items-center justify-center gap-1"
                            >
                              <Camera className="w-3 h-3" />
                              <span>Replace</span>
                            </button>
                            <button
                              id={`folder-card-copy-btn-${idx}`}
                              onClick={() =>
                                handleCopy(url, `url-${idx}`, `Photo ${idx + 1} URL copied`)
                              }
                              className="p-1.5 bg-white hover:bg-neutral-100 text-neutral-600 rounded-lg border border-neutral-300 transition-colors"
                              title="Copy URL"
                            >
                              {copiedKey === `url-${idx}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Info Callout Banner */}
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/80 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950">
                    <p className="font-bold">4-Picture Unified Folder Structure</p>
                    <p className="mt-0.5 text-amber-800">
                      All images for <strong>{activeProduct.name}</strong> are synchronized across
                      the storefront, catalog carousels, quick-view modals, and product detail
                      galleries. You can replace any individual photo via file upload or curated
                      editorial presets.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Specifications & Pricing */}
            {activeTab === 'specs' && (
              <div className="p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Commercial Data */}
                  <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                      Pricing & Commercial Details
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[11px] text-neutral-500">Current Price</span>
                        <p className="text-2xl font-black text-black">
                          {formatPrice(activeProduct.price)}
                        </p>
                      </div>
                      {activeProduct.originalPrice && (
                        <div>
                          <span className="text-[11px] text-neutral-500">MSRP / Original</span>
                          <p className="text-lg font-bold text-neutral-400 line-through">
                            {formatPrice(activeProduct.originalPrice)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-neutral-200 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-500">Product Identifier</span>
                        <span className="font-mono font-bold text-neutral-900">
                          {activeProduct.id}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-500">Target Category</span>
                        <span className="font-semibold text-neutral-900 capitalize">
                          {activeProduct.category}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-500">Subcategory</span>
                        <span className="font-semibold text-neutral-900">
                          {activeProduct.subcategory}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-neutral-500">Rating & Reviews</span>
                        <span className="font-semibold text-neutral-900 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {activeProduct.rating} ({activeProduct.reviewsCount} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Colors & Sizes */}
                  <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                      Colorways & Sizing Grid
                    </h4>

                    {/* Colors */}
                    <div>
                      <span className="text-[11px] text-neutral-500 font-semibold block mb-2">
                        Available Colorways ({activeProduct.colors?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeProduct.colors?.map((color, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-800"
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-sm"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span>{color.name}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {color.hex}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sizes */}
                    <div className="pt-3 border-t border-neutral-200">
                      <span className="text-[11px] text-neutral-500 font-semibold block mb-2">
                        Size Availability ({activeProduct.sizes?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeProduct.sizes?.map((size, sIdx) => (
                          <span
                            key={sIdx}
                            className="w-9 h-9 rounded-lg bg-white border border-neutral-200 font-bold text-xs flex items-center justify-center text-neutral-900 shadow-sm"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Box */}
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
                    Marketing Description
                  </h4>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    {activeProduct.description}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Fabric & Craft */}
            {activeTab === 'fabric' && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Material Composition
                    </span>
                    <p className="text-sm font-semibold text-neutral-900">
                      {activeProduct.details?.material || '100% Premium Eco-Textile'}
                    </p>
                  </div>

                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Fit & Silhouette
                    </span>
                    <p className="text-sm font-semibold text-neutral-900">
                      {activeProduct.details?.fit || 'Standard relaxed contemporary cut'}
                    </p>
                  </div>

                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Care & Washing Instructions
                    </span>
                    <p className="text-sm font-semibold text-neutral-900">
                      {activeProduct.details?.care || 'Machine wash delicate cold.'}
                    </p>
                  </div>

                  <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                      Origin & Craftsmanship
                    </span>
                    <p className="text-sm font-semibold text-neutral-900">
                      {activeProduct.details?.origin || 'Crafted with ethical global partners'}
                    </p>
                  </div>
                </div>

                {activeProduct.modelDescription && (
                  <div className="bg-neutral-100 rounded-xl p-4 text-xs text-neutral-700 flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                    <span>
                      <strong>Model Measurements:</strong> {activeProduct.modelDescription}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Reviews */}
            {activeTab === 'reviews' && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-neutral-900">
                    Customer Feedback & Testimonials
                  </h3>
                  <div className="flex items-center gap-1 text-sm font-bold bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{activeProduct.rating} / 5.0 Average</span>
                  </div>
                </div>

                {activeProduct.reviewsList && activeProduct.reviewsList.length > 0 ? (
                  <div className="space-y-3">
                    {activeProduct.reviewsList.map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {rev.avatar && (
                              <img
                                src={rev.avatar}
                                alt={rev.author}
                                className="w-8 h-8 rounded-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div>
                              <p className="text-xs font-bold text-neutral-900">{rev.author}</p>
                              <span className="text-[10px] text-neutral-400">{rev.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 fill-amber-400 text-amber-400"
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs font-bold text-neutral-900">{rev.title}</p>
                        <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-neutral-50 rounded-2xl text-neutral-500 text-xs">
                    No individual reviews listed for this product folder yet.
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: JSON Dossier */}
            {activeTab === 'json' && (
              <div className="p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700">
                    Full JSON Data Structure for 📁 /{activeProduct.id}/
                  </span>
                  <button
                    id="folder-copy-json-btn"
                    onClick={() =>
                      handleCopy(
                        JSON.stringify(activeProduct, null, 2),
                        'json',
                        'Product JSON copied to clipboard'
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    {copiedKey === 'json' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy JSON</span>
                  </button>
                </div>

                <pre className="bg-neutral-950 text-neutral-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 border border-neutral-800">
                  {JSON.stringify(activeProduct, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom modal */}
      {previewLightboxUrl && (
        <div
          id="folder-lightbox-backdrop"
          onClick={() => setPreviewLightboxUrl(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-150"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={previewLightboxUrl}
              alt="High-resolution preview"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setPreviewLightboxUrl(null)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-black p-2 rounded-full shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Replace Image Modal Sub-Dialog */}
      <ReplaceImageModal
        isOpen={isReplaceModalOpen}
        onClose={() => setIsReplaceModalOpen(false)}
        product={activeProduct}
        currentImageIndex={replaceTargetIndex}
        onApplyImage={(newUrl, target) => {
          updateProductImage(activeProduct.id, newUrl, target, replaceTargetIndex);
        }}
        onResetImages={() => {
          resetProductImages(activeProduct.id);
        }}
      />
    </div>
  );
};
