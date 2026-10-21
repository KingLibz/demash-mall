import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  DollarSign, 
  RefreshCw, 
  CheckCircle2, 
  Send, 
  Building2, 
  ShieldCheck, 
  SlidersHorizontal,
  Wallet,
  Landmark,
  ArrowRight
} from 'lucide-react';
import { openWhatsAppLink } from '../utils/navigation';

interface Contract {
  supplier_id: string;
  supplier_name: string;
  contract_reference: string;
  contractual_commission_percentage: number;
  settlement_routing_channel: 'AGRIBANK_NOSTRO' | 'ECOCASH';
  is_active_contract: boolean;
  activeConversions: number;
  netPaidUSD: number;
  last_audited_at: string;
}

export default function SupplierContractLedgerPanel() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>({
    totalConversions: 0,
    totalPaidUSD: 0.00,
    activeAgreements: 5,
    primarySettlementRoute: "AgriBank Nostro (Account: Nostro Escrow Gateway)"
  });

  // Dynamic Price Calibrator State
  const [selectedSupplierId, setSelectedSupplierId] = useState("SUP-AHM-01");
  const [inputSupplierCost, setInputSupplierCost] = useState(14500);
  const [skuCode, setSkuCode] = useState("SKU-AHM-CAT320");
  const [calcResult, setCalcResult] = useState<any>(null);

  // Webhook Test State
  const [isAuditingWebhook, setIsAuditingWebhook] = useState(false);
  const [webhookReceipt, setWebhookReceipt] = useState<string | null>(null);

  const loadContractMatrices = async () => {
    try {
      const res = await fetch('/api/v1/contracts/status');
      const data = await res.json();
      if (data.success && data.contracts) {
        setContracts(data.contracts);
        setSummary(data.summary);
      }
    } catch (e) {
      console.error("Failed to load contracts", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContractMatrices();
    const interval = setInterval(loadContractMatrices, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleCalculatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/contracts/calibrate-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: skuCode,
          rawSupplierCostUSD: inputSupplierCost,
          supplierId: selectedSupplierId
        })
      });
      const data = await res.json();
      if (data.success) {
        setCalcResult(data);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleExecuteLiveWebhook = async () => {
    setIsAuditingWebhook(true);
    setWebhookReceipt("⏳ Ingesting live POS transaction webhook & auditing contractual margin split...");
    try {
      const res = await fetch('/api/v1/contracts/settlement-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `ORD-${Date.now().toString().slice(-6)}`,
          rawSupplierCostUSD: inputSupplierCost,
          machineSku: skuCode,
          supplierId: selectedSupplierId
        })
      });
      const data = await res.json();
      if (data.success && data.receiptText) {
        setWebhookReceipt(data.receiptText);
        loadContractMatrices();
      }
    } catch (err: any) {
      setWebhookReceipt(`Error: ${err.message}`);
    } finally {
      setIsAuditingWebhook(false);
    }
  };

  return (
    <div className="bg-[#0b1320] border border-[#16253b] rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-6xl mx-auto font-sans text-slate-200 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#16253b] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Contractual Supplier Affiliate Margin Reconciliation
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-Time Mapping of Active Supplier Agreement Splitting Ratios and Settlement Routing Channels
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadContractMatrices}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer"
            title="Refresh Matrices"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-mono block uppercase">TOTAL COMMISSIONS PAID</span>
            <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full">
              ${summary.totalPaidUSD?.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
            </span>
          </div>
        </div>
      </div>

      {/* Contract Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3.5 bg-[#060a13] border border-slate-800 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Active Supplier Alliances</div>
          <div className="text-white text-base font-bold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>{summary.activeAgreements || 5} Verified Contracts</span>
          </div>
        </div>
        <div className="p-3.5 bg-[#060a13] border border-slate-800 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Total Partner Conversions</div>
          <div className="text-cyan-400 text-base font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{summary.totalConversions || 44} Completed Trades</span>
          </div>
        </div>
        <div className="p-3.5 bg-[#060a13] border border-slate-800 rounded-xl space-y-1">
          <div className="text-[10px] text-slate-500 font-bold uppercase">Primary Nostro Route</div>
          <div className="text-amber-400 text-xs font-bold flex items-center gap-1.5 truncate">
            <Landmark className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">AgriBank Nostro Gateway</span>
          </div>
        </div>
      </div>

      {/* Dynamic Price Calibrator & Live Settlement Ingestion */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1626] border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
              Dynamic Supplier Margin Calibrator & Webhook Settlement Engine
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">POS Webhook Engine</span>
        </div>

        <form onSubmit={handleCalculatePrice} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Supplier Contract *</label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-cyan-400 outline-none"
              >
                {contracts.map(c => (
                  <option key={c.supplier_id} value={c.supplier_id}>
                    {c.supplier_name} ({c.contractual_commission_percentage}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Raw Supplier Base Cost (USD) *</label>
              <input
                type="number"
                value={inputSupplierCost}
                onChange={(e) => setInputSupplierCost(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-cyan-400 outline-none"
                placeholder="14500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Machine / Asset SKU *</label>
              <input
                type="text"
                value={skuCode}
                onChange={(e) => setSkuCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-cyan-400 outline-none"
                placeholder="SKU-AHM-CAT320"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-400 text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Calibrate Margin Split</span>
            </button>

            <button
              type="button"
              onClick={handleExecuteLiveWebhook}
              disabled={isAuditingWebhook}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 text-slate-950 font-bold text-xs font-mono uppercase shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAuditingWebhook ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  <span>Auditing Webhook...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-slate-950" />
                  <span>Execute POS Commission Ingestion Webhook</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Calculation Preview */}
        {calcResult && (
          <div className="p-3.5 bg-slate-950 rounded-xl border border-cyan-500/40 text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-[10px] text-slate-500 block">SUPPLIER BASE</span>
              <span className="font-bold text-white">${calcResult.grossSupplierPrice.toFixed(2)} USD</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">CONTRACT RATE</span>
              <span className="font-bold text-cyan-400">{calcResult.commissionRateApplied}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">NET COMMISSION DUE</span>
              <span className="font-bold text-emerald-400">${calcResult.netCommissionEarned.toFixed(2)} USD</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">DESTINATION ROUTE</span>
              <span className="font-bold text-amber-400">{calcResult.payoutChannel} ({calcResult.settlementAccount})</span>
            </div>
          </div>
        )}

        {/* Webhook Receipt Display */}
        {webhookReceipt && (
          <div className="p-4 rounded-xl bg-black/90 border border-emerald-500/40 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Contractual Commission Settlement Receipt</span>
              </span>
              <button
                onClick={() => setWebhookReceipt(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px] p-2 bg-slate-950 rounded-lg">
              {webhookReceipt}
            </pre>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => openWhatsAppLink('263784219178', webhookReceipt)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Dispatch Receipt Alert to Director WhatsApp (+263784219178)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contracts Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Active Master Supplier Contracts
          </h4>
          <span className="text-[10px] font-mono text-emerald-400">PostgreSQL Schema: global_supplier_contracts</span>
        </div>

        <div className="overflow-x-auto w-full rounded-xl border border-[#16253b]">
          <table className="w-full text-left font-mono text-xs text-slate-400">
            <thead>
              <tr className="border-b border-[#16253b] bg-[#070c16] text-slate-400 text-[10px] uppercase tracking-wider">
                <th className="py-3 pl-3">Supplier Alliance Profile</th>
                <th className="py-3">Contract Rate</th>
                <th className="py-3 text-center">Settlement Channel</th>
                <th className="py-3 text-right">Transactions</th>
                <th className="py-3 text-right pr-3">Commissions Paid (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#090f1a]">
              {contracts.map((contract) => (
                <tr key={contract.supplier_id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 pl-3 font-sans font-bold text-slate-200">
                    {contract.supplier_name}
                    <span className="block text-[9px] text-slate-500 font-mono font-normal mt-0.5">
                      {contract.contract_reference} · {contract.supplier_id}
                    </span>
                  </td>
                  <td className="py-3.5 text-cyan-400 font-bold">
                    {contract.contractual_commission_percentage.toFixed(1)}%
                  </td>
                  <td className="py-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                      contract.settlement_routing_channel === 'AGRIBANK_NOSTRO'
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-400'
                        : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                    }`}>
                      {contract.settlement_routing_channel.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-bold text-slate-300">
                    {contract.activeConversions}
                  </td>
                  <td className="py-3.5 text-right font-bold text-white pr-3">
                    ${contract.netPaidUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
