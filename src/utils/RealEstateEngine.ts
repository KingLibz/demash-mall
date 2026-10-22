export const RealEstateEngine = {
  // REAL estate: No mock stands
  listings: [] as any[], // START ZERO
  addReal: (stand: any) => {
    if (!stand.titleDeed || !stand.ownerPosReceipt) return { error: "Need real title deed + owner verification, no mock" }
    return { status: "LIVE", referral: "5% if sold via demash-core.onrender.com/r/estate-id" }
  }
}
