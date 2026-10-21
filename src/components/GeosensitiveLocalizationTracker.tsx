import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  RefreshCw, 
  CheckCircle2, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  DollarSign,
  Layers
} from 'lucide-react';

interface RegionalMatrix {
  country_code: string;
  country_name: string;
  native_language: string;
  currency_code: string;
  currency_symbol: string;
  haulage_rate_usd_km: number;
  base_material_multiplier: number;
  system_route_strategy: string;
  exchange_rate_to_usd: number;
  cultural_negotiation_profile: string;
}

interface TelemetryMetrics {
  state: string;
  heapUsage: string;
  tokensAvailable: number;
  maxTokens: number;
  circuitProfile: string;
  uptimeSeconds: number;
  healthy: boolean;
}

export const GeosensitiveLocalizationTracker: React.FC = () => {
  const [matrices, setMatrices] = useState<RegionalMatrix[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryMetrics>({
    state: "CLOSED",
    heapUsage: "48.2MB / 64.0MB",
    tokensAvailable: 980,
    maxTokens: 1000,
    circuitProfile: "ANTI-CRASH ACTIVE",
    uptimeSeconds: 1420,
    healthy: true
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    const timer = setInterval(() => {
      fetchTelemetry();
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resRates, resTelem] = await Promise.all([
        fetch('/api/v1/forex/rates'),
        fetch('/api/v1/system/telemetry')
      ]);
      const dataRates = await resRates.json();
      const dataTelem = await resTelem.json();

      if (dataRates.success && dataRates.matrices) {
        setMatrices(dataRates.matrices);
      }
      if (dataTelem.success && dataTelem.breakerMetrics) {
        setTelemetry(dataTelem.breakerMetrics);
      }
    } catch (err: any) {
      console.error('Error fetching localization data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/v1/system/telemetry');
      const data = await res.json();
      if (data.success && data.breakerMetrics) {
        setTelemetry(data.breakerMetrics);
      }
    } catch (e) {}
  };

  const handleSyncForex = async () => {
    setSyncing(true);
    setNotice('Dispatched automated global currency synchronization exchange check loop...');
    try {
      const res = await fetch('/api/v1/forex/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setNotice('🏁 Dynamic currency exchange grids refreshed successfully across all regions.');
        if (data.matrices) setMatrices(data.matrices);
      }
    } catch (err: any) {
      setNotice(`Sync error: ${err.message}`);
    } finally {
      setSyncing(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-xs font-mono text-slate-500">
        MAPPING GLOBAL GEOSENSITIVE METRIC FIELDS...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. AUTOMATED THERMAL STABILIZER & CIRCUIT BREAKER CARD */}
      <div className="bg-[#080e1b] border border-[#16253b] rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#16253b] pb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>AUTOMATED THERMAL STABILIZER & COOLER INTERCEPTOR</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Real-Time Core Load Balancing, Rate-Limiting, and Circuit Breaker Telemetry
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider border ${
              telemetry.state === "CLOSED" 
                ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400" 
                : "bg-amber-950/30 border-amber-500/30 text-amber-400"
            }`}>
              ● ENGINE LOCK: {telemetry.state}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-[#050a12] border border-[#17263c] p-4 rounded-xl">
            <span className="text-slate-500 block mb-1 text-[11px]">SERVER HEAP TEMPERATURE</span>
            <span className="text-xl font-bold text-white tracking-tight">{telemetry.heapUsage} RAM Load</span>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Zero Memory Leak Barrier</span>
            </div>
          </div>

          <div className="bg-[#050a12] border border-[#17263c] p-4 rounded-xl">
            <span className="text-slate-500 block mb-1 text-[11px]">TOKEN BUCKET CAPACITY</span>
            <span className="text-xl font-bold text-cyan-400 tracking-tight">
              {telemetry.tokensAvailable} / {telemetry.maxTokens} Rps
            </span>
            <div className="text-[10px] text-slate-400 mt-1">
              Dynamic 50ms Burst Window
            </div>
          </div>

          <div className="bg-[#050a12] border border-[#17263c] p-4 rounded-xl">
            <span className="text-slate-500 block mb-1 text-[11px]">PROTECTION CIRCUIT PROFILE</span>
            <span className="text-xl font-bold text-emerald-400 tracking-tight">{telemetry.circuitProfile}</span>
            <div className="text-[10px] text-slate-400 mt-1">
              Active Uptime: {Math.floor(telemetry.uptimeSeconds / 60)}m {telemetry.uptimeSeconds % 60}s
            </div>
          </div>
        </div>
      </div>

      {/* 2. GEOSENSITIVE SYSTEM LOCALIZATION MATRIX TABLE */}
      <div className="bg-[#080e1b] border border-[#16253b] rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="border-b border-[#16253b] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              <span>GEOSENSITIVE SYSTEM LOCALIZATION MATRIX</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Real-Time Regional Sourcing Rates, Native Languages, and Cultural Fluency Telemetry
            </p>
          </div>

          <button
            onClick={handleSyncForex}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400 cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing Forex...' : 'Sync Forex Rates'}</span>
          </button>
        </div>

        {notice && (
          <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 font-mono">
            {notice}
          </div>
        )}

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left font-mono text-xs text-slate-400">
            <thead>
              <tr className="border-b border-[#16253b] text-slate-500 text-[10px] uppercase tracking-wider">
                <th className="pb-3 pl-2">Country Node</th>
                <th className="pb-3">Native Fluency</th>
                <th className="pb-3 text-right">Haulage Cost</th>
                <th className="pb-3 text-right">Material Multiplier</th>
                <th className="pb-3 text-right">Forex Rate / USD</th>
                <th className="pb-3 text-right pr-2">System Route Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {matrices.map((matrix) => (
                <tr key={matrix.country_code} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 pl-2 font-sans font-bold text-slate-200">
                    <div>{matrix.country_name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{matrix.cultural_negotiation_profile}</div>
                  </td>
                  <td className="py-3.5 text-cyan-400 font-bold">{matrix.native_language}</td>
                  <td className="py-3.5 text-right text-white">
                    ${matrix.haulage_rate_usd_km.toFixed(2)}/km
                  </td>
                  <td className="py-3.5 text-right text-slate-300">
                    {matrix.base_material_multiplier.toFixed(2)}x
                  </td>
                  <td className="py-3.5 text-right text-amber-400 font-bold">
                    {matrix.currency_symbol} {matrix.exchange_rate_to_usd.toFixed(4)} {matrix.currency_code}
                  </td>
                  <td className="py-3.5 text-right pr-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide border ${
                      matrix.system_route_strategy === 'FULFILLMENT_DIRECT' 
                        ? 'bg-amber-950/30 border-amber-500/30 text-amber-400' 
                        : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-400'
                    }`}>
                      {matrix.system_route_strategy.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
