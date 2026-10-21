import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  FileText, 
  Send, 
  Clock, 
  Landmark, 
  Smartphone, 
  Plus, 
  AlertCircle,
  RotateCw 
} from 'lucide-react';
import { openWhatsAppLink } from '../utils/navigation';

interface DomesticJob {
  id: string;
  country_code: string;
  project_title: string;
  raw_requirements: string;
  estimated_valuation_usd: number;
  procurement_status: string;
}

interface OutsourcedRecord {
  jobId: string;
  projectTitle: string;
  partnerName: string;
  partnerId: string;
  grossValuationUSD: number;
  partnerPayoutUSD: number;
  netBrokerMarginUSD: number;
  payoutPct: number;
  brokerMarginPct: number;
  status: string;
  dispatchedAt: string;
  agreementDocument: string;
}

interface LocalPartner {
  affiliate_id: string;
  company_name: string;
  contact_email: string;
  contact_phone: string;
  contractual_payout_percentage: number;
  retained_broker_cut_percentage: number;
  engineering_tier: string;
}

export const DomesticSubcontractingPipelinePanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [pendingJobs, setPendingJobs] = useState<DomesticJob[]>([]);
  const [history, setHistory] = useState<OutsourcedRecord[]>([]);
  const [partners, setPartners] = useState<LocalPartner[]>([]);
  const [totalRetainedMargin, setTotalRetainedMargin] = useState(0);
  const [totalGrossHandled, setTotalGrossHandled] = useState(0);
  const [selectedAgreement, setSelectedAgreement] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Job Queue Form
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newScope, setNewScope] = useState('');
  const [newValuation, setNewValuation] = useState('32000');

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/domestic-outsource/status');
      const data = await res.json();
      if (data.success) {
        setPendingJobs(data.activePendingJobs || []);
        setHistory(data.outsourcedHistory || []);
        setPartners(data.certifiedPartners || []);
        setTotalRetainedMargin(data.totalRetainedBrokerMarginUSD || 0);
        setTotalGrossHandled(data.totalGrossHandledUSD || 0);
      }
    } catch (err) {
      console.error('Failed to fetch domestic outsource status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleTriggerOutsource = async () => {
    setTriggering(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/v1/domestic-outsource/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message);
        fetchStatus();
      } else {
        setStatusMessage(data.error || 'Trigger completed.');
      }
    } catch (err: any) {
      setStatusMessage(`Fault: ${err?.message}`);
    } finally {
      setTriggering(false);
    }
  };

  const handleQueueJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/domestic-outsource/queue-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: newTitle,
          requirements: newScope,
          estimatedValuationUSD: Number(newValuation)
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowQueueModal(false);
        setNewTitle('');
        setNewScope('');
        fetchStatus();
      }
    } catch (err) {
      console.error('Failed to queue job:', err);
    }
  };

  const handleResetDomesticHistory = async () => {
    try {
      const res = await fetch('/api/v1/domestic-outsource/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setHistory([]);
        setTotalRetainedMargin(0);
        setTotalGrossHandled(0);
        if (data.activePendingJobs) setPendingJobs(data.activePendingJobs);
        setStatusMessage("✅ Domestic outsourcing history purged. All domestic jobs reset to pristine UNASSIGNED state.");
      }
    } catch {
      setHistory([]);
      setTotalRetainedMargin(0);
      setTotalGrossHandled(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0a101f] to-slate-950 border border-amber-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>SOVEREIGN DOMESTIC OUTSOURCING VALVE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Domestic Subcontracting & Hands-Off Profit Split Pipeline
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Traps existing held jobs and inbound Zimbabwean leads. Calculates contractual margin splits, drafts binding legal subcontracts, and delegates on-ground execution to certified Tier-1 partners while retaining net broker margins straight to AgriBank Nostro.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetDomesticHistory}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-red-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-800 hover:border-red-500/40 transition-all cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Reset Ledger</span>
            </button>
            <button
              onClick={() => setShowQueueModal(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Queue New ZW Job</span>
            </button>
            <button
              onClick={handleTriggerOutsource}
              disabled={triggering}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${triggering ? 'animate-spin' : ''}`} />
              <span>{triggering ? 'Delegating on-ground...' : 'Trigger Programmatic Outsource'}</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{statusMessage}</div>
          </div>
        )}

        {/* Real-Time Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#111928] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Retained Net Margin
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
              ${totalRetainedMargin.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-500">Your Locked Hands-Off Profit</span>
          </div>

          <div className="p-4 rounded-xl bg-[#111928] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Gross Valuation Handled
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
              ${totalGrossHandled.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-500">Escrow Locked to AgriBank</span>
          </div>

          <div className="p-4 rounded-xl bg-[#111928] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Daily EcoCash Split Run
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-mono">
              $300.00 <span className="text-xs font-normal text-slate-400">/ day</span>
            </div>
            <span className="text-[10px] text-slate-500">Daily 20:50 PM Automated Release</span>
          </div>

          <div className="p-4 rounded-xl bg-[#111928] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Pending Jobs Queue
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              {pendingJobs.length} <span className="text-xs font-normal text-slate-400">active</span>
            </div>
            <span className="text-[10px] text-slate-500">Programmatic Local Shift</span>
          </div>
        </div>

        {/* Interactive Visual Pipeline Diagram */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
            <span>PIPELINE EXECUTION TOPOLOGY</span>
            <span className="text-amber-400">SUB-SECOND MARGIN BUFFER ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            {/* Step 1 */}
            <div className="p-3.5 rounded-lg bg-[#0e1626] border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                <span>STAGE 1</span>
                <span className="text-amber-400">INGEST</span>
              </div>
              <div className="font-bold text-white">ZW Leads & Held Jobs</div>
              <p className="text-[11px] text-slate-400">Inbound residential, commercial slab, & civil tenders trapped in queue.</p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-lg bg-[#0e1626] border border-cyan-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                <span>STAGE 2</span>
                <span className="text-cyan-400">VALVE</span>
              </div>
              <div className="font-bold text-cyan-300">Cognitive Local Matcher</div>
              <p className="text-[11px] text-slate-400">Gemini Pro analyzes scope, selecting optimal Tier-1 domestic firm.</p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-lg bg-[#0e1626] border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                <span>STAGE 3</span>
                <span className="text-emerald-400">LEGAL</span>
              </div>
              <div className="font-bold text-white">Legal Contract Builder</div>
              <p className="text-[11px] text-slate-400">Generates official subcontract. Locks 18%-20% net margin for Demash.</p>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-lg bg-[#0e1626] border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                <span>STAGE 4</span>
                <span className="text-amber-400">ESCROW</span>
              </div>
              <div className="font-bold text-white">AgriBank Nostro Lock</div>
              <p className="text-[11px] text-slate-400">25% mandatory deposit clears to Nostro Escrow Gateway.</p>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-lg bg-[#0e1626] border border-emerald-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                <span>STAGE 5</span>
                <span className="text-emerald-400">PAYOUT</span>
              </div>
              <div className="font-bold text-emerald-300">Daily 20:50 EcoCash</div>
              <p className="text-[11px] text-slate-400">Paynow driver auto-drops $300.00 USD cash daily to +263784219178.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Ingest Queue vs Outsourced History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Pending Domestic Jobs Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Held Domestic Jobs Queue</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {pendingJobs.length} PENDING
              </span>
            </div>

            {pendingJobs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <div>All held domestic jobs have been programmatically allocated!</div>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingJobs.map((job) => (
                  <div key={job.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-2 text-xs">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-white">{job.project_title}</span>
                      <span className="font-mono text-emerald-400 font-bold shrink-0">
                        ${job.estimated_valuation_usd.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{job.raw_requirements}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
                      <span>ID: {job.id}</span>
                      <span className="text-amber-400 uppercase font-semibold">{job.procurement_status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Certified Tier-1 Partners Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Domestic Contractor Alliance</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">ZW TIER-1</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {partners.map((partner) => (
                <div key={partner.affiliate_id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white">{partner.company_name}</div>
                    <div className="text-[10px] font-mono text-slate-400">{partner.affiliate_id} • {partner.engineering_tier}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono text-emerald-400 font-bold">{partner.contractual_payout_percentage}% Payout</div>
                    <div className="text-[10px] font-mono text-amber-400">{partner.retained_broker_cut_percentage}% Your Margin</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Outsourced Ledger & Dynamic Legal Document (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Outsourced Projects & Retained Margins</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                {history.length} DEPLOYED
              </span>
            </div>

            {history.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <AlertCircle className="w-6 h-6 text-amber-400 mx-auto" />
                <div>No outsourced domestic jobs yet. Click "Trigger Programmatic Outsource" above to shift pending jobs to local partners.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((record) => (
                  <div key={record.jobId} className="p-4 rounded-xl bg-slate-950 border border-emerald-500/20 hover:border-emerald-500/40 transition-all space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white">{record.projectTitle}</div>
                        <div className="text-[11px] text-cyan-400">
                          Assigned Subcontractor: <span className="font-semibold text-white">{record.partnerName}</span> ({record.partnerId})
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 self-start sm:self-center">
                        OPERATIONAL OVERHEAD: 0%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-[#0e1626] border border-slate-800 text-center font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Gross Value</span>
                        <span className="font-bold text-white">${record.grossValuationUSD.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Partner Payout ({record.payoutPct}%)</span>
                        <span className="font-bold text-slate-300">${record.partnerPayoutUSD.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-400 block font-bold">Your Net Margin</span>
                        <span className="font-extrabold text-amber-400">${record.netBrokerMarginUSD.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        onClick={() => setSelectedAgreement(record.agreementDocument)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline cursor-pointer"
                      >
                        View Official Legal Subcontract
                      </button>
                      <button
                        onClick={() => openWhatsAppLink(
                          "+263784219178",
                          `*DEMASH SUBCONTRACT DISPATCH REPORT*\n\nJob: ${record.projectTitle}\nPartner: ${record.partnerName}\nYour Net Margin: $${record.netBrokerMarginUSD.toLocaleString()} USD\nAgriBank Nostro Escrow Gateway`
                        )}
                        className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>WhatsApp Alert</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Legal Agreement Modal */}
      {selectedAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b1120] border border-slate-700 rounded-2xl p-6 w-full max-w-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Demash Global Official Domestic Subcontract Agreement</span>
              </h3>
              <button
                onClick={() => setSelectedAgreement(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-black border border-slate-800 text-[11px] font-mono text-emerald-400/90 whitespace-pre-wrap overflow-y-auto flex-1 leading-relaxed">
              {selectedAgreement}
            </pre>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                Locked to AgriBank Nostro Escrow Gateway
              </span>
              <button
                onClick={() => setSelectedAgreement(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Agreement Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Queue New Job Modal */}
      {showQueueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0c1220] border border-slate-700 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Queue New Domestic Zimbabwean Job</h3>
              <button
                onClick={() => setShowQueueModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQueueJob} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Job / Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ruwa Commercial Foundation & Reinforced Concrete Slab"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Estimated Valuation USD ($) *</label>
                <input
                  type="number"
                  required
                  value={newValuation}
                  onChange={(e) => setNewValuation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Technical Scope / Requirements *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed masonry, earthworks, slab dimensions, or structural specs..."
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-amber-400 block mb-0.5">Automated Outsourcing Rule:</span>
                This job will be automatically analyzed by Gemini Pro, assigned to the top matching local contractor (Masimba, Fossil, Bitumen, or Tarcon), and your ~18%-20% net margin will be secured without job site overhead.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
              >
                Queue Job for Programmatic Outsourcing
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
