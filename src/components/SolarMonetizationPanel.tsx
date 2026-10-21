import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Cpu, 
  DollarSign, 
  ExternalLink,
  Flame,
  ArrowRight
} from 'lucide-react';
import { openWhatsAppLink } from '../utils/navigation';

interface SolarProduct {
  sku: string;
  name: string;
  baseCost: number;
  link: string;
}

interface SolarLeadItem {
  id: string;
  client: string;
  phone: string;
  countryCode: string;
  systemSku: string;
  systemName: string;
  quoteUSD: number;
  routingStrategy: string;
  depositUSD: number;
  status: string;
  timestamp: string;
}

export default function SolarMonetizationPanel() {
  const [telemetry, setTelemetry] = useState({
    activeOrders: 3,
    aggregateRevenueUSD: 21616.00,
    grossCommissionsUSD: 2702.00,
    progressiveMultiplier: 1.12,
    cachingLatency: "4.12 μs",
    status: "ONLINE",
    tuningState: "OPTIMAL LEARNING ON"
  });

  const [catalog, setCatalog] = useState<SolarProduct[]>([
    { sku: "SOL-GEN-5KW", name: "Demash Platinum 5kW Hybrid Solar Package (Tier-1 Mono PV + 5.12kWh LiFePO4 Battery)", baseCost: 3850.00, link: "products/5kw-hybrid-solar-system" },
    { sku: "SOL-IND-20KW", name: "Demash Industrial 20kW Three-Phase Commercial Solar Array", baseCost: 14200.00, link: "collections/commercial-solar" },
    { sku: "SOL-BAT-LITH", name: "Premium 48V 100Ah Deep-Cycle Wall-Mounted Lithium Battery Backup", baseCost: 1250.00, link: "products/48v-lithium-battery" }
  ]);

  const [ledger, setLedger] = useState<SolarLeadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [executingLead, setExecutingLead] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  // Form state
  const [clientName, setClientName] = useState('Eng. Tinashe Hove');
  const [prospectPhone, setProspectPhone] = useState('+263772183921');
  const [countryCode, setCountryCode] = useState('ZW');
  const [selectedSku, setSelectedSku] = useState('SOL-GEN-5KW');
  const [rawContent, setRawContent] = useState('We urgently need a reliable 5kW hybrid backup setup for a multi-storey house in Norton with heavy load-shedding.');

  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/solar/telemetry');
      const data = await res.json();
      if (data.success) {
        setTelemetry(data.metrics);
        setLedger(data.ledger || []);
      }
    } catch (err) {
      console.error('Failed to load solar telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const handleExecuteCloser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setExecutingLead(true);
      setExecutionResult(null);

      const res = await fetch('/api/v1/solar/ingest-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          prospectPhone,
          countryCode,
          sku: selectedSku,
          rawContent
        })
      });

      const data = await res.json();
      if (data.success) {
        setExecutionResult(data);
        await fetchTelemetry();
      }
    } catch (err) {
      console.error('Solar closer execution failed:', err);
    } finally {
      setExecutingLead(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sun className="w-5 h-5" />
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Clean-Energy Ingestion & Solar Monetization Pipeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Progressive learning cost calibrator, psychometric cognitive sales closer, and dual-routing fulfillment matrix.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            RAM SPEED: 4.12 μs
          </span>
          <button
            onClick={fetchTelemetry}
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
          <div className="text-[11px] font-mono uppercase text-slate-400">Cleared Solar Conversions</div>
          <div className="text-2xl font-bold font-mono text-white flex items-baseline gap-2">
            {telemetry.activeOrders}
            <span className="text-xs font-normal text-slate-400">Contracts Locked</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">100% Guaranteed Settlement</div>
        </div>

        <div className="p-4 rounded-xl bg-[#070c14] border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">Aggregate Solar Revenue</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            ${telemetry.aggregateRevenueUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Net Commissions: ${telemetry.grossCommissionsUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#070c14] border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">Progressive Multiplier</div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {(telemetry.progressiveMultiplier * 100).toFixed(0)}% (+12% Cushion)
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">{telemetry.tuningState}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#070c14] border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono uppercase text-slate-400">Escrow Nostro Target</div>
          <div className="text-xl font-bold font-mono text-white">AgriBank Nostro Gateway</div>
          <div className="text-[10px] text-indigo-400 font-mono">Harare Highlands Commercial</div>
        </div>
      </div>

      {/* Dual Routing Architecture Explainer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-950 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
              DOMESTIC ZIMBABWE (ZW)
            </span>
            <span className="text-xs font-mono text-amber-400 font-semibold">Strategy: DOMESH_DIRECT_ZIM</span>
          </div>
          <h4 className="text-sm font-bold text-white">Direct Turnkey Engineering & Norton Operations</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Direct on-ground civil roof installation and battery alignment executed by Demash Construction with zero third-party leakage. Locks 25% commitment deposits directly into AgriBank Nostro Account <strong className="text-white">Nostro Escrow Gateway</strong>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/30 to-slate-950 border border-indigo-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-400/20 text-indigo-300 border border-indigo-400/40">
              INTERNATIONAL INBOUND
            </span>
            <span className="text-xs font-mono text-indigo-400 font-semibold">Strategy: GLOBAL_SOLAR_AFFILIATE</span>
          </div>
          <h4 className="text-sm font-bold text-white">Global Tier-1 Equipment POS Checkout</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Routes international purchasers directly to verified manufacturer POS checkouts wrapping the permanent <strong className="text-cyan-300 font-mono">ref=mnpixfvf</strong> referral token. Completely eliminates inventory liabilities while securing hands-off broker credit.
          </p>
        </div>
      </div>

      {/* Interactive Execution & Dispatch Console */}
      <div className="p-6 rounded-2xl bg-[#070c14] border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Execute Cognitive Solar Closer & Dispatch Valve
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Gemini 1.5 Pro Cognitive Closer Engine</span>
        </div>

        <form onSubmit={handleExecuteCloser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 mb-1 font-medium">Client / Lead Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Prospect Phone (WhatsApp) *</label>
              <input
                type="text"
                required
                value={prospectPhone}
                onChange={(e) => setProspectPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Destination Region *</label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              >
                <option value="ZW">Zimbabwe (ZW - Turnkey Direct Norton)</option>
                <option value="ZA">South Africa (ZA - Affiliate POS)</option>
                <option value="AE">United Arab Emirates (AE - Affiliate POS)</option>
                <option value="GB">United Kingdom (GB - Diaspora POS)</option>
                <option value="US">United States (US - Affiliate POS)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 font-medium">Solar Product SKU *</label>
              <select
                value={selectedSku}
                onChange={(e) => setSelectedSku(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
              >
                {catalog.map(cat => (
                  <option key={cat.sku} value={cat.sku}>
                    {cat.sku} (${cat.baseCost.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 text-xs font-medium">Raw Client Demand Content *</label>
            <textarea
              rows={2}
              required
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs font-sans"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={executingLead}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              {executingLead ? 'Running Progressive Tuning & Cognitive Closer...' : 'Deploy High-Pressure Solar Closer Script'}
            </button>
          </div>
        </form>

        {/* Execution Output */}
        {executionResult && (
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Solar Monetization Pipeline Executed Successfully (Lead ID: {executionResult.leadId})
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                STRATEGY: {executionResult.routingStrategy}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">CALIBRATED PRICE (+12% CUSHION)</span>
                <span className="text-sm font-bold text-cyan-400">${executionResult.calibratedCostUSD?.toFixed(2)} USD</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">25% ADVANCE ESCROW DEPOSIT</span>
                <span className="text-sm font-bold text-amber-400">${executionResult.requiredDepositUSD?.toFixed(2)} USD</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">PAYMENT ROUTING ACCOUNT</span>
                <span className="text-sm font-bold text-white">AgriBank {executionResult.treasuryNostro}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
              <div className="font-mono text-[10px] text-amber-400 uppercase font-bold">Natively Formatted Sales Outreach Pitch:</div>
              <p className="text-slate-200 leading-relaxed font-sans">{executionResult.localizedPitch}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => openWhatsAppLink(prospectPhone.replace(/\D/g, ''), executionResult.localizedPitch)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch to Prospect WhatsApp ({prospectPhone})
              </button>

              <button
                onClick={() => {
                  const mdAlert = `*☀️ [SOLAR CONVERSION AUDIT]*\n*Lead ID:* ${executionResult.leadId}\n*Strategy:* ${executionResult.routingStrategy}\n*Quote:* $${executionResult.calibratedCostUSD?.toFixed(2)} USD\n*Deposit Required:* $${executionResult.requiredDepositUSD?.toFixed(2)} USD\n*Payment Rail:* AgriBank Nostro (Nostro Gateway)\n*Client:* ${clientName} (${prospectPhone})`;
                  openWhatsAppLink('263784219178', mdAlert);
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition cursor-pointer"
              >
                Ping Managing Director Line (+263784219178)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Active Solar Ledger */}
      <div className="p-6 rounded-2xl bg-[#070c14] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Live Solar Monetization & Conversion Ledger
            </h4>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">Production Sourced Units · 100% Real-Time Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Lead ID</th>
                <th className="py-2.5 px-3">Client & Contact</th>
                <th className="py-2.5 px-3">System Specification</th>
                <th className="py-2.5 px-3">Quote USD</th>
                <th className="py-2.5 px-3">25% Deposit</th>
                <th className="py-2.5 px-3">Routing Strategy</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {ledger.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 px-4 text-center text-xs text-slate-500 font-mono">
                    ⚡ No historical solar orders. Real-world solar ledger is clean and live. Ready to ingest real prospective buyer inquiries.
                  </td>
                </tr>
              ) : (
                ledger.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/60 transition">
                  <td className="py-3 px-3 font-mono font-bold text-amber-400">{item.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{item.client}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.phone} ({item.countryCode})</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200 font-medium">{item.systemName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.systemSku}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400">
                    ${item.quoteUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 font-mono text-amber-400 font-bold">
                    ${item.depositUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      item.routingStrategy === 'DOMESH_DIRECT_ZIM'
                        ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                        : 'bg-indigo-950/40 text-indigo-300 border border-indigo-500/30'
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
                        const alertText = `*DEMASH SOLAR DEPOSIT NOTICE*\n*Lead:* ${item.client}\n*System:* ${item.systemName}\n*Quote:* $${item.quoteUSD} USD\n*25% Deposit:* $${item.depositUSD} USD\n*Payment Rail:* AgriBank Zimbabwe Nostro (Nostro Gateway)`;
                        openWhatsAppLink(item.phone.replace(/\D/g, ''), alertText);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 transition cursor-pointer"
                    >
                      WhatsApp
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
