'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAllParts } from '@/lib/firebase';
import { Part, MAKES, CATEGORIES } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';

function PartsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [parts,          setParts]          = useState<Part[]>([]);
  const [filteredParts,  setFilteredParts]  = useState<Part[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [selectedMake,   setSelectedMake]   = useState('');
  const [selectedCat,    setSelectedCat]    = useState('');
  const [selectedBrand,  setSelectedBrand]  = useState('');
  const [inStockOnly,    setInStockOnly]    = useState(false);
  const [sortBy,         setSortBy]         = useState('latest');
  const [showFilters,    setShowFilters]    = useState(false);
  const [searchQuery,    setSearchQuery]    = useState('');

  // ── Fetch ──
  useEffect(() => {
    getAllParts()
      .then((all) => { setParts(all); setFilteredParts(all); })
      .catch((e)  => console.error('Error fetching parts:', e))
      .finally(()  => setLoading(false));
  }, []);

  // ── Sync URL params → state ──
  useEffect(() => {
    const make     = searchParams.get('make')     ?? '';
    const category = searchParams.get('category') ?? '';
    const search   = searchParams.get('search')   ?? '';
    setSelectedMake(make);
    setSelectedCat(category);
    setSearchQuery(search);
  }, [searchParams]);

  // ── Filter + sort ──
  useEffect(() => {
    let result = [...parts];

    // "All Models" parts always appear regardless of which make is selected
    if (selectedMake)  result = result.filter((p) => p.make === selectedMake || p.make === 'All Models');
    if (selectedCat)   result = result.filter((p) => p.category === selectedCat);
    if (selectedBrand) result = result.filter((p) => p.brand === selectedBrand);
    if (inStockOnly)   result = result.filter((p) => p.inStock);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc')  result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'name')  result.sort((a, b) => a.name.localeCompare(b.name));
    else                         result.sort((a, b) => b.createdAt - a.createdAt);

    setFilteredParts(result);
  }, [parts, selectedMake, selectedCat, selectedBrand, inStockOnly, sortBy, searchQuery]);

  // Brands derived from current parts
  const brands = Array.from(new Set(parts.map((p) => p.brand))).sort();

  const resetFilters = () => {
    setSelectedMake('');
    setSelectedCat('');
    setSelectedBrand('');
    setInStockOnly(false);
    setSortBy('latest');
    setSearchQuery('');
    router.push('/parts');
  };

  const hasActiveFilters =
    !!selectedMake || !!selectedCat || !!selectedBrand || inStockOnly || !!searchQuery;

  // ── Sidebar ──
  const Sidebar = () => (
    <div className="p-6 space-y-6">
      {/* Make / Year */}
      <div>
        <h3 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-3">Vehicle Brand</h3>
        <div className="space-y-2">
          {[{ label: 'All Brands', value: '' }, ...MAKES.map((m) => ({ label: m, value: m }))].map(({ label, value }) => (
            <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio" name="make" value={value}
                checked={selectedMake === value}
                onChange={() => setSelectedMake(value)}
                className="w-4 h-4 accent-red-600"
              />
              <span className="text-sm group-hover:text-red-600 transition">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category — uses CATEGORIES constant, never shows removed ones */}
      <div className="border-t pt-5">
        <h3 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-3">Category</h3>
        <div className="space-y-2">
          {[{ label: 'All Categories', value: '' }, ...CATEGORIES.map((c) => ({ label: c, value: c }))].map(({ label, value }) => (
            <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio" name="category" value={value}
                checked={selectedCat === value}
                onChange={() => setSelectedCat(value)}
                className="w-4 h-4 accent-red-600"
              />
              <span className="text-sm group-hover:text-red-600 transition">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div className="border-t pt-5">
          <h3 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-3">Brand</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {[{ label: 'All Brands', value: '' }, ...brands.map((b) => ({ label: b, value: b }))].map(({ label, value }) => (
              <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="radio" name="brand" value={value}
                  checked={selectedBrand === value}
                  onChange={() => setSelectedBrand(value)}
                  className="w-4 h-4 accent-red-600"
                />
                <span className="text-sm group-hover:text-red-600 transition">{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Stock */}
      <div className="border-t pt-5">
        <h3 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-3">Availability</h3>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox" checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 accent-red-600"
          />
          <span className="text-sm group-hover:text-red-600 transition">In Stock Only</span>
        </label>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full py-2.5 border-2 border-gray-200 hover:border-red-500 text-gray-600 hover:text-red-600 text-sm font-bold transition rounded flex items-center justify-center gap-2"
        >
          <X size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:block w-64 flex-shrink-0 border-r border-gray-100 sticky top-0 max-h-screen overflow-y-auto">
        <Sidebar />
      </aside>

      {/* ── Mobile filter drawer ── */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="relative w-72 bg-white h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)} aria-label="Close filters">
                <X size={22} />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0">
        <div className="px-4 sm:px-6 lg:px-8 py-6">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {selectedCat || selectedMake || 'All Parts'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {loading ? 'Loading…' : `${filteredParts.length} item${filteredParts.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-semibold hover:border-red-500 hover:text-red-600 transition rounded"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-3 pr-8 py-2 border border-gray-300 bg-white text-sm cursor-pointer appearance-none rounded focus:outline-none focus:border-red-500"
                >
                  <option value="latest">Newest First</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="name">Name A → Z</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedMake  && <FilterChip label={selectedMake}  onRemove={() => setSelectedMake('')} />}
              {selectedCat   && <FilterChip label={selectedCat}   onRemove={() => setSelectedCat('')} />}
              {selectedBrand && <FilterChip label={selectedBrand} onRemove={() => setSelectedBrand('')} />}
              {inStockOnly   && <FilterChip label="In Stock Only"  onRemove={() => setInStockOnly(false)} />}
              {searchQuery   && <FilterChip label={`"${searchQuery}"`} onRemove={() => setSearchQuery('')} />}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 h-80 animate-pulse rounded" />
              ))}
            </div>
          ) : filteredParts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredParts.map((part) => (
                <ProductCard key={part.id} part={part} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-3">No parts found.</p>
              <button onClick={resetFilters} className="text-red-600 hover:text-red-700 font-semibold text-sm">
                Clear all filters →
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full">
      {label}
      <button onClick={onRemove} aria-label={`Remove filter: ${label}`}>
        <X size={12} />
      </button>
    </span>
  );
}

export default function PartsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center text-gray-400">
        Loading parts…
      </div>
    }>
      <PartsContent />
    </Suspense>
  );
}
