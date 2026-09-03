'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Part } from '@/lib/types';
import { useCart } from '@/lib/context';
import { useState } from 'react';

interface ProductCardProps {
  part: Part;
}

export default function ProductCard({ part }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Use the first image as the primary display image
  const primaryImage = part.images?.[0] ?? '';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({ ...part, quantity: 1 });
  };

  return (
    <Link href={`/parts/${part.id}`}>
      <div className="group bg-white hover:shadow-lg transition duration-300 cursor-pointer h-full flex flex-col border border-gray-100">
        {/* Image */}
        <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={part.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
              No Image
            </div>
          )}
          {!part.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <p className="text-white font-bold text-lg">Out of Stock</p>
            </div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
            aria-label="Add to wishlist"
          >
            <Heart
              size={18}
              className={isWishlisted ? 'fill-red-600 text-red-600' : 'text-gray-400'}
            />
          </button>
          {/* Image count badge */}
          {(part.images?.length ?? 0) > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              +{part.images.length - 1}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-3 md:p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{part.brand}</p>
          <h3 className="font-bold text-sm md:text-base text-gray-900 mb-2 line-clamp-2 flex-1">
            {part.name}
          </h3>
          <div className="mt-auto">
            <p className="text-lg font-bold text-red-600 mb-3">${part.price.toFixed(2)}</p>
            <button
              onClick={handleAddToCart}
              disabled={!part.inStock}
              className="w-full py-2 bg-gray-900 hover:bg-red-600 disabled:bg-gray-300 text-white font-semibold text-sm transition"
            >
              {part.inStock ? 'ADD TO CART' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
