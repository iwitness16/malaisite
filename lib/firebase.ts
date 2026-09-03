// firebase.ts — shared Firestore utility (no 'use client' — used by both client and server)
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
} from 'firebase/firestore';
import type { Part } from './types';
import { DEMO_PARTS } from './demo-data';

// ─── Firebase configuration ───────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigured =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.projectId &&
  firebaseConfig.apiKey !== '' &&
  firebaseConfig.projectId !== '';

let db: ReturnType<typeof getFirestore> | null = null;

if (isFirebaseConfigured) {
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (e) {
    console.error('[ElitePartz] Firebase init error:', e);
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn(
      '[ElitePartz] Firebase not configured — running in demo mode with localStorage. ' +
      'Add credentials to .env.local to enable Firestore persistence.'
    );
  }
}

// ─── Back-compat helper ───────────────────────────────────────────────────────
/** Normalise a raw Firestore document's data to our Part shape. */
function normalisePart(id: string, data: Record<string, unknown>): Part {
  // Back-compat: old documents stored a single `image` string
  if (!data.images && data.image) {
    data.images = [data.image as string];
  }
  if (!Array.isArray(data.images)) {
    data.images = [];
  }
  return {
    id,
    name:        (data.name        as string)  ?? '',
    price:       (data.price       as number)  ?? 0,
    images:      data.images       as string[],
    brand:       (data.brand       as string)  ?? '',
    make:        (data.make        as Part['make']) ?? 'Ford F-150',
    application: (data.application as string[]) ?? [],
    description: (data.description as string)  ?? '',
    category:    (data.category    as string)  ?? '',
    inStock:     (data.inStock     as boolean) ?? false,
    createdAt:   (data.createdAt   as number)  ?? Date.now(),
    updatedAt:   (data.updatedAt   as number)  ?? Date.now(),
  };
}

// ─── Demo / localStorage helpers ─────────────────────────────────────────────
const LS_KEY = 'elitepartz_demo_parts';

const getStoredParts = (): Part[] => {
  if (typeof window === 'undefined') return DEMO_PARTS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEMO_PARTS;
    const parsed = JSON.parse(raw) as Part[];
    // Back-compat for demo data that used `image`
    return parsed.map((p: Part & { image?: string }) => {
      if (!p.images && p.image) p.images = [p.image];
      if (!Array.isArray(p.images)) p.images = [];
      return p;
    });
  } catch {
    return DEMO_PARTS;
  }
};

const saveStoredParts = (parts: Part[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LS_KEY, JSON.stringify(parts));
  }
};

// ─── Public API ───────────────────────────────────────────────────────────────

/** Fetch every part, newest first. Falls back to localStorage demo data. */
export const getAllParts = async (): Promise<Part[]> => {
  if (!db) return getStoredParts();
  try {
    const col = collection(db, 'parts');
    // Try with orderBy; if the index is missing fall back to unordered fetch
    let snapshot;
    try {
      snapshot = await getDocs(query(col, orderBy('createdAt', 'desc')));
    } catch {
      snapshot = await getDocs(col);
    }
    return snapshot.docs.map((d) => normalisePart(d.id, d.data() as Record<string, unknown>));
  } catch (error) {
    console.error('[ElitePartz] getAllParts error:', error);
    return getStoredParts();
  }
};

/** Fetch a single part by its Firestore document ID. */
export const getPartById = async (id: string): Promise<Part | null> => {
  if (!db) {
    return getStoredParts().find((p) => p.id === id) ?? null;
  }
  try {
    const snap = await getDoc(doc(db, 'parts', id));
    if (!snap.exists()) return null;
    return normalisePart(snap.id, snap.data() as Record<string, unknown>);
  } catch (error) {
    console.error('[ElitePartz] getPartById error:', error);
    return getStoredParts().find((p) => p.id === id) ?? null;
  }
};

/** Fetch parts filtered by category. */
export const getPartsByCategory = async (category: string): Promise<Part[]> => {
  if (!db) return getStoredParts().filter((p) => p.category === category);
  try {
    const snap = await getDocs(query(collection(db, 'parts'), where('category', '==', category)));
    return snap.docs.map((d) => normalisePart(d.id, d.data() as Record<string, unknown>));
  } catch (error) {
    console.error('[ElitePartz] getPartsByCategory error:', error);
    return getStoredParts().filter((p) => p.category === category);
  }
};

/** Fetch only in-stock parts. */
export const getInStockParts = async (): Promise<Part[]> => {
  if (!db) return getStoredParts().filter((p) => p.inStock);
  try {
    const snap = await getDocs(query(collection(db, 'parts'), where('inStock', '==', true)));
    return snap.docs.map((d) => normalisePart(d.id, d.data() as Record<string, unknown>));
  } catch (error) {
    console.error('[ElitePartz] getInStockParts error:', error);
    return getStoredParts().filter((p) => p.inStock);
  }
};

/** Create a new part document. Returns the new document ID. */
export const createPart = async (
  part: Omit<Part, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const now = Date.now();
  const payload = { ...part, createdAt: now, updatedAt: now };

  if (!db) {
    // Demo mode
    const parts = getStoredParts();
    const newId = `demo_${now}`;
    parts.unshift({ id: newId, ...payload });
    saveStoredParts(parts);
    return newId;
  }
  try {
    const ref = await addDoc(collection(db, 'parts'), payload);
    return ref.id;
  } catch (error) {
    console.error('[ElitePartz] createPart error:', error);
    throw error;
  }
};

/** Update an existing part document. */
export const updatePart = async (id: string, updates: Partial<Omit<Part, 'id' | 'createdAt'>>): Promise<void> => {
  const payload = { ...updates, updatedAt: Date.now() };

  if (!db) {
    const parts = getStoredParts();
    const idx = parts.findIndex((p) => p.id === id);
    if (idx >= 0) parts[idx] = { ...parts[idx], ...payload };
    saveStoredParts(parts);
    return;
  }
  try {
    await updateDoc(doc(db, 'parts', id), payload);
  } catch (error) {
    console.error('[ElitePartz] updatePart error:', error);
    throw error;
  }
};

/** Delete a part document. */
export const deletePart = async (id: string): Promise<void> => {
  if (!db) {
    saveStoredParts(getStoredParts().filter((p) => p.id !== id));
    return;
  }
  try {
    await deleteDoc(doc(db, 'parts', id));
  } catch (error) {
    console.error('[ElitePartz] deletePart error:', error);
    throw error;
  }
};
