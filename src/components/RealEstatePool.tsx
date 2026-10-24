import React, { useEffect, useState } from 'react';
const AFFILIATE = '24I5893858';
export default function RealEstatePool() {
  const [props, setProps] = useState([]);
  useEffect(() => {
    fetch('/api/real-estate/pool').then(r=>r.json()).then(d=>setProps(d.properties));
  }, []);
  return (
    <div className="bg-black p-4 rounded border border-yellow-500/20">
      <h2 className="text-white font-bold">REAL ESTATE POOL - Live from Tekce (No Mock)</h2>
      <p className="text-xs text-zinc-400">Clients see on demashglobal.live → Pay to Tekce → You earn via {AFFILIATE}</p>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {props.map((p:any)=>(
          <a key={p.id} href={p.buyLink} target="_blank" className="bg-zinc-900 p-3 rounded">
            <div className="text-white text-sm">{p.title}</div>
            <div className="text-yellow-400 text-xs">${p.priceUSD} USD</div>
            <div className="text-[10px] text-zinc-500">Pay to: {p.payTo}</div>
            <div className="mt-2 bg-white text-black text-center py-1 rounded text-xs font-bold">View & Pay on Tekce →</div>
          </a>
        ))}
      </div>
      {/* REAL AFFILIATE BANNER TOO */}
      <div id="tekce-banner" className="mt-4 flex justify-center"></div>
    </div>
  );
}
