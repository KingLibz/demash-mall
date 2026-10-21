import React, { useState } from 'react';
import { ProposalRecord } from '../types';
import { PROPOSALS_LEDGER } from '../data/executiveData';
import { COMPANY_INFO } from '../data/companyData';
import { openWhatsAppLink } from '../utils/navigation';
import { 
  FileText, 
  Plus, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Search, 
  Building2, 
  Download,
  Sparkles,
  Truck,
  Cpu,
  DollarSign,
  Layers,
  ExternalLink,
  Activity
} from 'lucide-react';

export const ProposalDispatch: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalRecord[]>(() => {
    const saved = localStorage.getItem('DEMASH_PROPOSALS');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* default */ }
    }
    return PROPOSALS_LEDGER;
  });
  const [filterQuery, setFilterQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Multi-Stage Autonomous Deal Proposer State
  const [showAutonomousModal, setShowAutonomousModal] = useState(false);
  const [isGeneratingDeal, setIsGeneratingDeal] = useState(false);
  const [autonomousDeal, setAutonomousDeal] = useState<any>(null);
  const [dealNotice, setDealNotice] = useState<string | null>(null);

  const [dealForm, setDealForm] = useState({
    clientName: 'Dr. Tendai M. (UK Diaspora)',
    clientContact: '+44 7911 123456',
    clientLocation: 'Borrowdale Brooke, Harare',
    projectScope: 'Turnkey Civil Infrastructure & Compact Hydraulic Excavation',
    equipmentSku: 'AHM-NW-A1',
    estimatedValuation: 28500
  });

  const [form, setForm] = useState({
    clientName: '',
    location: '',
    scope: '',
    totalUsd: 180000,
    phone: '',
    diasporaOrigin: ''
  });

  const filtered = proposals.filter((p) => 
    p.clientName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ProposalRecord = {
      id: `DEM-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: form.clientName,
      location: form.location,
      scope: form.scope,
      totalUsd: Number(form.totalUsd),
      stage: 'Dispatched',
      milestones: {
        m1_50: Math.round(Number(form.totalUsd) * 0.5),
        m2_30: Math.round(Number(form.totalUsd) * 0.3),
        m3_20: Math.round(Number(form.totalUsd) * 0.2)
      },
      phone: form.phone,
      diasporaOrigin: form.diasporaOrigin || undefined,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [created, ...proposals];
    setProposals(updated);
    localStorage.setItem('DEMASH_PROPOSALS', JSON.stringify(updated));
    setShowModal(false);

    const msg = `*DEMASH CONSTRUCTION OFFICIAL PROPOSAL [${created.id}]*\n*Client:* ${created.clientName}\n*Location:* ${created.location}\n*Scope:* ${created.scope}\n*Total Value:* $${created.totalUsd.toLocaleString()} USD\n*Escrow 50/30/20 Tranches:*\n- Milestone 1 (50%): $${created.milestones.m1_50.toLocaleString()}\n- Milestone 2 (30%): $${created.milestones.m2_30.toLocaleString()}\n- Milestone 3 (20%): $${created.milestones.m3_20.toLocaleString()}\n\nDirector Liberman Magaya (+263 78 421 9178) · Demash Construction Pvt Ltd.`;
    openWhatsAppLink('263784219178', msg);
  };

  const handleRunAutonomousDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingDeal(true);
    setDealNotice(null);

    try {
      const res = await fetch('/api/v1/autonomous/propose-deal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealForm)
      });
      const data = await res.json();
      if (data.success && data.proposal) {
        setAutonomousDeal(data.proposal);
        setDealNotice(`Deal ${data.proposal.dealId} formulated! Total Earned Commissions: $${data.proposal.financialSummary.totalDemashProfitEarnedUSD.toFixed(2)} USD.`);

        // Append to local ledger
        const pRecord: ProposalRecord = {
          id: data.proposal.dealId,
          clientName: data.proposal.client.name,
          location: data.proposal.client.location,
          scope: data.proposal.client.scope,
          totalUsd: data.proposal.financialSummary.grossContractValuationUSD,
          stage: 'Dispatched',
          milestones: {
            m1_50: Math.round(data.proposal.financialSummary.grossContractValuationUSD * 0.5),
            m2_30: Math.round(data.proposal.financialSummary.grossContractValuationUSD * 0.3),
            m3_20: Math.round(data.proposal.financialSummary.grossContractValuationUSD * 0.2)
          },
          phone: data.proposal.client.contact,
          date: new Date().toISOString().split('T')[0]
        };
        const updated = [pRecord, ...proposals];
        setProposals(updated);
        localStorage.setItem('DEMASH_PROPOSALS', JSON.stringify(updated));
      } else {
        setDealNotice(`Notice: ${data.error || 'Failed to compute deal.'}`);
      }
    } catch (err: any) {
      setDealNotice(`Error: ${err.message}`);
    } finally {
      setIsGeneratingDeal(false);
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono">
            <FileText className="w-3.5 h-3.5" />
            <span>OFFICIAL DEMASH CONTRACT ENGINE</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight font-display">
            Automated Proposal Dispatch & Live Tracking
          </h2>
          <p className="text-slate-400 text-xs max-w-2xl">
            Live client contract proposals, 50/30/20 escrow milestones, and automated multi-stage commission pipelines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowAutonomousModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-md border border-cyan-400/30"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Automate Multi-Stage Deal & Commission</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Client Proposal</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Total Pipeline (USD)</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
            ${proposals.reduce((sum, p) => sum + p.totalUsd, 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Active Contracts</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Active Proposals</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1">
            {proposals.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">In Ledger</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Escrow Funded</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
            {proposals.filter(p => p.stage === 'Escrow Funded' || p.stage === 'Active Build').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Protected Funds</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400">Setting-Out Accuracy</div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
            1mm
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Laser Alignment</div>
        </div>
      </div>

      {/* Search & Ledger */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client name, suburb, or proposal ID..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono bg-slate-950/60">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Scope</th>
                  <th className="py-3.5 px-4">Total USD</th>
                  <th className="py-3.5 px-4">50/30/20 Escrow Handover</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Dispatch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-amber-400">
                      {item.id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-white">{item.clientName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{item.phone}</div>
                      {item.diasporaOrigin && (
                        <div className="text-[10px] text-emerald-400">✈ {item.diasporaOrigin}</div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {item.location}
                    </td>
                    <td className="py-4 px-4 max-w-xs text-slate-300">
                      {item.scope}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-white">
                      ${item.totalUsd.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                      <div>M1 (50%): ${item.milestones.m1_50.toLocaleString()}</div>
                      <div>M2 (30%): ${item.milestones.m2_30.toLocaleString()}</div>
                      <div>M3 (20%): ${item.milestones.m3_20.toLocaleString()}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold ${
                        item.stage === 'Escrow Funded'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : item.stage === 'Active Build'
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.stage}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          const msg = `*DEMASH CONTRACT UPDATE [${item.id}]*\n*Client:* ${item.clientName}\n*Total Value:* $${item.totalUsd.toLocaleString()} USD\n*Stage:* ${item.stage}\n*Milestone Breakdown:*\n- 50% ($${item.milestones.m1_50.toLocaleString()}) Foundation & Slab\n- 30% ($${item.milestones.m2_30.toLocaleString()}) Roof & Plaster\n- 20% ($${item.milestones.m3_20.toLocaleString()}) Turnkey Key Handover\n\nDirector Liberman Magaya (+263 78 421 9178)`;
                          openWhatsAppLink('263784219178', msg);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/30 font-semibold cursor-pointer transition-colors"
                      >
                        WhatsApp
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0c1220] border border-slate-700 rounded-2xl p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Draft & Dispatch Client Proposal</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tendai Chikore"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Location / Stand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Glen Lorne Stand 88"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Contract Total USD ($) *</label>
                  <input
                    type="number"
                    required
                    value={form.totalUsd}
                    onChange={(e) => setForm({ ...form, totalUsd: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Scope of Works *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4-Bedroom Contemporary Villa + 10m Lap Pool"
                  value={form.scope}
                  onChange={(e) => setForm({ ...form, scope: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Client Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+263 ... or +44 ..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Diaspora Location</label>
                  <input
                    type="text"
                    placeholder="e.g. London, UK"
                    value={form.diasporaOrigin}
                    onChange={(e) => setForm({ ...form, diasporaOrigin: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
              >
                Dispatch Proposal on WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Multi-Stage Autonomous Deal Proposal Modal */}
      {showAutonomousModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-3xl w-full p-6 space-y-5 my-8 shadow-2xl font-mono text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <h3 className="text-base font-bold text-white font-sans">
                    Autonomous Multi-Stage Deal & Commission Engine
                  </h3>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Automated in real life: Client Sourcing ➔ Supplier Sourcing (AHM ref=mnpixfvf / Tier-1) ➔ Logistics Haulage ➔ Commission at Every Stage.
                </p>
              </div>
              <button 
                onClick={() => setShowAutonomousModal(false)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleRunAutonomousDeal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Stage 1: Client Name</label>
                  <input
                    type="text"
                    required
                    value={dealForm.clientName}
                    onChange={(e) => setDealForm({ ...dealForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Client WhatsApp Line</label>
                  <input
                    type="text"
                    required
                    value={dealForm.clientContact}
                    onChange={(e) => setDealForm({ ...dealForm, clientContact: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Project Site Location</label>
                  <input
                    type="text"
                    required
                    value={dealForm.clientLocation}
                    onChange={(e) => setDealForm({ ...dealForm, clientLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Estimated Gross Valuation (USD)</label>
                  <input
                    type="number"
                    required
                    value={dealForm.estimatedValuation}
                    onChange={(e) => setDealForm({ ...dealForm, estimatedValuation: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Project Scope & Demand Vertical</label>
                <input
                  type="text"
                  required
                  value={dealForm.projectScope}
                  onChange={(e) => setDealForm({ ...dealForm, projectScope: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Stage 2: Equipment Sourcing (AHM Corp)</label>
                  <select
                    value={dealForm.equipmentSku}
                    onChange={(e) => setDealForm({ ...dealForm, equipmentSku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-300 font-mono"
                  >
                    <option value="AHM-NW-A1">AHM Compact Hydraulic Mini Excavator 1.2T (15% Commission)</option>
                    <option value="AHM-MINI-EX-02">AHM Heavy Duty Mini Digger 2.0 Ton (15% Commission)</option>
                    <option value="AHM-TRACK-LOADER-85">AHM Track Loader 850kg (15% Commission)</option>
                    <option value="AHM-DUMP-HT-15">AHM 4WD Mini Site Dumper 1.5 Ton (15% Commission)</option>
                    <option value="AHM-GEN-HYBRID-30">AHM Industrial 30kVA Silent Generator (15% Commission)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Stage 3: Logistics Corridor</label>
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                    Norton Logistics Base ➔ {dealForm.clientLocation || 'Borrowdale'} (Demash Fleet)
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isGeneratingDeal}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isGeneratingDeal ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Calculating Multi-Stage Commissions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Formulate Intelligent Deal & Calculate Commissions</span>
                  </>
                )}
              </button>
            </form>

            {/* Generated Deal Output Deck */}
            {autonomousDeal && (
              <div className="space-y-4 pt-3 border-t border-slate-800">
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-sm">
                      DEAL LOCKED: {autonomousDeal.dealId}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-bold">
                      Intent Score: {autonomousDeal.client.intentScore}% (Ready)
                    </span>
                  </div>

                  {/* Multi-Stage Commission Table */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">STAGE 1: MOBILIZATION</span>
                      <span className="text-white font-bold">${autonomousDeal.financialSummary.stage1ClientDepositCommissionUSD.toFixed(2)} USD</span>
                      <span className="text-slate-500 block text-[9px]">25% Nostro Lock</span>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">STAGE 2: AHM COMMISSION</span>
                      <span className="text-emerald-400 font-bold">${autonomousDeal.financialSummary.stage2SupplierCommissionUSD.toFixed(2)} USD</span>
                      <span className="text-emerald-500 block text-[9px]">15% ref=mnpixfvf</span>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">STAGE 3: HAULAGE PROFIT</span>
                      <span className="text-cyan-300 font-bold">${autonomousDeal.financialSummary.stage3LogisticsCommissionUSD.toFixed(2)} USD</span>
                      <span className="text-slate-500 block text-[9px]">{autonomousDeal.logistics.calculatedDistanceKm} km Norton Fleet</span>
                    </div>

                    <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-500/40">
                      <span className="text-emerald-300 block text-[10px] font-bold">TOTAL DEMASH PROFIT</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        ${autonomousDeal.financialSummary.totalDemashProfitEarnedUSD.toFixed(2)} USD
                      </span>
                      <span className="text-slate-400 block text-[9px]">All Stages Realized</span>
                    </div>
                  </div>

                  {/* Linked Paynow & WhatsApp Actions */}
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">Paynow Multi-Currency Gateway Rail:</span>
                      <span className="text-amber-400 font-bold">txt.co.zw (Ref: 65593919) / ZimPropel</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => openWhatsAppLink('263784219178', autonomousDeal.proposalDispatches.whatsAppPitchText)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch to Director WhatsApp (+263784219178)</span>
                      </button>

                      <a
                        href={autonomousDeal.financialSummary.paynowCheckoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Paynow Checkout Link</span>
                      </a>
                    </div>
                  </div>

                  <pre className="p-3 rounded bg-black/60 text-emerald-400 text-[10px] whitespace-pre-wrap max-h-48 overflow-y-auto border border-emerald-500/20">
                    {autonomousDeal.proposalDispatches.whatsAppPitchText}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
