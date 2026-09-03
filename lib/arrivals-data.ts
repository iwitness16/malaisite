// ─── Static New Arrivals Data ─────────────────────────────────────────────────
// These 6 products are hardcoded for the homepage New Arrivals section.
// Each has a full detail page at /arrivals/[id].
// Images live in /public/arrivals/ — first image in each array is the primary.

export interface ArrivalPart {
  id: string;
  name: string;
  price: number;
  brand: string;
  make: string;
  application: string[];
  description: string;
  specs: { label: string; value: string }[];
  category: string;
  images: string[];
  inStock: boolean;
  condition: 'New' | 'Used' | 'Like New';
  shipping: string;
}

export const NEW_ARRIVALS: ArrivalPart[] = [
  // ── 1. OEM Ford F-150 Raptor Headlights ─────────────────────────────────────
  {
    id: 'na_1',
    name: 'OEM Ford F-150 Raptor (2017-2019) Headlights (Pair)',
    price: 599,
    brand: 'Ford OEM',
    make: 'Ford F-150',
    application: [
      'Ford F-150 Raptor 2017',
      'Ford F-150 Raptor 2018',
      'Ford F-150 Raptor 2019',
    ],
    category: 'Exterior',
    condition: 'Used',
    shipping: 'Included',
    images: [
      '/arrivals/arrival1a.jpg',
      '/arrivals/arrival1b.jpg',
      '/arrivals/arrival1c.jpg',
      '/arrivals/arrival1d.jpg',
    ],
    specs: [
      { label: 'Part Type',    value: 'OEM Headlight Assembly — Pair (Left + Right)' },
      { label: 'Fitment',      value: 'Ford F-150 Raptor 2017, 2018, 2019' },
      { label: 'Condition',    value: 'Used — fully functional, no cracks or moisture' },
      { label: 'Quantity',     value: 'Complete pair — both driver and passenger sides' },
      { label: 'Plug & Play',  value: 'Direct OEM fitment — no modification required' },
    ],
    inStock: true,
    description: `These are genuine OEM Ford F-150 Raptor headlights pulled directly from a 2017-2019 Raptor. The assemblies are in excellent used condition with no cracks, hazing, or moisture ingress on either side. All LED elements and projector functions are fully operational.

The Raptor headlight assembly is one of the most distinctive lighting signatures on any truck on the road. The aggressive LED daytime running light signature and high-output projector beam are both Ford-engineered specifically for the Raptor model — these are not found on standard F-150 trims.

At $599 for a complete pair with shipping included, this is significantly below dealer pricing for new assemblies. Plug-and-play fitment for any 2017, 2018, or 2019 Ford F-150 Raptor.`,
  },

  // ── 2. 2026 Escalade V OEM Take-Off Wheels & Tires ──────────────────────────
  {
    id: 'na_2',
    name: '2026 Escalade V OEM Take-Offs — Wheels & Tires (NOT REPLICAS)',
    price: 5500,
    brand: 'Cadillac OEM',
    make: 'Cadillac',
    application: [
      'Cadillac Escalade V 2026',
      'Cadillac Escalade 2021+',
    ],
    category: 'Wheels & Brakes',
    condition: 'Like New',
    shipping: 'Included',
    images: [
      '/arrivals/arrival2a.jpg',
      '/arrivals/arrival2b.jpg',
      '/arrivals/arrival2c.jpg',
      '/arrivals/arrival2d.jpg',
    ],
    specs: [
      { label: 'Part Type',    value: 'Factory OEM Take-Off Wheels with Bridgestone Alenza Tires' },
      { label: 'Source',       value: '2026 Cadillac Escalade V — direct dealer take-offs' },
      { label: 'Condition',    value: 'Like New — removed with minimal mileage' },
      { label: 'Tires',        value: 'Bridgestone Alenza — near-new tread life' },
      { label: 'Authenticity', value: 'NOT replicas — genuine factory OEM wheels' },
      { label: 'Quantity',     value: 'Full set of 4 with mounted Bridgestone Alenza tires' },
    ],
    inStock: true,
    description: `These are genuine factory take-off wheels from a 2026 Cadillac Escalade V — not replicas, not aftermarket, not copies. They were removed from the vehicle at the dealership with extremely low mileage when the owner upgraded to a custom wheel package.

The Bridgestone Alenza tires mounted on these wheels are in near-new condition. The Alenza is Bridgestone's premium all-season touring tire engineered specifically for luxury SUVs and trucks — known for its quiet ride, precise handling, and extended tread life.

If you are looking for a genuine OEM upgrade or direct replacement for your Cadillac Escalade without the inflated dealer price on new units, this is an exceptional find. Full set of 4 with Bridgestone Alenza tires, shipping included at $5,500.`,
  },

  // ── 3. 18" Ford Explorer Factory Wheels ─────────────────────────────────────
  {
    id: 'na_3',
    name: '18" Ford Explorer Factory Wheels Rims Gloss Black — New',
    price: 900,
    brand: 'Ford OEM',
    make: 'Ford F-150',
    application: [
      'Ford Explorer 2020+',
      'Ford F-150 (compatible 6-lug fitment)',
    ],
    category: 'Wheels & Brakes',
    condition: 'New',
    shipping: 'Included',
    images: [
      '/arrivals/arrival3a.jpg',
      '/arrivals/arrival3b.jpg',
      '/arrivals/arrival3c.jpg',
      '/arrivals/arrival3d.jpg',
    ],
    specs: [
      { label: 'Size',         value: '18 inch' },
      { label: 'Finish',       value: 'Gloss Black — factory painted' },
      { label: 'Part Type',    value: 'OEM Factory Wheels — never mounted' },
      { label: 'Condition',    value: 'Brand New — no road use, no scratches' },
      { label: 'Quantity',     value: 'Full set of 4' },
    ],
    inStock: true,
    description: `Brand new, never mounted 18-inch Ford Explorer factory wheels in a gloss black finish. These are straight from Ford — genuine OEM units that have never touched the road. The gloss black finish is applied at the factory and arrives in flawless condition.

Gloss black OEM Ford wheels are one of the sharpest factory looks available on the Explorer lineup. Clean, modern, and bold without looking aftermarket. At $900 for a full set of four brand new wheels, this is outstanding value versus dealer pricing.

Shipping is included. Perfect for an Explorer owner wanting a factory-correct wheel swap or for anyone seeking a clean, genuine set of gloss black Ford rims.`,
  },

  // ── 4. 2023 Cadillac Escalade 22" OEM Wheels & Tires ────────────────────────
  {
    id: 'na_4',
    name: 'Brand New Set of 2023 Cadillac Escalade Factory Wheels 22" OEM — Bridgestone Alenza 275/50/22',
    price: 1900,
    brand: 'Cadillac OEM',
    make: 'Cadillac',
    application: [
      'Cadillac Escalade 2021',
      'Cadillac Escalade 2022',
      'Cadillac Escalade 2023',
    ],
    category: 'Wheels & Brakes',
    condition: 'New',
    shipping: 'Included',
    images: [
      '/arrivals/arrival4a.jpg',
      '/arrivals/arrival4b.jpg',
      '/arrivals/arrival4c.jpg',
      '/arrivals/arrival4d.jpg',
    ],
    specs: [
      { label: 'Size',         value: '22 inch OEM Factory Wheels' },
      { label: 'Tires',        value: 'Bridgestone Alenza 275/50/22 — 100% tread life' },
      { label: 'Condition',    value: 'Brand New — never used, never mounted' },
      { label: 'Fitment',      value: 'Cadillac Escalade 2021, 2022, 2023' },
      { label: 'Authenticity', value: 'Genuine OEM factory wheels — not replicas' },
      { label: 'Quantity',     value: 'Full set of 4 wheels with mounted tires' },
    ],
    inStock: true,
    description: `A brand new set of genuine 2023 Cadillac Escalade OEM 22-inch factory wheels, complete with Bridgestone Alenza 275/50/22 tires at 100% tread life. These have never been used or mounted on a vehicle — they are in true new condition.

The Bridgestone Alenza is the factory-specified premium tire for the Escalade platform, engineered to match the vehicle's ride characteristics, load rating, and handling profile. At 275/50/22, this is the correct factory specification for 2021-2023 Escalade models.

Genuine Cadillac OEM 22" wheels on the Escalade represent the factory's premium visual statement. These are not replicas or aftermarket copies — these are the exact units that come from the factory. At $1,900 for a complete set with Bridgestone Alenza tires included and shipping covered, this is exceptional value.`,
  },

  // ── 5. SmartCap EVO Sport Truck Cap ─────────────────────────────────────────
  {
    id: 'na_5',
    name: 'SmartCap EVO Sport Matte Black Truck Cap — 2017-2020 Ford F-250/F-350',
    price: 3200,
    brand: 'SmartCap',
    make: 'Ford F-150',
    application: [
      'Ford F-250 2017–2020',
      'Ford F-350 2017–2020',
    ],
    category: 'Accessories',
    condition: 'New',
    shipping: 'Included',
    images: [
      '/arrivals/arrival5a.jpg',
      '/arrivals/arrival5b.jpg',
      '/arrivals/arrival5c.jpg',
      '/arrivals/arrival5d.jpg',
    ],
    specs: [
      { label: 'Brand',       value: 'SmartCap' },
      { label: 'Series',      value: 'EVO Sport' },
      { label: 'Finish',      value: 'Matte Black' },
      { label: 'Fitment',     value: '2017–2020 Ford F-250 / F-350 SuperDuty' },
      { label: 'Condition',   value: 'Brand New' },
      { label: 'Features',    value: 'Flush-fit design, integrated sports bar, modular load system compatible' },
    ],
    inStock: true,
    description: `The SmartCap EVO Sport is one of the most premium truck caps on the market — engineered in South Africa and trusted by commercial operators and enthusiast truck owners worldwide. The matte black finish gives a clean, blacked-out look that integrates seamlessly with factory or aftermarket trim packages.

The EVO Sport is built from high-strength composite materials and features SmartCap's signature flush-fit design for a low-profile, aerodynamically clean appearance. It sits flush with the cab roofline for a factory-integrated look rather than the boxy profile of conventional caps.

This unit is brand new and fits 2017-2020 Ford F-250 and F-350 SuperDuty models. Shipping is included at $3,200 — significantly below new retail for this spec.`,
  },

  // ── 6. Cadillac Escalade 22" Platinum Gloss Black Wheels ────────────────────
  {
    id: 'na_6',
    name: 'Cadillac Escalade 22" Platinum Gloss Black Wheels Rims',
    price: 1500,
    brand: 'Cadillac OEM',
    make: 'Cadillac',
    application: [
      'Cadillac Escalade Platinum (All Years)',
      'Cadillac Escalade ESV Platinum (All Years)',
    ],
    category: 'Wheels & Brakes',
    condition: 'Like New',
    shipping: 'Included',
    images: [
      '/arrivals/arrival6a.jpg',
      '/arrivals/arrival6b.jpg',
      '/arrivals/arrival6c.jpg',
      '/arrivals/arrival6d.jpg',
    ],
    specs: [
      { label: 'Size',         value: '22 inch' },
      { label: 'Finish',       value: 'Gloss Black — Platinum trim specification' },
      { label: 'Part Type',    value: 'OEM Factory Wheels — Escalade Platinum' },
      { label: 'Condition',    value: 'Like New — minimal road use, no damage' },
      { label: 'Quantity',     value: 'Full set of 4' },
    ],
    inStock: true,
    description: `A full set of 22-inch Cadillac Escalade Platinum gloss black wheels in like-new condition. These are genuine OEM Cadillac wheels from the Platinum trim level — one of the most visually distinctive factory wheel packages available on the Escalade.

The Platinum gloss black finish is a deep, mirror-like black that reads dramatically under any lighting condition. These wheels were removed from a well-maintained Escalade Platinum with minimal road use and show no damage, scratches, or structural issues.

At $1,500 for a full set of four 22-inch Platinum gloss black OEM Escalade wheels with shipping included, this is exceptional value for anyone upgrading or replacing wheels on their Escalade or ESV.`,
  },
];
