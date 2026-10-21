import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Zap, 
  Send, 
  ShieldCheck, 
  TrendingUp, 
  MessageSquare, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  Building2,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { openWhatsAppLink } from '../utils/navigation';

interface Deal {
  id: string;
  source: string;
  client: string;
  material: string;
  targetPhone: string;
  marginBeaten: string;
  discountOffered: string;
  status: 'OFFER_DELIVERED' | 'DEPOSIT_PENDING' | 'COMMISSION_LOCKED';
  depositRequiredUSD: number;
  agriBankNostro: string;
  localizedBeatingScript: string;
  timestamp: string;
}

export default function CompetitorInfiltrationPanel() {
  const [intercepts, setIntercepts] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [closingVelocity, setClosingVelocity] = useState("94.8% CLOSING VELOCITY");
  
  // Interactive Intercept Launcher State
  const [targetClient, setTargetClient] = useState("Harare Highlands Estate Developer");
  const [rawContent, setRawContent] = useState("Need 40 tons of 3/4 crushed stone and washed river sand delivered to Norton site immediately.");
  const [prospectPhone, setProspectPhone] = useState("+263784219178");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const loadLiveInterceptTelemetry = async () => {
    try {
      const res = await fetch('/api/v1/competitors/intercept-deals');
      const data = await res.json();
      if (data.success && data.deals) {
        setIntercepts(data.deals);
        setClosingVelocity(data.closingVelocity || "94.8% CLOSING VELOCITY");
      }
    } catch (e) {
      console.error("Failed to fetch live deals", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLiveInterceptTelemetry();
    const interval = setInterval(loadLiveInterceptTelemetry, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleExecuteIntercept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawContent.trim()) return;

    setIsExecuting(true);
    setStatusNotice("🧠 Running Gemini AI competitor price-beating analysis & drafting localized pitch...");

    try {
      const res = await fetch('/api/v1/competitors/intercept-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetClient,
          rawContent,
          prospectPhone
        })
      });
      const data = await res.json();
      if (data.success && data.dealRecord) {
        setExecutionResult(data);
        setIntercepts(prev => [data.dealRecord, ...prev]);
        setStatusNotice(`🎯 Intercept Successful: 5% discount pitch generated and locked to AgriBank Nostro Escrow Gateway.`);
      } else {
        throw new Error(data.error || "Execution failed");
      }
    } catch (err: any) {
      setStatusNotice(`Alert: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="bg-[#0b1320] border border-[#16253b] rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-6xl mx-auto font-sans text-slate-200 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#16253b] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30">
              <Target className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Competitor Infiltration & Deal Intercept Ledger
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-Time RFQ Board Interception, PhD-Level Price-Beater AI & Automated WhatsApp Escrow Outreach
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadLiveInterceptTelemetry}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer"
            title="Refresh Ledger"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-mono block uppercase">ACTIVE CLOSING VELOCITY</span>
            <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full">
              {closingVelocity}
            </span>
          </div>
        </div>
      </div>

      {/* Architecture Flow Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-[#060a13] border border-slate-800 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase">1. Portal Infiltration</div>
          <div className="text-slate-300 font-semibold flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Public RFQ Harvest &lt;5s</span>
          </div>
        </div>
        <div className="p-3 bg-[#060a13] border border-slate-800 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase">2. Gemini Price-Beater</div>
          <div className="text-cyan-400 font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-cyan-400" />
            <span>5% Trade Discount Active</span>
          </div>
        </div>
        <div className="p-3 bg-[#060a13] border border-slate-800 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase">3. High-Pressure Pitch</div>
          <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3 text-emerald-400" />
            <span>Direct WhatsApp & SMS</span>
          </div>
        </div>
        <div className="p-3 bg-[#060a13] border border-slate-800 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase">4. AgriBank Nostro Lock</div>
          <div className="text-amber-400 font-semibold flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>25% Escrow Gateway Lock</span>
          </div>
        </div>
      </div>

      {/* Interactive Intercept Campaign Launcher */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1626] border border-amber-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Live Intercept Campaign Trigger (PhD Automated Closer)
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Target Phone: +263 78 421 9178</span>
        </div>

        <form onSubmit={handleExecuteIntercept} className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Client Profile / Organization *</label>
              <input
                type="text"
                value={targetClient}
                onChange={(e) => setTargetClient(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-amber-400 outline-none"
                placeholder="e.g. Norton Commercial Villa Group"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Target WhatsApp / Mobile Phone *</label>
              <input
                type="text"
                value={prospectPhone}
                onChange={(e) => setProspectPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-amber-400 outline-none"
                placeholder="+263784219178"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Raw Competitor Inbound RFQ / Procurement Request *</label>
            <textarea
              rows={2}
              value={rawContent}
              onChange={(e) => setRawContent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-amber-400 outline-none resize-none"
              placeholder="Paste raw competitor procurement text..."
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Includes 5% Trade Discount + AgriBank Zimbabwe 25% Deposit Lock</span>
            </div>

            <button
              type="submit"
              disabled={isExecuting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 hover:from-red-500 hover:to-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isExecuting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Synthesizing Intercept...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Execute Price-Beater Intercept</span>
                </>
              )}
            </button>
          </div>
        </form>

        {statusNotice && (
          <div className="p-3 bg-slate-950 rounded-xl text-xs text-amber-300 border border-amber-500/30 font-mono">
            {statusNotice}
          </div>
        )}

        {/* Generated Pitch Preview Box */}
        {executionResult && executionResult.dealRecord && (
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Generated Competitor Beating Pitch</span>
              </span>
              <span className="text-[10px] text-slate-500">ID: {executionResult.dealRecord.id}</span>
            </div>
            
            <p className="text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
              {executionResult.dealRecord.localizedBeatingScript}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <div className="text-[11px] text-slate-400">
                Deposit Lock: <span className="text-amber-400 font-bold">${executionResult.dealRecord.depositRequiredUSD} USD</span> into <span className="text-white">AgriBank Nostro Escrow Gateway</span>
              </div>
              <button
                onClick={() => openWhatsAppLink(prospectPhone.replace(/\D/g, ''), executionResult.dealRecord.localizedBeatingScript)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>Dispatch to Buyer WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Intercepts Ledger Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Active Competitor Intercept Telemetry ({intercepts.length} Captured)
          </h4>
          <span className="text-[10px] font-mono text-emerald-400">Live PostgreSQL Stream</span>
        </div>

        <div className="overflow-x-auto w-full rounded-xl border border-[#16253b]">
          <table className="w-full text-left font-mono text-xs text-slate-400">
            <thead>
              <tr className="border-b border-[#16253b] bg-[#070c16] text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 pl-3">Target Client Profile</th>
                <th className="py-3">Sourced Platform</th>
                <th className="py-3">Material Requirement</th>
                <th className="py-3 text-center">Margin Beaten</th>
                <th className="py-3 text-right pr-3">Intercept Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#090f1a]">
              {intercepts.map((deal) => (
                <tr key={deal.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 pl-3 font-sans font-bold text-slate-200">
                    {deal.client}
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] text-slate-500 font-mono font-normal">{deal.id}</span>
                      <span className="text-[9px] text-amber-500 font-mono font-normal">{deal.targetPhone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-300 font-bold">{deal.source}</td>
                  <td className="py-3.5 text-slate-400 text-xs max-w-xs truncate" title={deal.material}>
                    {deal.material}
                  </td>
                  <td className="py-3.5 text-center font-bold text-cyan-400">
                    {deal.marginBeaten}
                    <span className="block text-[9px] text-slate-500 font-normal">Below Mkt</span>
                  </td>
                  <td className="py-3.5 text-right pr-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide border ${
                      deal.status === 'OFFER_DELIVERED' ? 'bg-amber-950/40 border-amber-500/40 text-amber-400' :
                      deal.status === 'DEPOSIT_PENDING' ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400' :
                      'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                    }`}>
                      {deal.status.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => openWhatsAppLink('263784219178', deal.localizedBeatingScript)}
                      className="block text-[9px] text-emerald-400 hover:underline mt-1 font-mono text-right ml-auto cursor-pointer"
                    >
                      Resend Offer ↗
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
