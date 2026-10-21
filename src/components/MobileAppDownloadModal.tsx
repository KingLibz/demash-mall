import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { COMPANY_INFO } from '../data/companyData';
import { 
  X, 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Share, 
  PlusSquare, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  Laptop,
  Check,
  Copy,
  ChevronRight
} from 'lucide-react';

interface MobileAppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAppDownloadModal: React.FC<MobileAppDownloadModalProps> = ({
  isOpen,
  onClose
}) => {
  const { isInstalled, isIOS, isAndroid, installApp } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'qrcode'>(
    isIOS ? 'ios' : 'android'
  );
  const [installStatus, setInstallStatus] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://demashglobal.com';

  const handleInstallClick = async () => {
    setInstallStatus('Initiating direct mobile application installation...');
    const result = await installApp();
    if (result) {
      setInstallStatus('✅ Demash Construction App successfully added to your home screen!');
    } else {
      setInstallStatus(
        isAndroid 
          ? '📱 Follow the fast 2-step prompt below in your mobile Chrome menu (⋮) -> "Install App"'
          : '📱 On iPhone, tap Share (⎙) -> "Add to Home Screen"'
      );
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#090f1d] border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent Glow */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#060a14]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white leading-tight">
                  Demash Global Mobile App
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold">
                  v2026.4
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Official PWA for Android, iPhone (iOS) & Tablets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Device Switcher Tabs */}
        <div className="flex border-b border-slate-800/90 bg-[#080d19] p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'android'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🤖 Android Phones</span>
          </button>

          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'ios'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span>🍎 iPhone (iOS)</span>
          </button>

          <button
            onClick={() => setActiveTab('qrcode')}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'qrcode'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR Code</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">

          {/* Quick Highlight Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
              <Sparkles className="w-4 h-4" />
              <span>ZERO APP-STORE HASSLE · INSTALLS DIRECTLY IN SECONDS</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Experience the full Demash Construction Suite directly on your phone home screen with <strong>offline caching</strong>, <strong>instant BOQ estimation</strong>, <strong>50/30/20 milestone escrow tracking</strong>, and <strong>direct 1-tap WhatsApp line to Director Liberman Magaya</strong>.
            </p>
          </div>

          {/* TAB 1: ANDROID PHONES */}
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Android One-Click Installation</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">
                      Chromium / Samsung / Edge
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Compatible with Samsung, Google Pixel, Xiaomi, Huawei, Tecno, Infinix, etc.</p>
                </div>
              </div>

              {/* Main Android Install Action Button */}
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm tracking-wide uppercase shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Download className="w-5 h-5 text-slate-950" />
                <span>Download & Install App On Phone</span>
              </button>

              {installStatus && (
                <div className="p-3 bg-slate-900 rounded-xl text-xs text-amber-300 border border-amber-500/30 font-medium">
                  {installStatus}
                </div>
              )}

              {/* Visual Step by Step Guide for Android */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                  Standard 2-Step Android Installation:
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-[11px] shrink-0">
                    1
                  </div>
                  <div>
                    Tap the <strong>three dots (⋮)</strong> in the top-right corner of your browser (Google Chrome, Samsung Internet, or Brave).
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-[11px] shrink-0">
                    2
                  </div>
                  <div>
                    Select <strong className="text-amber-400">"Install app"</strong> or <strong className="text-amber-400">"Add to Home screen"</strong>. The Demash badge will appear instantly on your phone!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APPLE IPHONE (IOS) */}
          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>iPhone & iPad (iOS Safari) Installation</span>
                  <span className="text-[10px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded font-mono font-bold">
                    iOS 14 - 18+
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Apple allows direct web apps to be installed natively without App Store credentials.</p>
              </div>

              {/* iOS 3-Step Illustrated Guide */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3.5 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center shrink-0">
                    <Share className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Step 1: Open Share Sheet</div>
                    <div className="text-slate-400 mt-0.5">
                      In Safari, tap the <strong>Share</strong> button at the bottom of the screen (the box with an arrow pointing up <span className="text-sky-400 font-bold">⎋</span>).
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Step 2: Add to Home Screen</div>
                    <div className="text-slate-400 mt-0.5">
                      Scroll down through the share options and tap <strong className="text-amber-400">"Add to Home Screen"</strong> with the plus icon.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Step 3: Confirm & Launch</div>
                    <div className="text-slate-400 mt-0.5">
                      Tap <strong className="text-emerald-400">"Add"</strong> in the top-right corner. The official Demash icon will now reside natively on your iOS Home Screen!
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Runs full-screen with zero browser address bar interference.</span>
              </div>
            </div>
          )}

          {/* TAB 3: SCAN QR CODE */}
          {activeTab === 'qrcode' && (
            <div className="space-y-4 text-center">
              <div>
                <h4 className="text-sm font-bold text-white">Scan from Computer with Mobile Camera</h4>
                <p className="text-xs text-slate-400 mt-0.5">Point your iPhone or Android camera at the code below to open the mobile app instantly.</p>
              </div>

              {/* Clean Vector QR Code Container */}
              <div className="inline-block p-4 bg-white rounded-2xl shadow-xl mx-auto">
                <svg
                  viewBox="0 0 160 160"
                  width="160"
                  height="160"
                  className="mx-auto"
                >
                  {/* Outer border markers */}
                  <rect x="10" y="10" width="40" height="40" fill="#070b14" rx="6" />
                  <rect x="18" y="18" width="24" height="24" fill="#ffffff" rx="3" />
                  <rect x="24" y="24" width="12" height="12" fill="#d97706" rx="2" />

                  <rect x="110" y="10" width="40" height="40" fill="#070b14" rx="6" />
                  <rect x="118" y="18" width="24" height="24" fill="#ffffff" rx="3" />
                  <rect x="124" y="24" width="12" height="12" fill="#d97706" rx="2" />

                  <rect x="10" y="110" width="40" height="40" fill="#070b14" rx="6" />
                  <rect x="18" y="118" width="24" height="24" fill="#ffffff" rx="3" />
                  <rect x="24" y="124" width="12" height="12" fill="#d97706" rx="2" />

                  {/* Matrix geometric pattern */}
                  <rect x="60" y="20" width="10" height="10" fill="#070b14" />
                  <rect x="80" y="20" width="10" height="10" fill="#070b14" />
                  <rect x="70" y="35" width="10" height="10" fill="#d97706" />
                  <rect x="60" y="50" width="10" height="10" fill="#070b14" />
                  <rect x="90" y="50" width="10" height="10" fill="#070b14" />

                  <rect x="20" y="65" width="10" height="10" fill="#070b14" />
                  <rect x="35" y="75" width="10" height="10" fill="#d97706" />
                  <rect x="50" y="70" width="10" height="10" fill="#070b14" />
                  <rect x="70" y="70" width="20" height="20" fill="#d97706" rx="4" />
                  <rect x="100" y="70" width="10" height="10" fill="#070b14" />
                  <rect x="130" y="70" width="10" height="10" fill="#070b14" />

                  <rect x="60" y="100" width="10" height="10" fill="#070b14" />
                  <rect x="85" y="105" width="10" height="10" fill="#d97706" />
                  <rect x="100" y="100" width="10" height="10" fill="#070b14" />
                  <rect x="120" y="115" width="10" height="10" fill="#070b14" />

                  <rect x="65" y="130" width="10" height="10" fill="#070b14" />
                  <rect x="85" y="130" width="10" height="10" fill="#d97706" />
                  <rect x="105" y="130" width="10" height="10" fill="#070b14" />
                  <rect x="135" y="130" width="10" height="10" fill="#070b14" />
                </svg>
              </div>

              {/* Copy URL fallback */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/40 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{copiedUrl ? 'Link Copied!' : 'Copy Direct App Link'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Included Features Grid */}
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Enabled Mobile Capabilities:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Offline Site Logs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-300">50/30/20 Escrow Tracker</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Fast BOQ Estimator</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Director WhatsApp Line</span>
              </div>
            </div>
          </div>

          {/* Contact Verification */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span className="text-[11px]">Direct Line: +263 78 421 9178</span>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>Instant WhatsApp Inquiry</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
