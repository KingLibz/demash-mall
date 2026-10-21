export const PARTNERSHIP_RATES = {
  tier1_subcontract: 0.08,  // 8% for 【entity-Fossil¦canonical_name=Fossil】 Tier-1 (reasonable, industry 5-10%)
  small_contractor: 0.12,   // 12% for small jobs
  supplier_referral: 0.05,  // 5% when client pays supplier POS via your link
  affiliate_link: 0.03,     // 3% affiliate
  signed_partnership: 0.10  // 10% signed partnership deal
}

export function trackRealProfit(deal: any) {
  if (!deal.supplierPosReceipt || !deal.referralCode) return 0
  const rate = PARTNERSHIP_RATES[deal.type as keyof typeof PARTNERSHIP_RATES] || 0.05
  return deal.value * rate
}
