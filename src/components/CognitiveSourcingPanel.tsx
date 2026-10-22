import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  ShieldAlert, 
  ShieldCheck, 
  Truck, 
  Brain, 
  Send, 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Phone, 
  Mail, 
  Compass, 
  ArrowRight, 
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { COMPANY_INFO } from '../data/companyData';

interface AuditItem {
  auditId: string;
  timestamp: string;
  groupName: string;
  industryVertical?: string;
  status: string;
  metrics?: {
    phones: string[];
    emails: string[];
    prices: string[];
    urls: string[];
    quantities: string[];
  };
  fraudProfile?: {
    isLegitimate: boolean;
    calculatedTrustScore: number;
    violations: string[];
  };
  optimizedMathMetrics?: {
    cargoType: string;
    calculatedMassTons: string;
    allocatedFleetCount: number;
    volumetricUtilization: string;
  };
  strategicProfile?: {
    dominantLaw: string;
    stance: string;
    tacticalSummary: string;
  };
  routing?: {
    supplierName: string;
    targetUrl: string;
    trackingToken: string;
  };
  pitchText?: string;
}

export const CognitiveSourcingPanel: React.FC = () => {
  const [groupName, setGroupName] = useState('Zimbabwe Civil Contractors & Heavy Equipment Forum');
  const [industryVertical, setIndustryVertical] = useState('machinery');
  const [rawText, setRawText] = useState(
    'Procuring 3 units 22-ton crawler excavators from AHM Corp for commercial groundworks in Norton. Budget $165,000 USD confirmed. Looking for exclusive supplier allocation with direct tipper haulage support.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAuditResult, setLastAuditResult] = useState<any>(null);
  const [auditHistory, setAuditHistory] = useState<AuditItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const presets = [
    {
      title: 'Legitimate Heavy Machinery (100% Verified)',
      group: 'Zimbabwe Civil Contractors & Heavy Equipment Forum',
      vertical: 'machinery',
      text: 'Procuring 3 units 22-ton crawler excavators from AHM Corp for commercial groundworks in Norton. Budget $165,000 USD confirmed. Looking for exclusive supplier allocation with direct tipper haulage support.'
    },
    {
      title: 'Quantitative Feasibility: 1,500 m³ Bulk Cement',
      group: 'Norton & Harare Infrastructure Procurement Group',
      vertical: 'cement',
      text: 'Urgent demand for 1500 m3 Portland cement for Katanga warehouse foundation. Need exact axle load calculations, fleet tipper count, and delivery via Beira corridor. Contact procurement@demashglobal.com or +263784219178.'
    },
    {
      title: 'Deception Trap: Upfront Fee & Short Link (Fraud)',
      group: 'Regional Builders WhatsApp Group',
      vertical: 'hardware',
      text: 'Guaranteed inheritance and free money pool! Send advance payment required via western union wire to claim bonus. Free gift card swap and airtime glitch available at bit.ly/free-tools-claim now.'
    }
  ];

  const fetchAuditHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/v1/sourcing/audit-history');
      const data = await res.json();
      if (data.success && Array.isArray(data.ledger)) {
        setAuditHistory(data.ledger);
      }
    } catch {
      // Handled silently
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchAuditHistory();
  }, []);

  const handleRunHarvestPipeline = async () => {
    setIsProcessing(true);
    setStatusNotice(null);
    setLastAuditResult(null);

    try {
      const res = await fetch('/api/v1/sourcing/harvest-group-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName,
          rawText,
          industryVertical
        })
      });

      const data = await res.json();
      setLastAuditResult(data);

      if (data.success) {
        setStatusNotice('✅ Ingestion validated! Operations research solved and stratagem aligned.');
      } else {
        setStatusNotice('🚨 Bayesian Fraud Sentry intercepted malicious deception markers.');
      }

      await fetchAuditHistory();
    } catch (err: any) {
      setStatusNotice(`Alert: ${err?.message || 'Harvesting pipeline error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const openWhatsAppPitch = (text: string) => {
    const url = `https://wa.me/263784219178?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#070e1c] to-slate-950 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Brain className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Universal Cognitive Sourcing & Anti-Fraud Harvester</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    LIVE PRODUCTION MONOLITH
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dynamic Bayesian Fraud Detection, Quantitative Heavy Freight Feasibility & 48 Laws of Power Stratagem Tuner.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 block text-[10px] uppercase">Workshop Base</span>
              <span className="text-amber-400 font-bold">{COMPANY_INFO.headquarters || 'K17412, Katanga, Norton'}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 block text-[10px] uppercase">Domain Route</span>
              <span className="text-cyan-400 font-bold">{COMPANY_INFO.productionDomain || 'demash-core.onrender.com'}</span>
            </div>
          </div>
        </div>

        {/* 4 Multi-Tier Capability Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bayesian Fraud Sentry</span>
            </div>
            <div className="text-slate-200 font-bold">100-Point Deception Audit</div>
            <div className="text-[10px] text-slate-400">Filters wire traps & spoofed links</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>Operations Research</span>
            </div>
            <div className="text-slate-200 font-bold">Axle Mass & Fleet Solver</div>
            <div className="text-[10px] text-slate-400">Cement, machinery & freight limits</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              <span>48 Laws of Power</span>
            </div>
            <div className="text-slate-200 font-bold">Robert Greene Stratagem</div>
            <div className="text-[10px] text-slate-400">Laws 3, 11, 15 behavioral posture</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Self-Healing Router</span>
            </div>
            <div className="text-slate-200 font-bold">1.2ms Redirect Gateway</div>
            <div className="text-[10px] text-slate-400">Automatic 404 fallback failover</div>
          </div>
        </div>
      </div>

      {/* Multi-Supplier Self-Healing Redirector Valve */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Live Multi-Supplier Self-Healing Redirectors (/gateways/redirect)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
            HEALTHY & VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs font-mono">
          {[
            { key: 'machinery', name: 'AHM Heavy Machinery', token: 'ref=mnpixfvf', color: 'from-amber-500/20 to-orange-500/20' },
            { key: 'hardware', name: 'Electrosales Hardware', token: 'affiliate=demash_global', color: 'from-blue-500/20 to-cyan-500/20' },
            { key: 'realestate', name: 'Property.CoZa Sovereign', token: 'partner=demash_highlands', color: 'from-emerald-500/20 to-teal-500/20' },
            { key: 'cement', name: 'Lafarge PPC Norton', token: 'corridor=norton_direct', color: 'from-slate-500/20 to-zinc-500/20' },
            { key: 'footwear', name: 'Bata Commercial Wholesale', token: 'procure=demash_commercial', color: 'from-rose-500/20 to-red-500/20' }
          ].map((item) => (
            <a
              key={item.key}
              href={`/gateways/redirect?program=${item.key}`}
              target="_blank"
              rel="noreferrer"
              className={`p-3 rounded-xl bg-gradient-to-br ${item.color} border border-slate-800 hover:border-slate-600 transition flex flex-col justify-between gap-2 group cursor-pointer`}
            >
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">{item.key}</span>
                <span className="font-bold text-white text-xs group-hover:text-amber-400 transition">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                <span className="truncate">{item.token}</span>
                <ExternalLink className="w-3 h-3 shrink-0 text-slate-500 group-hover:text-white" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Main Interactive Ingest & Testing Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Presets (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>Unstructured Marketplace Feed Ingest</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Live Production Pipeline</span>
            </div>

            {/* Presets Strip */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase">Production Industry Demand Presets:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setGroupName(preset.group);
                      setIndustryVertical(preset.vertical);
                      setRawText(preset.text);
                    }}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition cursor-pointer space-y-1"
                  >
                    <div className="font-bold text-[11px] text-slate-200 line-clamp-1">{preset.title}</div>
                    <div className="text-[9px] text-slate-400 font-mono capitalize">{preset.vertical}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Source Area / Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  placeholder="e.g. Zimbabwe Civil Contractors"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Industry Vertical</label>
                <select
                  value={industryVertical}
                  onChange={(e) => setIndustryVertical(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="machinery">Heavy Machinery (AHM Corp)</option>
                  <option value="cement">Bulk Cement (Lafarge PPC Norton)</option>
                  <option value="hardware">Commercial Hardware (Electrosales)</option>
                  <option value="footwear">Commercial Footwear (Bata)</option>
                  <option value="realestate">Sovereign Land (Property.CoZa)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium text-xs mb-1">
                Raw Unstructured Commercial Post / Conversation
              </label>
              <textarea
                rows={5}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-amber-500 leading-relaxed"
                placeholder="Paste raw WhatsApp, Facebook, or RFQ marketplace post..."
              />
            </div>

            <button
              onClick={handleRunHarvestPipeline}
              disabled={isProcessing || !rawText.trim()}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold rounded-xl transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs uppercase tracking-wider"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing Bayesian Sentry & Feasibility Engine...</span>
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" />
                  <span>Execute Cognitive Harvest & Anti-Fraud Sentry</span>
                </>
              )}
            </button>

            {statusNotice && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>{statusNotice}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Diagnostic Output Deck (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {lastAuditResult ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  {lastAuditResult.auditRecord?.fraudProfile?.isLegitimate ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                  )}
                  <span>Audit Diagnostics: {lastAuditResult.auditRecord?.auditId}</span>
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  lastAuditResult.auditRecord?.fraudProfile?.isLegitimate
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-950/60 text-red-400 border border-red-500/30'
                }`}>
                  {lastAuditResult.status}
                </span>
              </div>

              {/* Bayesian Fraud Sentry Score Gauge */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase">Bayesian Trust Index:</span>
                  <span className={`font-extrabold text-sm ${
                    lastAuditResult.auditRecord?.fraudProfile?.isLegitimate ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {lastAuditResult.auditRecord?.fraudProfile?.calculatedTrustScore} / 100
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      lastAuditResult.auditRecord?.fraudProfile?.isLegitimate ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${lastAuditResult.auditRecord?.fraudProfile?.calculatedTrustScore}%` }}
                  />
                </div>

                {lastAuditResult.auditRecord?.fraudProfile?.violations?.length > 0 && (
                  <div className="pt-2 text-[11px] font-mono space-y-1">
                    <span className="text-red-400 font-bold block">Violations Flagged:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {lastAuditResult.auditRecord.fraudProfile.violations.map((v: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30 text-[10px]">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantitative Heavy Freight Feasibility */}
              {lastAuditResult.auditRecord?.optimizedMathMetrics && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="text-cyan-400 font-bold uppercase flex items-center justify-between">
                    <span>Operations Research Feasibility Audit</span>
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">Calculated Mass</span>
                      <span className="text-white font-bold text-xs">{lastAuditResult.auditRecord.optimizedMathMetrics.calculatedMassTons} Tons</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">Allocated Heavy Road Units</span>
                      <span className="text-emerald-400 font-bold text-xs">{lastAuditResult.auditRecord.optimizedMathMetrics.allocatedFleetCount} Tippers/Flatbeds</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">Volumetric Efficiency</span>
                      <span className="text-amber-400 font-bold text-xs">{lastAuditResult.auditRecord.optimizedMathMetrics.volumetricUtilization}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">Corridor</span>
                      <span className="text-slate-200 text-[10px] truncate">{lastAuditResult.auditRecord.optimizedMathMetrics.haulageCorridor}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 48 Laws of Power Stratagem Tuner */}
              {lastAuditResult.auditRecord?.strategicProfile && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 font-bold uppercase">Robert Greene Stratagem:</span>
                    <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-500/40 text-[10px] font-bold">
                      {lastAuditResult.auditRecord.strategicProfile.dominantLaw}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    <strong>Tactical Stance:</strong> {lastAuditResult.auditRecord.strategicProfile.stance}
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    "{lastAuditResult.auditRecord.strategicProfile.tacticalSummary}"
                  </p>
                </div>
              )}

              {/* Mandated Closing Pitch */}
              {lastAuditResult.auditRecord?.pitchText && (
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-amber-400 font-mono text-[10px] font-bold uppercase">
                    <span>Mandated Closing Contract Pitch:</span>
                    <span>Direct Escrow Rail</span>
                  </div>
                  <p className="text-slate-200 text-[11px] leading-relaxed font-sans bg-black/40 p-2.5 rounded-lg border border-slate-800">
                    {lastAuditResult.auditRecord.pitchText}
                  </p>
                  <button
                    onClick={() => openWhatsAppPitch(lastAuditResult.auditRecord.pitchText)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Proposal to MD WhatsApp (+263 78 421 9178)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <Cpu className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-300">Awaiting Unstructured Feed Input</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Select an operational preset on the left and click execute to trigger the live Bayesian fraud sentry and heavy freight feasibility model.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Audit History Log */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono">
              Sovereign Sourcing & Audit Ledger History
            </h3>
          </div>
          <button
            onClick={fetchAuditHistory}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-mono cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60 text-[11px]">
                <th className="py-2.5 px-3">Audit ID</th>
                <th className="py-2.5 px-3">Source Group</th>
                <th className="py-2.5 px-3">Vertical</th>
                <th className="py-2.5 px-3">Trust Index</th>
                <th className="py-2.5 px-3">Fleet Units</th>
                <th className="py-2.5 px-3">Stratagem</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No active audits logged yet. Execute a harvest above to record data.
                  </td>
                </tr>
              ) : (
                auditHistory.map((item) => (
                  <tr key={item.auditId} className="hover:bg-slate-900/40 transition">
                    <td className="py-3 px-3 font-bold text-amber-400">{item.auditId}</td>
                    <td className="py-3 px-3 text-slate-300 max-w-[180px] truncate">{item.groupName}</td>
                    <td className="py-3 px-3 capitalize text-slate-400">{item.industryVertical || 'General'}</td>
                    <td className="py-3 px-3 font-bold">
                      <span className={item.fraudProfile?.isLegitimate ? 'text-emerald-400' : 'text-red-400'}>
                        {item.fraudProfile?.calculatedTrustScore ?? 'N/A'}/100
                      </span>
                    </td>
                    <td className="py-3 px-3 text-white">
                      {item.optimizedMathMetrics?.allocatedFleetCount ? `${item.optimizedMathMetrics.allocatedFleetCount} Units` : 'N/A'}
                    </td>
                    <td className="py-3 px-3 text-purple-300 text-[11px]">
                      {item.strategicProfile?.dominantLaw || 'N/A'}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'VALIDATED_AND_MAPPED'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-950/60 text-red-400 border border-red-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
