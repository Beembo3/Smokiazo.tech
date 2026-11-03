/**
 * Demo fixtures and shared types.
 *
 * Everything in the prototype is local: no network calls, no bookings, no
 * payments. References, tracking events and contact details mirror the
 * "demo fixtures only" section of the Figma handoff.
 */

export type Channel = "Email" | "Mobile" | "Either";

export type QuoteDraft = {
  province: string;
  city: string;
  barangay: string;
  postal: string;
  contactName: string;
  mobile: string;
  email: string;
  packageType: string;
  description: string;
  pieces: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  declaredValue: string;
  channel: Channel;
  consent: boolean;
};

export type InquiryDraft = {
  category: string;
  destination: string;
  quantity: string;
  contactName: string;
  email: string;
  message: string;
};

export type HelpDraft = {
  reference: string;
  issueType: string;
  message: string;
  email: string;
};

export type StoredRequest = {
  id: string;
  kind: "quote" | "inquiry";
  title: string;
  status: string;
  destination: string;
  summary: string;
  createdAt: string;
  channel?: string;
  detail?: {
    route?: string;
    contact?: string;
    package?: string;
    service?: string;
    quantity?: string;
    message?: string;
  };
};

export const EMPTY_QUOTE: QuoteDraft = {
  province: "Pampanga",
  city: "Angeles City",
  barangay: "Santo Cristo",
  postal: "2009",
  contactName: "Alex D.",
  mobile: "",
  email: "alex@example.com",
  packageType: "Parcel / package",
  description: "Folded cotton shirts",
  pieces: "1",
  weight: "1.0",
  length: "30",
  width: "20",
  height: "10",
  declaredValue: "800.00",
  channel: "Email",
  consent: false,
};

export const EMPTY_INQUIRY: InquiryDraft = {
  category: "business",
  destination: "Angeles City, Pampanga",
  quantity: "12 cartons",
  contactName: "Alex D.",
  email: "alex@example.com",
  message:
    "Can you handle 12 cartons of cotton shirts to Angeles City? Please advise on packing and service availability.",
};

export const EMPTY_HELP: HelpDraft = {
  reference: "DEMO-26001842",
  issueType: "Tracking question",
  message:
    "Please help me check this waybill. I cannot find a matching record.",
  email: "alex@example.com",
};

export const PACKAGE_TYPES = [
  "Documents",
  "Parcel / package",
  "Larger shipment",
];

export const CHANNELS: Channel[] = ["Email", "Mobile", "Either"];

export const HELP_TOPICS = [
  "Tracking question",
  "Quote request",
  "Special service inquiry",
  "Branch information",
  "Account and sign-in",
];

/* ------------------------------------------------------------------ */
/* Locations — a small, realistic subset for the dependent selects     */
/* ------------------------------------------------------------------ */

type City = { name: string; postal: string; barangays: string[] };

export const LOCATIONS: Record<string, City[]> = {
  Pampanga: [
    {
      name: "Angeles City",
      postal: "2009",
      barangays: ["Santo Cristo", "Balibago", "San Jose", "Cutcut", "Pulung Maragul"],
    },
    {
      name: "San Fernando",
      postal: "2000",
      barangays: ["Sindalan", "Dolores", "Del Pilar", "Sto. Rosario"],
    },
    {
      name: "Mabalacat",
      postal: "2010",
      barangays: ["Dau", "San Francisco", "Atlu-Bola"],
    },
  ],
  "Nueva Ecija": [
    {
      name: "Cabanatuan City",
      postal: "3100",
      barangays: ["Sangitan", "Dicarma", "Zulueta", "Burgos"],
    },
    {
      name: "Gapan",
      postal: "3105",
      barangays: ["Bayanihan", "San Lorenzo", "Malimba"],
    },
    {
      name: "San Jose",
      postal: "3121",
      barangays: ["Abes", "Rizal", "Malasin"],
    },
  ],
  Tarlac: [
    {
      name: "Tarlac City",
      postal: "2300",
      barangays: ["San Roque", "Poblacion", "Cut-cut Primero"],
    },
  ],
  Bulacan: [
    {
      name: "Malolos",
      postal: "3000",
      barangays: ["Poblacion", "Santisima Trinidad", "Guinhawa"],
    },
  ],
  Bataan: [
    {
      name: "Balanga",
      postal: "2100",
      barangays: ["Poblacion", "Tuyo", "Cupang"],
    },
  ],
};

export const PROVINCES = Object.keys(LOCATIONS);

/* ------------------------------------------------------------------ */
/* Service catalogue                                                   */
/* ------------------------------------------------------------------ */

export type ServiceItem = {
  slug: string;
  kicker: string;
  title: string;
  text: string;
  icon: "document" | "box" | "business";
  category: string;
};

export const SHIPPING_TYPES: ServiceItem[] = [
  {
    slug: "documents",
    kicker: "01 / Documents",
    title: "Paperwork, protected.",
    text: "For personal or business paperwork that needs a careful handover.",
    icon: "document",
    category: "Documents",
  },
  {
    slug: "parcels",
    kicker: "02 / Parcels",
    title: "Everyday, delivered.",
    text: "For gifts, personal belongings and properly packed customer orders.",
    icon: "box",
    category: "Parcel / package",
  },
  {
    slug: "larger",
    kicker: "03 / Larger shipments",
    title: "More to move? Let’s talk.",
    text: "For multiple packages, larger items or shipments needing extra planning.",
    icon: "business",
    category: "Larger shipment",
  },
];

/** Home cards use shorter, customer-facing names than the Shipping screen. */
export const HOME_SERVICES: {
  slug: string;
  title: string;
  text: string;
  icon: "document" | "box" | "business";
}[] = [
  {
    slug: "documents",
    title: "Documents",
    text: "Paperwork and non-merchandise items.",
    icon: "document",
  },
  {
    slug: "parcels",
    title: "Parcels & packages",
    text: "Gifts and everyday orders.",
    icon: "box",
  },
  {
    slug: "larger",
    title: "Business shipments",
    text: "Repeat orders and larger dispatches.",
    icon: "business",
  },
];

export const INQUIRY_CATEGORIES = [
  {
    slug: "business",
    kicker: "Recurring business shipments",
    title: "Recurring business shipment inquiry",
    text: "Ask the branch about repeat business shipments and the next steps.",
    icon: "business" as const,
    label: "Business shipments",
  },
  {
    slug: "bulk",
    kicker: "Bulk & multi-piece inquiries",
    title: "Bulk & multi-piece inquiry",
    text: "Share the shipment details and the branch will confirm availability.",
    icon: "bulk" as const,
    label: "Bulk & multi-piece",
  },
  {
    slug: "fragile",
    kicker: "Fragile & high-value items",
    title: "Fragile & high-value inquiry",
    text: "Share the item details and the branch will explain the next steps.",
    icon: "shield" as const,
    label: "Fragile & high-value",
  },
  {
    slug: "pickup",
    kicker: "Pickup & delivery questions",
    title: "Pickup & delivery inquiry",
    text: "Ask the branch about collection and delivery options.",
    icon: "truck" as const,
    label: "Pickup & delivery",
  },
];

export function inquiryBySlug(slug?: string) {
  return INQUIRY_CATEGORIES.find((c) => c.slug === slug) ?? INQUIRY_CATEGORIES[0];
}

/* ------------------------------------------------------------------ */
/* Tracking fixture                                                   */
/* ------------------------------------------------------------------ */

export const TRACKING_DEMO = {
  waybill: "DEMO-26001842",
  status: "In transit · demo",
  route: "Cabanatuan City, Nueva Ecija → Angeles City, Pampanga",
  updated: "19 Oct 2026 · 10:30 AM",
  events: [
    {
      title: "In transit",
      at: "19 Oct 2026 · 10:30 AM",
      note: "Moving toward the destination hub.",
      current: true,
    },
    {
      title: "At origin hub",
      at: "18 Oct 2026 · 5:10 PM",
      note: "Processed in Cabanatuan City.",
      current: false,
    },
    {
      title: "Shipment received",
      at: "18 Oct 2026 · 2:00 PM",
      note: "Received at the origin branch.",
      current: false,
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Seeded request history                                             */
/* ------------------------------------------------------------------ */

export const SEED_REQUESTS: StoredRequest[] = [
  {
    id: "DEMO-Q-0018",
    kind: "quote",
    title: "Quote request",
    status: "Awaiting branch review",
    destination: "Angeles City, Pampanga",
    summary: "1 parcel · cotton shirts · 1.0 kg",
    createdAt: "19 Oct 2026",
    channel: "Email",
    detail: {
      route:
        "From Cabanatuan City, Nueva Ecija to Santo Cristo, Angeles City, Pampanga 2009",
      contact: "Alex D. · alex@example.com · Mobile: not provided",
      package:
        "Parcel / package · Folded cotton shirts · 1 piece · 1.0 kg total · 30 × 20 × 10 cm · Declared value PHP 800.00 (not a price)",
    },
  },
  {
    id: "DEMO-I-0007",
    kind: "inquiry",
    title: "Business shipment inquiry",
    status: "Awaiting branch review",
    destination: "Angeles City, Pampanga",
    summary: "12 cartons of cotton shirts",
    createdAt: "19 Oct 2026",
    channel: "Email",
    detail: {
      service: "Business shipments",
      quantity: "12 cartons",
      message:
        "Can you handle 12 cartons of cotton shirts to Angeles City? Please advise on packing and service availability.",
    },
  },
];

/* ------------------------------------------------------------------ */
/* Form validation                                                    */
/* ------------------------------------------------------------------ */

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const mobilePattern = /^(09|\+639)\d{9}$/;

export type Errors<T> = Partial<Record<keyof T, string>>;

export function validateQuoteStep1(draft: QuoteDraft): Errors<QuoteDraft> {
  const errors: Errors<QuoteDraft> = {};
  if (!draft.province) errors.province = "Choose a province.";
  if (!draft.city) errors.city = "Choose a city or municipality.";
  if (!draft.barangay) errors.barangay = "Choose a barangay.";
  if (!/^\d{4}$/.test(draft.postal)) errors.postal = "Enter a 4-digit postal code.";
  if (!draft.contactName.trim()) errors.contactName = "Enter a contact name.";
  if (draft.mobile.trim() && !mobilePattern.test(draft.mobile.replace(/\s/g, ""))) {
    errors.mobile = "Use 09XXXXXXXXX or +639XXXXXXXXX.";
  }
  if (!draft.email.trim()) errors.email = "Enter an email address.";
  else if (!emailPattern.test(draft.email.trim()))
    errors.email = "Use a valid email, for example alex@example.com.";
  return errors;
}

export function validateQuoteStep2(draft: QuoteDraft): Errors<QuoteDraft> {
  const errors: Errors<QuoteDraft> = {};
  if (!draft.packageType) errors.packageType = "Choose a package type.";
  if (!draft.description.trim()) errors.description = "Describe the contents.";
  if (!Number.isInteger(Number(draft.pieces)) || Number(draft.pieces) < 1)
    errors.pieces = "Whole number, at least 1.";
  if (!(Number(draft.weight) > 0)) errors.weight = "Enter a packed weight above 0.";
  for (const key of ["length", "width", "height"] as const) {
    if (!(Number(draft[key]) > 0)) errors[key] = "Above 0.";
  }
  if (!(Number(draft.declaredValue) >= 0))
    errors.declaredValue = "Enter the declared value.";
  return errors;
}

export function validateQuoteStep3(draft: QuoteDraft): Errors<QuoteDraft> {
  const errors: Errors<QuoteDraft> = {};
  if (!draft.channel) errors.channel = "Choose a contact channel.";
  if (!draft.consent) errors.consent = "Consent is required before submission.";
  return errors;
}
