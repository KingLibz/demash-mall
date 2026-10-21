export const RealAutomationGuard = {
  // Ensures automations work only with real data, not mock
  beforeRun: (automation: string, data: any) => {
    const mockSigns = ["TNDR-ZW-5133", "5133-6132", "650000", "117000", "AgriBank 25%", "firebase-applet-config"]
    const isMock = mockSigns.some(m => JSON.stringify(data).includes(m))
    if (isMock) return { allow: false, reason: `BLOCKED ${automation}: contains mock data` }
    if (!data.supplierPosReceipt && !data.referralCode) return { allow: false, reason: `BLOCKED ${automation}: need real POS receipt + referral` }
    return { allow: true, reason: "Real data - automation will work and give results" }
  }
}
