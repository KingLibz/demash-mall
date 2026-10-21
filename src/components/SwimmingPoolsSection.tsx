import React, { useState, useMemo } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { openWhatsAppLink } from '../utils/navigation';
import { 
  Waves, 
  Sparkles, 
  Check, 
  Send, 
  ShieldCheck, 
  Sun, 
  Droplet, 
  Flame, 
  Maximize2,
  CheckCircle2
} from 'lucide-react';

export const SwimmingPoolsSection: React.FC = () => {
  const [poolSize, setPoolSize] = useState<'compact' | 'medium' | 'large' | 'resort'>('medium');
  const [poolType, setPoolType] = useState<'gunite-infinity' | 'geometric-lap' | 'sunken-boma'>('gunite-infinity');
  const [hasSolarHeat, setHasSolarHeat] = useState(true);
  const [hasGlassMosaics, setHasGlassMosaics] = useState(true);
  const [hasWaterfalls, setHasWaterfalls] = useState(true);
  const [hasSaltChlorinator, setHasSaltChlorinator] = useState(true);

  const poolSpecs = {
    compact: { name: 'Cocktail / Splash Pool (6m x 3m)', baseCost: 11500, volume: '25,000 Litres', time: '4 Weeks' },
    medium: { name: 'Executive Family Pool (8m x 4m)', baseCost: 14800, volume: '45,000 Litres', time: '5 Weeks' },
    large: { name: 'Luxury Infinity Lap Pool (10m x 4.5m)', baseCost: 18500, volume: '65,000 Litres', time: '6 Weeks' },
    resort: { name: 'Architectural Estate Rim-Flow (14m x 5m)', baseCost: 26000, volume: '95,000 Litres', time: '8 Weeks' }
  };

  const calculatedTotal = useMemo(() => {
    let total = poolSpecs[poolSize].baseCost;
    if (poolType === 'gunite-infinity') total += 3500; // Infinity edge engineering
    if (poolType === 'sunken-boma') total += 4200; // Sunken fire lounge inside pool
    if (hasSolarHeat) total += 2200;
    if (hasGlassMosaics) total += 2800;
    if (hasWaterfalls) total += 1500;
    if (hasSaltChlorinator) total += 1200;
    return total;
  }, [poolSize, poolType, hasSolarHeat, hasGlassMosaics, hasWaterfalls, hasSaltChlorinator]);

  const handleWhatsAppQuote = () => {
    const text = 
`*DEMASH SWIMMING POOL QUOTE REQUEST*
*Model:* ${poolSpecs[poolSize].name}
*Typology:* ${poolType.replace('-', ' ').toUpperCase()}
*Add-ons:*
- Solar Heating Manifolds: ${hasSolarHeat ? 'YES ($2,200)' : 'NO'}
- Glass Mosaic Accents: ${hasGlassMosaics ? 'YES ($2,800)' : 'NO'}
- Shear Descent Cascading Waterfall: ${hasWaterfalls ? 'YES ($1,500)' : 'NO'}
- Automated Salt Chlorinator: ${hasSaltChlorinator ? 'YES ($1,200)' : 'NO'}

*TOTAL ESTIMATE:* $${calculatedTotal.toLocaleString()} USD
Director Liberman, I'd like to book an on-site pool engineering survey in Harare.`;

    openWhatsAppLink('263784219178', text);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
      
      {/* Title & Banner */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono">
          <Waves className="w-3.5 h-3.5" />
          <span>GUNITE & INFINITY POOL SPECIALIST DIVISION</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
          Luxury Gunite & Infinity Swimming Pools
        </h2>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          Engineered for Zimbabwe’s climate. Double-caged steel reinforced gunite concrete, flawless rim-flow horizon drops, solar thermal heating, and natural saltwater purification systems.
        </p>
      </div>

      {/* Hero Showcase Card */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
          <img 
            src="/src/assets/images/demash_swimming_pool_1791654558199.jpg" 
            alt="Demash Luxury Infinity Swimming Pool Harare" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

        <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider">
              Featured Build · Highlands Rim-Flow Villa
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              14-Meter Rim-Flow Infinity Pool with Ambient Mood Illumination
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Double steel reinforcement, non-slip honed travertine coping, automatic chemical feeder, and solar heating manifolds for 365-day swimming.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleWhatsAppQuote}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg cursor-pointer whitespace-nowrap"
            >
              <span>Get Pool Estimate</span>
              <Waves className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Engineering Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Reinforced Gunite Concrete Shell</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Constructed with high-tensile double steel mesh and pneumatically shot concrete tested to 30MPa. Complete with a 10-year structural shell guarantee against soil movement.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sun className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Solar Thermal & Inverter Heating</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Harare enjoys over 300 days of sunshine. Our integrated rooftop solar collector panels raise pool water temperature by 6°C to 10°C with zero electrical utility bill cost.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Droplet className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Eco Saltwater & Glass Media Filters</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Say goodbye to red eyes and harsh chlorine smell. Automated salt electrolytic chlorinators and activated recycled glass media keep the water silky, crystal-clear and safe.
          </p>
        </div>
      </div>

      {/* Interactive Custom Pool Configurator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-cyan-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Waves className="w-5 h-5 text-cyan-400" />
              <span>Interactive Custom Pool Configurator</span>
            </h3>
            <p className="text-xs text-slate-400">Configure size, finish and hydro-features for instant Zimbabwe pricing</p>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">Turnkey Installed Estimate</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
              ${calculatedTotal.toLocaleString()} <span className="text-xs text-slate-400 font-normal">USD</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Pool Size */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Select Dimensions & Water Volume</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(Object.keys(poolSpecs) as Array<keyof typeof poolSpecs>).map((key) => {
                  const item = poolSpecs[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setPoolSize(key)}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        poolSize === key
                          ? 'bg-cyan-950/40 border-cyan-400 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-white flex items-center justify-between">
                        <span>{item.name}</span>
                        {poolSize === key && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                        <span>{item.volume}</span>
                        <span>·</span>
                        <span className="text-amber-400 font-mono">Base: ${item.baseCost.toLocaleString()}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typology */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Design Typology</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'gunite-infinity', label: 'Infinity Rim-Flow Edge', extra: '+$3,500' },
                  { id: 'geometric-lap', label: 'Clean Geometric Lap', extra: 'Standard' },
                  { id: 'sunken-boma', label: 'Integrated Sunken Fire Boma', extra: '+$4,200' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setPoolType(t.id as any)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      poolType === t.id
                        ? 'bg-cyan-950/40 border-cyan-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-xs text-white">{t.label}</div>
                    <div className="text-cyan-400 text-[11px] mt-0.5 font-mono">{t.extra}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upgrades */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-medium text-slate-300">Equipment & Finish Upgrades</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                
                <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSolarHeat}
                    onChange={(e) => setHasSolarHeat(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4 rounded"
                  />
                  <div>
                    <div className="font-semibold text-slate-200">Solar Thermal Heating Panels</div>
                    <div className="text-slate-500 text-[11px]">+$2,200 (Extend swim season)</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasGlassMosaics}
                    onChange={(e) => setHasGlassMosaics(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4 rounded"
                  />
                  <div>
                    <div className="font-semibold text-slate-200">Crystal Glass Mosaic Inlays</div>
                    <div className="text-slate-500 text-[11px]">+$2,800 (Iridescent waterline)</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasWaterfalls}
                    onChange={(e) => setHasWaterfalls(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4 rounded"
                  />
                  <div>
                    <div className="font-semibold text-slate-200">Shear Descent LED Waterfalls</div>
                    <div className="text-slate-500 text-[11px]">+$1,500 (Cascading acoustic water)</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSaltChlorinator}
                    onChange={(e) => setHasSaltChlorinator(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4 rounded"
                  />
                  <div>
                    <div className="font-semibold text-slate-200">Automated Saltwater Chlorinator</div>
                    <div className="text-slate-500 text-[11px]">+$1,200 (Soft gentle water)</div>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Right Summary */}
          <div className="lg:col-span-4 space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Turnkey Inclusions
            </h4>

            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Heavy machine site excavation & earth carting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Double-cage Y10/Y12 steel rebar cage</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>30MPa gunite structural concrete shell</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Quality pump, sand/glass filter & electrical box</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Honed non-slip natural stone coping perimeter</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>10-Year structural guarantee certificate</span>
              </li>
            </ul>

            <button
              onClick={handleWhatsAppQuote}
              className="w-full py-3 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400 hover:from-cyan-300 hover:to-cyan-400 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer pt-3"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp Director Liberman For Pool Survey</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
