export type ColorVariant = {
  name: string;
  hex: string;
  /** hardware tint used by the 3D viewer */
  hardware: string;
};

export type BagModel = "tote" | "crossbody" | "clutch" | "mini" | "weekender" | "hobo" | "bucket" | "satchel" | "luna" | "boston";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Totes" | "Crossbody" | "Clutches" | "Mini Bags" | "Travel";
  model: BagModel;
  price: number;
  compareAt?: number;
  blurb: string;
  story: string;
  material: string;
  dimensions: string;
  weight: string;
  colors: ColorVariant[];
  sizes: string[];
  image: string;
  lifestyle: string;
  tag?: "NEW" | "BEST SELLER" | "LIMITED" | "SALE";
  rating: number;
  reviews: number;
};

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const products: Product[] = [
  {
    id: "p1",
    slug: "meridienne-tote",
    name: "Méridienne Tote",
    category: "Totes",
    model: "tote",
    price: 128000,
    blurb: "A structured silhouette in full-grain calfskin.\nBuilt to carry a day that refuses to end.",
    story:
      "Cut from a single hide and burnished by hand over three days, the Méridienne is our atelier's answer to the working tote — architectural at rest, effortless in motion.",
    material: "Full-grain Tuscan calfskin",
    dimensions: "38 × 30 × 14 cm",
    weight: "920 g",
    colors: [
      { name: "Cognac", hex: "#8a4b2a", hardware: "#d4af6a" },
      { name: "Noir", hex: "#1c1a18", hardware: "#c0c0c4" },
      { name: "Ivory", hex: "#e8e0d2", hardware: "#d4af6a" },
    ],
    sizes: ["Standard", "Grand"],
    image: u("photo-1590874103328-eac38a683ce7"),
    lifestyle: u("photo-1483985988355-763728e1935b"),
    tag: "BEST SELLER",
    rating: 4.9,
    reviews: 214,
  },
  {
    id: "p2",
    slug: "aube-crossbody",
    name: "Aube Crossbody",
    category: "Crossbody",
    model: "crossbody",
    price: 86500,
    compareAt: 104000,
    blurb: "Soft-pleated lambskin on an adjustable chain.\nMorning light, made carriable.",
    story:
      "The Aube's pleats are folded wet and dried under linen weights — no two bags hold the light the same way.",
    material: "Pleated lambskin, brass chain",
    dimensions: "24 × 16 × 8 cm",
    weight: "540 g",
    colors: [
      { name: "Rosewood", hex: "#9c5c4e", hardware: "#d4af6a" },
      { name: "Slate", hex: "#5a5e66", hardware: "#c0c0c4" },
      { name: "Butter", hex: "#e6d3a3", hardware: "#d4af6a" },
    ],
    sizes: ["One Size"],
    image: u("photo-1548036328-c9fa89d128fa"),
    lifestyle: u("photo-1469334031218-e382a71b716b"),
    tag: "SALE",
    rating: 4.8,
    reviews: 167,
  },
  {
    id: "p3",
    slug: "vesper-clutch",
    name: "Vesper Clutch",
    category: "Clutches",
    model: "clutch",
    price: 64000,
    blurb: "An evening line drawn in mirror-polish calf.\nCarries exactly enough.",
    story:
      "Named for the first star of evening, the Vesper closes with a single machined clasp that takes forty minutes to polish.",
    material: "Mirror-polish calf, palladium clasp",
    dimensions: "28 × 15 × 4 cm",
    weight: "380 g",
    colors: [
      { name: "Onyx", hex: "#16141a", hardware: "#c0c0c4" },
      { name: "Oxblood", hex: "#5e1f24", hardware: "#d4af6a" },
    ],
    sizes: ["One Size"],
    image: u("photo-1566150905458-1bf1fc113f0d"),
    lifestyle: u("photo-1487222477894-8943e31ef7b2"),
    tag: "NEW",
    rating: 4.7,
    reviews: 89,
  },
  {
    id: "p4",
    slug: "petit-soleil",
    name: "Petit Soleil",
    category: "Mini Bags",
    model: "mini",
    price: 58000,
    blurb: "A mini top-handle with outsized presence.\nSunlight in bag form.",
    story:
      "Scaled down but never simplified — the Petit Soleil keeps every construction detail of its full-size siblings, including the hand-rolled handle.",
    material: "Grained goatskin",
    dimensions: "18 × 14 × 8 cm",
    weight: "310 g",
    colors: [
      { name: "Saffron", hex: "#d9920f", hardware: "#d4af6a" },
      { name: "Blanc", hex: "#efe9dd", hardware: "#d4af6a" },
      { name: "Forest", hex: "#2a4234", hardware: "#c0c0c4" },
    ],
    sizes: ["One Size"],
    image: u("photo-1584917865442-de89df76afd3"),
    lifestyle: u("photo-1581044777550-4cfa60707c03"),
    tag: "NEW",
    rating: 4.9,
    reviews: 142,
  },
  {
    id: "p5",
    slug: "voyage-48h",
    name: "Voyage 48H",
    category: "Travel",
    model: "weekender",
    price: 196000,
    blurb: "Two nights, one bag, zero compromise.\nThe weekender, re-engineered.",
    story:
      "A collapsible brass frame lets the Voyage stand open like a steamer trunk, then cinch flat for the overhead bin.",
    material: "Vachetta leather, brass frame",
    dimensions: "52 × 32 × 24 cm",
    weight: "1.6 kg",
    colors: [
      { name: "Tan", hex: "#a9743f", hardware: "#d4af6a" },
      { name: "Graphite", hex: "#3a3a3e", hardware: "#c0c0c4" },
    ],
    sizes: ["48H", "72H"],
    image: u("photo-1553062407-98eeb64c6a62"),
    lifestyle: u("photo-1581553673739-c4906b5d0de1"),
    tag: "LIMITED",
    rating: 4.8,
    reviews: 76,
  },
  {
    id: "p6",
    slug: "lune-hobo",
    name: "Lune Hobo",
    category: "Crossbody",
    model: "hobo",
    price: 98000,
    blurb: "A crescent of tumbled leather that softens with you.\nGravity does the styling.",
    story:
      "Tumbled for eleven hours before cutting, the Lune arrives pre-softened — it drapes from day one and only improves.",
    material: "Tumbled calfskin",
    dimensions: "32 × 22 × 10 cm",
    weight: "610 g",
    colors: [
      { name: "Taupe", hex: "#9d8b78", hardware: "#d4af6a" },
      { name: "Noir", hex: "#1c1a18", hardware: "#c0c0c4" },
      { name: "Claret", hex: "#6e2a35", hardware: "#d4af6a" },
    ],
    sizes: ["One Size"],
    image: u("photo-1591561954557-26941169b49e"),
    lifestyle: u("photo-1485968579580-b6d095142e6e"),
    tag: "BEST SELLER",
    rating: 4.9,
    reviews: 198,
  },
  {
    id: "p7",
    slug: "arc-shoulder",
    name: "Arc Shoulder",
    category: "Crossbody",
    model: "crossbody",
    price: 112000,
    blurb: "One continuous curve from strap to base.\nMinimalism with a spine.",
    story:
      "The Arc is moulded over a beechwood form for 48 hours, giving it a single unbroken line no flat pattern could produce.",
    material: "Moulded bridle leather",
    dimensions: "27 × 18 × 9 cm",
    weight: "520 g",
    colors: [
      { name: "Bone", hex: "#ddd5c4", hardware: "#c0c0c4" },
      { name: "Espresso", hex: "#3d2b1f", hardware: "#d4af6a" },
    ],
    sizes: ["One Size"],
    image: u("photo-1559563458-527698bf5295"),
    lifestyle: u("photo-1496747611176-843222e1e57c"),
    rating: 4.6,
    reviews: 61,
  },
  {
    id: "p8",
    slug: "rive-bucket",
    name: "Rive Bucket",
    category: "Totes",
    model: "bucket",
    price: 92000,
    blurb: "Drawstring ease, riverside composure.\nThe bucket bag, tailored.",
    story:
      "Its drawstring runs through hand-set eyelets and closes with a knot we teach every artisan in their first year.",
    material: "Suede-lined calfskin",
    dimensions: "26 × 28 × 18 cm",
    weight: "640 g",
    colors: [
      { name: "Sand", hex: "#cdb795", hardware: "#d4af6a" },
      { name: "Ink", hex: "#23262e", hardware: "#c0c0c4" },
    ],
    sizes: ["One Size"],
    image: u("photo-1564422170194-896b89110ef8"),
    lifestyle: u("photo-1515886657613-9f3515b0c78f"),
    rating: 4.7,
    reviews: 84,
  },
  {
    id: "p9",
    slug: "noctis-mini",
    name: "Noctis Mini",
    category: "Mini Bags",
    model: "mini",
    price: 71000,
    blurb: "After-dark hardware on a palm-sized frame.\nSmall bag, long night.",
    story:
      "Blackened brass, midnight lacquer edges, and a strap that converts from shoulder to crossbody with one gesture.",
    material: "Lacquered calfskin, blackened brass",
    dimensions: "16 × 12 × 7 cm",
    weight: "290 g",
    colors: [
      { name: "Midnight", hex: "#141822", hardware: "#3a3a3e" },
      { name: "Silver", hex: "#c9c9cf", hardware: "#c0c0c4" },
    ],
    sizes: ["One Size"],
    image: u("photo-1575032617751-6ddec2089882"),
    lifestyle: u("photo-1529139574466-a303027c1d8b"),
    tag: "LIMITED",
    rating: 4.8,
    reviews: 53,
  },
  {
    id: "p10",
    slug: "sable-satchel",
    name: "Sable Satchel",
    category: "Totes",
    model: "satchel",
    price: 134000,
    blurb: "The briefcase your grandfather promised,\nredrawn for now.",
    story:
      "Twin saddle-stitched gussets expand a full eight centimetres — laptop, portfolio, and the day's ambitions included.",
    material: "Saddle-stitched bridle leather",
    dimensions: "40 × 29 × 12 cm",
    weight: "1.1 kg",
    colors: [
      { name: "Chestnut", hex: "#7a4a26", hardware: "#d4af6a" },
      { name: "Black", hex: "#191715", hardware: "#c0c0c4" },
    ],
    sizes: ["Standard"],
    image: u("photo-1473188588951-666fce8e7c68"),
    lifestyle: u("photo-1507679799987-c73779587ccf"),
    rating: 4.7,
    reviews: 95,
  },
  {
    id: "p11",
    slug: "ondine-pochette",
    name: "Ondine Pochette",
    category: "Clutches",
    model: "clutch",
    price: 49000,
    compareAt: 61000,
    blurb: "A wave of ruched satin-leather.\nHolds a phone, a card, a secret.",
    story:
      "Each Ondine is ruched by a single artisan in one sitting — pausing would break the rhythm of the gathers.",
    material: "Ruched satin-finish lambskin",
    dimensions: "22 × 12 × 5 cm",
    weight: "240 g",
    colors: [
      { name: "Pearl", hex: "#e9e2d8", hardware: "#d4af6a" },
      { name: "Mocha", hex: "#6f5644", hardware: "#d4af6a" },
      { name: "Cobalt", hex: "#2c3e6b", hardware: "#c0c0c4" },
    ],
    sizes: ["One Size"],
    image: u("photo-1559563362-c667ba5f5480"),
    lifestyle: u("photo-1492707892479-7bc8d5a4ee93"),
    tag: "SALE",
    rating: 4.6,
    reviews: 118,
  },
  {
    id: "p12",
    slug: "atlas-weekender",
    name: "Atlas Weekender",
    category: "Travel",
    model: "weekender",
    price: 168000,
    blurb: "Maps the world from a luggage rack.\nCanvas body, leather everything else.",
    story:
      "Waxed canvas panels keep the Atlas under airline weight limits while bridle leather takes every point of stress.",
    material: "Waxed canvas, bridle leather trim",
    dimensions: "55 × 30 × 26 cm",
    weight: "1.4 kg",
    colors: [
      { name: "Olive", hex: "#5a5b42", hardware: "#d4af6a" },
      { name: "Charcoal", hex: "#3b3b3b", hardware: "#c0c0c4" },
    ],
    sizes: ["One Size"],
    image: u("photo-1547949003-9792a18a2601"),
    lifestyle: u("photo-1502920917128-1aa500764cbd"),
    rating: 4.8,
    reviews: 67,
  },
];

export const categories = ["All", "Totes", "Crossbody", "Clutches", "Mini Bags", "Travel"] as const;

export const materials = ["All", "Calfskin", "Lambskin", "Goatskin", "Bridle", "Canvas"] as const;

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
