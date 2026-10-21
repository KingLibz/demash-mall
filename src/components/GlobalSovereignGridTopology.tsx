import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  Layers, 
  Server, 
  Activity, 
  CheckCircle2, 
  RefreshCw, 
  SlidersHorizontal, 
  ShieldCheck, 
  FileText, 
  Clock, 
  Send,
  Zap,
  ArrowRight
} from 'lucide-react';

interface GridNode {
  hub: string;
  node: string;
  capabilities: string[];
  ping: string;
  status: string;
}

interface ManifestModule {
  id: number;
  name: string;
  script: string;
  purpose: string;
}

export default function GlobalSovereignGridTopology() {
  const [nodes, setNodes] = useState<GridNode[]>([]);
  const [modules, setModules] = useState<ManifestModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [kernelStatus, setKernelStatus] = useState("100-ADVANTAGE AUTONOMOUS ENTERPRISE KERNEL ONLINE");

  // Inventory Coupler Tuning state
  const [selectedCategory, setSelectedCategory] = useState("international_real_estate");
  const [isTuning, setIsTuning] = useState(false);
  const [tuneResult, setTuneResult] = useState<any>(null);

  const loadGridData = async () => {
    try {
      const res = await fetch('/api/v1/system/global-grid-topology');
      const data = await res.json();
      if (data.success) {
        setNodes(data.sovereignGrid || []);
        setModules(data.masterManifest || []);
        setKernelStatus(data.enterpriseKernelStatus || "ONLINE");
      }
    } catch (e) {
      console.error("Failed to load topology", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGridData();
  }, []);

  const handleTuneCatalog = async () => {
    setIsTuning(true);
    try {
      const res = await fetch('/api/v1/catalog/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryFilter: selectedCategory })
      });
      const data = await res.json();
      if (data.success) {
        setTuneResult(data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsTuning(false);
    }
  };

  return (
    <div className="bg-[#0b1320] border border-[#16253b] rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-6xl mx-auto font-sans text-slate-200 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#16253b] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Globe2 className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Global Sovereign Grid Multi-Region Node Topology
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            5 International Cloud Hubs, Autonomous Group Crawler Feeds & Master Manifest Modules (118–132)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadGridData}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer"
            title="Refresh Nodes"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wide bg-teal-950/60 border border-teal-500/40 text-teal-400 uppercase">
            {kernelStatus}
          </span>
        </div>
      </div>

      {/* 5 Hubs Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Active Multi-Region Sovereign Grid Nodes (Sub-Second Ingress)
          </h4>
          <span className="text-[10px] font-mono text-emerald-400">AWS / Hetzner Multi-Cluster</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {nodes.map((n, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                n.status === 'PRIMARY_ACTIVE'
                  ? 'bg-gradient-to-b from-[#0a1829] to-[#07111e] border-teal-500/40 shadow-lg'
                  : 'bg-[#060a13] border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-teal-400">
                    {n.hub}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">
                    {n.ping}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white mt-1">
                  {n.node}
                </h5>

                <div className="mt-2 space-y-1">
                  {n.capabilities.map((cap, cIdx) => (
                    <div key={cIdx} className="text-[10px] text-slate-400 flex items-start gap-1">
                      <span className="text-teal-400">•</span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-500">Status</span>
                <span className="text-emerald-400 font-bold">{n.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Industrial Inventory Arbitrage Coupler */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1626] border border-teal-500/30 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Unthrottled Industrial Inventory Coupler & Performance Tuning Pass
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Zero Lag Arbitrage Engine</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-teal-400 outline-none"
            >
              <option value="international_real_estate">International Real Estate (Dubai, London, Riviera)</option>
              <option value="mining_machinery">Heavy Equipment & Mining Machinery (AHM Corp / Acme)</option>
              <option value="commercial_aggregates">Commercial Civil Aggregates & Ready-Mix</option>
            </select>
            <button
              onClick={handleTuneCatalog}
              disabled={isTuning}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs uppercase transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isTuning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>Execute Tuning Pass</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400">
            Locks pricing arrays, image URLs, and ref=mnpixfvf tracking tokens
          </span>
        </div>

        {tuneResult && (
          <div className="p-3 bg-slate-950 rounded-xl border border-teal-500/40 text-xs text-teal-300">
            ✅ Catalog Performance Verified: Synchronized {tuneResult.recordCount} live listings for category "{tuneResult.category}". Unthrottled image galleries cached.
          </div>
        )}
      </div>

      {/* Master Manifest Modules (118 - 132) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Grouped Master Manifest (Modules 118–132 Live Daemons)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">{modules.length} Enterprise Daemons Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {modules.map((m) => (
            <div 
              key={m.id}
              className="p-3.5 bg-slate-950 border border-slate-800/90 rounded-xl space-y-1.5 text-xs font-mono hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold text-[11px]">
                  #{m.id}. {m.name}
                </span>
                <span className="text-[10px] bg-slate-800 text-cyan-400 px-1.5 py-0.5 rounded font-mono">
                  {m.script}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                {m.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
