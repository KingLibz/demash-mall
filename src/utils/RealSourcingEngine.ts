export const RealSourcingEngine = {
  // REAL sourcing: no mock, supplier POS only
  source: async (item: string, location: string) => {
    // Returns empty until real supplier added via Admin
    // Client pays supplier direct, we track via referral
    return { suppliers: [], note: "Add real supplier in Admin -> Suppliers with POS link. No mock." }
  },
  isReal: (data: any) => !!data.supplierPosReceipt && !!data.referralCode
}
