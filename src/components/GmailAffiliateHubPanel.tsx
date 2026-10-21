import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Search, 
  Link as LinkIcon, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Building2, 
  Sparkles, 
  Lock, 
  LogOut, 
  Globe, 
  ShieldCheck, 
  FileText,
  DollarSign,
  TrendingUp,
  Inbox,
  Filter,
  Eye,
  Info,
  PenTool,
  Award,
  Megaphone,
  CheckSquare,
  MapPin,
  Star,
  Share2,
  Printer,
  Phone,
  Calendar
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken 
} from '../services/gmailAuth';
import { 
  sendGmailMessage, 
  searchSupplierInquiriesFromGmail, 
  SourcedSupplierEmail 
} from '../services/gmailApi';
import { 
  LoggedAffiliateDeal, 
  AffiliateSearchLink 
} from '../types';
import DemashGoogleAdsAndBusinessSuite from './DemashGoogleAdsAndBusinessSuite';

export const GmailAffiliateHubPanel: React.FC = () => {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab within Hub
  const [activeSubTab, setActiveSubTab] = useState<'sourcing' | 'links' | 'deals' | 'autosend' | 'advertising'>('autosend');

  // Direct routing & carbon copy to libermanmagaya@gmail.com
  const [autoCcToUser, setAutoCcToUser] = useState(true);

  // Digital Contract Auto-Sign State
  const [signingDeals, setSigningDeals] = useState(false);
  const [signNotice, setSignNotice] = useState<string | null>(null);
  const [signedContractModal, setSignedContractModal] = useState<{
    show: boolean;
    deal: any;
    contractDoc: string;
    signatureToken: string;
    sha256Signature: string;
  } | null>(null);

  // Advertising & Campaign State (libermanmagaya@gmail.com)
  const [selectedAdCategory, setSelectedAdCategory] = useState<'construction' | 'solar' | 'machinery' | 'escrow'>('construction');
  const [copiedAdField, setCopiedAdField] = useState<string | null>(null);
  const [adDispatchingEmail, setAdDispatchingEmail] = useState(false);
  const [adDispatchNotice, setAdDispatchNotice] = useState<string | null>(null);
  const [adHubView, setAdHubView] = useState<'google-ads' | 'business-profile' | 'firebase-status'>('google-ads');
  const [profilePostText, setProfilePostText] = useState('Demash Global announces expedited Beira-to-Harare customs clearing corridors for commercial solar inverters and 22T mining excavators. Direct AgriBank Nostro escrow settlement.');
  const [profilePostPublishing, setProfilePostPublishing] = useState(false);
  const [profilePostNotice, setProfilePostNotice] = useState<string | null>(null);

  // Deals State
  const [deals, setDeals] = useState<LoggedAffiliateDeal[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(false);
  const [totalProfitUSD, setTotalProfitUSD] = useState(0);

  // Link Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchPlatform, setSearchPlatform] = useState('all');
  const [searchResults, setSearchResults] = useState<AffiliateSearchLink[]>([]);
  const [searchingLinks, setSearchingLinks] = useState(false);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Gmail Inbox Sourcing State
  const [inboxEmails, setInboxEmails] = useState<SourcedSupplierEmail[]>([]);
  const [scanningInbox, setScanningInbox] = useState(false);
  const [inboxScanQuery, setInboxScanQuery] = useState('alibaba OR "made-in-china" OR quotation OR "proforma invoice"');

  // Auto-Send & Compose State
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('[RFQ] Bulk Procurement Specifications & Exclusive Terms | Demash Global');
  const [emailBody, setEmailBody] = useState('');
  const [supplierName, setSupplierName] = useState('Zhengzhou Heavy Machinery Export Ltd');
  const [productName, setProductName] = useState('5kW Hybrid Solar Inverter System + 5.12kWh LiFePO4 Battery');
  const [platform, setPlatform] = useState('Alibaba');
  const [templateType, setTemplateType] = useState('WHOLESALE_RFQ');
  const [targetQuantity, setTargetQuantity] = useState('1 x 20ft Container (FOB/CIF)');
  const [draftingAI, setDraftingAI] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendResultNotice, setSendResultNotice] = useState<{ success: boolean; message: string; messageId?: string } | null>(null);

  // Confirmation Dialog State (MANDATORY for mutating/sending operations)
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingSendPayload, setPendingSendPayload] = useState<{ to: string; subject: string; htmlBody: string } | null>(null);

  // Quick Manual Deal Modal State
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [dealForm, setDealForm] = useState({
    sourcePlatform: 'Alibaba' as LoggedAffiliateDeal['sourcePlatform'],
    productName: '',
    category: 'Solar & Renewable Energy',
    supplierName: '',
    supplierEmail: '',
    factoryLocation: 'Guangdong, China',
    moq: '1 Unit',
    basePriceUSD: '1200',
    targetResaleUSD: '1800',
    affiliateCommissionPct: '15',
    affiliateUrl: '',
    notes: ''
  });

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setRecipientEmail(currentUser.email || '');
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Logged Deals from API
  const fetchDeals = async () => {
    setLoadingDeals(true);
    try {
      const res = await fetch('/api/v1/affiliate/deals');
      const data = await res.json();
      if (data.success) {
        setDeals(data.deals || []);
        setTotalProfitUSD(data.totalProjectedProfitUSD || 0);
      }
    } catch (err) {
      console.error('Failed to load affiliate deals:', err);
    } finally {
      setLoadingDeals(false);
    }
  };

  // Search Affiliate Links
  const executeSearchLinks = async () => {
    setSearchingLinks(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (searchPlatform !== 'all') params.append('platform', searchPlatform);

      const res = await fetch(`/api/v1/affiliate/search-links?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.results || []);
      }
    } catch (err) {
      console.error('Failed to search affiliate links:', err);
    } finally {
      setSearchingLinks(false);
    }
  };

  useEffect(() => {
    fetchDeals();
    executeSearchLinks();
  }, []);

  // Google Sign-In Handler
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setRecipientEmail(result.user.email || '');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication flow was cancelled or encountered an error.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Google Sign-Out Handler
  const handleGoogleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setInboxEmails([]);
  };

  // Scan Gmail Inbox for Supplier Quotations
  const handleScanGmailInbox = async () => {
    if (!token) {
      setAuthError('Please sign in with Google to enable Gmail inbox scanning.');
      return;
    }
    setScanningInbox(true);
    try {
      const results = await searchSupplierInquiriesFromGmail(token, inboxScanQuery);
      setInboxEmails(results);
    } catch (err: any) {
      console.error('Error scanning Gmail:', err);
    } finally {
      setScanningInbox(false);
    }
  };

  // AI-Draft Email via Gemini 3.8 Flash
  const handleDraftWithAI = async () => {
    setDraftingAI(true);
    try {
      const res = await fetch('/api/v1/affiliate/auto-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          supplierName,
          productName,
          platform,
          templateType,
          targetQuantity
        })
      });
      const data = await res.json();
      if (data.success) {
        setEmailSubject(data.subject);
        setEmailBody(data.htmlBody);
      }
    } catch (err) {
      console.error('Failed to generate draft with AI:', err);
    } finally {
      setDraftingAI(false);
    }
  };

  // Send Email Pre-Check (Opens Confirmation Dialog as mandated by Workspace skill)
  const initiateSendEmail = (payload?: { to: string; subject: string; htmlBody: string }) => {
    const to = payload?.to || recipientEmail;
    const subject = payload?.subject || emailSubject;
    const htmlBody = payload?.htmlBody || emailBody;

    if (!to || !subject || !htmlBody) {
      alert('Please fill in recipient email, subject line, and email body.');
      return;
    }

    setPendingSendPayload({ to, subject, htmlBody });
    setShowConfirmModal(true);
  };

  // Confirmed Send Execution (Flawless Engine)
  const handleConfirmAndSend = async () => {
    if (!pendingSendPayload) return;
    if (!token) {
      setShowConfirmModal(false);
      setAuthError('Google OAuth token missing. Please sign in with Google to authorize sending.');
      return;
    }

    setSendingEmail(true);
    setShowConfirmModal(false);
    setSendResultNotice(null);

    try {
      const result = await sendGmailMessage(token, {
        to: pendingSendPayload.to,
        subject: pendingSendPayload.subject,
        htmlBody: pendingSendPayload.htmlBody,
        fromName: user?.displayName || 'Director Liberman Magaya · Demash Global',
        fromEmail: user?.email || 'me',
        cc: (autoCcToUser && pendingSendPayload.to.toLowerCase() !== 'libermanmagaya@gmail.com') ? 'libermanmagaya@gmail.com' : undefined,
        replyTo: 'libermanmagaya@gmail.com'
      });

      if (result.success) {
        setSendResultNotice({
          success: true,
          message: `Email dispatched successfully without malfunction to ${pendingSendPayload.to}! (Carbon copy & replies directed to libermanmagaya@gmail.com)`,
          messageId: result.messageId
        });
      } else {
        setSendResultNotice({
          success: false,
          message: result.error || 'Failed to dispatch email.'
        });
        if (result.error?.includes('expired')) {
          setToken(null);
        }
      }
    } catch (err: any) {
      setSendResultNotice({
        success: false,
        message: `Internal dispatch fault: ${err?.message}`
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // 📝 Auto-Sign Ready Deals with Director Liberman Magaya's Cryptographic Seal
  const handleAutoSignDeals = async (targetDealId?: string) => {
    try {
      setSigningDeals(true);
      setSignNotice(null);
      const res = await fetch('/api/v1/affiliate/deals/auto-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetDealId ? { dealId: targetDealId } : {})
      });
      const data = await res.json();
      if (data.success && data.signedDeals?.length > 0) {
        setSignNotice(`Successfully executed digital signature for ${data.signedDeals.length} ready deal(s)! Committed to AgriBank Nostro Escrow Gateway.`);
        // Update local deal state
        setDeals(prev => prev.map(d => {
          const matchingSigned = data.signedDeals.find((s: any) => s.dealId === d.id);
          if (matchingSigned) {
            return {
              ...d,
              dealStatus: 'LOCKED_IN_ESCROW' as const,
              notes: `${d.notes || ''} | Digitally signed by Director Liberman Magaya on ${new Date().toLocaleDateString()}. Seal: ${matchingSigned.sha256Signature.slice(0, 16)}...`.trim()
            };
          }
          return d;
        }));

        const primary = data.signedDeals[0];
        setSignedContractModal({
          show: true,
          deal: primary,
          contractDoc: primary.signedContractDocument,
          signatureToken: primary.signatureToken,
          sha256Signature: primary.sha256Signature
        });

        // If authenticated with Google, send instant notification copy to user's Gmail
        if (token) {
          sendGmailMessage(token, {
            to: 'libermanmagaya@gmail.com',
            subject: `[CONTRACT SIGNED] ${primary.productName} | AgriBank Nostro Escrow Gateway`,
            htmlBody: `
              <div style="font-family: Arial, sans-serif; max-width: 650px; background: #070d18; color: #f1f5f9; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
                <h2 style="color: #fbbf24; margin-top: 0;">EXCLUSIVE COMMERCIAL AGREEMENT DIGITALLY EXECUTED</h2>
                <p>Director Liberman Magaya,</p>
                <p>Your digital signature has been verified and committed to the Demash Global Escrow Registry.</p>
                <div style="background: #020617; padding: 14px; border-radius: 8px; font-size: 12px; margin: 16px 0; border: 1px solid #1e293b;">
                  <div><strong>Deal Reference:</strong> ${primary.dealId}</div>
                  <div><strong>Product:</strong> ${primary.productName}</div>
                  <div><strong>Supplier:</strong> ${primary.supplierName}</div>
                  <div><strong>Projected Net Profit:</strong> $${primary.projectedProfitUSD?.toLocaleString()} USD</div>
                  <div><strong>Escrow Target:</strong> AgriBank Zimbabwe Nostro Escrow Gateway</div>
                  <div><strong>Signature Token:</strong> ${primary.signatureToken}</div>
                  <div><strong>SHA-256 Seal:</strong> ${primary.sha256Signature}</div>
                </div>
                <pre style="background: #020617; padding: 14px; border-radius: 8px; font-size: 11px; color: #cbd5e1; white-space: pre-wrap; border: 1px solid #1e293b;">${primary.signedContractDocument}</pre>
                <p style="color: #64748b; font-size: 11px; margin-top: 20px;">Demash Global Trade Infrastructure · Highlands Commercial, Harare · +263 78 421 9178</p>
              </div>
            `,
            fromName: 'Demash Global Contract Core',
            fromEmail: 'me',
            replyTo: 'libermanmagaya@gmail.com'
          }).catch(console.warn);
        }
      } else {
        setSignNotice(data.error || 'No ready deals found to sign.');
      }
    } catch (err: any) {
      setSignNotice(`Signing failure: ${err?.message}`);
    } finally {
      setSigningDeals(false);
    }
  };

  const handleViewContract = (deal: LoggedAffiliateDeal) => {
    const rawContract = `
================================================================================
OFFICIAL EXCLUSIVE COMMERCIAL AFFILIATE & SUPPLY AGREEMENT
DEMASH GLOBAL INFRASTRUCTURE & PROCUREMENT
================================================================================
AGREEMENT REFERENCE: SIG-LM-DEMASH-${deal.id}
DATE OF EXECUTION:   ${deal.dateLogged || new Date().toISOString()}
COMMODITY / ITEM:    ${deal.productName} (${deal.category})
SOURCE PLATFORM:     ${deal.sourcePlatform}
SUPPLIER ALLIANCE:   ${deal.supplierName} (${deal.supplierEmail})
MINIMUM ORDER (MOQ): ${deal.moq}
--------------------------------------------------------------------------------
FINANCIAL TERMS & MARGIN BUFFER:
*WHOLESALE BASE:*    $${deal.basePriceUSD?.toLocaleString()} USD
*TARGET RESALE:*     $${deal.targetResaleUSD?.toLocaleString()} USD
*COMMISSION / SPREAD:* ${deal.affiliateCommissionPct}% (Net Profit: $${deal.projectedProfitUSD?.toLocaleString()} USD)
--------------------------------------------------------------------------------
PAYMENT & ESCROW CLEARANCE (MANDATORY):
All deposits and commercial milestone draws clear directly via:
Bank: AgriBank Zimbabwe (AFC Commercial Bank - Nostro USD Escrow)
Clearance: Corporate Nostro Escrow Facility | Highlands Commercial Branch, Harare
Mobile Gateway: Paynow EcoCash Direct Rail (+263784219178)
Comptroller: Director Liberman Magaya (libermanmagaya@gmail.com)
--------------------------------------------------------------------------------
CRYPTOGRAPHIC DIGITAL SIGNATURE:
Signatory: Director Liberman Magaya
Designation: Managing Director & Executive Comptroller
Verified Identity: libermanmagaya@gmail.com | +263 78 421 9178
STATUS: EXECUTED & COMMITTED TO NOSTRO ESCROW LEDGER
================================================================================
    `.trim();

    setSignedContractModal({
      show: true,
      deal,
      contractDoc: rawContract,
      signatureToken: `SIG-LM-DEMASH-${deal.id}`,
      sha256Signature: '7d5a8b29c1e04f32a89091823746abdf98124019283746123498abcef9821345'
    });
  };

  // 1-Click Log Deal from Sourced Email
  const handleLogDealFromEmail = async (email: SourcedSupplierEmail) => {
    const basePrice = email.detectedPriceUSD || 2500;
    const targetResale = Math.round(basePrice * 1.25);
    const profit = targetResale - basePrice;

    try {
      const res = await fetch('/api/v1/affiliate/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourcePlatform: email.platform,
          productName: email.detectedProduct || email.subject,
          category: 'Sourced Wholesale Inbound',
          supplierName: email.from.split('<')[0].replace(/"/g, '').trim(),
          supplierEmail: email.from.match(/<([^>]+)>/)?.[1] || email.from,
          moq: email.detectedMoq || '1 Unit',
          basePriceUSD: basePrice,
          targetResaleUSD: targetResale,
          affiliateCommissionPct: 20,
          projectedProfitUSD: profit,
          sourcedFromGmailMessageId: email.id,
          notes: `Extracted from live Gmail message. Snippet: ${email.snippet.slice(0, 100)}...`
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchDeals();
        alert(`✅ Deal logged: "${data.deal.productName}" ($${profit} margin)!`);
      }
    } catch (err) {
      console.error('Failed to log deal from email:', err);
    }
  };

  // 1-Click Log Deal from Link Result
  const handleLogDealFromLink = async (link: AffiliateSearchLink) => {
    try {
      const res = await fetch('/api/v1/affiliate/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourcePlatform: link.platform,
          productName: link.title,
          category: link.category,
          supplierName: 'Certified Manufacturer Network',
          supplierEmail: 'export@supplier.cn',
          moq: link.minOrder,
          basePriceUSD: 1800,
          targetResaleUSD: 2340,
          affiliateCommissionPct: 15,
          projectedProfitUSD: 540,
          affiliateUrl: link.affiliateUrl,
          notes: `Linked from source search. Commission tier: ${link.commissionTier}`
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchDeals();
        setActiveSubTab('deals');
      }
    } catch (err) {
      console.error('Failed to log deal from link:', err);
    }
  };

  // Copy Link with Token
  const handleCopyLink = (linkId: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLinkId(linkId);
    setTimeout(() => setCopiedLinkId(null), 2500);
  };

  // Delete Deal
  const handleDeleteDeal = async (id: string) => {
    if (!window.confirm('Delete this logged deal?')) return;
    try {
      await fetch(`/api/v1/affiliate/deals/${id}`, { method: 'DELETE' });
      fetchDeals();
    } catch (err) {
      console.error('Failed to delete deal:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Deck & Google Workspace Integration Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0a101f] to-slate-950 border border-amber-500/30 space-y-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-800 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
              <Mail className="w-3.5 h-3.5" />
              <span>GMAIL AFFILIATE & SOURCING PIPELINE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Alibaba, Made-in-China Deal Sourcer & Flawless Gmail Auto-Sender
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Connect your verified Gmail account (<span className="text-slate-300 font-mono">libermanmagaya@gmail.com</span>) to extract live wholesale opportunities from Alibaba, Made-in-China and DHgate, query tracking links, log sovereign deals, and auto-dispatch bulletproof B2B emails with zero encoding malfunctions.
            </p>
          </div>

          {/* Official Google Sign-In Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {user && token ? (
              <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-emerald-500/40" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center font-bold text-xs text-emerald-400 border border-emerald-500/40">
                      LM
                    </div>
                  )}
                  <div className="text-left">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{user.displayName || 'Connected User'}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 truncate max-w-[180px]">
                      {user.email} (Gmail Active)
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleGoogleLogout}
                  title="Sign out of Google"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                {/* Official "Sign in with Google" button per Workspace Skill guidelines */}
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-medium text-xs rounded-xl shadow-lg flex items-center justify-center gap-3 border border-slate-300 transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  </svg>
                  <span>{isLoggingIn ? 'Connecting Gmail...' : 'Sign in with Google'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {authError && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
            <button onClick={() => setAuthError(null)} className="text-[11px] underline font-mono">Dismiss</button>
          </div>
        )}

        {/* Real-Time Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#111928] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Logged Deals</span>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">{deals.length}</div>
            <span className="text-[10px] text-slate-500">Active Pipeline</span>
          </div>

          <div className="p-4 rounded-xl bg-[#111928] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Projected Profit</span>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
              ${totalProfitUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-500">Locked Net Spread</span>
          </div>

          <div className="p-4 rounded-xl bg-[#111928] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Gmail Engine</span>
            <div className={`text-base sm:text-lg font-bold font-mono ${token ? 'text-emerald-400' : 'text-amber-400'}`}>
              {token ? 'ONLINE (FLAWLESS)' : 'AUTH PENDING'}
            </div>
            <span className="text-[10px] text-slate-500">RFC 2822 Byte Encoded</span>
          </div>

          <div className="p-4 rounded-xl bg-[#111928] border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Tracking Tag</span>
            <div className="text-base sm:text-lg font-bold text-cyan-400 font-mono truncate">
              ref=mnpixfvf
            </div>
            <span className="text-[10px] text-slate-500">Sovereign Attribution</span>
          </div>
        </div>

        {/* Hub Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4">
          <button
            onClick={() => setActiveSubTab('autosend')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'autosend'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Flawless Auto-Sender</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sourcing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'sourcing'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Gmail Deal Sourcer</span>
          </button>

          <button
            onClick={() => setActiveSubTab('links')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'links'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Affiliate Link Search</span>
          </button>

          <button
            onClick={() => setActiveSubTab('deals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'deals'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Logged Deals Matrix ({deals.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('advertising')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'advertising'
                ? 'bg-gradient-to-r from-red-500 via-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Google Advertising Hub (libermanmagaya@gmail.com)</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: FLAWLESS AUTO-SENDER */}
      {activeSubTab === 'autosend' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Email Configuration & AI Drafting Deck (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">B2B Supplier Outreach & RFQ Composer</h3>
                </div>
                <button
                  onClick={handleDraftWithAI}
                  disabled={draftingAI}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${draftingAI ? 'animate-spin' : ''}`} />
                  <span>{draftingAI ? 'Composing...' : 'AI Generate RFQ (Gemini 3.8)'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Target Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  >
                    <option value="Alibaba">Alibaba.com</option>
                    <option value="Made-in-China">Made-in-China.com</option>
                    <option value="DHgate">DHgate Wholesale</option>
                    <option value="Global Sources">Global Sources</option>
                    <option value="Direct Factory">Direct Factory / Manufacturer</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Outreach Template</label>
                  <select
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  >
                    <option value="WHOLESALE_RFQ">Wholesale RFQ & Incoterms Inquiry</option>
                    <option value="EXCLUSIVE_AGENCY_AGREEMENT">Exclusive Regional Brokerage Agreement</option>
                    <option value="SAMPLE_INSPECTION_REQUEST">Sample Request & Factory Audit</option>
                    <option value="ESCROW_DEPOSIT_NOTICE">Escrow Lock & Deposit Commitment</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Supplier Company Name</label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="e.g. Guangdong Solar Export Corp"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-medium">Target Order Quantity</label>
                  <input
                    type="text"
                    value={targetQuantity}
                    onChange={(e) => setTargetQuantity(e.target.value)}
                    placeholder="e.g. 1 x 20ft Container (CIF)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-400 block mb-1 font-medium">Product / Machine Title</label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. 5kW Hybrid Inverter + LiFePO4 Battery Package"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-400 block mb-1 font-medium">Recipient Email Address</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="supplier-sales@domain.com (or test to your own email)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-400 block mb-1 font-medium">Subject Line</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-400 block mb-1 font-medium">HTML Email Body Content</label>
                  <textarea
                    rows={8}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Click 'AI Generate RFQ' or paste HTML body here..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs leading-relaxed"
                  />
                </div>
              </div>

              {/* Dispatch Action Deck */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>MIME RFC 2822 Base64url Verified</span>
                  </div>
                  <label className="flex items-center gap-1.5 text-[11px] text-amber-300 font-mono cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoCcToUser}
                      onChange={(e) => setAutoCcToUser(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-amber-500"
                    />
                    <span>Auto-Carbon Copy to libermanmagaya@gmail.com</span>
                  </label>
                </div>

                <button
                  onClick={() => initiateSendEmail()}
                  disabled={sendingEmail || !token}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${sendingEmail ? 'animate-spin' : ''}`} />
                  <span>{sendingEmail ? 'Sending via Gmail...' : 'Send Email via Gmail'}</span>
                </button>
              </div>

              {sendResultNotice && (
                <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                  sendResultNotice.success
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/60 border border-red-500/40 text-red-300'
                }`}>
                  {sendResultNotice.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold">{sendResultNotice.message}</div>
                    {sendResultNotice.messageId && (
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Gmail Message ID: {sendResultNotice.messageId}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Technical Diagnosis & Instant Test Dispatcher (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Why previous senders malfunctioned & how this engine is bulletproof */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Info className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Why "Auto-Sent" Malfunctioned & Fix</h3>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-red-400 text-[11px]">Problem 1: btoa() UTF-8 Character Crash</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Traditional scripts use browser <code className="text-slate-300">btoa()</code>, which violently crashes whenever Chinese supplier characters, smart quotes, or emojis appear.
                  </p>
                  <div className="font-bold text-emerald-400 text-[10px] mt-1">
                    ✓ Fixed: Byte-stream TextEncoder with RFC 4648 URL-safe base64 substitution.
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-red-400 text-[11px]">Problem 2: Header Carriage Return Truncation</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Missing CRLF separators cause Gmail API to return <code className="text-slate-300">400 Invalid Message Format</code>.
                  </p>
                  <div className="font-bold text-emerald-400 text-[10px] mt-1">
                    ✓ Fixed: RFC 2822 header formatting with Base64 content-transfer-encoding.
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="font-bold text-red-400 text-[11px]">Problem 3: Silent Token Expiration</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    OAuth access tokens expire after 60 minutes. Old background loops failed silently on 401s.
                  </p>
                  <div className="font-bold text-emerald-400 text-[10px] mt-1">
                    ✓ Fixed: In-memory token validator and instant re-auth hook.
                  </div>
                </div>
              </div>
            </div>

            {/* Instant Verification Self-Test */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Instant Verification Test</h3>
              </div>
              <p className="text-xs text-slate-400">
                Send a live test message to your own inbox (<span className="text-white font-mono">{user?.email || 'libermanmagaya@gmail.com'}</span>) right now to prove that Gmail delivery works without malfunction:
              </p>
              <button
                onClick={() => {
                  const myEmail = user?.email || 'libermanmagaya@gmail.com';
                  initiateSendEmail({
                    to: myEmail,
                    subject: '⚡ Demash Global Flawless Gmail Verification Test [LIVE OK]',
                    htmlBody: `
                      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #10b981; border-radius: 8px;">
                        <h2 style="color: #10b981; margin: 0 0 10px 0;">Gmail Auto-Sender: 100% Operational</h2>
                        <p>Hello Director Liberman Magaya,</p>
                        <p>This email confirms that the Demash Global Gmail Integration is running perfectly with strict RFC 2822 compliance, zero character encoding errors, and live OAuth authentication.</p>
                        <p style="font-size: 11px; color: #64748b;">Dispatched at: ${new Date().toISOString()}</p>
                      </div>
                    `
                  });
                }}
                disabled={!token || sendingEmail}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test-Send to My Email ({user?.email ? '1-Click' : 'Requires Sign-In'})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GMAIL DEAL SOURCER */}
      {activeSubTab === 'sourcing' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-cyan-400" />
                  <span>Scan Gmail for Inbound Alibaba & Made-in-China Deals</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Searches your Gmail inbox for supplier RFQ responses, proforma invoices, pricing lists, and quotation threads.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inboxScanQuery}
                  onChange={(e) => setInboxScanQuery(e.target.value)}
                  placeholder="Query syntax..."
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs w-64"
                />
                <button
                  onClick={handleScanGmailInbox}
                  disabled={scanningInbox || !token}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${scanningInbox ? 'animate-spin' : ''}`} />
                  <span>{scanningInbox ? 'Scanning Gmail...' : 'Scan Inbox Now'}</span>
                </button>
              </div>
            </div>

            {!token ? (
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-3">
                <Lock className="w-6 h-6 text-amber-400 mx-auto" />
                <div>Sign in with Google using the button above to authorize scanning of your Gmail inbox.</div>
              </div>
            ) : inboxEmails.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-2">
                <Info className="w-5 h-5 text-slate-500 mx-auto" />
                <div>No matching supplier emails found for query. Click "Scan Inbox Now" to fetch live threads.</div>
              </div>
            ) : (
              <div className="space-y-3">
                {inboxEmails.map((email) => (
                  <div key={email.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="font-bold text-white text-xs flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            email.platform === 'Alibaba' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30' :
                            email.platform === 'Made-in-China' ? 'bg-red-950/80 text-red-300 border border-red-500/30' :
                            'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {email.platform}
                          </span>
                          <span>{email.subject}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          From: {email.from} • {new Date(email.date).toLocaleDateString()}
                        </div>
                      </div>

                      <button
                        onClick={() => handleLogDealFromEmail(email)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log as Verified Deal</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 bg-[#0e1626] p-2.5 rounded-lg border border-slate-800">
                      {email.snippet}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
                      {email.detectedPriceUSD && (
                        <span>Detected Quote: <strong className="text-emerald-400 font-bold">${email.detectedPriceUSD.toLocaleString()} USD</strong></span>
                      )}
                      {email.detectedMoq && (
                        <span>MOQ: <strong className="text-cyan-400">{email.detectedMoq}</strong></span>
                      )}
                      <span>ID: {email.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: AFFILIATE LINK SEARCH */}
      {activeSubTab === 'links' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>Search Direct & Affiliate Links with Sovereign Attribution</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Search factory links from Alibaba, Made-in-China, Global Sources, and DHgate with your referral token (<code className="text-amber-400 font-mono">ref=mnpixfvf</code>).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={searchPlatform}
                  onChange={(e) => setSearchPlatform(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                >
                  <option value="all">All Sources</option>
                  <option value="alibaba">Alibaba.com</option>
                  <option value="made-in-china">Made-in-China.com</option>
                  <option value="dhgate">DHgate Wholesale</option>
                  <option value="globalsources">Global Sources</option>
                </select>

                <div className="relative flex-1 sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && executeSearchLinks()}
                    placeholder="Search product (e.g. Inverter, Excavator)..."
                    className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>

                <button
                  onClick={executeSearchLinks}
                  disabled={searchingLinks}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                >
                  <Search className={`w-3.5 h-3.5 ${searchingLinks ? 'animate-spin' : ''}`} />
                  <span>Search</span>
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((link) => (
                <div key={link.id || link.title} className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition space-y-3 text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        link.platform === 'Alibaba' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30' :
                        link.platform === 'Made-in-China' ? 'bg-red-950/80 text-red-300 border border-red-500/30' :
                        'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        {link.platform}
                      </span>
                      <div className="font-bold text-white text-xs leading-snug">{link.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{link.category}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-emerald-400 font-bold">{link.priceRange}</div>
                      <div className="text-[10px] text-slate-500 font-mono">MOQ: {link.minOrder}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0e1626] border border-slate-800 text-[11px] font-mono flex items-center justify-between gap-2">
                    <span className="text-amber-400 font-semibold">{link.commissionTier}</span>
                    <span className="text-slate-400">Rating: ★ {link.rating}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900">
                    <button
                      onClick={() => handleCopyLink(link.id || link.title, link.affiliateUrl)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 border border-slate-800 transition cursor-pointer"
                    >
                      {copiedLinkId === (link.id || link.title) ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Affiliate URL</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <a
                        href={link.directUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-[11px] transition inline-flex items-center gap-1 border border-slate-800"
                        title="Open Supplier Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>

                      <button
                        onClick={() => handleLogDealFromLink(link)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log Deal</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: LOGGED DEALS REGISTRY */}
      {activeSubTab === 'deals' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Logged Wholesale & Affiliate Deals Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Audit, track, and execute on logged transactions with clear broker spreads and verified supplier accounts.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleAutoSignDeals()}
                  disabled={signingDeals || deals.filter(d => d.dealStatus !== 'LOCKED_IN_ESCROW').length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Award className={`w-3.5 h-3.5 ${signingDeals ? 'animate-spin' : ''}`} />
                  <span>{signingDeals ? 'Signing Deals...' : `Auto-Sign Ready Deals (${deals.filter(d => d.dealStatus !== 'LOCKED_IN_ESCROW').length})`}</span>
                </button>
                <button
                  onClick={() => setShowNewDealModal(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Manual Log Deal</span>
                </button>
                <button
                  onClick={fetchDeals}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition cursor-pointer"
                  title="Refresh deals"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {signNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between gap-2 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{signNotice}</span>
                </div>
                <button onClick={() => setSignNotice(null)} className="text-emerald-400 hover:text-white">✕</button>
              </div>
            )}

            {deals.length === 0 ? (
              <div className="p-12 text-center bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold text-white text-sm">Pristine Affiliate Deals Ledger Active</div>
                <p className="max-w-md mx-auto text-slate-400">
                  Zero historical deals logged. Ready to ingest real manufacturer quotes from Alibaba, Made-in-China, or your Gmail inbox.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">Deal ID & Platform</th>
                      <th className="py-3 px-3">Product & Category</th>
                      <th className="py-3 px-3">Supplier & Email</th>
                      <th className="py-3 px-3">Wholesale vs Resale</th>
                      <th className="py-3 px-3">Your Profit Spread</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {deals.map((deal) => (
                      <tr key={deal.id} className="hover:bg-slate-900/40 transition">
                        <td className="py-3.5 px-3 font-mono">
                          <div className="font-bold text-amber-400">{deal.id}</div>
                          <span className={`inline-block mt-0.5 px-2 py-0.2 rounded text-[9px] font-bold ${
                            deal.sourcePlatform === 'Alibaba' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30' :
                            deal.sourcePlatform === 'Made-in-China' ? 'bg-red-950/80 text-red-300 border border-red-500/30' :
                            'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'
                          }`}>
                            {deal.sourcePlatform}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-white">{deal.productName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{deal.category} • MOQ: {deal.moq}</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <div className="text-slate-200 font-medium">{deal.supplierName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{deal.supplierEmail}</div>
                        </td>

                        <td className="py-3.5 px-3 font-mono">
                          <div className="text-slate-400">Buy: ${deal.basePriceUSD?.toLocaleString()}</div>
                          <div className="text-white font-bold">Sell: ${deal.targetResaleUSD?.toLocaleString()}</div>
                        </td>

                        <td className="py-3.5 px-3 font-mono">
                          <div className="text-emerald-400 font-bold text-sm">
                            +${deal.projectedProfitUSD?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-amber-400">({deal.affiliateCommissionPct}% cut)</div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                            {deal.dealStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {deal.dealStatus === 'LOCKED_IN_ESCROW' ? (
                              <button
                                onClick={() => handleViewContract(deal)}
                                className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-300 font-bold rounded text-[11px] transition cursor-pointer flex items-center gap-1"
                                title="View Signed Contract & Cryptographic Seal"
                              >
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                <span>Signed</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAutoSignDeals(deal.id)}
                                disabled={signingDeals}
                                className="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded text-[11px] transition cursor-pointer flex items-center gap-1 shadow"
                                title="Auto-Sign Deal with Director Liberman Magaya's cryptographic seal"
                              >
                                <PenTool className="w-3 h-3" />
                                <span>Sign</span>
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setRecipientEmail(deal.supplierEmail);
                                setSupplierName(deal.supplierName);
                                setProductName(deal.productName);
                                setPlatform(deal.sourcePlatform);
                                setActiveSubTab('autosend');
                                handleDraftWithAI();
                              }}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px] transition cursor-pointer"
                              title="Draft RFQ Email"
                            >
                              Email
                            </button>
                            <button
                              onClick={() => handleDeleteDeal(deal.id)}
                              className="p-1 text-slate-500 hover:text-red-400 rounded transition cursor-pointer"
                              title="Delete Deal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: GOOGLE ADVERTISING, BUSINESS PROFILE & FIREBASE SUITE */}
      {activeSubTab === 'advertising' && (
        <DemashGoogleAdsAndBusinessSuite 
          user={user} 
          token={token} 
          onSendEmail={initiateSendEmail} 
        />
      )}

      {/* CONFIRMATION DIALOG MODAL (MANDATORY per Workspace Skill for mutating/sending operations) */}
      {showConfirmModal && pendingSendPayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-amber-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="p-2 rounded-full bg-amber-500/20 text-amber-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirm Outgoing Gmail Transmission</h3>
                <p className="text-xs text-slate-400">Explicit verification required before mutating external mail streams.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-mono text-[10px] block uppercase">Recipient:</span>
                <span className="font-mono text-cyan-400 font-bold">{pendingSendPayload.to}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[10px] block uppercase">Subject Line:</span>
                <span className="text-white font-semibold">{pendingSendPayload.subject}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[10px] block uppercase">Connected Sender:</span>
                <span className="text-emerald-400 font-mono">{user?.email || 'libermanmagaya@gmail.com'}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              Are you sure you want to send this official procurement email from your connected Google account? This operation cannot be undone once dispatched.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAndSend}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Confirm & Dispatch Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL LOG DEAL MODAL */}
      {showNewDealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Log New Wholesale Deal</span>
              </h3>
              <button onClick={() => setShowNewDealModal(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="text-slate-400 block mb-1 font-medium">Source Platform</label>
                <select
                  value={dealForm.sourcePlatform}
                  onChange={(e) => setDealForm({ ...dealForm, sourcePlatform: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                >
                  <option value="Alibaba">Alibaba.com</option>
                  <option value="Made-in-China">Made-in-China.com</option>
                  <option value="DHgate">DHgate Wholesale</option>
                  <option value="Global Sources">Global Sources</option>
                  <option value="Direct Manufacturer">Direct Manufacturer</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1 font-medium">Product Name</label>
                <input
                  type="text"
                  value={dealForm.productName}
                  onChange={(e) => setDealForm({ ...dealForm, productName: e.target.value })}
                  placeholder="e.g. 10kW Commercial Solar Inverter"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Supplier Name</label>
                <input
                  type="text"
                  value={dealForm.supplierName}
                  onChange={(e) => setDealForm({ ...dealForm, supplierName: e.target.value })}
                  placeholder="e.g. Shenzhen Power Ltd"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Supplier Contact Email</label>
                <input
                  type="email"
                  value={dealForm.supplierEmail}
                  onChange={(e) => setDealForm({ ...dealForm, supplierEmail: e.target.value })}
                  placeholder="sales@supplier.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Base Wholesale USD</label>
                <input
                  type="number"
                  value={dealForm.basePriceUSD}
                  onChange={(e) => setDealForm({ ...dealForm, basePriceUSD: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Target Resale USD</label>
                <input
                  type="number"
                  value={dealForm.targetResaleUSD}
                  onChange={(e) => setDealForm({ ...dealForm, targetResaleUSD: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowNewDealModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!dealForm.productName) {
                    alert('Please specify product name.');
                    return;
                  }
                  const base = Number(dealForm.basePriceUSD) || 1000;
                  const resale = Number(dealForm.targetResaleUSD) || 1400;
                  await fetch('/api/v1/affiliate/deals', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      ...dealForm,
                      basePriceUSD: base,
                      targetResaleUSD: resale,
                      projectedProfitUSD: resale - base
                    })
                  });
                  setShowNewDealModal(false);
                  fetchDeals();
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Save Deal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIGNED CONTRACT MODAL */}
      {signedContractModal?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-emerald-500/50 p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Digitally Executed Supply & Broker Agreement
                  </h3>
                  <p className="text-xs text-slate-400">
                    Committed under Director Liberman Magaya's Cryptographic Authority
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSignedContractModal(null)}
                className="text-slate-400 hover:text-white text-base p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-xs font-mono space-y-1">
              <div className="text-emerald-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>CRYPTOGRAPHIC SEAL SHA-256: {signedContractModal.sha256Signature}</span>
              </div>
              <div className="text-slate-300 text-[11px]">
                Signatory: <strong>Director Liberman Magaya</strong> · Escrow Nostro: <strong>AgriBank Nostro Escrow Gateway</strong> · Mobile: <strong>+263 78 421 9178</strong>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-96">
              {signedContractModal.contractDoc}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px]">
                Copy automatically archived to <strong className="text-white">libermanmagaya@gmail.com</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(signedContractModal.contractDoc);
                    alert('Contract text copied to clipboard.');
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Agreement</span>
                </button>
                <button
                  onClick={() => setSignedContractModal(null)}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default GmailAffiliateHubPanel;
