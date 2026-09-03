export type Make =
  | 'All Brands'
  | 'Ford F-150'
  | 'Toyota RAV4'
  | 'Chevrolet Silverado'
  | 'Nissan'
  | 'Mercedes-Benz'
  | 'Cadillac';

export const MAKES: Make[] = [
  'Ford F-150',
  'Toyota RAV4',
  'Chevrolet Silverado',
  'Nissan',
  'Mercedes-Benz',
  'Cadillac',
];

/** Sentinel value used when a part fits every brand. Kept separate from MAKES
 *  so it doesn't appear as a browsable brand option in the nav/sidebar. */
export const ALL_MODELS_VALUE: Make = 'All Brands';

export const CATEGORIES = [
  'Interior',
  'Exterior',
  'Suspension & Drivetrain',
  'Wheels & Brakes',
  'Engine',
  'Exhaust System',
  'Accessories',
];

export interface Part {
  id: string;
  name: string;
  price: number;
  /** Array of base64 data URIs or URLs — first entry is the primary display image. Max 5. */
  images: string[];
  brand: string;
  make: Make;
  application: string[];
  description: string;
  category: string;
  inStock: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CartItem extends Part {
  quantity: number;
}

export interface AdminUser {
  username: string;
  isAuthenticated: boolean;
}
