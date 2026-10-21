import { useState } from "react";
type Drawing = { id: string; name: string; size: string; category: string; boq: any; }
export default function AdminDrawingBOQEngine() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const categorize = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("found") || n.includes("foot")) return "Foundation";
    if (n.includes("roof") || n.includes("truss")) return "Roofing";
    if (n.includes("electr")) return "Electrical";
    if (n.includes("plumb")) return "Plumbing";
    if (n.includes("finish") || n.includes("tile") || n.includes("floor")) return "Finishing";
    return "Superstructure";
  }
  const calcBOQ = (category: string) => {
    if (category === "Foundation") return { cement: "45 bags", bricks: "0", sand: "6m³", labour: "USD 850", days: 7 };
    if (category === "Superstructure") return { cement: "120 bags", bricks: "8000", sand: "12m³", labour: "USD 2400", days: 21 };
    if (category === "Roofing") return { cement: "10 bags", bricks: "IBR 120m²", sand: "2m³", labour: "USD 1100", days: 5 };
    if (category === "Electrical") return { cement: "2 bags", bricks: "Cables 300m", sand: "Conduits", labour: "USD 650", days: 4 };
    if (category === "Plumbing") return { cement: "5 bags", bricks: "Pipes 80m", sand: "Fittings", labour: "USD 720", days: 5 };
    return { cement: "80 bags", bricks: "Tiles 150m²", sand: "Adhesive", labour: "USD 1500", days: 10 };
  }
  const handleFiles = (e: any) => {
    const files = Array.from(e.target.files).slice(0, 10) as File[];
    const newD = files.map((f: File) => {
      const cat = categorize(f.name);
      return { id: Math.random().toString(36).substring(2), name: f.name, size: (f.size/1024/1024).toFixed(2)+" MB", category: cat, boq: calcBOQ(cat) }
    });
    setDrawings([...drawings, ...newD].slice(0, 10));
  }
  return (
    <div className="p-6 bg-slate-950 text-white rounded-2xl border border-emerald-500/20">
      <h2 className="text-2xl font-bold text-emerald-400">DEMASH Drawing → BOQ Engine (Admin)</h2>
      <p className="text-slate-400 text-sm mb-4">Upload up to 10 drawings. System auto-calculates.</p>
      <div className="border-2 border-dashed border-emerald-500/30 p-8 rounded-xl text-center mb-6">
        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.dwg" onChange={handleFiles} className="hidden" id="drawUpload" />
        <label htmlFor="drawUpload" className="cursor-pointer bg-emerald-600 px-6 py-3 rounded-full font-bold">+ Upload Drawings (Max 10)</label>
        <p className="text-xs text-slate-500 mt-3">{drawings.length}/10 uploaded</p>
      </div>
      {drawings.map(d => (
        <div key={d.id} className="bg-slate-900 p-4 rounded-xl mb-3 border border-slate-800">
          <div className="flex justify-between"><span className="font-bold">{d.name}</span><span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs">{d.category}</span></div>
          <div className="grid grid-cols-5 gap-2 mt-3 text-xs">
            <div>Cement: <b className="text-white">{d.boq.cement}</b></div>
            <div>Mat: <b className="text-white">{d.boq.bricks}</b></div>
            <div>Sand: <b className="text-white">{d.boq.sand}</b></div>
            <div>Labour: <b className="text-emerald-400">{d.boq.labour}</b></div>
            <div>Days: <b className="text-white">{d.boq.days}</b></div>
          </div>
        </div>
      ))}
      {drawings.length > 0 && (
        <div className="mt-6 bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/30">
          <h3 className="font-bold">TOTAL ESTIMATE</h3>
          <p className="text-sm">Drawings: {drawings.length} | Total Labour: USD {drawings.reduce((a,b) => a + parseInt(b.boq.labour.replace(/\D/g,'')), 0)} | Total Days: {drawings.reduce((a,b) => a + b.boq.days, 0)} days</p>
          <button className="mt-3 w-full bg-white text-black py-2 rounded-full font-bold">Generate Full BOQ PDF + Quote</button>
        </div>
      )}
    </div>
  )
}
