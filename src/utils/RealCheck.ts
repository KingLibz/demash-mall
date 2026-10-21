export function isReal(data: any) {
  const str = JSON.stringify(data || "")
  if (str.includes("TNDR-ZW-5133") || str.includes("650000") || str.includes("firebase-applet")) return false
  return !!(data && data.supplierPosReceipt && data.referralCode)
}
