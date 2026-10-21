import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  ShieldCheck, 
  Building2, 
  CheckCircle2, 
  Send, 
  RefreshCw, 
  AlertTriangle, 
  FileText, 
  Server, 
  Layers, 
  Lock, 
  DollarSign,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { openWhatsAppLink } from '../utils/navigation';

interface Tender {
  id: string;
  country_code: string;
  project_title: string;
  raw_requirements: string;
  estimated_valuation_usd: number;
  procurement_status: 'UNASSIGNED' | 'ROUTED_DOMESTIC' | 'ALLOCATED_AFFILIATE' | 'ALLOCATED_DOMESTIC_SUBCONTRACT';
  matched_affiliate_id?: string;
  subcontractor_name?: string;
  subcontractor_payout_usd?: number;
  broker_cut_usd?: number;
  agreement_text?: string;
  ingested_at: string;
}

interface Affiliate {
  affiliate_id: string;
  country_code: string;
  company_name: string;
  engineering_tier: string;
  contractual_payout_percentage: number;
  contact_email: string;
  verification_status: string;
}

interface ZimbabweContractor {
  contractorId: string;
  companyName: string;
  headquarters: string;
  specialization: string;
  engineeringTier: string;
  contractualPayoutPercentage: number;
  retainedBrokerCutPercentage: number;
  contactPhone: string;
  contactEmail: string;
  complianceCert: string;
  verificationStatus: string;
}

interface DaemonProcess {
  process: string;
  state: string;
  instances: string;
  portOrTrap: string;
  targetTask: string;
}

interface AdvantagePillar {
  range: string;
  title: string;
  desc: string;
}

export default function CrossBorderProcurementPanel() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [zimContractors, setZimContractors] = useState<ZimbabweContractor[]>([]);
  const [contractorTab, setContractorTab] = useState<'tier1_zimbabwe' | 'international_affiliates'>('tier1_zimbabwe');
  const [daemons, setDaemons] = useState<DaemonProcess[]>([]);
  const [advantages, setAdvantages] = useState<AdvantagePillar[]>([]);
  const [stats, setStats] = useState({
    totalValuationUSD: 4020000,
    totalBrokerCutUSD: 1006750,
    domesticCount: 1,
    domesticSubcontractCount: 1,
    internationalAllocated: 3
  });
  const [loading, setLoading] = useState(true);

  // Form State
  const [projectTitle, setProjectTitle] = useState("Harare Western Arterial Corridor & Concrete Box Culvert Earthworks");
  const [countryCode, setCountryCode] = useState("ZW");
  const [executionMode, setExecutionMode] = useState<'AUTO' | 'DIRECT_INTERNAL' | 'SUBCONTRACT_TIER1'>('SUBCONTRACT_TIER1');
  const [estimatedValuation, setEstimatedValuation] = useState(650000);
  const [rawRequirements, setRawRequirements] = useState("High-volume Grade 40MPa reinforced concrete casting, continuous vibration, heavy stormwater box culvert fabrication, high-volume earth retaining structure.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<any>(null);

  // Quick Direct Deployment modal/valve
  const [selectedZimContractor, setSelectedZimContractor] = useState<ZimbabweContractor | null>(null);
  const [deployingAgreement, setDeployingAgreement] = useState(false);
  const [deployedAgreementResult, setDeployedAgreementResult] = useState<any>(null);

  // International Affiliate Onboarding State
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [onboardForm, setOnboardForm] = useState({
    company_name: '',
    country_code: 'ZW',
    engineering_tier: 'TIER_1_INDUSTRIAL',
    contractual_payout_percentage: 80,
    contact_email: ''
  });
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardSuccessNotice, setOnboardSuccessNotice] = useState<string | null>(null);


  const loadData = async () => {
    try {
      const [tendersRes, affiliatesRes, daemonsRes, zimRes] = await Promise.all([
        fetch('/api/v1/cross-border/tenders'),
        fetch('/api/v1/cross-border/affiliates'),
        fetch('/api/v1/cross-border/cluster-daemons'),
        fetch('/api/v1/cross-border/zimbabwe-contractors')
      ]);

      const tData = await tendersRes.json();
      if (tData.success) {
        setTenders(tData.tenders || []);
        setStats({
          totalValuationUSD: tData.totalValuationUSD,
          totalBrokerCutUSD: tData.totalBrokerCutUSD,
          domesticCount: tData.domesticCount,
          domesticSubcontractCount: tData.domesticSubcontractCount || 0,
          internationalAllocated: tData.internationalAllocated
        });
      }

      const aData = await affiliatesRes.json();
      if (aData.success) {
        setAffiliates(aData.affiliates || []);
      }

      const zData = await zimRes.json();
      if (zData.success) {
        setZimContractors(zData.contractors || []);
      }

      const dData = await daemonsRes.json();
      if (dData.success) {
        setDaemons(dData.processes || []);
        setAdvantages(dData.advantages || []);
      }
    } catch (e) {
      console.error("Failed to load cross-border data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleProcessTender = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessResult(null);

    try {
      const res = await fetch('/api/v1/cross-border/process-tender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode,
          projectTitle,
          rawRequirements,
          estimatedValuationUSD: estimatedValuation,
          executionMode
        })
      });

      const data = await res.json();
      if (data.success) {
        setProcessResult(data);
        loadData();
      }
    } catch (err: any) {
      setProcessResult({ error: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeployDirectAgreement = async (contractor: ZimbabweContractor) => {
    setDeployingAgreement(true);
    setDeployedAgreementResult(null);
    try {
      const res = await fetch('/api/v1/subcontract/deploy-agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: contractor.contractorId,
          projectTitle,
          rawRequirements,
          valuationUSD: estimatedValuation
        })
      });
      const data = await res.json();
      if (data.success) {
        setDeployedAgreementResult(data);
        loadData();
      }
    } catch (err: any) {
      setDeployedAgreementResult({ error: err.message });
    } finally {
      setDeployingAgreement(false);
    }
  };

  return (
    <div className="bg-[#0b1320] border border-[#16253b] rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-6xl mx-auto font-sans text-slate-200 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#16253b] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Globe className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Autonomous Cross-Border Procurement & Fulfillment Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Programmatic Sourcing, Strict Zimbabwe Domestic Execution, Tier-1 Subcontract Matrix (Modules 5133–6132) & Global Allocation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer"
            title="Refresh Registry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wide bg-purple-950/60 border border-purple-500/40 text-purple-300 uppercase">
            SOVEREIGN ARRAY MODULES 5133–6132 ACTIVE
          </span>
        </div>
      </div>

      {/* 5 Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs font-mono">
        <div className="p-3.5 bg-[#060a13] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">TOTAL PIPELINE VALUE</span>
          <span className="text-lg font-bold text-white block">
            ${stats.totalValuationUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-slate-400">USD Valuation</span>
        </div>

        <div className="p-3.5 bg-[#060a13] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">TOTAL DEMASH BROKER CUT</span>
          <span className="text-lg font-bold text-emerald-400 block">
            ${stats.totalBrokerCutUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-emerald-500">AgriBank Nostro Locked</span>
        </div>

        <div className="p-3.5 bg-[#060a13] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">DOMESTIC DIRECT BUILDS</span>
          <span className="text-lg font-bold text-amber-400 block">
            {stats.domesticCount} Direct
          </span>
          <span className="text-[10px] text-amber-500">100% Demash Retained</span>
        </div>

        <div className="p-3.5 bg-[#060a13] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[10px] text-slate-500 uppercase block">TIER-1 SUBCONTRACTS</span>
          <span className="text-lg font-bold text-purple-400 block">
            {stats.domesticSubcontractCount} Allocated
          </span>
          <span className="text-[10px] text-purple-400">Modules 5133–6132</span>
        </div>

        <div className="p-3.5 bg-[#060a13] border border-slate-800 rounded-xl space-y-1 col-span-2 md:col-span-1">
          <span className="text-[10px] text-slate-500 uppercase block">OFFSHORE SUBCONTRACTS</span>
          <span className="text-lg font-bold text-cyan-400 block">
            {stats.internationalAllocated} Allocated
          </span>
          <span className="text-[10px] text-cyan-500">Legal Escrow Dispatched</span>
        </div>
      </div>

      {/* Interactive Sourcing & Matching Valve Form */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1626] border border-indigo-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
              Programmatic Tender Processing & Sourcing Engine (Modules 5133–6132)
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Triple Routing: Direct · Tier-1 Subcontract · Offshore</span>
        </div>

        <form onSubmit={handleProcessTender} className="space-y-3.5 text-xs font-mono">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-5">
              <label className="block text-[10px] text-slate-400 mb-1">Project Tender Title *</label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-400 outline-none"
                placeholder="e.g. Mbudzi Bypass Concrete Pier Works"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] text-slate-400 mb-1">Country Corridor *</label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-400 outline-none"
              >
                <option value="ZW">ZW · Zimbabwe</option>
                <option value="AE">AE · United Arab Emirates (Dubai)</option>
                <option value="GB">GB · United Kingdom (London)</option>
                <option value="US">US · United States (New York)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[10px] text-slate-400 mb-1">Execution Mode *</label>
              <select
                value={executionMode}
                onChange={(e) => setExecutionMode(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-400 outline-none"
              >
                <option value="AUTO">AUTO (Threshold Sentry)</option>
                <option value="SUBCONTRACT_TIER1">TIER-1 SUBCONTRACT (Modules 5133-6132)</option>
                <option value="DIRECT_INTERNAL">DIRECT DEMASH (100% Retained)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] text-slate-400 mb-1">Valuation (USD) *</label>
              <input
                type="number"
                value={estimatedValuation}
                onChange={(e) => setEstimatedValuation(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-400 outline-none"
                placeholder="650000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Raw Engineering Scope & Specifications *</label>
            <textarea
              rows={2}
              value={rawRequirements}
              onChange={(e) => setRawRequirements(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-400 outline-none resize-none font-sans"
              placeholder="Enter technical structural engineering specifications..."
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-slate-400">
              {countryCode === 'ZW' ? (
                executionMode === 'SUBCONTRACT_TIER1' ? (
                  <span className="text-purple-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>Modules 5133–6132: Queries Zimbabwe Tier-1 Registry (Masimba/Fossil/Bitumen/Tarcon), bakes in 17-20% broker margin, locks 25% Nostro deposit to AgriBank.</span>
                  </span>
                ) : executionMode === 'DIRECT_INTERNAL' ? (
                  <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Direct Domestic Build: 100% executed internally by Demash. Zero partner split.</span>
                  </span>
                ) : (
                  <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Auto Threshold: Small projects direct Demash, heavy industrial (&gt;$100k) routes Tier-1 Subcontract.</span>
                  </span>
                )
              ) : (
                <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>International Zone: Matches on-ground affiliate, calculates split, dispatches agreement.</span>
                </span>
              )}
            </span>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating Sourcing Pipeline...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Sourcing Valve</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Processing Result Display */}
        {processResult && processResult.tender && (
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-indigo-400 font-bold uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{processResult.route}</span>
              </span>
              <span className="text-slate-400">Tender ID: {processResult.tender.id}</span>
            </div>

            <p className="text-slate-300 text-xs">
              {processResult.message}
            </p>

            {processResult.agreementText && (
              <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed text-[10px] p-3 bg-black/90 rounded-lg border border-slate-800 max-h-48 overflow-y-auto">
                {processResult.agreementText}
              </pre>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <div className="text-[11px] text-slate-400">
                Broker Cut / Demash Margin: <span className="text-emerald-400 font-bold">${processResult.tender.broker_cut_usd?.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</span> &rarr; AgriBank Nostro <span className="text-white">Nostro Escrow Gateway</span>
              </div>
              <button
                onClick={() => openWhatsAppLink('263784219178', processResult.whatsAppAlert)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Dispatch Alert to Director WhatsApp (+263784219178)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Verified Subcontractor Alliance Registry (Tabbed) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#16253b] pb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setContractorTab('tier1_zimbabwe')}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                contractorTab === 'tier1_zimbabwe'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Certified Zimbabwe Tier-1 Contractors ({zimContractors.length})
            </button>
            <button
              onClick={() => setContractorTab('international_affiliates')}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                contractorTab === 'international_affiliates'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Verified International Affiliates ({affiliates.length})
            </button>
            <button
              onClick={() => setShowOnboardModal(true)}
              className="px-3 py-1.5 text-xs font-mono font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
            >
              <span>+ Onboard Affiliate</span>
            </button>
          </div>
          <span className="text-[10px] font-mono text-purple-400">
            Sovereign Array Modules 5133–6132
          </span>
        </div>

        {/* Success Toast Notice */}
        {onboardSuccessNotice && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center justify-between">
            <span>{onboardSuccessNotice}</span>
            <button onClick={() => setOnboardSuccessNotice(null)} className="text-slate-400 hover:text-white cursor-pointer ml-2">✕</button>
          </div>
        )}

        {/* Onboard Affiliate Modal */}
        {showOnboardModal && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0b1322] border border-emerald-500/40 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <div>
                <h5 className="font-bold text-white text-sm">Onboard New Cross-Border Affiliate / Subcontractor</h5>
                <p className="text-[11px] text-slate-400">Add an international engineering contractor or material broker to Demash Sovereign Network.</p>
              </div>
              <button onClick={() => setShowOnboardModal(false)} className="text-slate-400 hover:text-white font-mono cursor-pointer">✕</button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!onboardForm.company_name) return;
                setIsOnboarding(true);
                try {
                  const res = await fetch('/api/v1/cross-border/affiliates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(onboardForm)
                  });
                  const data = await res.json();
                  if (data.success && data.affiliate) {
                    setAffiliates(prev => [data.affiliate, ...prev]);
                    setOnboardSuccessNotice(`Successfully onboarded: ${data.affiliate.company_name} (${data.affiliate.affiliate_id})`);
                    setContractorTab('international_affiliates');
                    setShowOnboardModal(false);
                    setOnboardForm({
                      company_name: '',
                      country_code: 'ZW',
                      engineering_tier: 'TIER_1_INDUSTRIAL',
                      contractual_payout_percentage: 80,
                      contact_email: ''
                    });
                  } else {
                    // Local fallback
                    const localAff: Affiliate = {
                      affiliate_id: `AFF-${onboardForm.country_code}-${Math.floor(100 + Math.random() * 900)}`,
                      country_code: onboardForm.country_code,
                      company_name: onboardForm.company_name,
                      engineering_tier: onboardForm.engineering_tier,
                      contractual_payout_percentage: Number(onboardForm.contractual_payout_percentage),
                      contact_email: onboardForm.contact_email || 'affiliate@demashglobal.com',
                      verification_status: 'ACTIVE'
                    };
                    setAffiliates(prev => [localAff, ...prev]);
                    setOnboardSuccessNotice(`Affiliate ${localAff.company_name} added to local session.`);
                    setContractorTab('international_affiliates');
                    setShowOnboardModal(false);
                  }
                } catch (err) {
                  console.error('Failed to onboard affiliate:', err);
                } finally {
                  setIsOnboarding(false);
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs"
            >
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Company / Enterprise Name *</label>
                <input
                  type="text"
                  required
                  value={onboardForm.company_name}
                  onChange={(e) => setOnboardForm(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="e.g. Apex Engineering Dubai FZE"
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Jurisdiction / Country Code</label>
                <select
                  value={onboardForm.country_code}
                  onChange={(e) => setOnboardForm(prev => ({ ...prev, country_code: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-white font-mono focus:border-emerald-500 focus:outline-none"
                >
                  <option value="ZW">ZW - Zimbabwe (Domestic Core)</option>
                  <option value="ZA">ZA - South Africa (Durban/JHB Hub)</option>
                  <option value="MZ">MZ - Mozambique (Beira Corridor)</option>
                  <option value="BW">BW - Botswana</option>
                  <option value="AE">AE - United Arab Emirates (Dubai Free Zone)</option>
                  <option value="GB">GB - United Kingdom (Diaspora Hub)</option>
                  <option value="US">US - United States</option>
                  <option value="CN">CN - China (OEM Machinery)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Engineering Accreditation Tier</label>
                <select
                  value={onboardForm.engineering_tier}
                  onChange={(e) => setOnboardForm(prev => ({ ...prev, engineering_tier: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-cyan-400 font-mono focus:border-emerald-500 focus:outline-none"
                >
                  <option value="TIER_1_INDUSTRIAL">TIER_1_INDUSTRIAL (Heavy Infrastructure)</option>
                  <option value="TIER_2_RESIDENTIAL">TIER_2_RESIDENTIAL (Luxury Civil & Pools)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Subcontractor Payout % ({onboardForm.contractual_payout_percentage}%)</label>
                <input
                  type="number"
                  min="50"
                  max="95"
                  value={onboardForm.contractual_payout_percentage}
                  onChange={(e) => setOnboardForm(prev => ({ ...prev, contractual_payout_percentage: Number(e.target.value) }))}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500">Demash Retention: {(100 - onboardForm.contractual_payout_percentage).toFixed(1)}%</span>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Official B2B Contact Email</label>
                <input
                  type="email"
                  value={onboardForm.contact_email}
                  onChange={(e) => setOnboardForm(prev => ({ ...prev, contact_email: e.target.value }))}
                  placeholder="procurement@partner.com"
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOnboardModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOnboarding || !onboardForm.company_name}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 cursor-pointer"
                >
                  {isOnboarding ? 'Onboarding...' : 'Onboard Certified Affiliate'}
                </button>
              </div>
            </form>
          </div>
        )}


        {contractorTab === 'tier1_zimbabwe' && (
          <div className="overflow-x-auto w-full rounded-xl border border-[#16253b]">
            <table className="w-full text-left font-mono text-xs text-slate-400">
              <thead>
                <tr className="border-b border-[#16253b] bg-[#070c16] text-slate-500 text-[10px] uppercase tracking-wider">
                  <th className="py-3 pl-3">Tier-1 Contractor Node</th>
                  <th className="py-3">Specialization</th>
                  <th className="py-3">Accreditation</th>
                  <th className="py-3 text-center">Contractor Split</th>
                  <th className="py-3 text-right">Demash Broker Cut</th>
                  <th className="py-3 pr-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#090f1a]">
                {zimContractors.map((c) => (
                  <tr key={c.contractorId} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 pl-3 font-sans font-bold text-slate-200">
                      {c.companyName}
                      <div className="text-[9px] text-slate-500 font-mono font-normal mt-0.5">
                        {c.contractorId} · {c.headquarters} · {c.contactPhone}
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-300 text-[11px] font-sans max-w-xs">{c.specialization}</td>
                    <td className="py-3.5 text-purple-400 font-bold text-[10px]">{c.complianceCert}</td>
                    <td className="py-3.5 text-center text-slate-300 font-bold">{c.contractualPayoutPercentage}%</td>
                    <td className="py-3.5 text-right font-bold text-emerald-400">
                      {c.retainedBrokerCutPercentage}% Margin
                    </td>
                    <td className="py-3.5 text-right pr-3">
                      <button
                        onClick={() => handleDeployDirectAgreement(c)}
                        disabled={deployingAgreement}
                        className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold transition cursor-pointer"
                      >
                        Deploy Agreement
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {contractorTab === 'international_affiliates' && (
          <div className="overflow-x-auto w-full rounded-xl border border-[#16253b]">
            <table className="w-full text-left font-mono text-xs text-slate-400">
              <thead>
                <tr className="border-b border-[#16253b] bg-[#070c16] text-slate-500 text-[10px] uppercase tracking-wider">
                  <th className="py-3 pl-3">Affiliate Partner Profile</th>
                  <th className="py-3">Region</th>
                  <th className="py-3">Engineering Tier</th>
                  <th className="py-3 text-center">Subcontractor Split</th>
                  <th className="py-3 text-right">Demash Retention</th>
                  <th className="py-3 pr-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#090f1a]">
                {affiliates.map((a) => (
                  <tr key={a.affiliate_id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 pl-3 font-sans font-bold text-slate-200">
                      {a.company_name}
                      <div className="text-[9px] text-slate-500 font-mono font-normal mt-0.5">
                        {a.affiliate_id} · {a.contact_email}
                      </div>
                    </td>
                    <td className="py-3.5 font-bold text-white">{a.country_code}</td>
                    <td className="py-3.5 text-cyan-400 font-bold">{a.engineering_tier}</td>
                    <td className="py-3.5 text-center text-slate-300 font-bold">{a.contractual_payout_percentage}%</td>
                    <td className="py-3.5 text-right font-bold text-emerald-400">
                      {(100 - a.contractual_payout_percentage).toFixed(1)}% Cut
                    </td>
                    <td className="py-3.5 text-right pr-3">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                        {a.verification_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Deployed Agreement Modal Receipt */}
        {deployedAgreementResult && (
          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/50 space-y-3 font-mono text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
              <span className="text-purple-300 font-bold uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Programmatic Subcontract Agreement Deployed: {deployedAgreementResult.agreementId}</span>
              </span>
              <button
                onClick={() => setDeployedAgreementResult(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed text-[10px] p-3 bg-black/90 rounded-lg border border-purple-500/30 max-h-52 overflow-y-auto">
              {deployedAgreementResult.agreementText}
            </pre>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-purple-500/30">
              <div className="text-[11px] text-slate-300">
                Broker Margin: <strong className="text-emerald-400">${deployedAgreementResult.brokerCutUSD?.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</strong> | 25% Nostro Deposit: <strong className="text-amber-400">${deployedAgreementResult.depositUSD?.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</strong> &rarr; AgriBank <strong className="text-white">Nostro Escrow Gateway</strong>
              </div>
              <button
                onClick={() => openWhatsAppLink('263784219178', deployedAgreementResult.whatsAppAlert)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Forward to Director WhatsApp (+263784219178)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Worldwide Project Tenders Tracking Ledger */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Worldwide Project Tenders Ledger (PostgreSQL: worldwide_project_tenders)
          </h4>
          <span className="text-[10px] font-mono text-slate-500">{tenders.length} Ingested Contracts</span>
        </div>

        <div className="space-y-2.5">
          {tenders.map((t) => (
            <div key={t.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{t.project_title}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-slate-800 text-amber-400 font-bold">
                    {t.country_code}
                  </span>
                  <span className="text-slate-500 text-[10px]">{t.id}</span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans line-clamp-1">
                  {t.raw_requirements}
                </p>
                {t.subcontractor_name && (
                  <div className="text-[10px] text-cyan-400">
                    Assigned Subcontractor: {t.subcontractor_name}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0 text-right">
                <div>
                  <div className="text-[10px] text-slate-500">Valuation: ${t.estimated_valuation_usd.toLocaleString()} USD</div>
                  <div className="font-bold text-emerald-400 text-xs">
                    Demash Cut: ${t.broker_cut_usd?.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded text-[9px] font-bold border ${
                  t.procurement_status === 'ROUTED_DOMESTIC'
                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-400'
                    : t.procurement_status === 'ALLOCATED_DOMESTIC_SUBCONTRACT'
                    ? 'bg-purple-950/60 border-purple-500/40 text-purple-300'
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                }`}>
                  {t.procurement_status === 'ALLOCATED_DOMESTIC_SUBCONTRACT' ? 'TIER-1 SUBCONTRACT' : t.procurement_status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cloud Daemon Node Process Cluster Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Full Cluster Operational Management Matrix (Cloud Daemons)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">6 DAEMONS UNTHROTTLED</span>
        </div>

        <div className="overflow-x-auto w-full rounded-xl border border-[#16253b]">
          <table className="w-full text-left font-mono text-xs text-slate-400">
            <thead>
              <tr className="border-b border-[#16253b] bg-[#070c16] text-slate-500 text-[10px] uppercase tracking-wider">
                <th className="py-2.5 pl-3">Cloud Daemon Node Process</th>
                <th className="py-2.5">Cluster State</th>
                <th className="py-2.5">Instances</th>
                <th className="py-2.5">Port / Trap</th>
                <th className="py-2.5 pr-3">Background Target Task</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#090f1a] text-[11px]">
              {daemons.map((d, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 pl-3 font-bold text-white">{d.process}</td>
                  <td className="py-2.5 text-emerald-400 font-bold">{d.state}</td>
                  <td className="py-2.5 text-slate-300">{d.instances}</td>
                  <td className="py-2.5 text-amber-400 font-bold">{d.portOrTrap}</td>
                  <td className="py-2.5 pr-3 text-slate-400 text-[10px] font-sans">{d.targetTask}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Production Engine Telemetry Blueprint Pillars */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Live Production Engine Telemetry Blueprint (Advantages 133–5132)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          {advantages.map((adv, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold text-[11px]">{adv.title}</span>
                <span className="text-[9px] bg-slate-800 text-cyan-400 px-2 py-0.5 rounded font-mono">
                  {adv.range}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                {adv.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
