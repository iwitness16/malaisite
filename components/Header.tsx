'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context';
import { useAdmin } from '@/lib/context';
import { ShoppingCart, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { MAKES, CATEGORIES } from '@/lib/types';
import SearchBar from '@/components/SearchBar';

export default function Header() {
  const { items } = useCart();
  const { isAuthenticated, logout } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="w-full bg-white border-b border-gray-200 relative z-40">
      {/* Top bar */}
      <div className="bg-gray-100 px-4 py-2 text-xs text-gray-600 flex justify-between items-center">
        <span>
          <a href="mailto:elitepartz.orders@gmail.com" className="hover:text-red-600 transition">elitepartz.orders@gmail.com</a>
          {' | '}
          <a href="https://wa.me/15072009576" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition">WhatsApp</a>
          {' | '}Worldwide Shipping
        </span>
        <div className="flex gap-4">
          {isAuthenticated && (
            <button onClick={logout} className="flex items-center gap-1 hover:text-red-600">
              <LogOut size={14} />
              Admin Logout
            </button>
          )}
        </div>
      </div>

      {/* Main header */}
      <div className="px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* Logo + Brand Name */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
              <Image
                src="/logo.jpg"
                alt="ElitePartz Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="font-black text-2xl tracking-tight leading-none select-none">
              <span className="text-red-600">Elite</span>
              <span className="text-gray-900">Partz</span>
            </span>
          </Link>

          {/* Desktop search bar */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <SearchBar variant="desktop" />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative flex items-center gap-1 text-gray-700 hover:text-red-600"
            >
              <ShoppingCart size={22} />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-3 md:hidden">
          <SearchBar variant="mobile" />
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-gray-900 text-white relative z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row`}>
            {MAKES.map((make) => (
              <div
                key={make}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(make)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="px-4 py-3 text-sm font-medium hover:bg-gray-700 w-full md:w-auto text-left flex items-center justify-between gap-1">
                  {make}
                  <ChevronDown size={14} className="opacity-60" />
                </button>

                {/* Dropdown */}
                <div className={`${
                  openDropdown === make ? 'block' : 'hidden'
                } md:group-hover:block absolute left-0 top-full w-60 bg-white text-gray-900 shadow-xl z-50 border-t-2 border-red-600`}>
                  {CATEGORIES.map((category) => (
                    <Link
                      key={category}
                      href={`/parts?make=${encodeURIComponent(make)}&category=${encodeURIComponent(category)}`}
                      className="block px-4 py-2 text-sm hover:bg-red-50 hover:text-red-600 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href="/parts"
              className="px-4 py-3 text-sm font-medium hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              ALL PARTS
            </Link>
            <Link
              href="/evaluate"
              className="px-4 py-3 text-sm font-medium hover:bg-gray-700 flex items-center gap-1.5 ml-auto"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg viewBox="0 0 48 48" className="w-3.5 h-3.5 flex-shrink-0">
                <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.1 17.8 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9c4.5-4.1 7.1-10.2 7.1-17.1z"/>
                <path fill="#FBBC05" d="M10.6 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6l-7.9-6.1A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.9-6.1z"/>
                <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.2-8.3 2.2-6.2 0-11.5-3.6-13.4-8.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/>
              </svg>
              EVALUATE
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
