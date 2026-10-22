export const RealCatalogSync = {
  sync: () => {
    console.log("Sync real - no mock 10000 or 1500")
    return { cleared: ["11400", "10000", "1500", "TNDR-ZW-5133"], real: ["165000 mnpixfvf", "demashglobal.live"] }
  },
  catalogLinks: {
    main: "https://demashglobal.live/catalog",
    ahm: "https://ahmcorp.com/?ref=mnpixfvf",
    construction: "https://demash.co.zw/r/ahm-mnpixfvf",
    solar: "https://demashglobal.live/catalog/solar"
  }
}
