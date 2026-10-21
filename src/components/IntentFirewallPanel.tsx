import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Send, 
  Database, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Link2, 
  Lock, 
  RefreshCw, 
  DollarSign, 
  FileText, 
  Layers,
  ArrowRight,
  Search,
  Mail,
  Zap
} from 'lucide-react';

interface BufferRecord {
  trackingId: string;
  createdAt: string;
  clientProfile: { name: string; contact: string };
  messagePayload: { rawText: string; normalizedIndex: string; extractedUrls: string[] };
  intentScore: number;
  routingStatus: { allocatedTarget: string; emailDispatched: boolean };
}

export const IntentFirewallPanel: React.FC = () => {
  const [clientName, setClientName] = useState('Dr. Tinashe Moyo');
  const [contactDetail, setContactDetail] = useState('+44 7921 883921 / tinashe.moyo@nhstrust.co.uk');
  const [rawMessage, setRawMessage] = useState(
    'I want to procure a 5-ton excavator and earthmover through AHM with an approved budget of $165,000 USD. Ready to place initial order deposit immediately.'
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [bufferRecords, setBufferRecords] = useState<BufferRecord[]>([]);
  const [isLoadingBuffer, setIsLoadingBuffer] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Live client-side score computation for instant visual feedback
  const computeLiveBreakdown = (text: string) => {
    const norm = (text || '').toLowerCase().trim();
    const urlMatches = text.match(/(https?:\/\/[^\s]+)/gi) || [];
    
    const budgetMatch = /(\$|\busd\b|\bdollars?\b|\b\d+(?:[,\.]\d+)?\s*(usd|dollars?|k|m)\b|\$\s*\d+)/i.test(norm);
    const buyingMatch = /\b(buy|order|procure|paynow|deposit|purchas(?:e|ing)|procuring|ordering|paying)\b/i.test(norm);
    const specMatch = /\b(block\s*[cde]|ahm|electrosales|propertycoza|property\.coza|blueprint)\b/i.test(norm);

    const score = (budgetMatch ? 40 : 0) + (buyingMatch ? 30 : 0) + (specMatch ? 30 : 0);

    return {
      normalized: norm,
      urls: urlMatches,
      budgetMatch,
      buyingMatch,
      specMatch,
      score,
      is100: score === 100
    };
  };

  const liveBreakdown = computeLiveBreakdown(rawMessage);

  const fetchBuffer = async () => {
    setIsLoadingBuffer(true);
    try {
      const res = await fetch('/api/v1/firewall/buffer');
      if (res.ok) {
        const data = await res.json();
        setBufferRecords(data.buffer || []);
      }
    } catch (err) {
      console.warn('Failed to fetch firewall buffer:', err);
    } finally {
      setIsLoadingBuffer(false);
    }
  };

  useEffect(() => {
    fetchBuffer();
  }, []);

  const handleEvaluateLead = async () => {
    if (!rawMessage.trim()) return;
    setIsProcessing(true);
    setEvaluationResult(null);

    try {
      const res = await fetch('/api/v1/firewall/evaluate-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          contactDetail,
          clientMessage: rawMessage
        })
      });

      const data = await res.json();
      setEvaluationResult(data);
      // Refresh buffer to reflect newly committed items
      fetchBuffer();
    } catch (err: any) {
      setEvaluationResult({
        success: false,
        error: err.message || 'Network request failed'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const presets = [
    {
      label: 'AHM Heavy Machinery (100% Intent)',
      desc: 'Budget $165,000 USD + procure + AHM supplier tag',
      name: 'Dr. Tinashe Moyo',
      contact: '+44 7921 883921 / tinashe.moyo@nhstrust.co.uk',
      text: 'I want to procure a 5-ton excavator through AHM with an approved budget of $165,000 USD. Ready to place deposit wire today.'
    },
    {
      label: 'Electrosales Hardware & Rebar (100% Intent)',
      desc: 'Budget $45,000 USD + buy + Electrosales tag',
      name: 'Farai Chidzero (Civil Eng)',
      contact: '+263 77 241 9081 / farai@hararedevelopments.co.zw',
      text: 'Need to buy structural reinforcement high-tensile steel from Electrosales with $45,000 USD cash allocated. Paynow / Nostro transfer ready.'
    },
    {
      label: 'Property.CoZa Sovereign Villa (100% Intent)',
      desc: 'Budget $320,000 USD + order + PropertyCoZa tag',
      name: 'Eng. Ruvimbo Maphosa',
      contact: '+27 82 459 1102 / r.maphosa@sandtoncapital.co.za',
      text: 'We are ordering the turnkey luxury villa package via PropertyCoZa for our Shawasha Hills stand. Total budget $320,000 USD ready for escrow deposit.'
    },
    {
      label: 'Partial Intent Lead (70% - Hold in Buffer)',
      desc: 'Budget $85,000 USD + buy (missing supplier/blueprint tag)',
      name: 'Simba Gumbo',
      contact: '+263 71 890 2234 / sgumbo@gmail.com',
      text: 'We have $85,000 USD cash ready to buy building materials for our warehouse construction in Msasa. Please send product catalogue.'
    },
    {
      label: 'Casual Browser (0% Intent - Hold in Buffer)',
      desc: 'Casual inquiry with zero budget and zero buying tags',
      name: 'Anonymous Visitor',
      contact: '+263 78 000 0000 / visitor@yahoo.com',
      text: 'Hello, could you provide general information on your residential building projects in Harare?'
    }
  ];

  const filteredBuffer = bufferRecords.filter(rec => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      rec.clientProfile.name.toLowerCase().includes(q) ||
      rec.clientProfile.contact.toLowerCase().includes(q) ||
      rec.messagePayload.rawText.toLowerCase().includes(q) ||
      rec.trackingId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>CORE INTELLIGENCE ENGINE & 100% INTENT FIREWALL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Sovereign Intent Firewall & Corporate Outbox Valve
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Acts as a strict cryptographic intent firewall for Demash Global Infrastructure & Capital. Calculates real-time mathematical Lead Intent Scores and routes only verified 100% intent leads to external corporate desks via verified Nodemailer SMTP.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>FIREWALL: ARMED (100% STRICT)</span>
            </span>
          </div>
        </div>

        {/* Operating Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
              <Terminal className="w-3.5 h-3.5" />
              <span>1. INPUT NORMALIZATION</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Converts text strings to lowercase, trims whitespace, and uses RegEx to harvest all buried links and reference URLs.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
              <Zap className="w-3.5 h-3.5" />
              <span>2. INTENT SCORING (MAX 100%)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Budget Mention (+40pts) + Buying Keywords (+30pts) + Blueprint/Supplier Tag (+30pts). Strict mathematical summation.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
              <Mail className="w-3.5 h-3.5" />
              <span>3. CONDITIONAL ROUTING</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              100% fires <span className="text-white font-mono">routeVerifiedLeadToSupplier</span> (SMTP Outbox). &lt;100% routes to <span className="text-white font-mono">saveToFirestoreBuffer</span>. 100% Real-Time Execution.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Firewall Testing Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Lead Input & Preset Launcher (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Live Intake Pipeline Scoring Console</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Connected to Node.js / Nodemailer / Gmail SMTP
              </span>
            </div>

            {/* Presets Strip */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Verified Production Procurement Scenarios:
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setClientName(p.name);
                      setContactDetail(p.contact);
                      setRawMessage(p.text);
                      setEvaluationResult(null);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-[11px] text-slate-200 transition-colors text-left cursor-pointer"
                  >
                    <span className="font-semibold text-amber-400">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Client Profile Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Client / Organization Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  placeholder="e.g. Dr. Tinashe Moyo"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Contact Detail (Phone / Email)</label>
                <input
                  type="text"
                  value={contactDetail}
                  onChange={(e) => setContactDetail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  placeholder="+44 7921 ... / email@domain.com"
                />
              </div>
            </div>

            {/* Raw Conversational Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Raw Incoming Conversational Message</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {rawMessage.length} characters
                </span>
              </label>
              <textarea
                rows={4}
                value={rawMessage}
                onChange={(e) => setRawMessage(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono leading-relaxed resize-none"
                placeholder="Paste client inquiry, WhatsApp extract, or lead message..."
              />
            </div>

            {/* Live Score Bar Feedback */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-300">
                  REAL-TIME INTENT PREVIEW:
                </span>
                <span className={`text-sm font-mono font-extrabold px-2.5 py-0.5 rounded-md ${
                  liveBreakdown.is100 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {liveBreakdown.score}% / 100%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    liveBreakdown.is100 ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${liveBreakdown.score}%` }}
                />
              </div>

              {/* Scoring Gates Matrix */}
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1">
                <div className={`p-2 rounded-lg border flex flex-col items-center text-center ${
                  liveBreakdown.budgetMatch 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  <span className="font-bold">+40 PTS</span>
                  <span className="text-[10px]">Financial Budget</span>
                </div>

                <div className={`p-2 rounded-lg border flex flex-col items-center text-center ${
                  liveBreakdown.buyingMatch 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  <span className="font-bold">+30 PTS</span>
                  <span className="text-[10px]">Buying Keywords</span>
                </div>

                <div className={`p-2 rounded-lg border flex flex-col items-center text-center ${
                  liveBreakdown.specMatch 
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  <span className="font-bold">+30 PTS</span>
                  <span className="text-[10px]">Supplier / Blueprint Tag</span>
                </div>
              </div>

              {/* Extracted URLs */}
              {liveBreakdown.urls.length > 0 && (
                <div className="flex items-center gap-2 text-[11px] text-cyan-300 font-mono bg-cyan-950/40 p-2 rounded-lg border border-cyan-500/30">
                  <Link2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Harvested Links: {liveBreakdown.urls.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleEvaluateLead}
              disabled={isProcessing || !rawMessage.trim()}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase font-mono tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                liveBreakdown.is100
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Executing Firewall Verification Engine...</span>
                </>
              ) : liveBreakdown.is100 ? (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute 100% Outbound SMTP Dispatch to Supplier Desk</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Route Below 100% Lead to Firestore Admin Buffer Vault</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Execution Output & Trace Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Execution Telemetry</span>
            </h3>

            {evaluationResult ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Status Badge */}
                <div className={`p-4 rounded-xl border space-y-2 ${
                  evaluationResult.firewallStatus === '100%_INTENT_CLEARED_FOR_DISPATCH'
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase">
                      {evaluationResult.firewallStatus}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/40 font-extrabold">
                      Score: {evaluationResult.evaluation?.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {evaluationResult.firewallStatus === '100%_INTENT_CLEARED_FOR_DISPATCH'
                      ? 'Client cleared the 100% intent threshold. Direct SMTP outbox transmission executed via Gmail App Password credentials.'
                      : 'Lead is under 100% intent. Record placed into Firestore administrative hold buffer to protect supplier tracking metrics.'}
                  </p>
                </div>

                {/* Details Breakdown */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Action Taken:</span>
                    <span className="text-white font-bold">{evaluationResult.actionTaken}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Target Corporate Desk:</span>
                    <span className="text-cyan-400 font-bold">{evaluationResult.evaluation?.targetCorporateDesk}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Target Corporate Email:</span>
                    <span className="text-emerald-400 font-bold">{evaluationResult.evaluation?.targetEmail}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tool Response:</span>
                    <span className="text-amber-400 font-bold">{evaluationResult.result?.toolResponse}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 break-all leading-relaxed">
                    <span className="text-slate-500 block mb-1">Details:</span>
                    {evaluationResult.result?.details}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl bg-slate-950/50 border border-dashed border-slate-800 space-y-2 text-slate-500">
                <Terminal className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs font-mono">Awaiting lead execution trigger...</p>
                <p className="text-[11px] text-slate-600">
                  Select a test scenario or enter client inquiry on the left and fire the engine.
                </p>
              </div>
            )}

            {/* Hardened Parameters Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px] font-mono text-slate-400">
              <div className="text-slate-300 font-bold flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>ENVIRONMENT SECURITY SPECIFICATIONS</span>
              </div>
              <div className="space-y-1 pt-1 text-slate-400">
                <div>• SMTP Host: Gmail Verified Relay (idvd aekx riyg cjij)</div>
                <div>• Sender Trace: libermanmagaya@gmail.com</div>
                <div>• Firestore Path: /demash_global_leads/BUFFER_*</div>
                <div>• Lead Intent Engine: Strict Summation (40/30/30)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Firestore Hold Buffer Ledger Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-400" />
              <span>Public Firestore Hold Buffer Ledger</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Collection: <span className="font-mono text-slate-300">demash_global_leads</span> • Holds leads under 100% intent for administrative review without triggering supplier emails.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search buffer records..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-400 font-mono w-48 sm:w-64"
              />
            </div>
            <button
              onClick={fetchBuffer}
              disabled={isLoadingBuffer}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBuffer ? 'animate-spin text-amber-400' : 'text-slate-400'}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>

        {/* Buffer Records Table */}
        {filteredBuffer.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-slate-500 space-y-2">
            <Database className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs font-mono">No records currently held in the buffer vault.</p>
            <p className="text-[11px] text-slate-600">
              Leads scoring under 100% intent will be isolated and recorded here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Tracking ID</th>
                  <th className="py-2.5 px-3">Client Profile</th>
                  <th className="py-2.5 px-3">Raw Ingest Content</th>
                  <th className="py-2.5 px-3">Intent Score</th>
                  <th className="py-2.5 px-3">Routing Status</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredBuffer.map((rec) => (
                  <tr key={rec.trackingId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 text-amber-400 font-bold whitespace-nowrap">
                      {rec.trackingId}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-semibold text-white">{rec.clientProfile.name}</div>
                      <div className="text-[10px] text-slate-400">{rec.clientProfile.contact}</div>
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate text-slate-300">
                      {rec.messagePayload.rawText}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                        {rec.intentScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {rec.routingStatus.allocatedTarget}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(rec.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
