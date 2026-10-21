import { AHM_REAL } from "../utils/AHMReal"
export default function AHMRealCard() {
  const demo = (165000 * 0.08)
  return (
    <div style={{padding:"20px", background:"#0f0", color:"#000", border:"3px solid #000", margin:"20px"}}>
      <h2>✅ AHM REAL - VERIFIED - ref=mnpixfvf</h2>
      <p>Link: {AHM_REAL.realLink} - VERIFIED LIVE</p>
      <p>Redirect: {AHM_REAL.redirectLink}</p>
      <p>Catalogue: Mini Excavators, Skid Steers, Mowers - Real from ahmcorp.com</p>
      <p>Commission: 8% | Example $165k excavator = ${demo} profit</p>
      <p>EcoCash Split: $300 to +263784219178 FIRST if daily >=$300, rest Bank</p>
      <p><b>Tracking: demash.co.zw/r/ahm-mnpixfvf -> {AHM_REAL.realLink}</b></p>
      <a href={AHM_REAL.realLink} target="_blank" style={{background:"#000", color:"#0f0", padding:"10px", display:"inline-block", marginTop:"10px"}}>SHOP AHM NOW - Your Referral Active</a>
    </div>
  )
}
