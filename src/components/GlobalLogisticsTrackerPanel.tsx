import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Ship, 
  Plane, 
  RefreshCw, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  Layers, 
  ExternalLink,
  Navigation,
  Globe2
} from 'lucide-react';
import { openWhatsAppLink } from '../utils/navigation';

interface LogisticsRoute {
  sku: string;
  name: string;
  baseCostUSD: number;
  slug: string;
}

interface LogisticsEntry {
  id: string;
  sku: string;
  route: string;
  cargoType: string;
  valuationUSD: number;
  brokerCutUSD: number;
  routingStrategy: string;
  status: string;
  timestamp: string;
}

export default function GlobalLogisticsTrackerPanel() {
  const [telemetry, setTelemetry] = useState({
    activeContainers: 0,
    aggregateBrokerageUSD: 0.00,
    tuningCoefficient: "1.08x (Fuel Adjustment Factor)",
    status: "UNTHROTTLED",
    fleetStatus: "ACTIVE"
  });

  const [catalog, setCatalog] = useState<LogisticsRoute[]>([
    { sku: "LOG-SEA-40HC", name: "40ft High-Cube Shipping Container Freight Slot (Durban Port to Harare Hub)", baseCostUSD: 4200.00, slug: "ocean-freight/durban-harare" },
    { sku: "LOG-BEIRA-RAIL", name: "Intermodal Containerized Freight Slot (Beira Port Mozambique to Harare Msasa Rail Hub)", baseCostUSD: 2850.00, slug: "ocean-rail/beira-harare" },
    { sku: "LOG-AIR-CARGO", name: "Express Air Freight Cargo Block (Guangzhou CAN to Harare RGM International HRE)", baseCostUSD: 8500.00, slug: "air-freight/guangzhou-harare" },
    { sku: "LOG-ROAD-LINER", name: "Cross-Border Tri-Axle Road Liner Freight (Johannesburg City Deep to Harare/Lusaka)", baseCostUSD: 5400.00, slug: "road-freight/joburg-harare" }
  ]);

  const [ledger, setLedger] = useState<LogisticsEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<any>(null);

  // Form State
  const [selectedSku, setSelectedSku] = useState('LOG-SEA-40HC');
  const [originCity, setOriginCity] = useState('Durban Port (Terminal 2)');
  const [destinationCity, setDestinationCity] = useState('Harare Dry Port Hub');
  const [weightTons, setWeightTons] = useState('28');
  const [isDomesticHaulage, setIsDomesticHaulage] = useState(false);

  const fetchLogisticsTelemetry = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/logistics/telemetry');
      const data = await res.json();
      if (data.success) {
        setTelemetry(data.metrics);
        setLedger(data.ledger || []);
      }
    } catch (err) {
      console.error('Failed to load logistics telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogisticsTelemetry();
  }, []);

  const handleDispatchCargo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setDispatching(true);
      setDispatchResult(null);

      const res = await fetch('/api/v1/logistics/ingest-cargo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: selectedSku,
          originCity,
          destinationCity,
          weightTons: parseFloat(weightTons),
          isDomesticHaulage
        })
      });

      const data = await res.json();
      if (data.success) {
        setDispatchResult(data);
        await fetchLogisticsTelemetry();
      }
    } catch (err) {
      console.error('Failed to dispatch cargo:', err);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Truck className="w-5 h-5" />
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              International Freight Procurement & Settlement Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multi-channel freight brokerage, automated fuel adjustment factors (FAF), and tipper fleet haulage routing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            FLEET LOGISTICS: ACTIVE
          </span>
          <button
            onClick={fetchLogisticsTelemetry}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#070c14] border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">Cleared Cargo Conversions</div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
            {telemetry.activeContainers}
            <span className="text-xs font-normal text-slate-400">Shipments Routed</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">100% Unthrottled Tracking</div>
        </div>

        <div className="p-4 rounded-xl bg-[#070c14] border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">Net Logistics Commissions</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            ${telemetry.aggregateBrokerageUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
          </div>
          <div className="text-[10px] text-slate-400 font-mono">12.5% Standard Platform Split</div>
        </div>

        <div className="p-4 rounded-xl bg-[#070c14] border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">Routing Tuning Factor</div>
          <div className="text-2xl font-bold font-mono text-amber-400">1.08x FAF Multiplier</div>
          <div className="text-[10px] text-emerald-400 font-mono">OPTIMAL / AUTOMATED</div>
        </div>

        <div className="p-4 rounded-xl bg-[#070c14] border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">Settlement Nostro Target</div>
          <div className="text-xl font-bold font-mono text-white">AgriBank Nostro Gateway</div>
          <div className="text-[10px] text-indigo-400 font-mono">Harare Highlands Commercial</div>
        </div>
      </div>

      {/* Dual Routing Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-950 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
              DOMESTIC ZIMBABWE FLEET
            </span>
            <span className="text-xs font-mono text-amber-400 font-semibold">Strategy: DOMESH_DIRECT_FLEET</span>
          </div>
          <h4 className="text-sm font-bold text-white">Demash Commercial Tipper Fleet Execution</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Direct brick haulage, aggregate moving, and precast transit across Harare, Norton, and Chitungwiza fulfilled natively with Demash tippers. Zero external fleet leakage. 25% commitment deposit locks to verified <strong className="text-white">AgriBank Nostro Escrow Gateway</strong>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/30 to-slate-950 border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
              CROSS-BORDER MARITIME & AIR
            </span>
            <span className="text-xs font-mono text-cyan-400 font-semibold">Strategy: GLOBAL_LOGISTICS_AFFILIATE</span>
          </div>
          <h4 className="text-sm font-bold text-white">Global Maritime POS Checkout Rails</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Direct slot allocation across ocean shipping lines (Durban to Harare) and express air freight (Guangzhou to Harare) wrapped with <strong className="text-cyan-300 font-mono">ref=mnpixfvf</strong>. Eliminates transport liability while banking broker commissions.
          </p>
        </div>
      </div>

      {/* Interactive Cargo Routing Console */}
      <div className="p-6 rounded-2xl bg-[#070c14] border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Dispatch Cargo Ingestion & Routing Valve
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">FAF Dynamic Buffer Engine</span>
        </div>

        <form onSubmit={handleDispatchCargo} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Logistics Corridor SKU *</label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              >
                {catalog.map(item => (
                  <option key={item.sku} value={item.sku}>
                    {item.sku} (${item.baseCostUSD.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Origin Port / City *</label>
              <input
                type="text"
                required
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Destination Hub *</label>
              <input
                type="text"
                required
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Cargo Weight (Metric Tons) *</label>
              <input
                type="number"
                required
                value={weightTons}
                onChange={(e) => setWeightTons(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              id="isDomesticHaulageCheck"
              checked={isDomesticHaulage}
              onChange={(e) => setIsDomesticHaulage(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="isDomesticHaulageCheck" className="text-slate-200 cursor-pointer">
              Domestic Zimbabwe Haulage Route (Execute natively via Demash Tipper Fleet, zero third-party subcontracting)
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={dispatching}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition cursor-pointer disabled:opacity-50"
            >
              <Truck className="w-4 h-4" />
              {dispatching ? 'Calibrating FAF & Dispatching...' : 'Lock Slot & Deploy Freight Proposal'}
            </button>
          </div>
        </form>

        {/* Dispatch Result */}
        {dispatchResult && (
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Freight Corridor Locked (Ref: {dispatchResult.cargoId})
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                STRATEGY: {dispatchResult.routingStrategy}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">CALIBRATED FREIGHT QUOTE (+8% FAF)</span>
                <span className="text-sm font-bold text-cyan-400">${dispatchResult.calibratedCostUSD?.toFixed(2)} USD</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">NET BROKER COMMISSION (12.5%)</span>
                <span className="text-sm font-bold text-emerald-400">${dispatchResult.brokerCutUSD?.toFixed(2)} USD</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">REQUIRED 25% DEPOSIT (AGRIBANK)</span>
                <span className="text-sm font-bold text-amber-400">${dispatchResult.requiredDepositUSD?.toFixed(2)} USD</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
              <div className="font-mono text-[10px] text-cyan-400 uppercase font-bold">Logistics Proposal Outreach Copy:</div>
              <p className="text-slate-200 leading-relaxed font-sans">{dispatchResult.closingPitch}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  const alertMD = `*🚚 [FREIGHT ALLOCATION SECURED]*\n*Ref:* ${dispatchResult.cargoId}\n*Strategy:* ${dispatchResult.routingStrategy}\n*Valuation:* $${dispatchResult.calibratedCostUSD?.toFixed(2)} USD\n*Broker Cut:* $${dispatchResult.brokerCutUSD?.toFixed(2)} USD\n*Deposit:* $${dispatchResult.requiredDepositUSD?.toFixed(2)} USD\n*Payment Rail:* AgriBank Nostro Escrow Gateway`;
                  openWhatsAppLink('263784219178', alertMD);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Audit Report to MD WhatsApp (+263784219178)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Freight Ledger */}
      <div className="p-6 rounded-2xl bg-[#070c14] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Automated Global Freight & Cargo Ledger
            </h4>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">Sovereign Cargo Logistics · 100% Live Operations</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Cargo ID</th>
                <th className="py-2.5 px-3">Corridor & Route</th>
                <th className="py-2.5 px-3">Consignment Specification</th>
                <th className="py-2.5 px-3">Valuation USD</th>
                <th className="py-2.5 px-3">Broker Cut (12.5%)</th>
                <th className="py-2.5 px-3">Routing Strategy</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {ledger.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 px-4 text-center text-xs text-slate-500 font-mono">
                    ⚡ No historical cargo consignments. Real-world logistics ledger is clean and live. Ready to dispatch real freight hauls.
                  </td>
                </tr>
              ) : (
                ledger.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400">{item.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{item.route}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.sku}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-medium">{item.cargoType}</td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    ${item.valuationUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    ${item.brokerCutUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      item.routingStrategy === 'DOMESH_DIRECT_FLEET'
                        ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                        : 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {item.routingStrategy}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        const note = `*FREIGHT MANIFEST RECEIPT*\n*ID:* ${item.id}\n*Route:* ${item.route}\n*Valuation:* $${item.valuationUSD} USD\n*Broker Cut:* $${item.brokerCutUSD} USD\n*Account:* AgriBank Nostro Escrow Gateway`;
                        openWhatsAppLink('263784219178', note);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 transition cursor-pointer"
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
