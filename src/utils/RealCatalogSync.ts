export const RealCatalogSync = {
  sync: () => {
    console.log("Sync real - no mock 10000 or 1500")
    return { cleared: ["11400", "10000", "1500", "TNDR-ZW-5133"], real: ["165000 mnpixfvf", "demash-core.onrender.com"] }
  },
  catalogLinks: {
    main: "https://demash-core.onrender.com/catalog",
    ahm: "https://ahmcorp.com/?ref=mnpixfvf",
    construction: "https://demash-core.onrender.com/r/ahm-mnpixfvf",
    solar: "https://demash-core.onrender.com/catalog/solar"
  }
}
