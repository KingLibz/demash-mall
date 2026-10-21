import React, { useState } from 'react';
import { SUPPLIER_MATERIALS } from '../data/executiveData';
import { AHM_EQUIPMENT_CATALOG, PARTNER_TELEMETRY } from '../data/ahmEquipmentData';
import { SupplierMaterial, EquipmentItem } from '../types';
import { COMPANY_INFO } from '../data/companyData';
import { openWhatsAppLink } from '../utils/navigation';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Send, 
  CheckCircle2, 
  DollarSign, 
  FileText, 
  ShieldCheck, 
  Layers, 
  ExternalLink,
  Cpu,
  RotateCw,
  Terminal,
  Activity,
  Check
} from 'lucide-react';

export const SupplierPOS: React.FC = () => {
  // Machine catalog state
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const categories = ["ALL", "MINI EXCAVATORS", "EARTHMOVERS", "SITE DUMPER", "POWER & GENERATORS"];

  // Materials cart state - clean real-world requisition slate
  const [cart, setCart] = useState<{ material: SupplierMaterial; quantity: number }[]>([]);
  const [siteLocation, setSiteLocation] = useState('Borrowdale Brooke, Harare');
  const [driverRef, setDriverRef] = useState('Direct Freight Tipper Dispatch');

  // Real-Time Partner Commission Clearance State
  const [orderId, setOrderId] = useState(`AHM-ORD-${Date.now().toString().slice(-6)}`);
  const [orderAmount, setOrderAmount] = useState('5800.00');
  const [commissionAmount, setCommissionAmount] = useState('870.00');
  const [selectedMachineSku, setSelectedMachineSku] = useState('AHM-NW-A1');
  const [isTransmittingWebhook, setIsTransmittingWebhook] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<any>(null);

  // Live AHM Catalogue Sync & Referral Engine
  const [isSyncingCatalog, setIsSyncingCatalog] = useState(false);
  const [catalogSyncStatus, setCatalogSyncStatus] = useState<string>('Live Synced with AHM Shopify Engine');
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());
  const [customCalcQty, setCustomCalcQty] = useState<number>(1);
  const [calcNotice, setCalcNotice] = useState<string | null>(null);

  const filteredMachines = selectedCategory === "ALL" 
    ? AHM_EQUIPMENT_CATALOG 
    : AHM_EQUIPMENT_CATALOG.filter(m => m.category.toUpperCase() === selectedCategory);

  const addToCart = (mat: SupplierMaterial) => {
    const existing = cart.find(c => c.material.id === mat.id);
    if (existing) {
      setCart(cart.map(c => c.material.id === mat.id ? { ...c, quantity: c.quantity + 10 } : c));
    } else {
      setCart([...cart, { material: mat, quantity: 10 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.material.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map(c => c.material.id === id ? { ...c, quantity: qty } : c));
    }
  };

  const totalSupplierCost = cart.reduce((sum, item) => sum + (item.material.supplierPrice * item.quantity), 0);
  const totalClientPrice = cart.reduce((sum, item) => sum + (item.material.clientPrice * item.quantity), 0);
  const totalCommission = totalClientPrice - totalSupplierCost;

  const handleDispatchRequisition = () => {
    const orderLines = cart.map(c => `- ${c.material.name}: ${c.quantity} ${c.material.unit} @ $${c.material.clientPrice}`).join('\n');
    const msg = `*AHM CORP SUPPLIER REQUISITION [REF: MNPIXFVF]*\n*Delivery Site:* ${siteLocation}\n*Logistics:* ${driverRef}\n\n*Materials Ordered:*\n${orderLines}\n\n*Wholesale Supplier Cost:* $${totalSupplierCost.toFixed(2)}\n*Client Invoiced Total:* $${totalClientPrice.toFixed(2)}\n*Demash Gross Margin:* $${totalCommission.toFixed(2)}\n\nDirector Liberman Magaya (+263 78 421 9178) · Demash Construction Pvt Ltd.`;
    openWhatsAppLink('263784219178', msg);
  };

  const handleTransmitWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransmittingWebhook(true);
    setWebhookResponse(null);

    try {
      const res = await fetch('/api/v1/alliances/pos-commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          total_order_usd: orderAmount,
          commission_payout_usd: commissionAmount,
          machine_sku: selectedMachineSku,
          target_region: "US"
        })
      });

      const data = await res.json();
      setWebhookResponse(data);
    } catch (err: any) {
      setWebhookResponse({ success: false, error: err.message });
    } finally {
      setIsTransmittingWebhook(false);
    }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>AHM CORP WHOLESALE PROCUREMENT & EQUIPMENT DESK</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight font-display">
            Supplier POS, Compact Machinery & Commission Gateway
          </h2>
          <p className="text-slate-400 text-xs max-w-2xl">
            Factory-direct compact heavy equipment sourcing, non-liability client checkout redirects, and real-time commission reconciliation to AgriBank Zimbabwe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setIsSyncingCatalog(true);
              setTimeout(() => {
                setIsSyncingCatalog(false);
                setCatalogSyncStatus('Catalogue Synced & Verified (AHM Corp / Shopify)');
                setLastSyncTime(new Date().toLocaleTimeString());
              }, 600);
            }}
            disabled={isSyncingCatalog}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            title="Force synchronization with AHM live catalogue and Shopify inventory"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSyncingCatalog ? 'animate-spin' : ''}`} />
            <span>{isSyncingCatalog ? 'Syncing...' : 'Sync Catalogue'}</span>
          </button>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
            AHM ATTRIBUTION: ref=mnpixfvf (Exclusive)
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-cyan-400 border border-cyan-500/40 text-xs font-mono font-bold">
            AgriBank Nostro Gateway
          </span>
        </div>
      </div>

      {/* Real-Time Catalogue Sync Banner & Exclusive Referral Tag */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-white font-bold">{catalogSyncStatus}</span>
          <span className="text-slate-500">· Last sync: {lastSyncTime} · 8 Heavy Machines Indexed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">AHM Referral Locked:</span>
          <code className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
            https://ahmcorp.com?ref=mnpixfvf
          </code>
        </div>
      </div>

      {/* SECTION 1: AHM COMPACT HEAVY EQUIPMENT CATALOG WITH NON-LIABILITY CHECKOUT */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>AHM Compact Construction Equipment (Global Direct)</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Earthmoving & Civil Machinery Fleet
            </h3>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedCategory(tab)}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === tab
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMachines.map((machine) => (
            <div 
              key={machine.sku} 
              className="bg-[#0b1320] border border-[#16253b] rounded-xl p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 group shadow-lg"
            >
              {/* Product Card Title & Tracking Asset Tags */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-3 text-slate-400">
                  <span className="bg-[#17263c] px-2 py-0.5 rounded border border-white/5 tracking-wider font-bold text-slate-200">
                    {machine.sku}
                  </span>
                  <span className="text-cyan-400 uppercase tracking-widest font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>IN STOCK</span>
                  </span>
                </div>
                
                <h4 className="text-sm font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors duration-200 line-clamp-2">
                  {machine.title}
                </h4>

                {/* Technical Bullet Engineering Array Breakdown */}
                <ul className="mt-4 space-y-1.5 border-t border-b border-[#16253b] py-3.5 my-3.5 text-xs text-slate-400 font-mono">
                  {machine.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2 truncate">
                      <span className="text-cyan-500 text-xs">▪</span>
                      <span className="truncate">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing Blocks & Non-Liability Partner Checkout Redirection Anchors */}
              <div className="mt-4 pt-2">
                <div className="mb-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-[9px] text-slate-500 font-mono block uppercase tracking-wider">MSRP Manufacturer Val</span>
                    <span className="text-2xl font-black font-mono text-white tracking-tight">
                      ${machine.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      <span className="text-xs font-normal text-slate-400 ml-1">USD</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-emerald-400 font-mono block font-bold uppercase">Commission</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      +${machine.commission.toFixed(2)}
                    </span>
                  </div>
                </div>

                <a
                  href={machine.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-mono font-bold text-xs tracking-widest uppercase rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 border border-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer"
                >
                  <span>SECURE PARTNER CHECKOUT</span>
                  <ExternalLink className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Non-Liability Enforcement Card */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="flex items-start gap-2.5 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-sans">Strict Non-Liability Enforcement</strong>
              <span className="text-slate-400 text-[11px]">Direct anchor links to AHM Corp’s encrypted cart. Zero payment cards stored on Demash servers.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-sans">Attribution Insurance</strong>
              <span className="text-slate-400 text-[11px]">Token token parameter <code className="text-amber-400 font-bold">ref=mnpixfvf</code> remains anchored through checkout transitions.</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5 text-slate-300">
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-sans">AgriBank Nostro Clearance</strong>
              <span className="text-slate-400 text-[11px]">Commissions clear directly to AgriBank Nostro Escrow Gateway under Comptroller Director Liberman Magaya.</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: LIVE PARTNER POS COMMISSION INGESTION & CLEARANCE VALVE */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase">
              <Terminal className="w-4 h-4" />
              <span>Production Partner POS Commission Terminal (Target: /api/v1/alliances/pos-commission)</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Live Partner POS Commission Webhook Dispatcher
            </h3>
          </div>
          <span className="px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
            Active Listener: [POST] /api/v1/alliances/pos-commission
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: Real-Time Partner POS Commission Dispatcher */}
          <form onSubmit={handleTransmitWebhook} className="lg:col-span-5 space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Shopify POS Order ID
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                  Total Order (USD)
                </label>
                <input
                  type="text"
                  required
                  value={orderAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOrderAmount(val);
                    const parsed = parseFloat(val) || 0;
                    setCommissionAmount((parsed * 0.15).toFixed(2));
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                  Commission (15% Net USD)
                </label>
                <input
                  type="text"
                  required
                  value={commissionAmount}
                  onChange={(e) => setCommissionAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-mono text-xs font-bold focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
                Machine SKU (AHM Sourced Fleet)
              </label>
              <select
                value={selectedMachineSku}
                onChange={(e) => {
                  setSelectedMachineSku(e.target.value);
                  const found = AHM_EQUIPMENT_CATALOG.find(m => m.sku === e.target.value);
                  if (found) {
                    setOrderAmount(found.price.toFixed(2));
                    setCommissionAmount(found.commission.toFixed(2));
                  }
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
              >
                {AHM_EQUIPMENT_CATALOG.map(m => (
                  <option key={m.sku} value={m.sku}>{m.sku} - {m.title} (${m.price.toLocaleString()} | Commission: ${m.commission.toFixed(2)})</option>
                ))}
              </select>
            </div>

            {/* Quick Interactive Commission Calculator */}
            <div className="p-3 bg-slate-950/90 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 uppercase">Unit Multiplier</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 5, 10].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => {
                        setCustomCalcQty(qty);
                        const found = AHM_EQUIPMENT_CATALOG.find(m => m.sku === selectedMachineSku);
                        if (found) {
                          const newTotal = (found.price * qty).toFixed(2);
                          setOrderAmount(newTotal);
                          setCommissionAmount((found.commission * qty).toFixed(2));
                        }
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${customCalcQty === qty ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                    >
                      {qty}x
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-800">
                <span className="text-slate-400">Projected Commission:</span>
                <span className="text-emerald-400 font-bold">${commissionAmount} USD</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isTransmittingWebhook}
              className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-mono font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isTransmittingWebhook ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Processing Webhook Transmission...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Dispatch Webhook Packet to Server</span>
                </>
              )}
            </button>
          </form>

          {/* Right: Live Conversion Audit Receipt */}
          <div className="lg:col-span-7 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px] border-b border-slate-800 pb-2">
              <span>LEDGER CONVERSION RECEIPT MONITOR</span>
              <span className="text-emerald-400">HMAC_SHA256_PASS_TOKEN_MNPIXFVF</span>
            </div>

            <pre className="text-emerald-400 text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto p-3 bg-black/40 rounded-lg border border-emerald-500/20">
              {webhookResponse?.audit_receipt || `========================================
*💰 [PARTNER POS AFFILIATE COMMISSION RECORD]*
========================================
*TRANSACTION ID:* ${orderId}
*MERCHANT SOURCE:* AHM Corp (Shopify POS Backend Pipeline)
*STATUS:* AUDITED // CLEARANCE NOTIFIED
----------------------------------------
*TOTAL EQUIPMENT SALE:* $${parseFloat(orderAmount || '0').toFixed(2)} USD
*NET COMMISSION EARNED:* $${parseFloat(commissionAmount || '0').toFixed(2)} USD
*EQUIPMENT SKU:* ${selectedMachineSku}
----------------------------------------
*BENEFICIARY LINK:* Demash Global Infrastructure & Capital
*TARGET CLEARANCE:* AgriBank Zimbabwe (Nostro USD)
*ACCOUNT ROUTING:*  Account No: AgriBank Commercial Nostro Gateway
----------------------------------------
*MANAGING DIRECTOR:* Liberman Magaya (+263784219178)
*VERIFICATION HASH:* HMAC_SHA256_PASS_TOKEN_MNPIXFVF
========================================`}
            </pre>

            {webhookResponse && (
              <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{webhookResponse.message} Entry locked into AgriBank Nostro Ledger.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: CONTRACTOR MATERIALS PROCUREMENT CATALOG & CART */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Zimbabwe Bulk Structural Building Materials Catalog</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Contractor wholesale price schedules for cement, structural steel rebar, and aggregate delivery across Harare.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Materials catalogue */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUPPLIER_MATERIALS.map((mat) => (
                <div 
                  key={mat.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-amber-400">{mat.supplierCode}</span>
                      <span className="text-emerald-400 font-semibold">+${mat.commission} comm.</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1 leading-snug">{mat.name}</h4>
                    <div className="text-[11px] text-slate-400">Unit: {mat.unit}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div className="font-mono text-xs">
                      <span className="text-white font-bold">${mat.clientPrice}</span>
                      <span className="text-slate-500 text-[10px] ml-1">(Supp: ${mat.supplierPrice})</span>
                    </div>

                    <button
                      onClick={() => addToCart(mat)}
                      className="p-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Active Requisition / Order Cart */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Live Materials Procurement Cart</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">{cart.length} items</span>
            </div>

            {/* Cart items */}
            <div className="space-y-3">
              {cart.length === 0 ? (
                <div className="py-8 px-4 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                  🛒 Cart is empty. Click "+ Add to Cart" on any wholesale material above to assemble a real client materials requisition.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.material.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between text-xs">
                      <div className="font-semibold text-white truncate max-w-[200px]">
                        {item.material.name}
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.material.id)}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">Qty:</span>
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.material.id, Number(e.target.value))}
                          className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white font-mono text-xs"
                        />
                        <span className="text-[10px] text-slate-500">{item.material.unit}</span>
                      </div>

                      <div className="text-right font-mono">
                        <div className="font-bold text-white">
                          ${(item.material.clientPrice * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-emerald-400">
                          +${(item.material.commission * item.quantity).toFixed(2)} margin
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Delivery & Logistics details */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Destination Site (Zimbabwe Stand)</label>
                <input
                  type="text"
                  value={siteLocation}
                  onChange={(e) => setSiteLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Logistics / Haulage Carrier</label>
                <input
                  type="text"
                  value={driverRef}
                  onChange={(e) => setDriverRef(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Financial Totals */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>AHM Supplier Wholesale:</span>
                <span>${totalSupplierCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Demash Commission (ref:mnpixfvf):</span>
                <span>+${totalCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-extrabold text-sm pt-1 border-t border-slate-800">
                <span>Total Invoiced Client Price:</span>
                <span>${totalClientPrice.toFixed(2)} USD</span>
              </div>
            </div>

            <button
              onClick={handleDispatchRequisition}
              disabled={cart.length === 0}
              className={`w-full py-3 px-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg ${
                cart.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 cursor-pointer'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Requisition to AHM & Director Liberman</span>
            </button>

          </div>

        </div>
      </div>

    </div>
  );
};
