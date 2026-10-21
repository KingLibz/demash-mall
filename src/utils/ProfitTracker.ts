export const PARTNERSHIP_RATES = {
  tier1_subcontract: 0.08,  // 8% Fossil Tier-1
  small_contractor: 0.12,   // 12%
  supplier_referral: 0.05,  // 5% supplier POS
  affiliate_link: 0.03,     // 3%
  signed_partnership: 0.10  // 10%
}

export const PAYOUT_CONFIG = {
  personalEcoCash: "+263784219178",
  dailyEcoCashSplit: 300, // $300 to EcoCash first
  bankAccount: "BANK", // your bank
  minToSplit: 300 // only split if day has enough to cover
}

export function trackRealProfit(deal: any) {
  if (!deal.supplierPosReceipt || !deal.referralCode) return 0
  const rate = (PARTNERSHIP_RATES as any)[deal.type] || 0.05
  return deal.value * rate
}

// DAILY SPLIT: EcoCash first, then Bank, only if enough money that day
export function processDailyPayout(totalToday: number) {
  if (totalToday < PAYOUT_CONFIG.minToSplit) {
    return {
      ecoCash: 0,
      bank: 0,
      pending: totalToday,
      message: `Not enough to cover EcoCash split - need $${PAYOUT_CONFIG.minToSplit}, have $${totalToday}. Carrying over.`
    }
  }
  const ecoCash = PAYOUT_CONFIG.dailyEcoCashSplit
  const bank = totalToday - ecoCash
  return {
    ecoCash,
    bank,
    pending: 0,
    message: `$${ecoCash} -> EcoCash ${PAYOUT_CONFIG.personalEcoCash} FIRST, $${bank} -> Bank`
  }
}
