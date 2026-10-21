import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Globe2, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  Eye, 
  ArrowRight, 
  MessageSquare, 
  CheckCircle2, 
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Send
} from 'lucide-react';
import { openWhatsAppLink } from '../utils/navigation';

export interface CatalogEstate {
  sku: string;
  title: string;
  category: 'international_real_estate' | 'mining_machinery' | 'construction_aggregate';
  target_url: string;
  unit_price: number;
  inventory_status: 'AVAILABLE' | 'RESERVED' | 'UNDER_OFFER';
  media_url_array: string[];
  target_country_code: 'AE' | 'GB' | 'FR' | 'US' | 'ZA' | 'ZW' | 'GLOBAL';
  rich_community_tier: 'ULTRA_HNW' | 'HIGH_NET_WORTH' | 'STANDARD';
  developer: string;
  location: string;
  tags: string[];
  specs: string[];
  synchronized_at: string;
}

export const GlobalEstateCatalog: React.FC = () => {
  const [estates, setEstates] = useState<CatalogEstate[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [activeImageMap, setActiveImageMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Psychometric Closing Modal State
  const [selectedItemForClosing, setSelectedItemForClosing] = useState<CatalogEstate | null>(null);
  const [clientCustomNeed, setClientCustomNeed] = useState<string>('');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState<boolean>(false);
  const [psychometricResult, setPsychometricResult] = useState<any>(null);

  useEffect(() => {
    fetchCatalog();
  }, [selectedRegion, selectedTier]);

  const fetchCatalog = async () => {
    setIsLoading(true);
    try {
      let url = `/api/v1/alliances/global-catalog?country=${selectedRegion}`;
      if (selectedTier !== 'ALL') url += `&tier=${selectedTier}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.catalog) {
        setEstates(data.catalog);
      }
    } catch (err: any) {
      console.error('Failed to fetch catalog:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncPass = async () => {
    setIsSyncing(true);
    setSyncNotice('Connecting to international developer feeds (Emaar, DAMAC, Knight Frank, Luxury Portfolio)...');
    try {
      const res = await fetch('/api/v1/alliances/global-catalog/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncNotice(`✅ ${data.message}`);
        fetchCatalog();
      }
    } catch (err: any) {
      setSyncNotice(`Sync drop: ${err.message}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  const handlePsychometricCloser = async (estate: CatalogEstate) => {
    setSelectedItemForClosing(estate);
    setClientCustomNeed(`Inquiring about ${estate.title} in ${estate.location}. Looking for fast private acquisition and maximum asset security.`);
    setIsGeneratingPitch(true);
    setPsychometricResult(null);

    try {
      const res = await fetch('/api/v1/alliances/psychometric-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadPayload: {
            countryCode: estate.target_country_code,
            rawContent: `Client interested in ${estate.title} ($${estate.unit_price} USD). Need direct referral hook and verified image routing.`
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setPsychometricResult(data);
      }
    } catch (err: any) {
      console.error('Psychometric error:', err);
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold mb-3">
            <Globe2 className="w-3.5 h-3.5" />
            <span>HIGH-VELOCITY WORLDWIDE PROPERTY & INDUSTRIAL MATRIX</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Global Luxury Estates & Equipment
          </h2>
          <p className="text-slate-400 text-sm max-w-3xl mt-1.5 leading-relaxed">
            Direct institutional referrals across Dubai (AE), London (GB), French Riviera (FR), Beverly Hills (US), Cape Town (ZA), and Zimbabwe (ZW). Real-time tracking baked with verified credentials (<code className="text-cyan-400 font-mono">ref=mnpixfvf</code>).
          </p>
        </div>

        <button
          onClick={handleSyncPass}
          disabled={isSyncing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing Feeds...' : 'Sync Developer Feeds'}</span>
        </button>
      </div>

      {syncNotice && (
        <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 font-mono">
          {syncNotice}
        </div>
      )}

      {/* Regional Country Code Filtering Tabs & Tier Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Regional Country Code Filtering Tabs */}
        <div className="flex flex-wrap bg-[#0b1320] border border-[#16253b] p-1.5 rounded-xl font-mono text-xs shadow-xl gap-1">
          {[
            { id: 'ALL', label: 'GLOBAL METRICS' },
            { id: 'AE', label: 'AE MARKET (DUBAI)' },
            { id: 'GB', label: 'GB MARKET (LONDON)' },
            { id: 'FR', label: 'FR MARKET (RIVIERA)' },
            { id: 'US', label: 'US MARKET (HNW)' },
            { id: 'ZA', label: 'ZA MARKET (CAPE TOWN)' },
            { id: 'ZW', label: 'ZW MARKET (HARARE CORE)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedRegion(tab.id)}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all uppercase tracking-wide cursor-pointer ${
                selectedRegion === tab.id
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Wealth Tier Filtering */}
        <div className="flex items-center gap-2 bg-[#0b1320] border border-[#16253b] p-1 rounded-xl text-xs font-mono">
          <span className="text-slate-500 pl-2 text-[11px]">TIER:</span>
          {['ALL', 'ULTRA_HNW', 'HIGH_NET_WORTH', 'STANDARD'].map(tier => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedTier === tier
                  ? 'bg-slate-800 text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tier.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="py-16 text-center text-xs font-mono text-slate-500">
          INDEXING UNIFIED PROPERTY & MACHINERY ASSET MATRICES...
        </div>
      )}

      {/* Rich Graphic Visual Catalog Grid Layout */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {estates.map(property => {
            const activeImgIdx = activeImageMap[property.sku] || 0;
            const currentImg = property.media_url_array[activeImgIdx] || property.media_url_array[0];

            return (
              <div 
                key={property.sku} 
                className="bg-[#0b1320] border border-[#16253b] rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group flex flex-col justify-between shadow-2xl"
              >
                <div>
                  {/* Image Asset Rendering Canvas Window */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-900 border-b border-[#16253b]">
                    <img 
                      src={currentImg} 
                      alt={property.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 select-none"
                      loading="lazy"
                    />
                    
                    {/* Top Overlay Badges */}
                    <div className="absolute top-3 left-3 bg-slate-950/90 border border-white/10 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md text-amber-400">
                      {property.sku}
                    </div>

                    <div className="absolute top-3 right-3 bg-cyan-950/90 border border-cyan-500/30 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md text-cyan-300">
                      {property.target_country_code} · {property.rich_community_tier.replace(/_/g, ' ')}
                    </div>

                    {/* Multi-Image Gallery Mini Selector */}
                    {property.media_url_array.length > 1 && (
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-black/75 p-1 rounded-lg backdrop-blur-sm">
                        {property.media_url_array.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageMap(prev => ({ ...prev, [property.sku]: idx }))}
                            className={`w-4 h-4 rounded-full border transition-all ${
                              activeImgIdx === idx ? 'bg-cyan-400 border-white scale-110' : 'bg-slate-600 border-transparent hover:bg-slate-400'
                            }`}
                            aria-label={`View photo ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Text Description Content Block */}
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{property.location}</span>
                      </div>
                      <h4 className="text-base font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors mt-1">
                        {property.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Developer: <span className="text-slate-300 font-semibold">{property.developer}</span>
                      </p>
                    </div>

                    {/* Local Technical Bullet Specifications Array */}
                    <div className="space-y-1.5 pt-1">
                      {property.specs.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tags Array */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {property.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-[#121c2c] border border-white/5 px-2 py-0.5 rounded text-slate-400 font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* MSRP Checkout Value Metrics & Direct Action Redirection Links */}
                <div className="p-5 pt-0 border-t border-white/5 space-y-3">
                  <div className="pt-3">
                    <span className="text-[10px] text-slate-500 font-mono block uppercase tracking-wider">
                      Developer Pricing Profile
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-white tracking-tight">
                        ${property.unit_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs font-normal text-slate-400">USD</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Psychometric Outreach Generator Button */}
                    <button
                      onClick={() => handlePsychometricCloser(property)}
                      className="py-2.5 px-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-[11px] font-mono font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Closer Pitch</span>
                    </button>

                    {/* Direct Referral Action Link */}
                    <a
                      href={property.target_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-mono font-bold text-[11px] tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-1 border border-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    >
                      <span>SECURE ACCESS</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* PSYCHOMETRIC INTENT CLOSER MODAL */}
      {selectedItemForClosing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-2xl bg-[#090f1e] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-[#060a14] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    PhD Cognitive Psychometric Closer Engine
                  </h3>
                  <p className="text-xs text-slate-400">
                    Bespoke high-converting sales outreach for {selectedItemForClosing.title}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedItemForClosing(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Asset Card Preview */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <img 
                  src={selectedItemForClosing.media_url_array[0]} 
                  alt="" 
                  className="w-16 h-14 object-cover rounded-lg shrink-0" 
                />
                <div>
                  <div className="font-bold text-white">{selectedItemForClosing.title}</div>
                  <div className="text-slate-400 font-mono mt-0.5">
                    ${selectedItemForClosing.unit_price.toLocaleString()} USD · {selectedItemForClosing.location}
                  </div>
                  <div className="text-cyan-400 font-mono text-[10px] mt-0.5">
                    Target Route: {selectedItemForClosing.target_url}
                  </div>
                </div>
              </div>

              {/* Status or Result */}
              {isGeneratingPitch ? (
                <div className="py-8 text-center space-y-2">
                  <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto" />
                  <div className="text-slate-400 font-mono">
                    PROFILING COGNITIVE PERSONA & SYNTHESIZING NATIVE COPY (GEMINI)...
                  </div>
                </div>
              ) : psychometricResult ? (
                <div className="space-y-4">
                  
                  {/* Persona Detection Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                      Detected Persona: <strong className="text-amber-400 uppercase">{psychometricResult.detectedPersona}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">
                      Native Fluency: <strong className="text-cyan-400">{psychometricResult.nativeLanguageUsed}</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-mono">
                      Prestige Scarcity Mode
                    </span>
                  </div>

                  {/* Generated Script Box */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                      <span>Aggressive Multi-Lingual WhatsApp Copy:</span>
                      <span className="text-emerald-400">Ready to Broadcast</span>
                    </div>
                    <div className="text-white text-xs leading-relaxed font-sans bg-slate-900/60 p-3 rounded-xl border border-slate-800 whitespace-pre-wrap">
                      {psychometricResult.highPressureWhatsAppScript}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        openWhatsAppLink('263784219178', psychometricResult.highPressureWhatsAppScript);
                      }}
                      className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Dispatch to WhatsApp Lead</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(psychometricResult.highPressureWhatsAppScript);
                        alert('Script copied to clipboard!');
                      }}
                      className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono rounded-xl cursor-pointer"
                    >
                      Copy Copy
                    </button>
                  </div>

                </div>
              ) : null}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
