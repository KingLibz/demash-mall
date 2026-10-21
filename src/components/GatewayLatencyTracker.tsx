import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  Send, 
  AlertTriangle, 
  Server, 
  Activity, 
  Landmark, 
  Wallet,
  Clock,
  ArrowRight
} from 'lucide-react';
import { openWhatsAppLink } from '../utils/navigation';

interface GatewayRoute {
  channel: string;
  key: string;
  targetTimeout: string;
  actualLatency: string;
  latencyMs: number;
  state: string;
  loadSplit: string;
  trackingRef: string;
}

interface DiagnosticHandshake {
  timestamp: string;
  cloudServer: string;
  runtimeStatus: string;
  databaseResponseTimeMs: number;
  agricBalanceUsd: number;
  ecocashBalanceUsd: number;
  lastTransactionRef: string;
  diagnosticReport: string;
}

export default function GatewayLatencyTracker() {
  const [routes, setRoutes] = useState<GatewayRoute[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Transaction processing state
  const [amountUSD, setAmountUSD] = useState(4500);
  const [selectedGateway, setSelectedGateway] = useState("PRIMARY_STRIPE");
  const [forceFailover, setForceFailover] = useState(false);
  const [isProcessingTxn, setIsProcessingTxn] = useState(false);
  const [txnResult, setTxnResult] = useState<any>(null);

  // Diagnostic state
  const [handshakeData, setHandshakeData] = useState<DiagnosticHandshake | null>(null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);

  const loadActiveRouteTelemetry = async () => {
    try {
      const res = await fetch('/api/v1/gateways/latency-telemetry');
      const data = await res.json();
      if (data.success && data.cluster) {
        setRoutes(data.cluster);
      }
    } catch (e) {
      console.error("Failed to load telemetry", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunDiagnostic = async () => {
    setIsRunningDiagnostic(true);
    try {
      const res = await fetch('/api/v1/diagnostics/live-handshake');
      const data = await res.json();
      if (data.success) {
        setHandshakeData(data);
      }
    } catch (e) {
      console.error("Diagnostic sweep failed", e);
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  useEffect(() => {
    loadActiveRouteTelemetry();
    handleRunDiagnostic();
    const interval = setInterval(loadActiveRouteTelemetry, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleProcessTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingTxn(true);
    setTxnResult(null);

    try {
      const res = await fetch('/api/v1/gateways/process-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `ORD-SETTLE-${Date.now().toString().slice(-6)}`,
          totalAmountUSD: amountUSD,
          preferredGatewayKey: selectedGateway,
          forceFailover
        })
      });
      const data = await res.json();
      if (data.success) {
        setTxnResult(data);
        handleRunDiagnostic(); // refresh balances
      }
    } catch (err: any) {
      setTxnResult({ error: err.message });
    } finally {
      setIsProcessingTxn(false);
    }
  };

  return (
    <div className="bg-[#0b1320] border border-[#16253b] rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-6xl mx-auto font-sans text-slate-200 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#16253b] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Multi-Gateway Latency Route Balancer & Hot-Swap Router
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-Time Sub-Second Payment Validation Speeds & Sub-450ms Fallback Hot-Swap Matrix
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              loadActiveRouteTelemetry();
              handleRunDiagnostic();
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer"
            title="Refresh Latency"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wide bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 uppercase">
            HOT-SWAP ARMED // SUB-SECOND RECOVERY
          </span>
        </div>
      </div>

      {/* Latency Table */}
      <div className="overflow-x-auto w-full rounded-xl border border-[#16253b]">
        <table className="w-full text-left font-mono text-xs text-slate-400">
          <thead>
            <tr className="border-b border-[#16253b] bg-[#070c16] text-slate-500 text-[10px] uppercase tracking-wider">
              <th className="py-3 pl-3">API Connection Route</th>
              <th className="py-3">Latency Ceiling</th>
              <th className="py-3 text-right">Actual Ping</th>
              <th className="py-3 text-right">Traffic Weight</th>
              <th className="py-3 pr-3 text-right">Channel Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-[#090f1a]">
            {routes.map((route, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 pl-3 font-sans font-bold text-slate-200">
                  {route.channel}
                  <span className="block text-[9px] text-slate-500 font-mono font-normal mt-0.5">
                    Tracking Token: {route.trackingRef}
                  </span>
                </td>
                <td className="py-3.5 text-amber-400 font-bold">{route.targetTimeout}</td>
                <td className="py-3.5 text-right font-bold text-emerald-400">{route.actualLatency}</td>
                <td className="py-3.5 text-right text-slate-300">{route.loadSplit}</td>
                <td className="py-3.5 text-right pr-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide border ${
                    route.state === 'OPTIMAL' ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}>
                    {route.state}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Real-Time Transaction Router & Hot-Swap Tester */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1626] border border-amber-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              Live Latency Shielded Transaction Router
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Escrow Rails: Nostro Gateway</span>
        </div>

        <form onSubmit={handleProcessTransaction} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Transaction Amount (USD) *</label>
              <input
                type="number"
                value={amountUSD}
                onChange={(e) => setAmountUSD(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-amber-400 outline-none"
                placeholder="4500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Preferred Gateway Route *</label>
              <select
                value={selectedGateway}
                onChange={(e) => setSelectedGateway(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-amber-400 outline-none"
              >
                <option value="PRIMARY_STRIPE">PRIMARY_STRIPE (450ms ceiling · 70% load)</option>
                <option value="BACKUP_PAYPAL">BACKUP_PAYPAL (600ms ceiling · 20% load)</option>
                <option value="LOCAL_PAYNOW">LOCAL_PAYNOW (800ms ceiling · 10% load)</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={forceFailover}
                  onChange={(e) => setForceFailover(e.target.checked)}
                  className="rounded text-amber-400"
                />
                <span className="text-[11px] font-mono">Dynamic Failover Hot-Swap Route</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <span className="text-[11px] font-mono text-slate-400">
              {forceFailover ? '⚠️ Dynamic failover switch activated: clears through secondary PayPal channel in <450ms' : '🟢 Standard high-speed clearing via primary card channel'}
            </span>

            <button
              type="submit"
              disabled={isProcessingTxn}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessingTxn ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  <span>Routing Payment...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                  <span>Execute Latency Shielded Payment</span>
                </>
              )}
            </button>
          </div>
        </form>

        {txnResult && (
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{txnResult.status}</span>
              </span>
              <span className="text-slate-400">Total Latency: {txnResult.latencyMs}ms</span>
            </div>
            <p className="text-slate-300 text-xs">
              {txnResult.message}
            </p>
            {txnResult.hotSwapEngaged && (
              <div className="text-[11px] text-amber-400 bg-amber-950/30 p-2 rounded-lg border border-amber-500/30">
                ⚡ Hot-Swap Action: Primary route dropped. PayPal fallback captured order and recorded entry in `global_monetization_ledger`.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Core Infrastructure Handshake Card */}
      {handshakeData && (
        <div className="p-5 rounded-2xl bg-[#060a12] border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Core Infrastructure Handshake (AWS Cape Town Node Zone-1)
              </h4>
            </div>
            <button
              onClick={handleRunDiagnostic}
              disabled={isRunningDiagnostic}
              className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isRunningDiagnostic ? 'animate-spin' : ''}`} />
              <span>Trigger Handshake Sweep</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">DB LATENCY</span>
              <span className="text-emerald-400 font-bold text-sm">{handshakeData.databaseResponseTimeMs} ms</span>
              <span className="text-[9px] text-slate-400 block">Threshold: &lt;10ms</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">AGRIBANK NOSTRO</span>
              <span className="text-white font-bold text-sm">
                ${handshakeData.agricBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[9px] text-amber-400 block">Escrow Gateway Active</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">ECOCASH WALLET</span>
              <span className="text-cyan-400 font-bold text-sm">
                ${handshakeData.ecocashBalanceUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[9px] text-slate-400 block">+263 78 421 9178</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">RUNTIME STATUS</span>
              <span className="text-emerald-400 font-bold text-xs truncate block">100% OPERATIONAL</span>
              <span className="text-[9px] text-slate-400 block">Unthrottled</span>
            </div>
          </div>

          <div className="p-3 bg-black/80 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300">
            <div className="flex items-center justify-between pb-1 text-slate-400 border-b border-slate-900 mb-2">
              <span>Diagnostic Validation Report</span>
              <button
                onClick={() => openWhatsAppLink('263784219178', handshakeData.diagnosticReport)}
                className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Forward to Director WhatsApp (+263784219178) ↗
              </button>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed text-[10px] text-slate-400">
              {handshakeData.diagnosticReport}
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}
