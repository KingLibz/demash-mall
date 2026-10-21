import React from 'react';
import { Smartphone, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface FloatingMobileAppButtonProps {
  onOpenDownloadModal: () => void;
}

export const FloatingMobileAppButton: React.FC<FloatingMobileAppButtonProps> = ({
  onOpenDownloadModal
}) => {
  const { isInstalled } = usePWAInstall();

  // If already running inside installed standalone PWA, no need to show persistent floating banner
  if (isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6 animate-in slide-in-from-bottom duration-300">
      <button
        onClick={onOpenDownloadModal}
        className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-xs tracking-wide shadow-2xl shadow-amber-500/40 border border-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        aria-label="Download Demash Construction App for all mobile phones"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-950"></span>
        </span>
        <Smartphone className="w-4 h-4 text-slate-950" />
        <span className="font-extrabold uppercase tracking-wider">Download App</span>
        <span className="hidden md:inline text-[10px] bg-slate-950/20 px-2 py-0.5 rounded-full font-mono">
          iOS & Android
        </span>
      </button>
    </div>
  );
};
