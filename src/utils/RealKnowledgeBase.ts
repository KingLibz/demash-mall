export const RealKnowledgeBase = {
  // REAL knowledge - not mock TNDR-5133
  // Only real BOQ from your drawings, real cement prices from supplier POS
  getCementPrice: () => {
    // Must come from real supplier POS API, not hardcoded 650k
    return { price: 0, source: "Add real supplier in Admin, no mock price" }
  },
  validateBOQ: (boq: any) => {
    if (boq.value === 650000 || boq.code === "TNDR-ZW-5133") return { valid: false, reason: "MOCK DATA BLOCKED - delete mock" }
    return { valid: !!boq.supplierPosReceipt, reason: "Need real supplier POS" }
  }
}
