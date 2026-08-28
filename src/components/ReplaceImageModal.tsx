import React, { useState, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Sparkles,
  X,
  Check,
  RotateCcw,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { Product } from '../types';

interface ReplaceImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  currentImageIndex: number;
  onApplyImage: (newUrl: string, target: 'current' | 'primary' | 'add') => void;
  onResetImages: () => void;
}

const PRESET_IMAGES = [
  {
    name: 'Clean White Cotton Poplin Shirt',
    url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
    tag: 'Classic Shirt',
  },
  {
    name: 'Oversized Botanical Linen Blouse',
    url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop',
    tag: 'Editorial',
  },
  {
    name: 'Contemporary Tailored Casual Shirt',
    url: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=1000&auto=format&fit=crop',
    tag: 'Minimalist',
  },
  {
    name: 'High-Fashion Studio Editorial Look',
    url: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?q=80&w=1000&auto=format&fit=crop',
    tag: 'Studio',
  },
  {
    name: 'Vibrant Canary Yellow Jacket',
    url: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1000&auto=format&fit=crop',
    tag: 'Hero Outerwear',
  },
  {
    name: 'Minimalist Ivory Fleece Zip-Up',
    url: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1000&auto=format&fit=crop',
    tag: 'Fleece Knit',
  },
  {
    name: 'Urban High-Contrast Streetwear',
    url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop',
    tag: 'Streetwear',
  },
  {
    name: 'Heritage Warm Biscuit Jacket',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
    tag: 'Warm Vintage',
  },
];

export const ReplaceImageModal: React.FC<ReplaceImageModalProps> = ({
  isOpen,
  onClose,
  product,
  currentImageIndex,
  onApplyImage,
  onResetImages,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>(
    product.gallery[currentImageIndex] || product.image
  );
  const [urlInput, setUrlInput] = useState<string>('');
  const [targetSlot, setTargetSlot] = useState<'current' | 'primary' | 'add'>('current');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setPreviewUrl(urlInput.trim());
    }
  };

  const handleApply = () => {
    if (previewUrl) {
      onApplyImage(previewUrl, targetSlot);
      onClose();
    }
  };

  return (
    <div
      id="replace-image-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="replace-image-modal-card"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 leading-tight">
                Replace Picture
              </h3>
              <p className="text-xs text-neutral-500">
                Updating image for <span className="font-semibold text-black">{product.name}</span>
              </p>
            </div>
          </div>

          <button
            id="close-replace-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Target Slot Option */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              Apply Image To:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetSlot('current')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center focus:outline-none ${
                  targetSlot === 'current'
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                }`}
              >
                Current Slide ({currentImageIndex + 1})
              </button>
              <button
                type="button"
                onClick={() => setTargetSlot('primary')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center focus:outline-none ${
                  targetSlot === 'primary'
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                }`}
              >
                Primary Cover
              </button>
              <button
                type="button"
                onClick={() => setTargetSlot('add')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center focus:outline-none ${
                  targetSlot === 'add'
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                }`}
              >
                + Add To Gallery
              </button>
            </div>
          </div>

          {/* Source Tabs */}
          <div className="flex border-b border-neutral-100">
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'upload'
                  ? 'text-black border-b-2 border-black'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Upload Device File
            </button>
            <button
              onClick={() => setActiveTab('preset')}
              className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'preset'
                  ? 'text-black border-b-2 border-black'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Curated Presets
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'url'
                  ? 'text-black border-b-2 border-black'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              Image URL
            </button>
          </div>

          {/* Tab 1: Upload (Drag & Drop + Click) */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                id="file-upload-input"
              />
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-black bg-neutral-50 scale-[0.99]'
                    : 'border-neutral-200 hover:border-black bg-neutral-50/50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-neutral-100 flex items-center justify-center text-black">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900">
                    Click to browse or drag & drop image here
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    Supports PNG, JPG, WEBP, GIF up to 10MB
                  </p>
                </div>
                {fileName && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Loaded: {fileName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Curated Presets */}
          {activeTab === 'preset' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PRESET_IMAGES.map((preset, idx) => {
                const isSelected = previewUrl === preset.url;
                return (
                  <div
                    key={idx}
                    onClick={() => setPreviewUrl(preset.url)}
                    className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all p-1.5 flex flex-col gap-1.5 relative ${
                      isSelected
                        ? 'border-black bg-neutral-50 shadow-md'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="aspect-[3/4] w-full rounded-lg overflow-hidden bg-neutral-100 relative">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-neutral-800 truncate">
                      {preset.tag}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 3: Custom URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                Paste Direct Web Image Link:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-black"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-neutral-900 text-white hover:bg-black px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-colors"
                >
                  Load
                </button>
              </div>
            </form>
          )}

          {/* Live Preview Box */}
          <div className="border border-neutral-100 rounded-2xl p-4 bg-neutral-50 flex items-center gap-4">
            <div className="w-20 h-24 rounded-xl overflow-hidden bg-neutral-200 border border-neutral-200 shrink-0">
              <img
                src={previewUrl}
                alt="Replacement preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                New Photo Preview
              </span>
              <p className="text-xs font-bold text-neutral-900 truncate mt-0.5">
                Ready to apply to {product.name}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                Will be rendered instantly in catalog, bag, and product view.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-100 bg-white flex items-center justify-between">
          <button
            type="button"
            onClick={onResetImages}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-red-600 transition-colors focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset To Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="apply-replace-image-btn"
              type="button"
              onClick={handleApply}
              className="px-6 py-2 rounded-full bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 shadow-md transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Picture</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
