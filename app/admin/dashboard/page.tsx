'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/lib/context';
import { getAllParts, createPart, updatePart, deletePart } from '@/lib/firebase';
import { Part, MAKES, CATEGORIES } from '@/lib/types';
import { Trash2, Edit2, Plus, X, ImagePlus } from 'lucide-react';
import Image from 'next/image';

interface FormData {
  name: string;
  price: string;
  brand: string;
  make: string;
  application: string;
  description: string;
  category: string;
  inStock: boolean;
}

const initialFormData: FormData = {
  name: '',
  price: '',
  brand: '',
  make: '',
  application: '',
  description: '',
  category: '',
  inStock: true,
};

const MAX_IMAGES = 5;

/** Max dimension (width or height) for stored images */
const MAX_DIM = 800;
/** JPEG compression quality 0-1 */
const JPEG_QUALITY = 0.75;

/**
 * Resize + compress an image File to a JPEG base64 data URI.
 */
const compressImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > MAX_DIM || height > MAX_DIM) {
        if (width >= height) {
          height = Math.round((height / width) * MAX_DIM);
          width  = MAX_DIM;
        } else {
          width  = Math.round((width / height) * MAX_DIM);
          height = MAX_DIM;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas not available')); return; }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    };

    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Failed to load image')); };
    img.src = objectUrl;
  });

export default function AdminDashboard() {
  const { isAuthenticated } = useAdmin();
  const router = useRouter();

  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [images, setImages] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // ← prevents duplicate adds
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) router.push('/admin/login');
  }, [isAuthenticated, router]);

  // Fetch parts
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchParts = async () => {
      try {
        const allParts = await getAllParts();
        setParts(allParts);
      } catch {
        setError('Failed to fetch parts');
      } finally {
        setLoading(false);
      }
    };
    fetchParts();
  }, [isAuthenticated]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.currentTarget;
    const checked = type === 'checkbox' ? (e.currentTarget as HTMLInputElement).checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle image file selection — compress then convert to base64
  const handleImageFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const selected = Array.from(files).slice(0, remaining);
      const compressed = await Promise.all(selected.map(compressImage));
      setImages((prev) => [...prev, ...compressed]);
    } catch {
      setError('Failed to process one or more images. Please try again with a different file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    setImages((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard: prevent double-submission
    if (submitting) return;

    setError('');
    setSuccess('');

    if (
      !formData.name ||
      !formData.price ||
      !formData.brand ||
      !formData.make ||
      !formData.category
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    if (images.length === 0) {
      setError('Please upload at least one image.');
      return;
    }

    // Disable the button immediately
    setSubmitting(true);

    try {
      const applicationArray = formData.application
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const partData = {
        name: formData.name,
        price: parseFloat(formData.price),
        images,
        brand: formData.brand,
        make: formData.make as Part['make'],
        application: applicationArray,
        description: formData.description,
        category: formData.category,
        inStock: formData.inStock,
      };

      if (editingId) {
        await updatePart(editingId, partData);
        setSuccess('Part updated successfully. Refreshing…');
      } else {
        await createPart(partData);
        setSuccess('Part added successfully. Refreshing…');
      }

      // Short delay so the admin sees the success message, then hard-reload
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch {
      setError('Failed to save part. Please try again.');
      setSubmitting(false); // re-enable only on error so admin can retry
    }
  };

  const handleEdit = (part: Part) => {
    setFormData({
      name: part.name,
      price: part.price.toString(),
      brand: part.brand,
      make: part.make,
      application: part.application.join(', '),
      description: part.description,
      category: part.category,
      inStock: part.inStock,
    });
    setImages(part.images ?? []);
    setEditingId(part.id);
    setShowForm(true);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this part?')) return;
    try {
      await deletePart(id);
      setParts((prev) => prev.filter((p) => p.id !== id));
      setSuccess('Part deleted.');
    } catch {
      setError('Failed to delete part.');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setImages([]);
    setEditingId(null);
    setShowForm(false);
    setError('');
    setSubmitting(false);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your parts inventory — ElitePartz</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 flex items-start gap-3 px-4 py-3 border border-gray-300 bg-white rounded">
            <svg className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span className="text-sm text-gray-800 flex-1">{error}</span>
            <button onClick={() => setError('')} className="flex-shrink-0 text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
        )}
        {success && (
          <div className="mb-6 flex items-start gap-3 px-4 py-3 border border-gray-300 bg-white rounded">
            <svg className="w-4 h-4 text-gray-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            <span className="text-sm text-gray-800 flex-1">{success}</span>
            <button onClick={() => setSuccess('')} className="flex-shrink-0 text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
        )}

        {/* Add Part Button */}
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditingId(null); setFormData(initialFormData); setImages([]); setSubmitting(false); }}
            className="mb-8 flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold transition"
          >
            <Plus size={20} />
            Add New Part
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="mb-10 bg-white p-8 shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Part' : 'Add New Part'}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Part Name *</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleInputChange}
                    placeholder="e.g., OEM Front Bumper Assembly"
                    className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:border-red-500"
                    required
                    disabled={submitting}
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (USD) *</label>
                  <input
                    type="number" name="price" value={formData.price} onChange={handleInputChange}
                    placeholder="e.g., 299.99" step="0.01" min="0"
                    className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:border-red-500"
                    required
                    disabled={submitting}
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Part Brand / Manufacturer *</label>
                  <input
                    type="text" name="brand" value={formData.brand} onChange={handleInputChange}
                    placeholder="e.g., Ford OEM, Bilstein, Borla"
                    className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:border-red-500"
                    required
                    disabled={submitting}
                  />
                </div>

                {/* Vehicle Brand (Make) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Vehicle Brand *</label>
                  <select
                    name="make" value={formData.make} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:border-red-500"
                    required
                    disabled={submitting}
                  >
                    <option value="">Select Vehicle Brand</option>
                    <option value="All Brands">All Brands (fits every vehicle)</option>
                    <option disabled>──────────────</option>
                    {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {formData.make === 'All Brands' && (
                    <p className="mt-1 text-xs text-gray-500">
                      This part will appear under every brand and show &ldquo;Compatible with all brands&rdquo; on its product page.
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    name="category" value={formData.category} onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:border-red-500"
                    required
                    disabled={submitting}
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Application */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Vehicle Application (comma-separated)</label>
                  <input
                    type="text" name="application" value={formData.application} onChange={handleInputChange}
                    placeholder="e.g., Ford F-150 2018-2020, Ford F-150 Raptor 2019"
                    className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:border-red-500"
                    disabled={submitting}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleInputChange}
                    placeholder="Enter detailed product description"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 bg-white focus:outline-none focus:border-red-500 resize-vertical"
                    disabled={submitting}
                  />
                </div>

                {/* ── Image Upload ── */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Images * &nbsp;
                    <span className="font-normal text-gray-500">
                      ({images.length}/{MAX_IMAGES} — first image is the primary display)
                    </span>
                  </label>

                  {/* Previews */}
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {images.map((src, idx) => (
                        <div
                          key={idx}
                          className={`relative group w-28 h-28 border-2 ${idx === 0 ? 'border-red-500' : 'border-gray-200'} rounded overflow-hidden bg-gray-50`}
                        >
                          <img
                            src={src}
                            alt={`Product image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Primary badge */}
                          {idx === 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-[10px] font-bold text-center py-0.5">
                              PRIMARY
                            </div>
                          )}
                          {/* Controls overlay */}
                          {!submitting && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => moveImage(idx, idx - 1)}
                                  title="Move left"
                                  className="bg-white text-gray-800 text-xs px-1.5 py-1 rounded hover:bg-gray-100"
                                >
                                  ←
                                </button>
                              )}
                              {idx < images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => moveImage(idx, idx + 1)}
                                  title="Move right"
                                  className="bg-white text-gray-800 text-xs px-1.5 py-1 rounded hover:bg-gray-100"
                                >
                                  →
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                title="Remove"
                                className="bg-red-600 text-white text-xs px-1.5 py-1 rounded hover:bg-red-700"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload button */}
                  {images.length < MAX_IMAGES && !submitting && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleImageFiles(e.target.files)}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-gray-300 hover:border-red-500 text-gray-600 hover:text-red-600 font-medium text-sm transition disabled:opacity-50"
                      >
                        <ImagePlus size={18} />
                        {uploading ? 'Processing…' : `Upload Images (${images.length}/${MAX_IMAGES})`}
                      </button>
                      <p className="mt-1 text-xs text-gray-400">
                        Select up to {MAX_IMAGES - images.length} more image{MAX_IMAGES - images.length !== 1 ? 's' : ''} from your gallery.
                        Images are automatically resized and compressed. Drag ← → on hover to reorder.
                      </p>
                    </>
                  )}
                </div>

                {/* In Stock */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox" name="inStock" checked={formData.inStock} onChange={handleInputChange}
                      className="w-4 h-4 accent-red-600"
                      disabled={submitting}
                    />
                    <span className="text-sm font-semibold text-gray-700">In Stock</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold transition"
                >
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      {editingId ? 'Updating…' : 'Adding Part…'}
                    </>
                  ) : (
                    editingId ? 'Update Part' : 'Add Part'
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Parts Table */}
        <div className="bg-white shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
            <h2 className="text-lg font-bold">Parts Inventory ({parts.length})</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading inventory…</div>
          ) : parts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No parts yet. Add your first part above.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Part Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Vehicle</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((part) => (
                    <tr key={part.id} className="border-b hover:bg-gray-50">
                      {/* Thumbnail */}
                      <td className="px-4 py-3">
                        {part.images?.[0] ? (
                          <img
                            src={part.images[0]}
                            alt={part.name}
                            className="w-14 h-14 object-cover rounded border border-gray-200"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-300 text-xs">
                            No img
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium max-w-[180px]">
                        <span className="line-clamp-2">{part.name}</span>
                        <span className="text-xs text-gray-400 mt-0.5 block">{part.images?.length ?? 0} image{(part.images?.length ?? 0) !== 1 ? 's' : ''}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{part.brand}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[130px]">
                        <span className="line-clamp-2">{part.make}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{part.category}</td>
                      <td className="px-4 py-3 text-sm font-bold text-red-600">
                        ${part.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-bold rounded border ${
                          part.inStock
                            ? 'border-gray-300 text-gray-700 bg-white'
                            : 'border-red-300 text-red-700 bg-white'
                        }`}>
                          {part.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEdit(part)}
                            className="text-gray-700 hover:text-red-600 font-semibold flex items-center gap-1"
                          >
                            <Edit2 size={15} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(part.id)}
                            className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                          >
                            <Trash2 size={15} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
