import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/context'
import { AdminProvider } from '@/lib/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingWidgets from '@/components/FloatingWidgets'

export const metadata: Metadata = {
  title: 'ElitePartz - Premium Auto Parts | Ford, Toyota, Chevrolet, Nissan, Mercedes, Cadillac',
  description: 'Premium OEM and aftermarket auto parts for Ford F-150, Toyota RAV4, Chevrolet Silverado, Nissan, Mercedes-Benz, and Cadillac. Authentic, high-quality components. Worldwide shipping.',
  icons: {
    icon: [
      { url: '/logo.jpg', type: 'image/jpeg', sizes: 'any' },
    ],
    apple: '/logo.jpg',
    shortcut: '/logo.jpg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#d41f1f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-white">
      <body className="antialiased bg-white text-gray-900">
        <CartProvider>
          <AdminProvider>
            <Header />
            {children}
            <Footer />
            <FloatingWidgets />
          </AdminProvider>
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
