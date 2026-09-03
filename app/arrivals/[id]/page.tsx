'use client';

import { useState, useCallback } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Heart, Copy, Check, Share2, Mail } from 'lucide-react';
import { useCart } from '@/lib/context';
import { NEW_ARRIVALS, ArrivalPart } from '@/lib/arrivals-data';
import { CartItem } from '@/lib/types';

// ─── Share Panel (same pattern as /parts/[id]) ───────────────────────────────
function SharePanel({ part }: { part: ArrivalPart }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const url =
    typeof window !== 'undefined'
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elitepartz.com'}/arrivals/${part.id}`;

  const text = `Check out this part on ElitePartz: ${part.name} — $${part.price.toFixed(2)}`;
  const encodedUrl  = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${text}\n${url}`);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const targets = [
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodedText}`,
      bg: 'bg-green-500 hover:bg-green-600',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.849L.054 23.25a.75.75 0 0 0 .916.99l5.637-1.481A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.65-.523-5.154-1.43l-.37-.217-3.827 1.005 1.023-3.736-.24-.386A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      ),
    },
    {
      label: 'Twitter / X',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodedUrl}`,
      bg: 'bg-black hover:bg-gray-800',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bg: 'bg-blue-600 hover:bg-blue-700',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: 'Email',
      href: `mailto:?subject=${encodeURIComponent(`Check out: ${part.name}`)}&body=${encodedText}`,
      bg: 'bg-gray-600 hover:bg-gray-700',
      icon: <Mail className="w-4 h-4" />,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 hover:border-red-500 text-gray-600 hover:text-red-600 font-semibold text-sm transition rounded"
        aria-label="Share this product"
      >
        <Share2 size={16} /> Share
      </button>

      {open && (
        <div className="absolute left-0 bottom-full mb-2 w-80 bg-white border border-gray-200 shadow-2xl rounded-lg p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-sm">Share this product</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              readOnly value={url}
              className="flex-1 text-xs px-3 py-2 border border-gray-200 bg-gray-50 rounded text-gray-600 truncate focus:outline-none"
            />
            <button
              onClick={copyLink}
              className={`flex items-center gap-1.5 px-3 py-2 rounded font-semibold text-xs transition whitespace-nowrap ${
                copied ? 'bg-gray-900 text-white' : 'bg-gray-900 hover:bg-red-600 text-white'
              }`}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded p-2 mb-3">
            <strong>Instagram / TikTok:</strong> Copy the link above and paste it in your bio, story, or caption.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {targets.map(({ label, href, bg, icon }) => (
              <a
                key={label} href={href} target="_blank" rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-white text-xs font-semibold transition ${bg}`}
              >
                {icon} {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ArrivalDetailPage() {
  const params = useParams();
  const id     = params.id as string;

  // ── All hooks must be declared before any conditional return ──────────────
  const { addToCart } = useCart();
  const [activeImage,  setActiveImage]  = useState(0);
  const [quantity,     setQuantity]     = useState(1);
  const [wishlisted,   setWishlisted]   = useState(false);
  const [addedToCart,  setAddedToCart]  = useState(false);
  const [activeTab,    setActiveTab]    = useState<'description' | 'specs' | 'questions'>('description');

  // ── Lookup after hooks ────────────────────────────────────────────────────
  const found = NEW_ARRIVALS.find((p) => p.id === id);
  if (!found) notFound();
  // After notFound() the function never continues — cast is safe
  const part = found as ArrivalPart;

  const images     = part.images;
  const primarySrc = images[activeImage] ?? '';

  const handleAddToCart = useCallback(() => {
    const cartItem: CartItem = {
      id:          part.id,
      name:        part.name,
      price:       part.price,
      images:      part.images,
      brand:       part.brand,
      make:        part.make as CartItem['make'],
      application: part.application,
      description: part.description,
      category:    part.category,
      inStock:     part.inStock,
      createdAt:   Date.now(),
      updatedAt:   Date.now(),
      quantity,
    };
    addToCart(cartItem);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  }, [part, quantity, addToCart]);

  const conditionBadge = {
    'New':       'border-gray-300 text-gray-700',
    'Like New':  'border-gray-300 text-gray-700',
    'Used':      'border-gray-300 text-gray-700',
  }[part.condition];

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 flex-wrap" aria-label="Breadcrumb">
          <Link href="/"  className="hover:text-gray-900 transition">Home</Link>
          <span>/</span>
          <Link href="/#new-arrivals" className="hover:text-gray-900 transition">New Arrivals</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{part.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Image Gallery ── */}
          <div>
            {/* Primary image */}
            <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3 border border-gray-200">
              {primarySrc ? (
                <img
                  src={primarySrc}
                  alt={`${part.name} — image ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Image</div>
              )}
              {!part.inStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white font-black text-2xl tracking-widest">OUT OF STOCK</span>
                </div>
              )}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                  {activeImage + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                      idx === activeImage
                        ? 'border-red-600 ring-2 ring-red-200'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-red-600 text-white text-[9px] font-bold text-center py-0.5">
                        MAIN
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold tracking-widest rounded border ${
                part.inStock ? 'border-gray-300 text-gray-700' : 'border-red-300 text-red-700'
              } bg-white`}>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${part.inStock ? 'bg-gray-700' : 'bg-red-600'}`} />
                {part.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
              </span>
              <span className={`inline-flex items-center px-3 py-1.5 text-xs font-bold tracking-widest rounded border bg-white ${conditionBadge}`}>
                {part.condition.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 leading-tight">{part.name}</h1>
            <p className="text-gray-500 font-semibold mb-2">{part.brand}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <p className="text-4xl font-black text-red-600">${part.price.toFixed(2)}</p>
              {part.shipping === 'Included' && (
                <span className="text-sm font-semibold text-gray-500">Free shipping</span>
              )}
              {part.shipping !== 'Included' && (
                <span className="text-sm text-gray-400">{part.shipping}</span>
              )}
            </div>

            {/* Application tags */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Fits</p>
              <div className="flex flex-wrap gap-2">
                {part.application.map((app) => (
                  <span key={app} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">{app}</span>
                ))}
              </div>
            </div>

            {/* Meta row */}
            <div className="mb-6 space-y-1.5 text-sm">
              <p>
                <span className="font-bold text-gray-500 uppercase text-xs tracking-widest w-24 inline-block">Category</span>
                {part.category}
              </p>
              <p>
                <span className="font-bold text-gray-500 uppercase text-xs tracking-widest w-24 inline-block">Brand</span>
                {part.brand}
              </p>
              <p>
                <span className="font-bold text-gray-500 uppercase text-xs tracking-widest w-24 inline-block">Model</span>
                {part.make}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-semibold text-sm text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-gray-100 text-xl leading-none font-bold"
                  aria-label="Decrease quantity"
                >−</button>
                <input
                  type="number" min="1" value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-14 px-2 py-2 border-x border-gray-300 text-center text-sm focus:outline-none"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-2 hover:bg-gray-100 text-xl leading-none font-bold"
                  aria-label="Increase quantity"
                >+</button>
              </div>
            </div>

            {/* Add to cart + wishlist */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!part.inStock}
                className={`flex-1 py-3 font-black text-sm tracking-wide transition rounded ${
                  addedToCart
                    ? 'bg-gray-900 text-white'
                    : part.inStock
                      ? 'bg-gray-900 hover:bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {addedToCart ? '✓ ADDED TO CART' : part.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}
              </button>
              <button
                onClick={() => setWishlisted((w) => !w)}
                aria-label="Toggle wishlist"
                className={`px-5 py-3 border-2 rounded transition ${
                  wishlisted
                    ? 'border-red-600 text-red-600'
                    : 'border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-500'
                }`}
              >
                <Heart size={22} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Share */}
            <SharePanel part={part} />

            {/* Shipping note */}
            <div className="mt-5 flex items-start gap-3 px-4 py-3 border border-gray-200 bg-white rounded">
              <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 10-4 0m4 0v6a2 2 0 002 2h10a2 2 0 002-2V8m-4 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2"/>
              </svg>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">Ships via UPS (door-to-door).</strong> We ship worldwide and this item can be combined with other products.
              </p>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mt-14 border-t pt-8">
          <div className="flex gap-0 border-b mb-6">
            {(['description', 'specs', 'questions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 pb-4 pt-1 font-semibold uppercase text-sm transition ${
                  activeTab === tab
                    ? 'text-red-600 border-b-2 border-red-600 -mb-px'
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {tab === 'description' && 'Description'}
                {tab === 'specs'       && 'Specifications'}
                {tab === 'questions'   && 'Questions (0)'}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="max-w-3xl">
              {part.description.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4 text-sm">{para}</p>
              ))}
            </div>
          )}

          {activeTab === 'specs' && (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 max-w-2xl">
              {part.specs.map(({ label, value }) => (
                <div key={label} className="flex gap-2 border-b border-gray-100 pb-2">
                  <dt className="font-bold text-gray-500 text-xs uppercase tracking-wide w-36 flex-shrink-0 pt-0.5">{label}</dt>
                  <dd className="text-gray-800 text-sm">{value}</dd>
                </div>
              ))}
              {/* Always show category, brand, model in specs */}
              {[
                { label: 'Category',  value: part.category },
                { label: 'Brand',     value: part.brand },
                { label: 'Condition', value: part.condition },
                { label: 'Shipping',  value: part.shipping === 'Included' ? 'Free shipping included' : part.shipping },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-2 border-b border-gray-100 pb-2">
                  <dt className="font-bold text-gray-500 text-xs uppercase tracking-wide w-36 flex-shrink-0 pt-0.5">{label}</dt>
                  <dd className="text-gray-800 text-sm">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {activeTab === 'questions' && (
            <div className="text-center py-12 text-gray-400">
              No questions yet. Be the first to ask!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
