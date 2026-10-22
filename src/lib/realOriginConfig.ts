// REAL ORIGIN CONFIG - No demashglobal.live - fixes Lovable + Google AI Studio block
export const REAL_ORIGINS = [
  "https://demash.co.zw",
  "https://www.demash.co.zw",
  "https://*.lovable.app",
  "https://*.lovable.dev",
  "https://*.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000"
];

export const REAL_AFFILIATE_LINKS = {
  ahm: {
    url: "https://ahmcorp.com/?ref=mnpixfvf",
    ref: "mnpixfvf",
    status: "LIVE - $165k real",
    isMock: false
  },
  zim: {
    url: "https://demash.co.zw/r/ahm-mnpixfvf",
    status: "LIVE - real",
    isMock: false
  },
  sona: {
    name: "Sona Solar Zimbabwe",
    address: "7 Frank Johnson Ave Eastlea Harare",
    brands: ["Pylontech US3000C $1570", "LVTOPSUN $600-2700"],
    type: "wholesale - no link, direct",
    isMock: false
  },
  // These will be REAL only after you apply
  renogy: {
    url: null, // null = not real yet, so outreach shows "Apply Now" not fake link
    apply: "https://www.renogy.com/pages/affiliate-program",
    commission: "6%",
    status: "PENDING"
  },
  【entity-ecoflow¦canonical_name=EcoFlow】: {
    url: null,
    apply: "CJ Affiliate search 【entity-EcoFlow¦canonical_name=EcoFlow】",
    commission: "5%",
    status: "PENDING"
  }
};

// Function that returns ONLY real, no mock, no demashglobal.live
export function getRealLinksOnly() {
  const banned = ["11400", "10000", "1500", "TNDR-ZW-5133", "demashglobal.live"];
  const real: any = {};
  Object.entries(REAL_AFFILIATE_LINKS).forEach(([k, v]: any) => {
    if (v.url && !banned.some(b => v.url.includes(b))) {
      real[k] = v;
    }
  });
  return real;
}

console.log("REAL ONLY:", getRealLinksOnly());
