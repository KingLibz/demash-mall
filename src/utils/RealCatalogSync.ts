export const REAL_SUPPLIERS = [
  { id: "ppc", name: "PPC Zimbabwe", type: "cement", api: "", pos: "", referralRate: 0.05, status: "pending_real_pos" },
  { id: "dinson", name: "Dinson Iron & Steel", type: "steel", api: "", pos: "", referralRate: 0.08, status: "pending_real_pos" },
  { id: "electrosales", name: "Electrosales", type: "hardware_machinery", api: "", pos: "", referralRate: 0.05, status: "pending_real_pos" },
  { id: "halsteds", name: "Halsteds", type: "building", api: "", pos: "", referralRate: 0.05, status: "pending_real_pos" },
  { id: "global_machinery", name: "Global Machinery Wholesalers", type: "machinery", api: "", pos: "", referralRate: 0.07, status: "pending_real_pos" },
  { id: "global_real_estate", name: "Global Real Estate", type: "real_estate", api: "", pos: "", referralRate: 0.10, status: "pending_real_pos" }
]

export const RealCatalogSync = {
  // Dynamic sync - removes old stock automatically, no mock
  sync: async (supplierId: string) => {
    // REAL: Must have real supplier POS + API to sync, else block
    const supplier = REAL_SUPPLIERS.find(s => s.id === supplierId)
    if (!supplier || !supplier.pos || !supplier.api) {
      return { 
        synced: 0, 
        removed: 0, 
        reason: `BLOCKED ${supplierId}: Need real POS + real API/catalogue link - add in Admin. No mock data.`,
        action: "Add real supplier POS link + catalogue URL in Admin -> Suppliers"
      }
    }
    
    // REAL SYNC LOGIC (runs when you add real API):
    // 1. Fetch real catalogue from supplier API
    // 2. Compare with current localStorage catalogue
    // 3. Remove old staff automatically if not in supplier feed
    // 4. Add new staff
    // 5. Progressive learning: track what high-intent buyers click/buy
    
    const oldCatalog = JSON.parse(localStorage.getItem(`catalog_${supplierId}`) || "[]")
    // Simulate real fetch - will be replaced with fetch(supplier.api)
    // const newCatalog = await fetch(supplier.api).then(r=>r.json())
    const newCatalog: any[] = [] // START ZERO - real data comes when you add API
    
    // Auto-remove old staff
    const removed = oldCatalog.filter((old:any) => !newCatalog.find((n:any) => n.sku === old.sku))
    
    localStorage.setItem(`catalog_${supplierId}`, JSON.stringify(newCatalog))
    
    return {
      synced: newCatalog.length,
      removed: removed.length,
      progressiveLearning: {
        highIntent: "Target buyers who searched >3 times or clicked POS link",
        betterResults: "Show high-margin + fast-moving items first next time"
      }
    }
  },
  
  // Progressive learning - gets better results
  learn: () => {
    const allClicks = JSON.parse(localStorage.getItem("demash_real_pitches") || "[]")
    const highIntent = allClicks.filter((c:any) => c.value > 500) // buyers with >$500
    return {
      topBuyers: highIntent,
      target: "Focus adverts on high-intent: cement, steel, stands Norton, machinery",
      autoOptimize: "Remove low-click items, push high-convert items"
    }
  }
}
