import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      {/* Main footer content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand / About */}
          <div>
            {/* Logo + name */}
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="ElitePartz Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-black text-xl tracking-tight leading-none">
                <span className="text-red-500">Elite</span>
                <span className="text-white">Partz</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              ElitePartz is your trusted source for authentic, high-quality OEM and aftermarket parts for Ford F-150, Toyota RAV4, Chevrolet Silverado, Nissan, Mercedes-Benz, and Cadillac. Serving customers worldwide.
            </p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-4">Customer Service</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a
                  href="https://wa.me/15072009576"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-500 transition flex items-center gap-1.5"
                >
                  Contact Us
                </a>
              </li>
              <li><a href="mailto:elitepartz.orders@gmail.com" className="hover:text-red-500 transition">elitepartz.orders@gmail.com</a></li>
              <li><Link href="#" className="hover:text-red-500 transition">Returns &amp; Exchanges</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Shipping Info</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Store Info */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-4">ElitePartz</h3>
            <ul className="text-sm space-y-2">
              <li><Link href="#" className="hover:text-red-500 transition">About Us</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Our Locations</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Blog</Link></li>
              <li><Link href="#" className="hover:text-red-500 transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wide mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {[
                { label: 'Facebook', href: '#', icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                )},
                { label: 'Instagram', href: '#', icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                )},
                { label: 'X / Twitter', href: '#', icon: (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                )},
                { label: 'Email', href: 'mailto:elitepartz.orders@gmail.com', icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                )},
              ].map(({ label, href, icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} ElitePartz. All rights reserved.</p>
          <div className="flex gap-4 text-sm items-center">
            <span className="text-gray-500">We accept:</span>
            <span className="px-2 py-1 border border-gray-600 rounded text-xs">VISA</span>
            <span className="px-2 py-1 border border-gray-600 rounded text-xs">Mastercard</span>
            <span className="px-2 py-1 border border-gray-600 rounded text-xs">PayPal</span>
            <span className="px-2 py-1 border border-gray-600 rounded text-xs">Zelle</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-black px-4 sm:px-6 lg:px-8 py-4 text-xs text-gray-500 text-center">
        ElitePartz is an authorized dealer of genuine OEM and premium aftermarket auto parts. Ford F-150 · Toyota RAV4 · Chevrolet Silverado · Nissan · Mercedes-Benz · Cadillac
      </div>
    </footer>
  );
}
