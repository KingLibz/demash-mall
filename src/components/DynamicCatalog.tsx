import { REAL_SUPPLIERS, RealCatalogSync } from "../utils/RealCatalogSync"
import { useEffect, useState } from "react"

export default function DynamicCatalog() {
  const [status, setStatus] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const results = []
      for (const s of REAL_SUPPLIERS) {
        const r = await RealCatalogSync.sync(s.id)
        results.push({ supplier: s.name, ...r })
      }
      setStatus(results)
    }
    load()
  }, [])

  return (
    <div style={{padding:"20px", background:"#000", color:"#fff", border:"1px solid #333"}}>
      <h2>🌍 GLOBAL REAL CATALOGUE SYNC - No Mock</h2>
      <p>Auto-sync PPC, Dinson, Electrosales, Halsteds, Global Wholesales + Real Estate | Auto-remove old staff | Progressive Learning</p>
      {status.map((s:any, i:number) => (
        <div key={i} style={{margin:"10px 0", padding:"10px", background:"#111"}}>
          <b>{s.supplier}</b>: Synced {s.synced} | Removed old {s.removed} | {s.reason || "Waiting for real POS/API - Add in Admin"}
        </div>
      ))}
      <div style={{marginTop:"15px", color:"#0f0"}}>
        Target: High-intent buyers | Learning: {JSON.stringify(RealCatalogSync.learn().target)}
      </div>
      <div style={{marginTop:"10px", fontSize:"12px", color:"#aaa"}}>
        EcoCash Split: $300 to +263784219178 FIRST if daily profit >=$300, rest to Bank. Real POS referral only.
      </div>
    </div>
  )
}
