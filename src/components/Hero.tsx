import React from 'react';
import { TabType } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { 
  ShieldCheck, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  Ruler, 
  Building, 
  Lock, 
  Sparkles,
  MapPin,
  CreditCard
} from 'lucide-react';

interface HeroProps {
  setActiveTab: (tab: TabType) => void;
  onOpenDirectorModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab, onOpenDirectorModal }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Harare Zimbabwe badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-400 text-xs font-mono font-medium shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>DEMASH CONSTRUCTION PVT LTD · HARARE, ZIMBABWE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] font-display">
              Precision Civil <br />
              Engineering & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                Turnkey Construction.
              </span>
            </h1>

            {/* Subhead text from screenshot */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Building exceptional residential residences, commercial structures, and remote diaspora developments across Zimbabwe. Grounded in 1mm setting-out accuracy, zero omitted site consumables, and secure 50/30/20 milestone escrow handovers.
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3.5 sm:items-center">
              <button
                onClick={() => setActiveTab('estimator')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <span>Instant Cost Estimate</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('payments')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <CreditCard className="w-4 h-4 text-emerald-300" />
                <span>Paynow & PayPal Escrow</span>
              </button>

              <button
                onClick={onOpenDirectorModal}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-emerald-400 bg-slate-900/90 hover:bg-slate-800/90 border border-emerald-500/40 hover:border-emerald-400 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Speak with Director Liberman</span>
              </button>
            </div>

            {/* Key engineering hallmarks */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-800/80 text-xs">
              <div className="flex items-start gap-2 text-slate-400">
                <Ruler className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">1mm Tolerances</strong>
                  <span>Laser setting-out & structural integrity</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-400">
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">50/30/20 Escrow</strong>
                  <span>Milestone-gated funds protection</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-400 col-span-2 sm:col-span-1">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">All Zimbabwe Provinces</strong>
                  <span>Harare, Bulawayo, Mutare & beyond</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] overflow-hidden">
                <img 
                  src="/src/assets/images/demash_luxury_residence_1791654545514.jpg" 
                  alt="Demash Construction Modern Luxury Villa in Harare"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Scrim overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Overlay card info */}
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-semibold tracking-wide uppercase text-[11px] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    Turnkey Residential Showcase
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">Harare North</span>
                </div>

                <div className="text-white font-bold text-lg leading-snug">
                  Contemporary Multi-Storey Villa with Infinity Pool
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Turnkey Completed
                  </span>
                  <span>·</span>
                  <span>680m² Built Area</span>
                  <span>·</span>
                  <button 
                    onClick={() => setActiveTab('projects')}
                    className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2 ml-auto"
                  >
                    View Project
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Diaspora Assurance Banner */}
            <div 
              onClick={() => setActiveTab('diaspora')} 
              className="mt-3 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-200">Building from the Diaspora? (UK, SA, USA)</div>
                  <div className="text-slate-400 text-[11px]">Explore our weekly 4K drone reports & escrow safeguards</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
