import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Landmark, 
  DollarSign, 
  RefreshCw, 
  Cpu, 
  Activity, 
  Terminal, 
  Send, 
  Zap, 
  FileCheck, 
  Award, 
  CheckCircle2, 
  Truck, 
  Plane, 
  Ship, 
  Building 
} from 'lucide-react';
import { openWhatsAppLink } from '../utils/navigation';

interface MilestoneRecord {
  id: string;
  title: string;
  targetUSD: number;
  allocationPct: number;
  licenseType: string;
  currentUSD: number;
  licenseTriggered: boolean;
  status: string;
}

interface RuntimeMetrics {
  cacheHitRatio: string;
  bucketTokens: number;
  circuitState: string;
  totalIngestedLeads: number;
  totalEscrowClearedUSD: number;
  activeAccount: string;
  mdLine: string;
  heapUsedMB: number;
  heapTotalMB: number;
  memoryHealth: string;
}

interface MutationState {
  lastExecuted: string;
  nextScheduled: string;
  cycleCount: number;
  marketLoopHealth: string;
  payoutOptimizationFactor: number;
  tradeVectors: Array<{
    corridor: string;
    tradeType: string;
    marginYield: string;
    status: string;
  }>;
  mutationDetails: string;
}

export const SovereignMilestoneMatrixPanel: React.FC = () => {
  const [milestones, setMilestones] = useState<MilestoneRecord[]>([]);
  const [metrics, setMetrics] = useState<RuntimeMetrics>({
    cacheHitRatio: "100.0%",
    bucketTokens: 100000,
    circuitState: "CLOSED",
    totalIngestedLeads: 0,
    totalEscrowClearedUSD: 0.0,
    activeAccount: "AgriBank Nostro Gateway",
    mdLine: "+263784219178",
    heapUsedMB: 48.2,
    heapTotalMB: 64.0,
    memoryHealth: "OPTIMAL"
  });
  const [mutation, setMutation] = useState<MutationState | null>(null);
  const [allocationAmount, setAllocationAmount] = useState('25000');
  const [allocating, setAllocating] = useState(false);
  const [allocationReport, setAllocationReport] = useState<any[] | null>(null);
  const [leadInquiry, setLeadInquiry] = useState('Turnkey 5kW Hybrid Solar System + Borehole Pump for Norton property');
  const [leadCountry, setLeadCountry] = useState('ZW');
  const [testingAICloser, setTestingAICloser] = useState(false);
  const [aiCloserResult, setAiCloserResult] = useState<any | null>(null);

  const fetchData = async () => {
    try {
      const [resM, resR, resMut] = await Promise.all([
        fetch('/api/v1/revenue/milestones'),
        fetch('/api/v1/system/runtime-metrics'),
        fetch('/api/v1/system/autonomous-mutation/status')
      ]);

      const dataM = await resM.json();
      if (dataM.success && dataM.registry) {
        setMilestones(dataM.registry);
      }

      const dataR = await resR.json();
      if (dataR.success) {
        setMetrics(dataR);
      }

      const dataMut = await resMut.json();
      if (dataMut.success && dataMut.mutationState) {
        setMutation(dataMut.mutationState);
      }
    } catch (err) {
      console.error('Error fetching sovereign telemetry:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleAllocateRevenue = async (e: React.FormEvent) => {
    e.preventDefault();
    setAllocating(true);
    setAllocationReport(null);
    try {
      const res = await fetch('/api/v1/revenue/allocate-milestones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: `TX-REVENUE-${Date.now().toString().slice(-4)}`,
          grossAmountUSD: Number(allocationAmount)
        })
      });
      const data = await res.json();
      if (data.success) {
        setAllocationReport(data.allocations);
        if (data.registry) setMilestones(data.registry);
        fetchData();
      }
    } catch (err) {
      console.error('Revenue allocation failed:', err);
    } finally {
      setAllocating(false);
    }
  };

  const handleTestAICloser = async () => {
    setTestingAICloser(true);
    setAiCloserResult(null);
    try {
      const res = await fetch('/api/v1/leads/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawContent: leadInquiry,
          countryCode: leadCountry,
          tradeType: "civil_solar_turnkey",
          budgetUSD: 18000
        })
      });
      const data = await res.json();
      setAiCloserResult(data);
      fetchData();
    } catch (err: any) {
      setAiCloserResult({ error: err.message });
    } finally {
      setTestingAICloser(false);
    }
  };

  const getMilestoneIcon = (id: string) => {
    switch (id) {
      case 'MS-LOG-ROAD': return <Truck className="w-5 h-5 text-amber-400" />;
      case 'MS-LOG-AIR': return <Plane className="w-5 h-5 text-cyan-400" />;
      case 'MS-LOG-SEA': return <Ship className="w-5 h-5 text-indigo-400" />;
      case 'MS-CAP-RESERVE': return <Building className="w-5 h-5 text-emerald-400" />;
      default: return <Award className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Edge Buffer & Multi-Cluster Core Telemetry */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0a1020] to-[#0d1527] border border-cyan-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>HIGH-AVAILABILITY MULTI-CLUSTER OPERATIONAL CORE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Sovereign Milestone Matrix & Cognitive Closer Engine
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Real-time revenue divider, automated regulatory licensing engine, token bucket rate limiter, and autonomous self-coding mutation loop.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>PM2 CLUSTER ONLINE</span>
            </span>
          </div>
        </div>

        {/* Real-Time Cluster Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#17263c] p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-mono block mb-1">EDGE BUFFER INGESTION RATIO</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">{metrics.cacheHitRatio}</span>
            <span className="text-[10px] text-slate-500 block">Sub-Second Volatile RAM</span>
          </div>

          <div className="bg-[#17263c] p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-mono block mb-1">TOKEN BUCKET CAPACITY</span>
            <span className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
              {metrics.bucketTokens.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 block">Refill: 25,000 / sec</span>
          </div>

          <div className="bg-[#17263c] p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-mono block mb-1">CIRCUIT BREAKER STATE</span>
            <span className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-mono">{metrics.circuitState}</span>
            <span className="text-[10px] text-slate-500 block">Failover Protection Active</span>
          </div>

          <div className="bg-[#17263c] p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] font-mono block mb-1">TOTAL ESCROW CLEARED</span>
            <span className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              ${metrics.totalEscrowClearedUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-500 block">AgriBank Nostro Nostro Escrow Gateway</span>
          </div>
        </div>
      </div>

      {/* Strategic Milestone Matrix Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Rigid Strategic Milestone Performance Matrix</h3>
            </div>
            <p className="text-xs text-slate-400">
              Evaluates cleared cash inputs, divides funds according to strict percentage allocations, and programmatically triggers regulatory license payments upon reaching milestone targets.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 self-start sm:self-auto">
            4 STRATEGIC ALLOCATIONS ACTIVE
          </span>
        </div>

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((m) => {
            const pct = Math.min(100, Math.round((m.currentUSD / m.targetUSD) * 1000) / 10);
            return (
              <div key={m.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#111928] border border-slate-800">
                      {getMilestoneIcon(m.id)}
                    </div>
                    <div>
                      <div className="text-xs font-mono text-slate-400">{m.id} • {(m.allocationPct * 100).toFixed(0)}% SPLIT CUT</div>
                      <div className="font-bold text-white text-sm">{m.title}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold shrink-0 ${
                    m.licenseTriggered 
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                  }`}>
                    {m.licenseTriggered ? 'LICENSE PAID' : 'ACCUMULATING'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Accumulated Cash:</span>
                    <span className="text-white font-bold">${m.currentUSD.toLocaleString()} / ${m.targetUSD.toLocaleString()} USD</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full transition-all duration-500 ${m.licenseTriggered ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-300'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{pct}% funded</span>
                    <span className="text-slate-400 truncate max-w-[200px]">License: {m.licenseType}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Cash Allocation Action Box */}
        <div className="p-5 rounded-xl bg-[#0e1626] border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-mono font-bold text-cyan-400">HARDENED REVENUE SPLITTER DISPATCH</span>
              <div className="text-sm font-bold text-white">Allocate Incoming Cleared Cash to Strategic Matrix</div>
            </div>
            <span className="text-xs font-mono text-slate-400">AgriBank Nostro Gateway</span>
          </div>

          <form onSubmit={handleAllocateRevenue} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
              <input
                type="number"
                required
                min="100"
                value={allocationAmount}
                onChange={(e) => setAllocationAmount(e.target.value)}
                placeholder="Gross USD Amount (e.g. 25000)"
                className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:border-amber-400 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={allocating}
              className="w-full sm:w-auto px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <DollarSign className="w-4 h-4" />
              <span>{allocating ? 'Allocating Matrix...' : 'Execute Percentage Split'}</span>
            </button>
          </form>

          {allocationReport && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
              <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Revenue Successfully Allocated Across 4 Milestones:</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                {allocationReport.map((rep) => (
                  <div key={rep.milestoneId} className="p-2.5 bg-[#111928] rounded-lg border border-slate-800 space-y-0.5">
                    <div className="text-slate-400 text-[10px]">{rep.milestoneId}</div>
                    <div className="text-amber-400 font-bold">+${rep.allocatedUSD.toLocaleString()}</div>
                    <div className="text-slate-300 text-[11px]">Total: ${rep.newTotalUSD.toLocaleString()} ({rep.pctCompleted}%)</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cognitive Closer AI Test & Lead Ingestion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: SPIN / Challenger / NEAT Cognitive Closer AI (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">SPIN / Challenger / NEAT Cognitive Closer AI</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">GEMINI PRO REASONING</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Prospect Request / Inquiry Details</label>
              <textarea
                rows={3}
                value={leadInquiry}
                onChange={(e) => setLeadInquiry(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Country Code</label>
                <select
                  value={leadCountry}
                  onChange={(e) => setLeadCountry(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                >
                  <option value="ZW">ZW (Zimbabwe - Norton Turnkey Direct)</option>
                  <option value="ZA">ZA (South Africa - Global Affiliate)</option>
                  <option value="GB">GB (United Kingdom - Diaspora Nostro)</option>
                  <option value="US">US (United States - Machinery Brokerage)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">AgriBank Nostro Account</label>
                <div className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono font-bold">
                  Nostro Escrow Gateway
                </div>
              </div>
            </div>

            <button
              onClick={handleTestAICloser}
              disabled={testingAICloser}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{testingAICloser ? 'Analyzing with SPIN & Challenger Sale...' : 'Generate 25% Escrow Closer Pitch'}</span>
            </button>
          </div>

          {aiCloserResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3 text-xs">
              <div className="flex items-center justify-between text-amber-400 font-mono font-bold text-[11px]">
                <span>ROUTED STRATEGY: {aiCloserResult.strategy || 'DOMESH_DIRECT_ZIM'}</span>
                <span>ESCROW DEPOSIT: ${aiCloserResult.depositRequiredUSD ? aiCloserResult.depositRequiredUSD.toLocaleString() : '3,750'} USD</span>
              </div>
              <div className="p-3 bg-black rounded-lg border border-slate-800 text-emerald-400 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                {aiCloserResult.outreachScript || aiCloserResult.actionReport?.routedStrategy}
              </div>
              {aiCloserResult.spinAnalysis && (
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 bg-[#0e1626] p-2.5 rounded-lg border border-slate-800">
                  <div><strong className="text-slate-200">Situation:</strong> {aiCloserResult.spinAnalysis.situation}</div>
                  <div><strong className="text-slate-200">Problem:</strong> {aiCloserResult.spinAnalysis.problem}</div>
                  <div><strong className="text-slate-200">Implication:</strong> {aiCloserResult.spinAnalysis.implication}</div>
                  <div><strong className="text-slate-200">Need-Payoff:</strong> {aiCloserResult.spinAnalysis.needPayoff}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Autonomous Self-Coding Mutation Loop & Weekly Trade Vectors (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Autonomous Trade Vector Mutation</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              WEEKLY LOOP ACTIVE
            </span>
          </div>

          {mutation && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Cycle Count</span>
                  <span className="text-white font-bold">#{mutation.cycleCount}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Margin Optimization</span>
                  <span className="text-amber-400 font-bold">{mutation.payoutOptimizationFactor}x</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Active Expanded Trade Vectors
                </span>
                {mutation.tradeVectors.map((v, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-white">{v.corridor}</div>
                      <div className="text-[10px] text-slate-400">{v.tradeType}</div>
                    </div>
                    <span className="font-mono text-emerald-400 font-bold shrink-0">{v.marginYield}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-black border border-slate-800 text-[10px] font-mono text-slate-400 leading-relaxed">
                <strong className="text-slate-200">Mutation Policy:</strong> {mutation.mutationDetails}
              </div>
            </div>
          )}

          {/* PM2 Reload Status */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
            <div className="text-slate-200 font-bold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Production PM2 Ecosystem:</span>
            </div>
            <div className="text-emerald-400">pm2 reload ecosystem.config.js --env production</div>
            <div className="text-slate-500">demash-global-core (cluster) & demash-domestic-outsourcer (daemon)</div>
          </div>
        </div>

      </div>

    </div>
  );
};
