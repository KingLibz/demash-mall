import React, { useState } from 'react';
import { SERVICES } from '../data/companyData';
import { 
  Building2, 
  Home, 
  Waves, 
  ShieldCheck, 
  Droplets, 
  Fence, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase,
  Layers
} from 'lucide-react';
import { TabType } from '../types';

interface ServicesSectionProps {
  setActiveTab: (tab: TabType) => void;
  onOpenDirectorModal: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  setActiveTab,
  onOpenDirectorModal
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState(SERVICES[0].id);

  const activeService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  const getIcon = (id: string) => {
    switch (id) {
      case 'turnkey-residential':
        return <Home className="w-5 h-5 text-amber-400" />;
      case 'civil-engineering':
        return <Building2 className="w-5 h-5 text-amber-400" />;
      case 'swimming-pools':
        return <Waves className="w-5 h-5 text-cyan-400" />;
      case 'diaspora-management':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'borehole-solar':
        return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'perimeter-security':
        return <Fence className="w-5 h-5 text-amber-400" />;
      default:
        return <Briefcase className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
      
      {/* Section Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono">
          <Layers className="w-3.5 h-3.5" />
          <span>FULL-SCOPE CIVIL & STRUCTURAL CAPABILITIES</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display">
          Precision Engineering & Turnkey Capabilities
        </h2>
        <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
          From complex geotechnical earthworks on Harare hillsides to bespoke luxury finishes and off-grid solar-water systems. Every contract is backed by 1mm setting-out accuracy and fixed milestone escrow.
        </p>
      </div>

      {/* Services Grid & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Service Selector */}
        <div className="lg:col-span-5 space-y-3">
          {SERVICES.map((srv, idx) => {
            const isSelected = srv.id === selectedServiceId;
            return (
              <button
                key={srv.id}
                onClick={() => setSelectedServiceId(srv.id)}
                className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-950/20'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {getIcon(srv.id)}
                  </div>
                  <div>
                    <div className="text-xs font-mono text-slate-500">0{idx + 1}.</div>
                    <div className="text-sm font-bold text-white leading-snug">
                      {srv.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {srv.tagline}
                    </div>
                  </div>
                </div>

                <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${
                  isSelected ? 'text-amber-400 translate-x-1' : 'text-slate-600'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Service Deep Dive */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          
          <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                Capability Overview
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {activeService.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {activeService.tagline}
              </p>
            </div>
            
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              {getIcon(activeService.id)}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {activeService.description}
          </p>

          {/* Key Deliverables */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Technical Deliverables & Standards
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeService.deliverables.map((del, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed">{del}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hallmark Features */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
              Demash Quality Assurance
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {activeService.features.map((feat, idx) => (
                <span key={idx} className="px-3 py-1 rounded-md bg-slate-900 border border-slate-700 text-xs text-slate-200 font-medium">
                  {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('estimator')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer"
            >
              <span>Calculate Project Cost</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenDirectorModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-emerald-400 bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 rounded-xl transition-all cursor-pointer"
            >
              <span>Speak to Director Liberman</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
