import React, { useState } from 'react';
import { COMPANY_INFO } from '../data/companyData';
import { openWhatsAppLink } from '../utils/navigation';
import { 
  X, 
  MessageSquare, 
  Phone, 
  Calendar, 
  Send, 
  CheckCircle, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';

interface DirectorConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectorConnectModal: React.FC<DirectorConnectModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: 'Harare (Borrowdale / Highlands / Glen Lorne)',
    projectType: 'turnkey-residential',
    diasporaCountry: 'none',
    customNotes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const quickMessages = [
    {
      title: 'Diaspora Turnkey Construction',
      text: `Hello Director Liberman, I am based in the diaspora and looking to build a residential home in Zimbabwe with your 50/30/20 escrow protection. Can we connect?`
    },
    {
      title: 'Book a Harare Site Inspection',
      text: `Hello Director Liberman, I have a stand in Harare and would like to schedule a civil engineering site inspection with Demash Construction.`
    },
    {
      title: 'Luxury Swimming Pool Quote',
      text: `Hello Director Liberman, I want to get an estimate for a custom gunite/infinity swimming pool for my property.`
    },
    {
      title: 'Commercial Steel / Civil Works',
      text: `Hello Director Liberman, I have a commercial warehouse / civil engineering project requiring structural estimation.`
    }
  ];

  const handleQuickWhatsApp = (msg: string) => {
    openWhatsAppLink('263784219178', msg);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Also build a custom WhatsApp string
    const message = `*DEMASH SITE CONSULTATION REQUEST*\n*Client:* ${formData.name}\n*Phone:* ${formData.phone}\n*Location/Stand:* ${formData.location}\n*Project Type:* ${formData.projectType}\n*Diaspora Origin:* ${formData.diasporaCountry}\n*Notes:* ${formData.customNotes || 'None'}`;
    
    setTimeout(() => {
      openWhatsAppLink('263784219178', message);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0c1220] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#070b14]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Direct Line: Director Liberman Magaya
              </h3>
              <p className="text-xs text-slate-400">
                Demash Construction Pvt Ltd · Managing Director & Principal Lead
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

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Director Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                Direct Verified Contact
              </div>
              <div className="text-lg font-bold text-white">Liberman Magaya</div>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Harare, Zimbabwe (Highlands & Borrowdale Corridor)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp Directly</span>
              </a>
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </a>
            </div>
          </div>

          {/* 1-Tap Quick Start WhatsApp Prompts */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              1-Tap Instant Inquiries (Direct to Director WhatsApp)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickMessages.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickWhatsApp(item.text)}
                  className="text-left p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 transition-colors group cursor-pointer"
                >
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 flex items-center justify-between">
                    <span>{item.title}</span>
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400 opacity-70 group-hover:opacity-100" />
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    "{item.text}"
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Consultation & Site Visit Booking Form */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Book Site Visit or Custom Consultation</h4>
                <p className="text-xs text-slate-400">Director Liberman reviews every submission personally</p>
              </div>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>

            {submitted ? (
              <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-white">Consultation Request Dispatched</div>
                <div className="text-xs text-slate-300">
                  Director Liberman Magaya has been alerted via WhatsApp. You can also message him directly at {COMPANY_INFO.phoneDisplay}.
                </div>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-amber-400 underline pt-2"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Trevor Moyo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp / Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+263 ... or +44 / +27 ..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Project Suburb / Stand Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Borrowdale Brooke, Highlands, Glen Lorne"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Are You Based in Diaspora?</label>
                    <select
                      value={formData.diasporaCountry}
                      onChange={(e) => setFormData({ ...formData, diasporaCountry: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="none">Resident in Zimbabwe</option>
                      <option value="United Kingdom">United Kingdom (UK)</option>
                      <option value="South Africa">South Africa (RSA)</option>
                      <option value="United States / Canada">United States / Canada</option>
                      <option value="Australia / New Zealand">Australia / NZ</option>
                      <option value="Other Diaspora">Other Overseas</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Specific Requirements / Site Status</label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Stand is ready, need 4-bedroom double storey with 10m swimming pool and borehole..."
                    value={formData.customNotes}
                    onChange={(e) => setFormData({ ...formData, customNotes: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request & Open WhatsApp With Director</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
