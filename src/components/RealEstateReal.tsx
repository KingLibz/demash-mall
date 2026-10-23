import React, { useEffect } from 'react';
export const RealEstateReal = () => {
  useEffect(() => {
    const existing = document.querySelector('script[data-affiliate="24I5893858"]');
    if (existing) return;
    const script = document.createElement('script');
    script.src = 'https://static.tekce.com/cache/affiliate.min.js?s=300x250-1-en&code=24I5893858';
    script.setAttribute('data-affiliate', '24I5893858');
    script.async = true;
    document.getElementById('tekce-real-estate')?.appendChild(script);
  }, []);
  return (
    <div className="w-full bg-black p-4 rounded-xl border border-yellow-500/20">
      <h2 className="text-white font-bold text-lg mb-2">REAL ESTATE - LIVE (Tekce 24I5893858)</h2>
      <p className="text-zinc-400 text-xs mb-4">No mock. Real external affiliate. Code: 24I5893858</p>
      <div id="tekce-real-estate" className="w-full flex justify-center min-h-[250px] bg-zinc-900 rounded"></div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <a href="https://tekce.com/?utm_source=taff&utm_medium=24I5893858" target="_blank" className="bg-white text-black p-3 rounded text-center font-bold">View Real Properties → Tekce</a>
        <a href="https://tekce.com/property?search=Turkey&utm_source=taff&utm_medium=24I5893858" target="_blank" className="bg-zinc-800 text-white p-3 rounded text-center">Turkey</a>
        <a href="https://tekce.com/property?search=Spain&utm_source=taff&utm_medium=24I5893858" target="_blank" className="bg-zinc-800 text-white p-3 rounded text-center">Spain</a>
      </div>
    </div>
  );
};
export default RealEstateReal;
