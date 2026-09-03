'use client';

import { useCart } from '@/lib/context';
import Link from 'next/link';
import { Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [shippingCost] = useState(0);

  const subtotal = total;
  const grandTotal = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/parts" className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {/* Cart confirmed notice */}
      <div className="mb-6 flex items-center gap-3 px-4 py-3 border border-gray-200 bg-white rounded">
        <svg className="w-4 h-4 text-gray-900 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        <p className="text-sm text-gray-700">
          <strong className="text-gray-900">Items added to cart.</strong> Your order will be processed securely at checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-start gap-3 px-4 py-3 border border-gray-200 bg-white rounded">
            <svg className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
            </svg>
            <p className="text-sm text-gray-600">
              <strong className="text-gray-800">Oversized items</strong> in your cart are shipped via DHL — our most competitive option for large parts.
            </p>
          </div>

          {/* Table Header */}
          <div className="hidden sm:grid sm:grid-cols-12 gap-4 mb-4 pb-4 border-b font-bold text-gray-700">
            <div className="col-span-6">Item</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Subtotal</div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 pb-4 border-b">
                {/* Item Image and Name */}
                <div className="sm:col-span-6 flex gap-4">
                  <img
                    src={item.images?.[0] ?? ''}
                    alt={item.name}
                    className="w-24 h-24 object-cover bg-gray-100"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-600">Brand: {item.brand}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 text-sm font-semibold mt-2 flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="sm:col-span-2">
                  <p className="sm:hidden text-sm text-gray-600">Price:</p>
                  <p className="font-semibold">${item.price.toFixed(2)}</p>
                </div>

                {/* Quantity */}
                <div className="sm:col-span-2">
                  <p className="sm:hidden text-sm text-gray-600 mb-1">Qty:</p>
                  <div className="flex items-center border border-gray-300 w-fit">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 px-1 py-1 text-center border-l border-r border-gray-300"
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="sm:col-span-2">
                  <p className="sm:hidden text-sm text-gray-600">Subtotal:</p>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href="/parts"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
            >
              CONTINUE SHOPPING
            </Link>
            <button
              onClick={() => clearCart()}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
            >
              CLEAR SHOPPING CART
            </button>
            <button className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-semibold ml-auto">
              UPDATE CART
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 pb-4 border-b">
              <div className="flex justify-between">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Shipping</span>
                <button className="text-gray-900 underline underline-offset-2 text-sm font-semibold hover:text-red-600 transition">
                  Estimate
                </button>
              </div>
              {shippingCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-700">Shipping Cost</span>
                  <span className="font-semibold">${shippingCost.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between py-4 font-bold text-lg">
              <span>Order Total</span>
              <span className="text-red-600">${grandTotal.toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="block w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-lg mb-3 text-center transition">
              GO TO CHECKOUT
            </Link>

            <p className="text-xs text-gray-600 text-center">
              Taxes and shipping costs will be calculated at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
