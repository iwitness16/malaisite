'use client';

import { useState } from 'react';
import Link from 'next/link';

// All review avatar images from /public/reviewimages
const AVATARS = [
  '/reviewimages/2.jpg',
  '/reviewimages/4.jpg',
  '/reviewimages/6.jpg',
  '/reviewimages/10.jpg',
  '/reviewimages/12.jpg',
  '/reviewimages/14.jpg',
  '/reviewimages/16.jpg',
  '/reviewimages/20.jpg',
  '/reviewimages/24.jpg',
  '/reviewimages/26.jpg',
  '/reviewimages/30.jpg',
  '/reviewimages/150.jpg',
  '/reviewimages/150 (1).jpg',
  '/reviewimages/150 (2).jpg',
  '/reviewimages/150 (3).jpg',
  '/reviewimages/150 (4).jpg',
  '/reviewimages/150 (5).jpg',
  '/reviewimages/150 (6).jpg',
  '/reviewimages/150 (7).jpg',
  '/reviewimages/150 (8).jpg',
  '/reviewimages/150 (9).jpg',
  '/reviewimages/150 (10).jpg',
];

function av(i: number) { return AVATARS[i % AVATARS.length]; }


// Google icon SVG
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-4 h-4 flex-shrink-0">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.1 17.8 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9c4.5-4.1 7.1-10.2 7.1-17.1z"/>
      <path fill="#FBBC05" d="M10.6 28.6A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6l-7.9-6.1A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.7 10.7l7.9-6.1z"/>
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.2-8.3 2.2-6.2 0-11.5-3.6-13.4-8.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/>
    </svg>
  );
}

// Star row
function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < n ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}


// 36 reviews — index 0 = newest (July 20 2026), index 35 = oldest (2022)
type Review = { name: string; location: string; car: string; stars: number; date: string; text: string; avatar: string; };

const ALL_REVIEWS: Review[] = [
  { name: 'Marcus J.',     location: 'Texas, USA',       car: 'Ford F-150 Raptor 2018',      stars: 5, date: '20 July 2026',      avatar: av(0),  text: 'Ordered OEM headlights for my Raptor and they fit perfectly out of the box. Shipping was fast and everything was packed really well. Will be ordering again.' },
  { name: 'Darnell W.',    location: 'Georgia, USA',     car: 'Cadillac Escalade 2022',       stars: 5, date: '18 July 2026',      avatar: av(1),  text: 'Third order from ElitePartz and every time it is the same experience. Genuine OEM product, fast delivery, and a team that actually knows these vehicles well.' },
  { name: 'Sofia R.',      location: 'Spain',            car: 'Mercedes-Benz GLE 2021',       stars: 5, date: '15 July 2026',      avatar: av(2),  text: 'The side skirts arrived with no damage and in perfect finish. Fitment on the first try with no modification needed. Very satisfied.' },
  { name: 'Kevin T.',      location: 'Florida, USA',     car: 'Toyota RAV4 2023',             stars: 5, date: '12 July 2026',      avatar: av(3),  text: 'The strut bar made an immediate difference to how the vehicle handles in corners. Well packaged and delivered faster than estimated.' },
  { name: 'Carlos M.',     location: 'California, USA',  car: 'Chevrolet Silverado 2020',     stars: 5, date: '9 July 2026',       avatar: av(4),  text: 'Found the SmartCap for my Silverado here when I could not find it anywhere locally. Easy to order and the install was clean. Highly recommended.' },
  { name: 'Ahmed R.',      location: 'UAE',              car: 'Mercedes-Benz S-Class 2022',   stars: 5, date: '6 July 2026',       avatar: av(5),  text: 'Bought genuine Mercedes parts. Quality is exactly what you would expect from OEM. Will be ordering the matching trim pieces next.' },
  { name: 'Ryan M.',       location: 'Canada',           car: 'Ford F-150 2019',              stars: 5, date: '3 July 2026',       avatar: av(6),  text: 'Great selection and the part fit perfectly first time. Shipping to Canada was faster than I expected and everything was packed really well.' },
  { name: 'Paolo R.',      location: 'Philippines',      car: 'Nissan Patrol 2020',           stars: 5, date: '29 June 2026',      avatar: av(7),  text: 'First time ordering and it went smoothly. The team responded quickly to my questions and the product arrived in perfect condition.' },
  { name: 'Tom H.',        location: 'United Kingdom',   car: 'Cadillac Escalade 2023',       stars: 5, date: '25 June 2026',      avatar: av(8),  text: 'Ordered 22-inch OEM wheels and they look incredible. The packaging was very secure and delivery was within the estimated window.' },
  { name: 'Yuki A.',       location: 'Japan',            car: 'Toyota RAV4 2022',             stars: 5, date: '20 June 2026',      avatar: av(9),  text: 'Super happy with this purchase. The quality is well above average and the price was fair for an authentic OEM item.' },
  { name: 'Ethan L.',      location: 'United States',    car: 'Chevrolet Silverado 2021',     stars: 5, date: '15 June 2026',      avatar: av(10), text: 'The truck cap went on without any fuss. Looks clean and the fitment is precise. Would recommend to any Silverado owner.' },
  { name: 'Hana C.',       location: 'Taiwan',           car: 'Nissan Murano 2021',           stars: 5, date: '10 June 2026',      avatar: av(11), text: 'Bought interior trim pieces and everything fits like it was made for the car — because it was. Great shop.' },
  { name: 'Damien V.',     location: 'France',           car: 'Mercedes-Benz GLC 2022',       stars: 5, date: '4 June 2026',       avatar: av(12), text: 'Always a bit nervous ordering from overseas but ElitePartz made it easy. Good tracking updates and the part was in stock as shown.' },
  { name: 'Josh N.',       location: 'New Zealand',      car: 'Ford F-150 2021',              stars: 5, date: '28 May 2026',       avatar: av(13), text: 'The running boards are exactly what the truck needed. Fitment is spot on and the finish is clean. Shipping to NZ was surprisingly quick.' },
  { name: 'Mei L.',        location: 'Singapore',        car: 'Toyota RAV4 2020',             stars: 4, date: '20 May 2026',       avatar: av(14), text: 'Very solid product overall. Slight delay in dispatch but the team kept me informed. Part arrived in perfect condition and fits well.' },
  { name: 'Alex P.',       location: 'Poland',           car: 'Chevrolet Silverado 2019',     stars: 5, date: '12 May 2026',       avatar: av(15), text: 'Ordered a bed cover and it was exactly as described. The quality is obviously genuine and the price was reasonable for what you get.' },
  { name: 'Michael S.',    location: 'Texas, USA',       car: 'Cadillac Escalade 2022',       stars: 5, date: '5 May 2026',        avatar: av(16), text: 'Got a set of Escalade factory take-offs and they look incredible. Will be ordering from ElitePartz again for my next upgrade.' },
  { name: 'Emma G.',       location: 'Netherlands',      car: 'Nissan Pathfinder 2021',       stars: 5, date: '27 April 2026',     avatar: av(17), text: 'Came here based on a recommendation and now I understand why everyone talks about this shop. Excellent service and genuine parts.' },
  { name: 'Ben O.',        location: 'Ireland',          car: 'Ford F-150 2018',              stars: 5, date: '18 April 2026',     avatar: av(18), text: 'The Raptor front bumper transforms the look completely. Install was straightforward and the finish is consistent with factory spec.' },
  { name: 'Priya N.',      location: 'India',            car: 'Toyota RAV4 2023',             stars: 5, date: '8 April 2026',      avatar: av(19), text: 'Was unsure about ordering internationally but the whole process was smooth. Clear communication and the product was exactly as pictured.' },
  { name: 'Diego F.',      location: 'Brazil',           car: 'Mercedes-Benz C-Class 2022',   stars: 5, date: '28 March 2026',     avatar: av(20), text: 'The quality on the OEM parts is very good. Worth every cent for the fit and finish. Much better than aftermarket alternatives.' },
  { name: 'Lin Y.',        location: 'China',            car: 'Cadillac Escalade 2021',       stars: 5, date: '17 March 2026',     avatar: av(21), text: 'Ordered a set of 22-inch OEM wheels and the car looks completely different. Great advice from the team and delivery tracking worked perfectly.' },
  { name: 'Sam T.',        location: 'South Africa',     car: 'Chevrolet Silverado 2020',     stars: 5, date: '5 March 2026',      avatar: av(0),  text: 'Shipping to South Africa took a bit longer but the team warned me upfront. The part was authentic and packaging was solid throughout transit.' },
  { name: 'Finn B.',       location: 'Sweden',           car: 'Nissan Armada 2021',           stars: 4, date: '20 February 2026',  avatar: av(1),  text: 'Good experience overall. The part took slightly longer than expected to arrive but it was well packed and genuine. Would order again.' },
  { name: 'Nadia M.',      location: 'UAE',              car: 'Mercedes-Benz GLE 2022',       stars: 5, date: '5 February 2026',   avatar: av(2),  text: 'Very professional from start to finish. Ordered two items and both arrived together, well packed. The quality speaks for itself.' },
  { name: 'Chris D.',      location: 'United States',    car: 'Ford F-150 2020',              stars: 5, date: '20 January 2026',   avatar: av(3),  text: 'The hood vent is a perfect fit. No drilling, no modification. Just bolted straight on. This is what genuine OEM parts do that knockoffs cannot.' },
  { name: 'Ava S.',        location: 'Canada',           car: 'Cadillac Escalade 2022',       stars: 5, date: '3 January 2026',    avatar: av(4),  text: 'My second order and the experience was just as good as the first. The OEM wheel set is an upgrade in every direction.' },
  { name: 'Kota I.',       location: 'Japan',            car: 'Toyota RAV4 2021',             stars: 5, date: '14 December 2025',  avatar: av(5),  text: 'Fast shipping and the part quality is consistent with what the OEM produces. I have ordered three times now and will continue to.' },
  { name: 'Oliver W.',     location: 'United Kingdom',   car: 'Ford F-150 2019',              stars: 5, date: '28 November 2025',  avatar: av(6),  text: 'The bumper arrived exactly as described and fits the factory mounting points perfectly. A great upgrade for the front end.' },
  { name: 'Leila A.',      location: 'Morocco',          car: 'Nissan Navara 2020',           stars: 4, date: '10 November 2025',  avatar: av(7),  text: 'Smooth process from payment to delivery. The part was listed as in stock and it was dispatched within two days exactly as promised.' },
  { name: 'Isaac J.',      location: 'Nigeria',          car: 'Toyota RAV4 2019',             stars: 5, date: '20 October 2025',   avatar: av(8),  text: 'International shipping to Nigeria was handled well. The item was in sealed OEM packaging and fit without any adjustments. Very happy.' },
  { name: 'Mia H.',        location: 'Denmark',          car: 'Mercedes-Benz E-Class 2022',   stars: 5, date: '5 October 2025',    avatar: av(9),  text: 'Excellent shop for genuine OEM parts. The brake kit I ordered came with all hardware included and the quality is clearly authentic.' },
  { name: 'Tariq S.',      location: 'Saudi Arabia',     car: 'Cadillac Escalade 2023',       stars: 5, date: '15 September 2025', avatar: av(10), text: 'I run a car workshop here and recommend ElitePartz to all my customers. The parts are always genuine and the service is consistent.' },
  { name: 'Grace O.',      location: 'Ghana',            car: 'Chevrolet Silverado 2021',     stars: 5, date: '22 August 2025',    avatar: av(11), text: 'First experience with this shop and it was positive from start to finish. The side mirror caps are a quality item at a fair price.' },
  { name: 'Daniel C.',     location: 'Portugal',         car: 'Ford F-150 2020',              stars: 5, date: '10 June 2024',      avatar: av(12), text: 'Ordered a tonneau cover and the fitment was faultless. The finish is clean and it locks securely. Great product.' },
  { name: 'Kim J.',        location: 'South Korea',      car: 'Nissan Frontier 2022',         stars: 5, date: '14 March 2022',     avatar: av(13), text: 'One of the first orders I placed here and still remember how smooth it was. They have been consistent ever since. Good people.' },
];

const REVIEWS_PER_PAGE = 6;
const TOTAL_PAGES = Math.ceil(ALL_REVIEWS.length / REVIEWS_PER_PAGE);


function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-100 flex-shrink-0"
          />
          <div>
            <p className="font-bold text-sm text-gray-900 leading-tight">{review.name}</p>
            <p className="text-xs text-gray-400">{review.car} &bull; {review.location}</p>
          </div>
        </div>
        {/* Google verified badge */}
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-full px-2 py-1 flex-shrink-0">
          <GoogleIcon />
          <span className="text-[10px] text-gray-500 font-semibold">Verified</span>
        </div>
      </div>

      {/* Stars + date */}
      <div className="flex items-center justify-between">
        <Stars n={review.stars} />
        <span className="text-xs text-gray-400">{review.date}</span>
      </div>

      {/* Review text */}
      <p className="text-sm text-gray-700 leading-relaxed">{review.text}</p>

      {/* ElitePartz reply stub */}
      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 border-l-2 border-red-400">
        <span className="font-bold text-gray-700">ElitePartz</span> &nbsp;Thank you for your review. We are glad everything arrived well and look forward to your next order.
      </div>
    </div>
  );
}

export default function EvaluatePage() {
  const [page, setPage] = useState(1);

  const start   = (page - 1) * REVIEWS_PER_PAGE;
  const visible = ALL_REVIEWS.slice(start, start + REVIEWS_PER_PAGE);

  const avgRating = (ALL_REVIEWS.reduce((s, r) => s + r.stars, 0) / ALL_REVIEWS.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Page header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GoogleIcon />
            <span className="text-sm font-semibold text-gray-600">Google Reviews</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-1">
            <span className="text-red-600">86</span>PARTS Reviews
          </h1>
          <p className="text-gray-500 text-sm mb-4">What our community says about us worldwide</p>

          {/* Rating summary */}
          <div className="inline-flex items-center gap-4 bg-white border border-gray-100 shadow-sm rounded-2xl px-6 py-4">
            <div className="text-center">
              <p className="text-5xl font-black text-gray-900">{avgRating}</p>
              <Stars n={5} />
              <p className="text-xs text-gray-400 mt-1">{ALL_REVIEWS.length} reviews</p>
            </div>
            <div className="w-px h-16 bg-gray-100" />
            <div className="text-left space-y-1">
              {[5, 4, 3].map((s) => {
                const count = ALL_REVIEWS.filter((r) => r.stars === s).length;
                const pct   = Math.round((count / ALL_REVIEWS.length) * 100);
                return (
                  <div key={s} className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-4">{s}</span>
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {visible.map((review, i) => (
            <ReviewCard key={`${page}-${i}`} review={review} index={start + i} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-red-500 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          {[...Array(TOTAL_PAGES)].map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition ${
                  p === page
                    ? 'bg-red-600 text-white shadow-md'
                    : 'border border-gray-200 text-gray-600 hover:border-red-500 hover:text-red-600'
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => { setPage((p) => Math.min(TOTAL_PAGES, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === TOTAL_PAGES}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-red-500 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Page {page} of {TOTAL_PAGES} &bull; Showing reviews {start + 1} to {Math.min(start + REVIEWS_PER_PAGE, ALL_REVIEWS.length)} of {ALL_REVIEWS.length}
        </p>

        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-red-600 hover:text-red-700 font-semibold transition">
            Back to ElitePartz Home
          </Link>
        </div>
      </div>
    </div>
  );
}
