import { EquipmentItem, NetworkScope, B2BProposalLead } from '../types';

export const PARTNER_TELEMETRY = {
  agriBankNostroAccount: "AgriBank Commercial Nostro Gateway",
  affiliateToken: "mnpixfvf",
  commissionRate: 0.15, // 15% standard commission
  commissionPercentage: 15,
  ahmDirectReferralUrl: "https://ahmcorp.com?ref=mnpixfvf",
  ahmCatalogueUrl: "https://ahmcorp.com/collections/all?ref=mnpixfvf",
  masterWhatsAppAlertLine: "+263784219178",
  merchantSource: "AHM Corp (Shopify POS Backend Pipeline)",
  director: "Liberman Magaya",
  verificationHashPrefix: "HMAC_SHA256_PASS_TOKEN_MNPIXFVF"
};

export const AHM_EQUIPMENT_CATALOG: EquipmentItem[] = [
  {
    sku: "AHM-NW-A1",
    title: "AHM Compact Hydraulic Mini Excavator 1.2 Ton",
    category: "Mini Excavators",
    price: 5800.00,
    commission: 870.00,
    inStock: true,
    specs: [
      "Operating Weight: 1,200 kg (2,645 lbs)",
      "Engine: Koop 192F Euro 5 / EPA Tier 4",
      "Max Digging Depth: 1,650 mm",
      "Bucket Capacity: 0.025 m³ with Tooth Array",
      "Zero-Tail Swing & 360° Hydraulic Rotation"
    ],
    targetUrl: "https://ahmcorp.com/products/ahm-nw-a1?ref=mnpixfvf"
  },
  {
    sku: "AHM-MINI-EX-02",
    title: "AHM Heavy Duty Mini Digger 2.0 Ton Pilot Control",
    category: "Mini Excavators",
    price: 9450.00,
    commission: 1417.50,
    inStock: true,
    specs: [
      "Operating Weight: 2,000 kg",
      "Engine: Kubota D902 Diesel 3-Cylinder",
      "Pilot Joystick Hydraulic Valve Control",
      "Rubber Crawler Tracks with Deflection Guard",
      "Auxiliary Piping for Breaker & Auger"
    ],
    targetUrl: "https://ahmcorp.com/products/ahm-mini-ex-02?ref=mnpixfvf"
  },
  {
    sku: "AHM-TRACK-LOADER-85",
    title: "AHM Skid Steer Compact Track Loader 850kg",
    category: "Earthmovers",
    price: 12800.00,
    commission: 1920.00,
    inStock: true,
    specs: [
      "Rated Operating Capacity: 850 kg",
      "Engine: Yanmar 4TNV88 Tier 4 Diesel",
      "High-Flow Auxiliary Hydraulics (80 L/min)",
      "Standard 4-in-1 Multipurpose Bucket Included",
      "Enclosed ROP/FOP Safety Operator Canopy"
    ],
    targetUrl: "https://ahmcorp.com/products/track-loader-85?ref=mnpixfvf"
  },
  {
    sku: "AHM-DUMP-HT-15",
    title: "AHM Hydrostatic 4WD Mini Site Dumper 1.5 Ton",
    category: "Site Dumper",
    price: 6200.00,
    commission: 930.00,
    inStock: true,
    specs: [
      "Payload Capacity: 1,500 kg (1.5 Metric Ton)",
      "Drive: 4x4 Hydrostatic Permanent Transmission",
      "180° Swivel Tip Hydraulic Tipping Skip",
      "Hydraulic Articulated Steering Chassis",
      "Rough Terrain All-Pneumatic Construction Tyres"
    ],
    targetUrl: "https://ahmcorp.com/products/dumper-ht-15?ref=mnpixfvf"
  },
  {
    sku: "AHM-ROLLER-CMP-10",
    title: "AHM Vibratory Double Drum Trench Roller 1.0 Ton",
    category: "Earthmovers",
    price: 7150.00,
    commission: 1072.50,
    inStock: true,
    specs: [
      "Static Linear Load: 45 N/cm",
      "Honda GX390 Industrial Petrol / Diesel Option",
      "Centrifugal Compaction Force: 20 kN",
      "Pressurized Water Sprinkler System (40L)",
      "Dual Drum Hydrostatic Drive & Vibration"
    ],
    targetUrl: "https://ahmcorp.com/products/vibratory-roller-10?ref=mnpixfvf"
  },
  {
    sku: "AHM-GEN-HYBRID-30",
    title: "AHM Industrial 30kVA Silent Diesel Generator Standby",
    category: "Power & Generators",
    price: 8900.00,
    commission: 1335.00,
    inStock: true,
    specs: [
      "Prime Power: 30 kVA (24 kW) / 400V 3-Phase",
      "Engine: Cummins / Perkins Water-Cooled 4-Cylinder",
      "Sound Attenuated Canopy: 68 dBA @ 7m",
      "SmartGen Automatic Transfer Switch (ATS) Ready",
      "12-Hour Continuous Fuel Storage Tank Base"
    ],
    targetUrl: "https://ahmcorp.com/products/generator-silent-30kva?ref=mnpixfvf"
  },
  {
    sku: "AHM-SOLAR-TWR-04",
    title: "AHM Mobile Solar LED Site Lighting Tower 4x100W",
    category: "Power & Generators",
    price: 4650.00,
    commission: 697.50,
    inStock: true,
    specs: [
      "Luminaires: 4x 100W High-Lumen Cree LEDs",
      "Telescopic Mast: 6.5 Meter Manual/Pneumatic",
      "Solar Array: 3x 350W Monocrystalline Panels",
      "Battery Bank: 4x 200Ah Deep Cycle AGM Array",
      "Road-Towable Heavy Duty Suspension Trailer"
    ],
    targetUrl: "https://ahmcorp.com/products/solar-light-tower?ref=mnpixfvf"
  },
  {
    sku: "AHM-BREAKER-HYD-50",
    title: "AHM Heavy Hydraulic Rock Breaker Attachment",
    category: "Mini Excavators",
    price: 2850.00,
    commission: 427.50,
    inStock: true,
    specs: [
      "Operating Pressure: 90 - 120 bar",
      "Chisel Diameter: 45 mm Moil & Wedge Tool",
      "Impact Rate: 600 - 1,100 bpm",
      "Compatible with 0.8 - 2.5 Ton Excavator Arm",
      "Dual High-Pressure Hydraulic Hoses & Nitrogen Kit"
    ],
    targetUrl: "https://ahmcorp.com/products/hydraulic-breaker-attachment?ref=mnpixfvf"
  }
];

export const INITIAL_NETWORK_SCOPES: NetworkScope[] = [
  {
    id: 1,
    ip_range: "196.220.40.0/24",
    country_code: "ZW",
    business_vertical: "mining_machinery",
    last_scanned_at: "2026-10-10 11:45:00",
    status: "ACTIVE"
  },
  {
    id: 2,
    ip_range: "41.76.0.0/16",
    country_code: "ZA",
    business_vertical: "international_real_estate",
    last_scanned_at: "2026-10-10 09:30:12",
    status: "ACTIVE"
  },
  {
    id: 3,
    ip_range: "197.221.128.0/20",
    country_code: "ZW",
    business_vertical: "commercial_construction_materials",
    last_scanned_at: "2026-10-09 18:20:00",
    status: "IDLE"
  },
  {
    id: 4,
    ip_range: "102.134.0.0/16",
    country_code: "AE",
    business_vertical: "heavy_plant_and_equipment",
    last_scanned_at: "2026-10-10 04:00:00",
    status: "ACTIVE"
  }
];

export const INITIAL_B2B_PROPOSALS: B2BProposalLead[] = [];

export function buildB2BProposalText(agencyName: string): string {
  return `DEMASH CONSTRUCTION (PVT) LTD
K17412 Katanga, Norton, Zimbabwe
Contact: +263 78 421 9178 | libermanking@gmail.com

Date: 10 October 2026

To: The Commercial Accounts & Wholesale Division Manager (${agencyName || 'Commercial Partner'})

RE: PROPOSAL FOR AFFILIATE DIGITAL LEAD GENERATION & BULK SUPPLY PARTNERSHIP

Dear Sir/Madam,

I am writing to you in my capacity as the Managing Director of Demash Construction Pvt Ltd. Our construction and development business is currently rolling out an optimized, highly interactive digital procurement and materials sourcing engine designed to assist property developers, private builders, and Diaspora clients in ordering high-volume structural materials seamlessly.

${agencyName || 'Your Agency'} represents top-tier building standards. We are formally proposing a digital lead-generation and channel partnership to funnel high-volume trade buyer inquiries straight to your wholesale counters.

Our Proposed Operational Terms:
1. Direct Product Spotlighting: We will display your bulk structural material lines (including cement, timber, steel, tools, roofing, and plumbing profiles) to high-intent builders using our platform.
2. Verified Lead Delivery: Instead of operating a complex retail infrastructure ourselves, our digital engine captures verified bills of quantities (BOQ) from private developers and pushes them as ready-to-buy orders straight to your commercial sales desks.
3. Channel Affiliate Rebate: We operate on a structured commercial affiliate model, where your firm grants a trade discount or a volume-based referral commission to Demash Construction Pvt Ltd for all bulk orders fully settled through our digital pipeline.

We want to add your wholesale product catalogs to our listing index. Let us discuss how we can sync your bulk prices to our traffic hub under a standard trade introduction agreement.

Sincerely,

Liberman Magaya
Managing Director
Demash Construction Pvt Ltd
Phone: +263 78 421 9178
Email: libermanking@gmail.com`;
}
