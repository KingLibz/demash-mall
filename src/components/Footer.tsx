import React from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { TabType } from '../types';
import { 
  Building2, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ArrowUp 
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: TabType) => void;
  onOpenDirectorModal: () => void;
  onOpenBrochureModal: () => void;
  onOpenDownloadModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onOpenDirectorModal,
  onOpenBrochureModal,
  onOpenDownloadModal
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05080f] border-t border-slate-800 text-slate-400 text-xs">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-base font-bold text-white tracking-wider">DEMASH</span>
                  <span className="text-base font-extrabold text-amber-400 tracking-wider">CONSTRUCTION</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Demash Construction Pvt Ltd · Zimbabwe
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Precision Civil Engineering, Turnkey Residential Residences, Commercial Structures, and Luxury Gunite Swimming Pools across Harare and all Zimbabwe provinces.
            </p>

            <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Registered Private Limited Company · Republic of Zimbabwe</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="lg:col-span-3 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Core Divisions
            </div>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveTab('overview')} 
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Overview & Company Profile
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('services')} 
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Turnkey Residential & Commercial
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('pools')} 
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Luxury Gunite & Infinity Swimming Pools
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('estimator')} 
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Instant Project Cost & BOQ Estimator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('blueprints')} 
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  AI Blueprints & Structural Engine
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('diaspora')} 
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Diaspora 50/30/20 Escrow Portal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('global-estates')} 
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors text-left cursor-pointer"
                >
                  Global Luxury Estates & Machinery
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Harare Head Office & Direct Access
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Highlands & Borrowdale Business Corridor, Harare, Zimbabwe</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-white font-mono">
                  {COMPANY_INFO.phoneDisplay}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={COMPANY_INFO.whatsappUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-mono"
                >
                  WhatsApp: {COMPANY_INFO.phoneDisplay} (Direct)
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white">
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenDirectorModal}
                className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Director Line
              </button>
              {onOpenDownloadModal && (
                <button
                  onClick={onOpenDownloadModal}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Download App (iOS/Android)
                </button>
              )}
              <button
                onClick={onOpenBrochureModal}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs transition-colors cursor-pointer"
              >
                Brochure
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-900 bg-[#03050a] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Demash Construction Pvt Ltd. All rights reserved. Registered in Zimbabwe.
          </div>

          <div className="flex items-center gap-4">
            <span>Managing Director: {COMPANY_INFO.director}</span>
            <span>·</span>
            <button 
              onClick={scrollToTop} 
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
