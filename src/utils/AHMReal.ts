export const AHM_REAL = {
  supplier: "AHM",
  referralCode: "mnpixfvf",
  realLink: "https://ahmcorp.com/?ref=mnpixfvf",
  redirectLink: "demash-core.onrender.com/r/ahm-mnpixfvf",
  catalogue: [
    "Mini Excavators", "Skid Steers", "Lawn Mowers", "Parts",
    "Kubota Engine Excavators", "Briggs & Stratton", "Komatsu Parts"
  ],
  commission: 0.08,
  isReal: true,
  verified: true,
  note: "REAL - Sourced by Boss Liberman - Verified 2026 - Mini excavators, skid steers, high-intent buyers"
}

export function trackAHMReferral(value: number) {
  const profit = value * AHM_REAL.commission
  return {
    profit,
    ecoCash: profit >= 300 ? 300 : 0,
    bank: profit >= 300 ? profit - 300 : profit,
    split: profit >= 300 ? `$300 -> EcoCash +263784219178 FIRST, $${(profit-300).toFixed(2)} -> Bank` : `Pending $${profit.toFixed(2)} - need $300 to split`,
    link: AHM_REAL.realLink,
    isReal: true
  }
}
