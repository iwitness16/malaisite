'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  KeyboardEvent,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ShoppingCart, Loader2 } from 'lucide-react';
import { getAllParts } from '@/lib/firebase';
import { Part } from '@/lib/types';
import { useCart } from '@/lib/context';

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Highlight matched substring in a string */
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-100 text-yellow-900 font-bold rounded-sm px-px">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

/** Score a part against a query — higher = better match */
function scorePart(part: Part, q: string): number {
  const lq = q.toLowerCase();
  let score = 0;
  if (part.name.toLowerCase().includes(lq))        score += 10;
  if (part.name.toLowerCase().startsWith(lq))      score += 5;
  if (part.brand.toLowerCase().includes(lq))       score += 6;
  if (part.category.toLowerCase().includes(lq))    score += 4;
  if (part.make.toLowerCase().includes(lq))        score += 4;
  if (part.description.toLowerCase().includes(lq)) score += 2;
  if (part.application.some((a) => a.toLowerCase().includes(lq))) score += 3;
  return score;
}

// ─── component ───────────────────────────────────────────────────────────────

interface SearchBarProps {
  /** 'desktop' renders inline with full width; 'mobile' renders full-width block */
  variant?: 'desktop' | 'mobile';
}

export default function SearchBar({ variant = 'desktop' }: SearchBarProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [query,        setQuery]        = useState('');
  const [results,      setResults]      = useState<Part[]>([]);
  const [allParts,     setAllParts]     = useState<Part[] | null>(null);
  const [loading,      setLoading]      = useState(false);
  const [open,         setOpen]         = useState(false);
  const [activeIdx,    setActiveIdx]    = useState(-1);
  const [addedId,      setAddedId]      = useState<string | null>(null);

  const containerRef  = useRef<HTMLDivElement>(null);
  const inputRef      = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Fetch all parts once on first focus ─────────────────────────────────────
  const ensurePartsLoaded = useCallback(async () => {
    if (allParts !== null) return;
    setLoading(true);
    try {
      const parts = await getAllParts();
      setAllParts(parts);
    } catch {
      setAllParts([]);
    } finally {
      setLoading(false);
    }
  }, [allParts]);

  // ── Search whenever query or allParts change ─────────────────────────────────
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!query.trim() || !allParts) {
      setResults([]);
      setActiveIdx(-1);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      const q = query.trim();
      const scored = allParts
        .map((p) => ({ part: p, score: scorePart(p, q) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map(({ part }) => part);

      setResults(scored);
      setActiveIdx(-1);
      setOpen(scored.length > 0 || q.length >= 2);
    }, 200);
  }, [query, allParts]);

  // ── Close on outside click ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Keyboard navigation ──────────────────────────────────────────────────────
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIdx >= 0 && results[activeIdx]) {
        router.push(`/parts/${results[activeIdx].id}`);
        closeOverlay();
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      closeOverlay();
    }
  };

  const closeOverlay = () => {
    setOpen(false);
    setActiveIdx(-1);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/parts?search=${encodeURIComponent(query.trim())}`);
    closeOverlay();
  };

  const handleAddToCart = (e: React.MouseEvent, part: Part) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...part, quantity: 1 });
    setAddedId(part.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const clearQuery = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const isDesktop = variant === 'desktop';

  return (
    <div
      ref={containerRef}
      className={`relative ${isDesktop ? 'flex-1 max-w-lg' : 'w-full'}`}
    >
      {/* ── Input row ── */}
      <div className="flex">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Search parts, brands, models..."
            aria-label="Search parts"
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={ensurePartsLoaded}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-8 py-2 border border-gray-300 bg-white focus:outline-none focus:border-red-500 text-sm"
          />
          {query && (
            <button
              onClick={clearQuery}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="px-5 py-2 bg-red-600 text-white hover:bg-red-700 font-semibold text-sm transition flex items-center gap-2 flex-shrink-0"
          aria-label="Submit search"
        >
          {loading
            ? <Loader2 size={15} className="animate-spin" />
            : <Search size={15} />
          }
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* ── Results overlay ── */}
      {open && (
        <div
          className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 shadow-2xl z-[999] rounded-b-xl overflow-hidden"
          style={{ maxHeight: '72vh', overflowY: 'auto' }}
          role="listbox"
          aria-label="Search suggestions"
        >
          {/* Loading state */}
          {loading && (
            <div className="px-4 py-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
              <Loader2 size={18} className="animate-spin" />
              Loading parts database…
            </div>
          )}

          {/* No results */}
          {!loading && results.length === 0 && query.trim().length >= 2 && (
            <div className="px-5 py-6 text-center">
              <p className="text-gray-500 text-sm mb-3">
                No parts found for <strong>&quot;{query}&quot;</strong>
              </p>
              <Link
                href={`/parts?search=${encodeURIComponent(query)}`}
                onClick={closeOverlay}
                className="inline-block text-xs font-semibold text-red-600 hover:text-red-700 transition"
              >
                Browse all parts instead
              </Link>
            </div>
          )}

          {/* Results list */}
          {!loading && results.length > 0 && (
            <>
              {/* Header bar */}
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                </span>
                <button onClick={closeOverlay} className="text-gray-400 hover:text-gray-600" aria-label="Close">
                  <X size={14} />
                </button>
              </div>

              {results.map((part, idx) => {
                const isActive  = idx === activeIdx;
                const wasAdded  = addedId === part.id;
                const primary   = part.images?.[0] ?? '';

                return (
                  <div
                    key={part.id}
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIdx(idx)}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 transition cursor-pointer ${
                      isActive ? 'bg-red-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/parts/${part.id}`}
                      onClick={closeOverlay}
                      className="flex-shrink-0"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        {primary ? (
                          <img
                            src={primary}
                            alt={part.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                            No img
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <Link
                      href={`/parts/${part.id}`}
                      onClick={closeOverlay}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide truncate">
                        {part.brand} &bull; {part.category}
                      </p>
                      <p className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mt-0.5">
                        <Highlight text={part.name} query={query} />
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-sm font-black text-red-600">
                          ${part.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          part.inStock
                            ? 'border-gray-300 text-gray-600 bg-white'
                            : 'border-red-300 text-red-600 bg-white'
                        }`}>
                          {part.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
                          {part.make}
                        </span>
                      </div>
                    </Link>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <button
                        onClick={(e) => handleAddToCart(e, part)}
                        disabled={!part.inStock}
                        title={part.inStock ? 'Add to cart' : 'Out of stock'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
                          wasAdded
                            ? 'bg-gray-900 text-white'
                            : part.inStock
                              ? 'bg-gray-900 hover:bg-red-600 text-white'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart size={12} />
                        {wasAdded ? 'Added!' : 'Add'}
                      </button>
                      <Link
                        href={`/parts/${part.id}`}
                        onClick={closeOverlay}
                        className="text-[11px] text-red-600 hover:text-red-700 font-semibold transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}

              {/* Footer — show all results */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <Link
                  href={`/parts?search=${encodeURIComponent(query)}`}
                  onClick={closeOverlay}
                  className="block text-center text-sm font-bold text-red-600 hover:text-red-700 transition"
                >
                  See all results for &quot;{query}&quot; in parts catalogue
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
