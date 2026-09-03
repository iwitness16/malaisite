'use client';

import { useEffect, useState } from 'react';
import { useAdmin } from '@/lib/context';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAdmin();
  const router = useRouter();

  // Redirect AFTER render — never call router.push() during render
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = login(username, password);
      if (success) {
        router.push('/admin/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-3">
            <img
              src="/logo.jpg"
              alt="ElitePartz Logo"
              className="w-14 h-14 rounded-full border-2 border-gray-200 object-cover shadow"
            />
            <span className="font-black text-3xl tracking-tight">
              <span className="text-red-600">Elite</span>
              <span className="text-gray-900">Partz</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-700">Admin Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your parts inventory</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 px-4 py-3 border border-gray-300 bg-white rounded">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Login Failed</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
          )}

          {/* Username Field */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:border-red-600"
              required
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:border-red-600"
              required
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
