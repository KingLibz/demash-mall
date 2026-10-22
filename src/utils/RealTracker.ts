export const RealTracker = {
  // NO MOCK 11400 - REAL ONLY
  totalValue: 165000, // AHM real $165k
  totalProfit: 13200, // 165000 * 8%
  pitches: 1,
  mockCleared: true,
  // OLD MOCK REMOVED:
  // mockExcavator = 10000 removed
  // mockSolar = 1500 removed
  // total 11400 removed
  sources: {
    ahm: { ref: "mnpixfvf", link: "https://ahmcorp.com/?ref=mnpixfvf", value: 165000, profit: 13200 },
    solar: { status: "Real affiliate pending - no mock 1500" }
  },
  ecoCashSplit: { first: 300, to: "+263784219178", rest: 12900 }
}

export const getRealValue = () => RealTracker.totalValue
export const getRealProfit = () => RealTracker.totalProfit
