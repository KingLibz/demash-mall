import React from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { 
  X, 
  Download, 
  FileText, 
  Smartphone, 
  CheckCircle2, 
  Printer, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

interface DownloadBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAppModal?: () => void;
}

export const DownloadBrochureModal: React.FC<DownloadBrochureModalProps> = ({
  isOpen,
  onClose,
  onOpenAppModal
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#0c1220] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#070b14]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Demash Digital Portfolio & App
              </h3>
              <p className="text-xs text-slate-400">
                Official Company Profile, Rate Schedules & PWA Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Card 1: Official Corporate Dossier */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">Demash Company Profile 2026</h4>
                  <p className="text-xs text-slate-400">Civil engineering credentials, BOQ methodology & escrow charter</p>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                Verified PDF
              </span>
            </div>

            <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zimbabwe Company Registration & Tax Clearance details</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Standardized 50/30/20 Escrow Milestone Contracts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Luxury Swimming Pool technical specifications & warranty terms</span>
              </li>
            </ul>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handlePrint}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save Dossier as PDF</span>
              </button>
            </div>
          </div>

          {/* Card 2: Install Mobile Web App (PWA) */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-sm font-bold text-white">Install Demash Construction App</h4>
                <p className="text-xs text-slate-400">Add directly to your iPhone or Android home screen</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              No app store download needed. Install Demash directly as a progressive web app to track site milestone progress, receive weekly drone logs, and maintain direct messaging with Director Liberman Magaya.
            </p>

            <div className="p-3 bg-slate-950 rounded-lg text-xs space-y-1.5 text-slate-400 border border-slate-800">
              <div className="font-semibold text-slate-200">Quick 2-Step Install:</div>
              <div>• <strong>iOS Safari:</strong> Tap Share icon <span className="text-white">⎙</span> and select <span className="text-amber-400">"Add to Home Screen"</span>.</div>
              <div>• <strong>Android Chrome:</strong> Tap top menu <span className="text-white">⋮</span> and select <span className="text-amber-400">"Add to Home screen / Install App"</span>.</div>
            </div>

            {onOpenAppModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAppModal();
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                <span>Launch Universal Mobile App Installer</span>
              </button>
            )}
          </div>

          {/* Security & Direct Support */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Harare Registrar of Companies Verified</span>
            </div>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Need help? WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
