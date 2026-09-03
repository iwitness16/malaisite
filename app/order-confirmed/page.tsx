'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ADMIN_WA = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? '15072009576';

function ConfirmedContent() {
  const params   = useSearchParams();
  const orderRef = params.get('ref') ?? 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 max-w-lg w-full text-center">

        {/* Icon */}
        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">Order Received</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your order has been submitted and a confirmation email is on its way to your inbox.
        </p>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6 text-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Reference</p>
          <p className="text-xl font-black text-gray-900">{orderRef}</p>
        </div>

        <div className="space-y-3 mb-8 text-sm text-gray-600 text-left border-t pt-5">
          <p className="flex items-start gap-2">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
            A confirmation email has been sent to you and to our orders team at <strong>elitepartz.orders@gmail.com</strong>.
          </p>
          <p className="flex items-start gap-2">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
            WhatsApp has opened with your order summary pre-filled. Send it to confirm with our team instantly.
          </p>
          <p className="flex items-start gap-2">
            <span className="mt-0.5 w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
            Our team will reply with payment instructions and a dispatch timeline.
          </p>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${ADMIN_WA}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 hover:bg-red-600 text-white font-bold text-sm rounded transition mb-3"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.849L.054 23.25a.75.75 0 0 0 .916.99l5.637-1.481A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.65-.523-5.154-1.43l-.37-.217-3.827 1.005 1.023-3.736-.24-.386A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Message Us on WhatsApp
        </a>

        <Link href="/parts" className="block text-sm text-gray-400 hover:text-gray-600 transition">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense>
      <ConfirmedContent />
    </Suspense>
  );
}
