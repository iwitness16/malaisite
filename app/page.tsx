'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NEW_ARRIVALS, ArrivalPart } from '@/lib/arrivals-data';

// ─── Homepage Reviews ─────────────────────────────────────────────────────────
const HOME_REVIEWS = [
  {
    avatar: '/reviewimages/2.jpg',
    name: 'Marcus J.',
    location: 'Texas, USA',
    car: 'Ford F-150 2018',
    stars: 5,
    text: 'Ordered OEM headlights for my F-150 and they fit perfectly out of the box. Shipping was fast and everything was packed really well. Will definitely be ordering again.',
  },
  {
    avatar: '/reviewimages/4.jpg',
    name: 'Darnell W.',
    location: 'Georgia, USA',
    car: 'Cadillac Escalade 2022',
    stars: 5,
    text: 'Got a set of 22" OEM wheels for my Escalade. Not replicas — the real deal. ElitePartz responded to every question quickly and the product arrived in perfect condition.',
  },
  {
    avatar: '/reviewimages/6.jpg',
    name: 'Carlos M.',
    location: 'California, USA',
    car: 'Chevrolet Silverado 2021',
    stars: 5,
    text: 'Found a SmartCap for my Silverado that I could not find anywhere else locally. Ordered it here, arrived on time, fitment was spot on. Great experience all around.',
  },
  {
    avatar: '/reviewimages/10.jpg',
    name: 'Ahmed R.',
    location: 'UAE',
    car: 'Mercedes-Benz GLE 2020',
    stars: 5,
    text: 'Sourced genuine Mercedes parts through ElitePartz and the quality is exactly what you expect from OEM. Communication was professional and shipping to UAE was smooth.',
  },
  {
    avatar: '/reviewimages/12.jpg',
    name: 'Kevin T.',
    location: 'Florida, USA',
    car: 'Toyota RAV4 2023',
    stars: 5,
    text: 'This is my second order with ElitePartz. Consistent quality, genuine parts, fair prices. The team clearly knows their vehicles and makes the whole process easy.',
  },
];

// ─── Trust feature data ───────────────────────────────────────────────────────
const TRUST_FEATURES = [
  {
    title: 'Genuine Parts Only',
    body: 'Every item we sell is 100% authentic. We do not stock copies, replicas, or grey-market goods.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    title: 'Worldwide Shipping',
    body: 'We ship to any destination in the world. Fast dispatch and competitive rates on every order.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    title: 'Expert Support',
    body: 'Our team are car owners and enthusiasts themselves. Ask us anything before or after your purchase.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    title: 'Secure Checkout',
    body: 'All transactions are protected with industry-standard encryption. Shop with complete peace of mind.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    title: '5 Years of Trust',
    body: 'Since 2021, customers across 40+ countries have trusted ElitePartz for their builds and repairs.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
  },
  {
    title: 'Easy Returns',
    body: 'Something not right? Our hassle-free return process ensures you are always looked after.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 1 0 .49-3.51"/>
      </svg>
    ),
  },
];

// ─── Brand cards for the Browse section ──────────────────────────────────────
const BRAND_CARDS = [
  { name: 'Ford F-150',           make: 'Ford F-150',           image: '/ford.png'          },
  { name: 'Toyota RAV4',          make: 'Toyota RAV4',          image: '/toyota.png'        },
  { name: 'Chevrolet Silverado',  make: 'Chevrolet Silverado',  image: '/chevy.png'         },
  { name: 'Nissan',               make: 'Nissan',               image: '/nissan .png'       },
  { name: 'Mercedes-Benz',        make: 'Mercedes-Benz',        image: '/mercedes.png'      },
  { name: 'Cadillac',             make: 'Cadillac',             image: '/cadillac.png'      },
];

// ─── Mini ProductCard for hardcoded arrivals ──────────────────────────────────
function ArrivalCard({ part }: { part: ArrivalPart }) {
  return (
    <Link
      href={`/arrivals/${part.id}`}
      className="group bg-white border border-gray-100 hover:shadow-lg transition duration-300 flex flex-col h-full rounded overflow-hidden"
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={part.images[0]}
          alt={part.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {!part.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold">Out of Stock</span>
          </div>
        )}
        {/* Condition badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-black rounded tracking-wide bg-gray-900 text-white">
          {part.condition.toUpperCase()}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-3 md:p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 font-semibold">{part.brand}</p>
        <h3 className="font-bold text-sm text-gray-900 mb-2 line-clamp-2 flex-1">{part.name}</h3>
        <p className="text-lg font-black text-red-600 mb-3">${part.price.toLocaleString()}</p>
        <div className="w-full py-2 bg-gray-900 group-hover:bg-red-600 text-white text-xs font-bold text-center tracking-wide transition">
          VIEW PART
        </div>
      </div>
    </Link>
  );
}

// ─── Review Carousel ──────────────────────────────────────────────────────────
function ReviewCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % HOME_REVIEWS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const review = HOME_REVIEWS[active];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-black text-gray-900">What Customers Say</h2>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white border border-gray-100 rounded-xl p-6 shadow-sm relative overflow-hidden transition-all duration-500">
        {/* Decorative quote mark */}
        <svg className="absolute top-4 right-5 w-10 h-10 text-red-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>

        {/* Stars */}
        <div className="flex gap-0.5 mb-3">
          {[...Array(review.stars)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          ))}
        </div>

        {/* Review text */}
        <p className="text-gray-700 text-sm leading-relaxed mb-5 relative z-10">
          {review.text}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-red-100 flex-shrink-0"
          />
          <div>
            <p className="font-bold text-sm text-gray-900">{review.name}</p>
            <p className="text-xs text-gray-400">{review.car} &bull; {review.location}</p>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="flex gap-2 mt-4 justify-center">
        {HOME_REVIEWS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to review ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? 'w-6 bg-red-600' : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* See all link */}
      <Link
        href="/evaluate"
        className="mt-3 text-xs text-center text-red-600 hover:text-red-700 font-semibold transition"
      >
        Read all reviews on Evaluate page
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main className="w-full">

      {/* ── Browse by Brand ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <h2 className="text-3xl font-bold mb-2 text-center">Browse by Brand</h2>
        <p className="text-gray-500 text-sm text-center mb-8">Select your vehicle brand to find the right parts</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {BRAND_CARDS.map((c) => (
            <Link
              key={c.make}
              href={`/parts?make=${encodeURIComponent(c.make)}`}
              className="relative group overflow-hidden rounded-lg ring-1 ring-gray-200 hover:ring-red-500 transition"
            >
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-44 md:h-52 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end">
                <div className="p-3 w-full text-center">
                  <p className="text-white font-black text-base leading-none">{c.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold">New Arrivals</h2>
          <Link href="/parts" className="text-sm text-red-600 hover:text-red-700 font-semibold transition">
            Shop All Parts
          </Link>
        </div>
        <p className="text-gray-500 text-sm mb-8">Latest additions to the ElitePartz catalogue</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {NEW_ARRIVALS.map((part) => (
            <ArrivalCard key={part.id} part={part} />
          ))}
        </div>
      </section>

      {/* ── Trust + Reviews ── */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">

          {/* Trust grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-2">Why Shop With Us</h2>
            <p className="text-gray-500 text-sm text-center mb-10">
              ElitePartz has been serving the automotive community since 2021
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {TRUST_FEATURES.map(({ title, body, icon }) => (
                <div
                  key={title}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-14 h-14 rounded-full bg-red-50 group-hover:bg-red-600 flex items-center justify-center text-red-600 group-hover:text-white transition duration-300 mb-3 flex-shrink-0 shadow-sm">
                    {icon}
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews + CTA side by side */}
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Review carousel */}
            <ReviewCarousel />

            {/* CTA card */}
            <div className="bg-gray-900 rounded-xl p-8 flex flex-col justify-between h-full text-white">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-black text-3xl">
                    <span className="text-red-500">Elite</span>Partz
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">Ready to find parts for your vehicle?</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  We stock genuine OEM and premium aftermarket parts for Ford F-150, Toyota RAV4, Chevrolet Silverado, Nissan, Mercedes-Benz, and Cadillac. From wheels and exterior upgrades to engine components, find everything you need in one place.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { value: '5+',   label: 'Years active' },
                    { value: '40+',  label: 'Countries served' },
                    { value: '100%', label: 'Genuine parts' },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center">
                      <p className="text-2xl font-black text-red-500">{value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/parts"
                  className="block text-center py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide transition rounded"
                >
                  SHOP ALL PARTS
                </Link>
                <Link
                  href="/evaluate"
                  className="block text-center py-3 border border-gray-600 hover:border-white text-gray-300 hover:text-white font-semibold text-sm transition rounded"
                >
                  Read Customer Reviews
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
