import React, { useState, useMemo } from 'react';
import { EstimateOptions, EstimateResult } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { openWhatsAppLink } from '../utils/navigation';
import { 
  Calculator, 
  Check, 
  Send, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Waves, 
  Sun, 
  Droplets, 
  Fence, 
  FileSpreadsheet, 
  Info 
} from 'lucide-react';

export const CostEstimator: React.FC = () => {
  const [options, setOptions] = useState<EstimateOptions>({
    city: 'Harare (Borrowdale / Glen Lorne / Highlands)',
    buildingType: 'Double Storey Luxury Residence',
    squareMeters: 380,
    finishTier: 'executive',
    hasPool: true,
    hasBoreholeSolar: true,
    hasSolarSystem: true,
    hasBoundaryWall: true,
    hasPaving: true
  });

  const tierRates = {
    standard: 650,
    executive: 950,
    luxury: 1400
  };

  const calculation = useMemo<EstimateResult>(() => {
    const rate = tierRates[options.finishTier];
    const baseCost = options.squareMeters * rate;

    let addonsCost = 0;
    if (options.hasPool) addonsCost += 16500;
    if (options.hasBoreholeSolar) addonsCost += 4500;
    if (options.hasSolarSystem) addonsCost += 7500;
    if (options.hasBoundaryWall) addonsCost += 5800;
    if (options.hasPaving) addonsCost += 3800;

    const totalCost = baseCost + addonsCost;

    const breakdown = [
      { category: 'Excavation, Foundation & Raft Slab', percentage: 22, amount: Math.round(baseCost * 0.22) },
      { category: 'Superstructure Masonry & Lintels', percentage: 20, amount: Math.round(baseCost * 0.20) },
      { category: 'Engineered Trusses & Chromadek Roof', percentage: 16, amount: Math.round(baseCost * 0.16) },
      { category: 'Plumbing, Drainage & Electrical', percentage: 12, amount: Math.round(baseCost * 0.12) },
      { category: 'Plaster, Ceilings & Skim Finishes', percentage: 10, amount: Math.round(baseCost * 0.10) },
      { category: 'Architectural Glazing & Doors', percentage: 10, amount: Math.round(baseCost * 0.10) },
      { category: 'Porcelain Tiling & Cabinetry', percentage: 10, amount: Math.round(baseCost * 0.10) }
    ];

    const milestones = [
      {
        phase: 'Phase 1: Mobilization, Foundation & Superstructure',
        percentage: 50,
        amount: Math.round(totalCost * 0.50),
        trigger: 'Excavation to wall plate level, certified slab inspection'
      },
      {
        phase: 'Phase 2: Roof Trusses, Sheeting & Wet Trades',
        percentage: 30,
        amount: Math.round(totalCost * 0.30),
        trigger: 'Chromadek roof sealed, internal plastering & rough-in certified'
      },
      {
        phase: 'Phase 3: Turnkey Finishes & Final Snagging',
        percentage: 20,
        amount: Math.round(totalCost * 0.20),
        trigger: 'Full porcelain tiling, glazing, sanitaryware & key handover'
      }
    ];

    return {
      baseCost,
      addonsCost,
      totalCost,
      currency: 'USD',
      ratePerSqm: rate,
      breakdown,
      milestones
    };
  }, [options]);

  const handleSendToWhatsApp = () => {
    const text = 
`*DEMASH CONSTRUCTION COST ESTIMATE*
*Location:* ${options.city}
*Project Type:* ${options.buildingType}
*Area:* ${options.squareMeters} m²
*Finish Tier:* ${options.finishTier.toUpperCase()} ($${calculation.ratePerSqm}/m²)
*Add-ons:*
- Infinity Pool: ${options.hasPool ? 'YES ($16,500)' : 'NO'}
- Solar Borehole: ${options.hasBoreholeSolar ? 'YES ($4,500)' : 'NO'}
- 10kVA Solar Backup: ${options.hasSolarSystem ? 'YES ($7,500)' : 'NO'}
- Boundary Wall: ${options.hasBoundaryWall ? 'YES ($5,800)' : 'NO'}
- Interlocking Paving: ${options.hasPaving ? 'YES ($3,800)' : 'NO'}

*ESTIMATED TOTAL:* $${calculation.totalCost.toLocaleString()} USD
*50/30/20 Escrow Schedule:*
1. Phase 1 (50%): $${calculation.milestones[0].amount.toLocaleString()}
2. Phase 2 (30%): $${calculation.milestones[1].amount.toLocaleString()}
3. Phase 3 (20%): $${calculation.milestones[2].amount.toLocaleString()}

Director Liberman, please review this estimate and advise on a formal site inspection.`;

    openWhatsAppLink('263784219178', text);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
      
      {/* Title & Introduction */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono">
          <Calculator className="w-3.5 h-3.5" />
          <span>REAL-TIME ZIMBABWE BUILDING COST ENGINE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
          Instant Project Cost & BOQ Estimator
        </h2>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          Calibrated to current 2026 material prices, cement indices, structural steel, and certified artisan rates across Harare and Zimbabwe. All calculations mirror Demash’s transparent 50/30/20 milestone escrow structure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Configurator Controls */}
        <div className="lg:col-span-7 space-y-6 bg-slate-900/60 border border-slate-800 p-5 sm:p-6 rounded-2xl">
          
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Project Parameters</span>
            </h3>

            {/* City / Province */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Site Location in Zimbabwe</label>
              <select
                value={options.city}
                onChange={(e) => setOptions({ ...options, city: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Harare (Borrowdale / Glen Lorne / Highlands)">Harare North (Borrowdale, Glen Lorne, Highlands, Shawasha)</option>
                <option value="Harare (Mt Pleasant / Avondale / Westgate)">Harare Central / West (Mt Pleasant, Avondale, Westgate)</option>
                <option value="Bulawayo (Suburbs / Burnside / Hillside)">Bulawayo Metropolitan</option>
                <option value="Mutare / Manicaland">Mutare / Manicaland</option>
                <option value="Gweru / Midlands">Gweru / Midlands</option>
                <option value="Victoria Falls / Resort Region">Victoria Falls / Resort Region</option>
              </select>
            </div>

            {/* Building Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Building Typology</label>
              <select
                value={options.buildingType}
                onChange={(e) => setOptions({ ...options, buildingType: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Single Storey Contemporary Villa">Single Storey Contemporary Villa</option>
                <option value="Double Storey Luxury Residence">Double Storey Luxury Residence</option>
                <option value="Executive Cluster Housing Unit">Executive Cluster Housing Unit</option>
                <option value="Commercial Steel Warehouse & Offices">Commercial Steel Warehouse & Offices</option>
              </select>
            </div>

            {/* Square Meterage Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">Total Built Area (m²)</span>
                <span className="text-amber-400 font-mono font-bold text-sm bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                  {options.squareMeters} m²
                </span>
              </div>
              <input
                type="range"
                min={80}
                max={900}
                step={10}
                value={options.squareMeters}
                onChange={(e) => setOptions({ ...options, squareMeters: Number(e.target.value) })}
                className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>80 m² (Compact)</span>
                <span>350 m² (Executive)</span>
                <span>900 m² (Palatial)</span>
              </div>
            </div>

            {/* Finish Tier Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-slate-300">Architectural Finish Tier</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'standard',
                    label: 'Standard Spec',
                    rate: '$650/m²',
                    desc: 'Quality double-brick, chromadek roof, durable ceramic tiles'
                  },
                  {
                    id: 'executive',
                    label: 'Executive Spec',
                    rate: '$950/m²',
                    desc: 'Porcelain tiling, architectural glazing, designer cabinetry, bulkheads'
                  },
                  {
                    id: 'luxury',
                    label: 'Ultra-Luxury',
                    rate: '$1,400/m²',
                    desc: 'Cantilevered structural engineering, imported marble, double glazing'
                  }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setOptions({ ...options, finishTier: tier.id as any })}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      options.finishTier === tier.id
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-white flex items-center justify-between">
                      <span>{tier.label}</span>
                      {options.finishTier === tier.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="text-amber-400 font-mono text-xs font-semibold mt-1">{tier.rate}</div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-on toggles */}
            <div className="space-y-2.5 pt-3 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Infrastructure & Turnkey Add-ons
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                
                {/* Pool */}
                <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.hasPool}
                    onChange={(e) => setOptions({ ...options, hasPool: e.target.checked })}
                    className="accent-amber-400 w-4 h-4 rounded"
                  />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                      <Waves className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Custom Infinity Pool</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">+$16,500 (Gunite + filtration)</div>
                  </div>
                </label>

                {/* Borehole */}
                <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.hasBoreholeSolar}
                    onChange={(e) => setOptions({ ...options, hasBoreholeSolar: e.target.checked })}
                    className="accent-amber-400 w-4 h-4 rounded"
                  />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      <span>Solar Borehole & 5000L</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">+$4,500 (Siting + casing + pump)</div>
                  </div>
                </label>

                {/* Solar Backup */}
                <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.hasSolarSystem}
                    onChange={(e) => setOptions({ ...options, hasSolarSystem: e.target.checked })}
                    className="accent-amber-400 w-4 h-4 rounded"
                  />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>10kVA Lithium Solar Backup</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">+$7,500 (Zero ZESA downtime)</div>
                  </div>
                </label>

                {/* Boundary Wall */}
                <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.hasBoundaryWall}
                    onChange={(e) => setOptions({ ...options, hasBoundaryWall: e.target.checked })}
                    className="accent-amber-400 w-4 h-4 rounded"
                  />
                  <div className="flex-1">
                    <div className="text-slate-200 font-semibold flex items-center gap-1.5">
                      <Fence className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Boundary Wall & Electric</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">+$5,800 (2.4m brick + razor wire)</div>
                  </div>
                </label>

              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Live Estimate Summary & 50/30/20 Escrow Schedule */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Price Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0c1220] border border-amber-500/40 shadow-xl space-y-5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 uppercase tracking-wider font-semibold">Total Turnkey Estimate</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-[11px]">
                Fixed Milestone Terms
              </span>
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
                ${calculation.totalCost.toLocaleString()}
                <span className="text-sm font-normal text-slate-400 ml-2">USD</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span>Structure: ${calculation.baseCost.toLocaleString()}</span>
                <span>·</span>
                <span>Add-ons: ${calculation.addonsCost.toLocaleString()}</span>
              </div>
            </div>

            {/* 50/30/20 Escrow Handover Accordion */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Standard 50/30/20 Milestone Escrow Schedule</span>
              </div>

              <div className="space-y-2">
                {calculation.milestones.map((m, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{m.phase}</span>
                      <span className="font-mono font-bold text-amber-400">
                        ${m.amount.toLocaleString()} ({m.percentage}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Release Trigger: {m.trigger}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action button */}
            <button
              onClick={handleSendToWhatsApp}
              className="w-full py-3.5 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Estimate Directly to Director Liberman on WhatsApp</span>
            </button>
            <div className="text-center text-[11px] text-slate-500">
              Opens WhatsApp with complete formatted BOQ summary
            </div>

          </div>

          {/* Quick BOQ Itemized Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>Base Structure BOQ Breakdown</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">100% Itemized</span>
            </div>

            <div className="space-y-2 text-xs">
              {calculation.breakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-800/60 last:border-0">
                  <span className="truncate pr-2">{item.category}</span>
                  <span className="font-mono font-medium text-slate-200 shrink-0">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg text-[11px] text-slate-400 flex items-start gap-2 border border-slate-800">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Zero hidden costs. Includes municipal council submission, engineer stamp, site fencing, water bowser mobilization, and artisan insurance.
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
