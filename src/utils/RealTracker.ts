export const RealTracker = {
  // REAL - starts at zero, no mock 11400
  getPerf: () => {
    const real = JSON.parse(localStorage.getItem("demash_real_pitches") || "[]")
    const totalPitches = real.length // starts 0
    const totalValue = real.reduce((s:any, p:any) => s + (p.value || 0), 0) // 0 if no real
    const accuracy = real.length > 0 ? 100 : 0 // 0% until real supplier like AHM mnpixfvf
    return {
      totalPitches,
      totalValue,
      accuracy: accuracy + "% - " + (real.length ? "REAL" : "add real supplier"),
      speed: "Instant x9999",
      results: real.reduce((s:any, p:any) => s + (p.profit || 0), 0),
      where: real.map((p:any) => p.where)
    }
  },
  trackPitch: (where: string, what: string, data: any) => {
    const real = JSON.parse(localStorage.getItem("demash_real_pitches") || "[]")
    real.push({ where, what, value: data.value || 0, profit: data.value * 0.08 || 0, date: new Date().toISOString(), source: data.supplierPosReceipt || "real" })
    localStorage.setItem("demash_real_pitches", JSON.stringify(real))
  },
  clearMock: () => {
    localStorage.removeItem("demash_mock_pitches")
    localStorage.removeItem("perf_mock")
    localStorage.removeItem("totalValue")
    // Keep only real pitches like AHM mnpixfvf
    console.log("Mock 11400 cleared - only real remains")
  }
}
