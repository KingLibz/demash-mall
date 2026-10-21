import { RealTracker } from "../utils/RealTracker"
import { useEffect, useState } from "react"
export default function PerformanceDashboard() {
  const [perf, setPerf] = useState<any>(null)
  useEffect(() => {
    setPerf(RealTracker.getPerformance())
    const i = setInterval(() => setPerf(RealTracker.getPerformance()), 2000)
    return () => clearInterval(i)
  }, [])
  if (!perf) return <div>Loading...</div>
  return (
    <div style={{padding:"20px", background:"#111", color:"#fff", border:"2px solid #0f0", margin:"20px"}}>
      <h2>REAL TRACKING - Where Pitching (No Mock)</h2>
      <div>Pitches: {perf.totalPitches} | Value: ${perf.totalValue} | Accuracy: {perf.accuracy}</div>
      <div>Speed: {perf.speed} | Profit: ${perf.results} | EcoCash $300 first to +263784219178 if >=$300</div>
      <div>Where: {perf.where.length ? perf.where.join(", ") : "No real pitches yet"}</div>
    </div>
  )
}
