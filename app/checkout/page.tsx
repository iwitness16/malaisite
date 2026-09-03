'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/context';
import { ChevronDown, Package, MapPin, CreditCard, CheckCircle } from 'lucide-react';
import type { OrderPayload } from '@/app/api/order/route';

const PAYMENT_METHODS = ['Zelle', 'Apple Pay', 'Cash App', 'Gift Card', 'Chime', 'Bank Transfer'];

const COUNTRIES = [
  'United States', 'Canada', 'Australia', 'United Kingdom', 'Germany', 'France',
  'Japan', 'South Korea', 'Philippines', 'Singapore', 'UAE', 'South Africa',
  'Nigeria', 'Ghana', 'Brazil', 'Mexico', 'New Zealand', 'Ireland', 'Netherlands',
  'Sweden', 'Denmark', 'Poland', 'Portugal', 'Spain', 'Italy', 'Other',
];

function generateOrderRef() {
  const ts  = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `EP-${ts}-${rnd}`;
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

type Step = 'shipping' | 'payment' | 'review';

interface ShippingForm {
  firstName: string; lastName: string; email: string;
  phone: string; whatsapp: string;
  address: string; city: string; state: string; zip: string;
  country: string; notes: string;
}

const emptyShipping: ShippingForm = {
  firstName: '', lastName: '', email: '',
  phone: '', whatsapp: '',
  address: '', city: '', state: '', zip: '',
  country: 'United States', notes: '',
};

// ─── Step indicator ───────────────────────────────────────────────────────────
function StepBar({ current }: { current: Step }) {
  const steps: { key: Step; label: string; Icon: typeof Package }[] = [
    { key: 'shipping', label: 'Shipping', Icon: MapPin     },
    { key: 'payment',  label: 'Payment',  Icon: CreditCard },
    { key: 'review',   label: 'Review',   Icon: Package    },
  ];
  const idx = steps.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => {
        const done   = i < idx;
        const active = i === idx;
        return (
          <div key={step.key} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition ${
              active ? 'bg-gray-900 text-white' :
              done   ? 'bg-gray-100 text-gray-500' :
                       'bg-gray-50 text-gray-300'
            }`}>
              {done ? <CheckCircle size={15} /> : <step.Icon size={15} />}
              {step.label}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-10 h-px mx-1 ${i < idx ? 'bg-gray-900' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Field component ──────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 border border-gray-300 bg-white text-sm focus:outline-none focus:border-gray-900 rounded transition';

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const router                = useRouter();
  const { items, total, clearCart } = useCart();

  // ── ALL hooks must be declared before any conditional return ──────────────
  const [step,          setStep]          = useState<Step>('shipping');
  const [shipping,      setShipping]      = useState<ShippingForm>(emptyShipping);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [submitting,    setSubmitting]    = useState(false);
  const [submitError,   setSubmitError]   = useState('');
  const [orderRef]                        = useState(generateOrderRef);

  const grandTotal = total;

  const handleField = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  }, []);

  const shippingValid = !!(
    shipping.firstName.trim() && shipping.lastName.trim() &&
    shipping.email.trim() && shipping.phone.trim() &&
    shipping.address.trim() && shipping.city.trim() &&
    shipping.country.trim()
  );

  const placeOrder = useCallback(async () => {
    if (!paymentMethod) { setSubmitError('Please select a payment method.'); return; }
    setSubmitting(true);
    setSubmitError('');

    const payload: OrderPayload = {
      orderRef,
      items: items.map((it) => ({
        id:       it.id,
        name:     it.name,
        brand:    it.brand,
        price:    it.price,
        quantity: it.quantity,
        images:   it.images ?? [],
      })),
      subtotal:  total,
      grandTotal,
      payment:   paymentMethod,
      shipping: {
        firstName: shipping.firstName,
        lastName:  shipping.lastName,
        email:     shipping.email,
        phone:     shipping.phone,
        whatsapp:  shipping.whatsapp || shipping.phone,
        address:   shipping.address,
        city:      shipping.city,
        state:     shipping.state,
        zip:       shipping.zip,
        country:   shipping.country,
        notes:     shipping.notes,
      },
    };

    try {
      const res  = await fetch('/api/order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Server error');

      clearCart();

      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
      }

      router.push(`/order-confirmed?ref=${orderRef}`);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [paymentMethod, orderRef, items, total, grandTotal, shipping, clearCart, router]);

  // ── Conditional render AFTER all hooks ────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <Package size={48} className="text-gray-200 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6 text-sm">Add some parts before checking out.</p>
        <Link href="/parts" className="px-6 py-3 bg-gray-900 hover:bg-red-600 text-white font-bold text-sm transition rounded">
          Shop Parts
        </Link>
      </div>
    );
  }

  // ── Full checkout render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Brand header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block font-black text-2xl tracking-tight">
            <span className="text-red-600">Elite</span><span className="text-gray-900">Partz</span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Secure Checkout</p>
        </div>

        <StepBar current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Form panels ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* STEP 1: Shipping */}
            <div className={`bg-white border rounded-xl overflow-hidden ${step !== 'shipping' ? 'opacity-60 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-3 px-6 py-4 border-b bg-gray-50">
                <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-black flex items-center justify-center flex-shrink-0">1</div>
                <h2 className="font-bold text-gray-900">Shipping Information</h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First Name" required>
                  <input name="firstName" value={shipping.firstName} onChange={handleField} className={inputCls} placeholder="John" />
                </Field>
                <Field label="Last Name" required>
                  <input name="lastName" value={shipping.lastName} onChange={handleField} className={inputCls} placeholder="Doe" />
                </Field>
                <Field label="Email Address" required>
                  <input name="email" type="email" value={shipping.email} onChange={handleField} className={inputCls} placeholder="john@example.com" />
                </Field>
                <Field label="Phone Number" required>
                  <input name="phone" type="tel" value={shipping.phone} onChange={handleField} className={inputCls} placeholder="+1 555 000 0000" />
                </Field>
                <Field label="WhatsApp Number">
                  <input name="whatsapp" type="tel" value={shipping.whatsapp} onChange={handleField} className={inputCls} placeholder="Leave blank if same as phone" />
                </Field>
                <Field label="Country" required>
                  <div className="relative">
                    <select name="country" value={shipping.country} onChange={handleField} className={`${inputCls} appearance-none pr-8`}>
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                  </div>
                </Field>
                <Field label="Street Address" required>
                  <input name="address" value={shipping.address} onChange={handleField} className={inputCls} placeholder="123 Main Street, Apt 4B" />
                </Field>
                <Field label="City" required>
                  <input name="city" value={shipping.city} onChange={handleField} className={inputCls} placeholder="Los Angeles" />
                </Field>
                <Field label="State / Region">
                  <input name="state" value={shipping.state} onChange={handleField} className={inputCls} placeholder="California" />
                </Field>
                <Field label="ZIP / Postal Code">
                  <input name="zip" value={shipping.zip} onChange={handleField} className={inputCls} placeholder="90001" />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Order Notes">
                    <textarea name="notes" value={shipping.notes} onChange={handleField} rows={3} className={`${inputCls} resize-none`} placeholder="Special instructions, colour preferences, etc." />
                  </Field>
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    onClick={() => { if (shippingValid) setStep('payment'); }}
                    disabled={!shippingValid}
                    className="px-8 py-3 bg-gray-900 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm transition rounded"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 2: Payment */}
            <div className={`bg-white border rounded-xl overflow-hidden ${step !== 'payment' ? 'opacity-60 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-3 px-6 py-4 border-b bg-gray-50">
                <div className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0 ${step === 'payment' || step === 'review' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'}`}>2</div>
                <h2 className="font-bold text-gray-900">Payment Method</h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-4">
                  Select how you will send payment. Our team will contact you with payment details after confirming your order.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`px-4 py-3 border-2 rounded-lg text-sm font-bold transition text-center ${
                        paymentMethod === method
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 justify-between">
                  <button onClick={() => setStep('shipping')} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 hover:border-gray-400 font-bold text-sm transition rounded">
                    Back
                  </button>
                  <button
                    onClick={() => { if (paymentMethod) setStep('review'); else setSubmitError('Please select a payment method.'); }}
                    disabled={!paymentMethod}
                    className="px-8 py-3 bg-gray-900 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm transition rounded"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            </div>

            {/* STEP 3: Review & Place Order */}
            <div className={`bg-white border rounded-xl overflow-hidden ${step !== 'review' ? 'opacity-60 pointer-events-none' : ''}`}>
              <div className="flex items-center gap-3 px-6 py-4 border-b bg-gray-50">
                <div className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0 ${step === 'review' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-400'}`}>3</div>
                <h2 className="font-bold text-gray-900">Review &amp; Confirm</h2>
              </div>
              <div className="p-6 space-y-5">
                {/* Shipping summary */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shipping To</p>
                    <button onClick={() => setStep('shipping')} className="text-xs text-red-600 hover:text-red-700 font-semibold">Edit</button>
                  </div>
                  <div className="text-sm text-gray-700 border border-gray-100 rounded-lg p-4 bg-gray-50 space-y-0.5">
                    <p className="font-bold text-gray-900">{shipping.firstName} {shipping.lastName}</p>
                    <p>{shipping.address}, {shipping.city}{shipping.state ? `, ${shipping.state}` : ''} {shipping.zip}</p>
                    <p>{shipping.country}</p>
                    <p className="text-gray-500">{shipping.email} &bull; {shipping.phone}</p>
                    {shipping.whatsapp && shipping.whatsapp !== shipping.phone && (
                      <p className="text-gray-500">WhatsApp: {shipping.whatsapp}</p>
                    )}
                    {shipping.notes && <p className="text-gray-500 italic">Note: {shipping.notes}</p>}
                  </div>
                </div>

                {/* Payment summary */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Payment Method</p>
                    <button onClick={() => setStep('payment')} className="text-xs text-red-600 hover:text-red-700 font-semibold">Edit</button>
                  </div>
                  <div className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                    <p className="font-bold text-gray-900 text-sm">{paymentMethod}</p>
                    <p className="text-xs text-gray-500 mt-1">Payment details will be provided after order confirmation.</p>
                  </div>
                </div>

                {/* Error */}
                {submitError && (
                  <div className="flex items-center gap-2 px-4 py-3 border border-gray-200 bg-white rounded text-sm text-red-700">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {submitError}
                  </div>
                )}

                <div className="flex gap-3 justify-between pt-2">
                  <button onClick={() => setStep('payment')} className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 hover:border-gray-400 font-bold text-sm transition rounded">
                    Back
                  </button>
                  <button
                    onClick={placeOrder}
                    disabled={submitting}
                    className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-black text-sm tracking-wide transition rounded"
                  >
                    {submitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                        Placing Order…
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="white" className="w-4 h-4">
                          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                        </svg>
                        Place Order &amp; Open WhatsApp
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Clicking Place Order sends your order to <strong>elitepartz.orders@gmail.com</strong> and opens WhatsApp with a pre-filled summary ready to send.
                </p>
              </div>
            </div>

          </div>

          {/* ── Right: Order summary sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-xl overflow-hidden sticky top-4">
              <div className="px-5 py-4 border-b bg-gray-50">
                <h2 className="font-bold text-gray-900 text-sm">Order Summary</h2>
                <p className="text-xs text-gray-400 mt-0.5">Ref: {orderRef}</p>
              </div>
              <div className="p-5 space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.images?.[0] ?? ''}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 line-clamp-2 leading-tight">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.brand} &bull; x{item.quantity}</p>
                    </div>
                    <p className="text-xs font-black text-red-600 flex-shrink-0">${fmt(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="px-5 pb-5 border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${fmt(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-gray-400">Confirmed after order</span>
                </div>
                <div className="flex justify-between font-black text-base pt-2 border-t">
                  <span>Total</span>
                  <span className="text-red-600">${fmt(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
