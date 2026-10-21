import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { 
  Globe2, 
  ShieldCheck, 
  Video, 
  Receipt, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  ArrowRight, 
  AlertTriangle, 
  Building, 
  Lock 
} from 'lucide-react';
import { TabType } from '../types';

interface DiasporaPortalProps {
  setActiveTab: (tab: TabType) => void;
  onOpenDirectorModal: () => void;
}

export const DiasporaPortal: React.FC<DiasporaPortalProps> = ({
  setActiveTab,
  onOpenDirectorModal
}) => {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const diasporaMilestones = [
    {
      stage: 'Milestone 1 (50% Escrow)',
      title: 'Site Mobilization, Foundations & Superstructure',
      status: 'Verified Release Upon Slab Cube Test',
      description: 'Site clearance, setting-out with 1mm laser accuracy, deep trench excavations, steel rebar reinforcement cages, casting of structural raft slab, and double-brick masonry to wall-plate level.',
      auditProofs: ['Independent civil engineer slump & cube crushing report', 'Geotagged site drone video', 'Cement & rebar purchase invoices']
    },
    {
      stage: 'Milestone 2 (30% Escrow)',
      title: 'Roof Structure, Sheeting & Wet Trades',
      status: 'Released Upon Weather-Tight Seal',
      description: 'Manufacture and crane installation of certified timber/steel trusses, 0.58mm Chromadek roof sheeting, fascias, internal plumbing and conduit rough-ins, and full interior/exterior plastering.',
      auditProofs: ['Harare City Council roof inspection certificate', 'Weatherproof seal drone flyover', 'Electrical plumbing pressure tests']
    },
    {
      stage: 'Milestone 3 (20% Escrow)',
      title: 'Turnkey Finishes, Glazing & Handover',
      status: 'Released Upon Final Snag Clearance',
      description: 'Porcelain floor tiling, architectural aluminum glazing, custom master kitchen cabinetry, bathroom sanitaryware, solar backup commissioning, swimming pool fill, and final handover of keys.',
      auditProofs: ['Formal defect-free handover certificate', 'Director Liberman video walkthrough', 'Physical keys & warranty package courier']
    }
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
      
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
          <Globe2 className="w-3.5 h-3.5" />
          <span>DIASPORA CAPITAL PROTECTION & ESCROW CHARTER</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
          Building Back Home with Complete Peace of Mind
        </h2>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          Engineered specifically for Zimbabweans resident in the United Kingdom, South Africa, the United States, Australia, and worldwide. Never risk sending lump-sum funds through unverified channels again.
        </p>
      </div>

      {/* The Problem vs Demash Solution Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pain Point */}
        <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-4">
          <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>The Traditional Diaspora Risk</span>
          </div>

          <ul className="text-xs text-slate-300 space-y-2.5">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">✕</span>
              <span>Sending lump-sum cash to family members, often diverted to personal emergencies.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">✕</span>
              <span>Unqualified "briefcase contractors" quoting low prices, skipping cement ratios, causing wall cracks.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">✕</span>
              <span>No independent site inspections or verifiable photographic progress reports.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">✕</span>
              <span>Projects left unfinished at window level for years with money exhausted.</span>
            </li>
          </ul>
        </div>

        {/* Demash Solution */}
        <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>The Demash 4-Pillar Escrow Guarantee</span>
          </div>

          <ul className="text-xs text-slate-300 space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>50/30/20 Milestone Escrow:</strong> Tranches released only when independent structural engineer approves each stage.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Weekly 4K Drone Logs:</strong> Every Friday, receive high-resolution drone footage and 360° photo walkthroughs.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Transparent Procurement Receipts:</strong> Direct manufacturer prices with scanned original receipts for every batch.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Direct Director Line:</strong> Regular WhatsApp video calls directly with Managing Director Liberman Magaya.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Interactive Milestone Escrow Schedule */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-400" />
              <span>Demash 50/30/20 Milestone Escrow Clearance Protocol</span>
            </h3>
            <p className="text-xs text-slate-400">Click each phase to inspect verification hurdles before funds release</p>
          </div>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
            Zero Upfront 100% Risk
          </span>
        </div>

        {/* Phase selector tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {diasporaMilestones.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhaseIndex(idx)}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer ${
                activePhaseIndex === idx
                  ? 'bg-amber-500/15 border-amber-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-mono font-bold text-amber-400">{m.stage}</div>
              <div className="text-sm font-bold text-white mt-1 leading-snug">{m.title}</div>
            </button>
          ))}
        </div>

        {/* Active Phase Details */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
            <h4 className="text-sm font-bold text-white">
              {diasporaMilestones[activePhaseIndex].title}
            </h4>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              {diasporaMilestones[activePhaseIndex].status}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {diasporaMilestones[activePhaseIndex].description}
          </p>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-200">Required Audit Deliverables Before Milestone Drawdown:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {diasporaMilestones[activePhaseIndex].auditProofs.map((proof, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{proof}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400">
            Have a stand or planning to acquire land in Zimbabwe? Get an independent site assessment.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('global-estates')}
              className="flex-1 sm:flex-initial py-2.5 px-4 text-xs font-bold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Explore Global Luxury Portfolios
            </button>
            <button
              onClick={() => setActiveTab('estimator')}
              className="flex-1 sm:flex-initial py-2.5 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Calculate Construction Cost
            </button>
            <button
              onClick={onOpenDirectorModal}
              className="flex-1 sm:flex-initial py-2.5 px-4 text-xs font-semibold text-emerald-400 bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 rounded-xl transition-all cursor-pointer whitespace-nowrap"
            >
              Consult Director Liberman
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
