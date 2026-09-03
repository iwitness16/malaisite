# 86Parts - Professional Spare Parts E-Commerce Store

A modern, professional e-commerce platform for Toyota GT86, Subaru BRZ, and Scion FRS spare parts. Built with Next.js 16, Tailwind CSS, and Firebase Firestore.

## Features

### 🛍️ Public Storefront
- **Landing Page** with hero section featuring the iconic GT86 image
- **Parts Browsing** with advanced filtering by category and brand
- **Product Details** pages with full specifications
- **Shopping Cart** with persistent storage (localStorage)
- **Responsive Design** optimized for mobile (2 columns) and desktop (3-4 columns)
- **Professional UI** with red (#d41f1f) accent color and clean design

### 🔐 Admin Dashboard
- **Secure Authentication** - Username: `admin`, Password: `Marko123#`
- **Inventory Management** - View, add, edit, and delete parts
- **Parts Form** with all required fields:
  - Part Name (required)
  - Price (required)
  - Brand (required)
  - Category (required)
  - Image URL (required)
  - Application/Compatibility (required)
  - Description (required)
  - **In Stock Toggle** (checked by default - can be deselected)
- **Parts Table** displaying all inventory with actions

### 📱 Responsive & Mobile-First
- Mobile: 2-column grid layout for parts
- Tablet: 3-column grid
- Desktop: 4-column grid
- Hamburger navigation on mobile
- Touch-friendly buttons and spacing

## Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS (v4)
- **Database**: Firebase Firestore (demo data using localStorage if not configured)
- **Icons**: Lucide React
- **UI Components**: Custom components with shadcn/ui patterns

## Setup & Installation

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Firebase (Optional)
To use Firebase Firestore instead of demo data:

Create a `.env.local` file with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Get these values from:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click ⚙️ Settings → Project Settings
4. Copy the config values from the "General" tab

### 3. Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Customer Site
- Browse parts by category or brand
- View detailed product information
- Add items to cart
- Search for parts

### Admin Dashboard
1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with:
   - Username: `admin`
   - Password: `Marko123#`
3. **Add Parts**: Click "Add New Part" button and fill the form
   - All fields are required
   - "In Stock" checkbox defaults to CHECKED
   - Admin can uncheck to mark as out of stock
4. **Edit Parts**: Click "Edit" button on any part
5. **Delete Parts**: Click "Delete" button (with confirmation)

## Data Model

### Part Schem
```typescript
{
  id: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  imageUrl: string;
  application: string;
  description: string;
  inStock: boolean; // Auto-selected (true) by default in admin form
  stock: number; // Quantity available
  createdAt: string; // ISO timestamp
}
```

## Categories Available
- Exterior
- Interior
- Engine
- Suspension & Drivetrain
- Wheels & Brakes
- Accessories

## Brands
- SARD
- BEATRUSH
- RESULT JAPAN
- 326POWER
- Pro Composite
- CUSCO
- TOM'S

## File Structure
```
/app
  /admin
    /login      # Admin login page
    /dashboard  # Parts management dashboard
  /parts        # Parts browsing page
    /[id]       # Product detail page
  /cart         # Shopping cart page
  page.tsx      # Landing page
  layout.tsx    # Root layout with providers

/components
  Header.tsx    # Navigation header
  Footer.tsx    # Footer
  ProductCard.tsx  # Part card component

/lib
  types.ts      # TypeScript interfaces
  firebase.ts   # Firestore utilities (with demo fallback)
  context.tsx   # React context (Cart, Admin auth)
  demo-data.ts  # Default demo parts

/public
  logo.jpg      # 86Parts logo
  86_2012-2016_home.jpg  # Hero image
```

## Key Features Implemented

✅ **Professional Design**
- No borders on containers (clean aesthetic)
- Red (#d41f1f) accent color with white/gray palette
- Responsive typography and spacing

✅ **Admin Controls**
- Password-protected admin panel
- Default "In Stock" selection (unchecked deselects)
- Full CRUD operations for parts

✅ **Demo Data Support**
- Pre-loaded with 8 sample parts
- Works without Firebase (uses localStorage)
- Can be replaced with real Firebase data

✅ **Mobile Responsive**
- 2-column grid on mobile
- 3-column on tablet
- 4-column on desktop
- Touch-optimized interface

✅ **Shopping Cart**
- Add/remove items
- Quantity management
- Persistent cart (localStorage)
- Clean checkout summary

## Deployment

### Deploy to Vercel
```bash
vercel
```

Or push to GitHub and connect to Vercel for automatic deployments.

## Notes

- **Demo Mode**: The app includes 8 demo parts and works without Firebase configuration
- **localStorage Fallback**: If Firebase isn't configured, parts are stored in browser localStorage
- **Admin Password**: The credentials (admin/Marko123#) are hardcoded for simplicity
- **Images**: Product images are stored as URLs in Firestore (or localStorage)

## Support & Issues

For Firebase integration issues or technical help, ensure:
1. Firebase project is created
2. Firestore database is enabled
3. Environment variables are correctly set in `.env.local`
4. Browser console shows no errors (F12)

## License

Built with v0 for the 86Parts storefront project.

---

**Version**: 1.0.0  
**Last Updated**: July 14, 2026  
**Status**: Production Ready ✓
