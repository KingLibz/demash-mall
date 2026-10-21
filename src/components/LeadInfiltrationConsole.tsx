import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Terminal, 
  Cpu, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Zap, 
  Server, 
  Database,
  ArrowRight
} from 'lucide-react';
import { openWhatsAppLink } from '../utils/navigation';

interface IngestStats {
  queueCount: number;
  processingVelocity: string;
  status: string;
  crawlerCeiling: string;
}

interface ProcessInfo {
  id: number;
  name: string;
  mode: string;
  status: string;
  restart: number;
  uptime: string;
  cpu: string;
  memory: string;
  user: string;
  watching: string;
}

interface CronRoutine {
  timing: string;
  task: string;
  cronExpr: string;
  activeState: string;
}

interface QueueRecord {
  id: string;
  prospect_phone: string;
  raw_content: string;
  business_vertical: string;
  processing_status: 'PENDING' | 'PROCESSED' | 'DISPATCHED';
  source_node: string;
  timestamp: string;
}

export default function LeadInfiltrationConsole() {
  const [ingestStats, setIngestStats] = useState<IngestStats>({ 
    queueCount: 145, 
    processingVelocity: "4.8 leads/min", 
    status: "UNTHROTTLED",
    crawlerCeiling: "OPTIMAL / NO LOSS"
  });
  
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [crons, setCrons] = useState<CronRoutine[]>([]);
  const [queue, setQueue] = useState<QueueRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Crawler Sweep Trigger State
  const [portalUrl, setPortalUrl] = useState("https://tenderbulletin.co.zw");
  const [vertical, setVertical] = useState("construction_aggregate");
  const [isSweeping, setIsSweeping] = useState(false);
  const [sweepResult, setSweepResult] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [statsRes, clusterRes, queueRes] = await Promise.all([
        fetch('/api/v1/inflow/stats'),
        fetch('/api/v1/system/cluster-status'),
        fetch('/api/v1/inflow/queue')
      ]);

      const statsData = await statsRes.json();
      if (statsData.success) {
        setIngestStats({
          queueCount: statsData.queueCount,
          processingVelocity: statsData.processingVelocity,
          status: statsData.status,
          crawlerCeiling: statsData.crawlerCeiling
        });
      }

      const clusterData = await clusterRes.json();
      if (clusterData.success) {
        setProcesses(clusterData.processes || []);
        setCrons(clusterData.cronSchedules || []);
      }

      const queueData = await queueRes.json();
      if (queueData.success && queueData.queue) {
        setQueue(queueData.queue);
      }
    } catch (e) {
      console.error("Failed to load inflow telemetry", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRunManualSweep = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSweeping(true);
    setSweepResult(`Engaging Puppeteer stealth nodes across ${portalUrl}...`);
    try {
      const res = await fetch('/api/v1/inflow/crawl-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portalUrl, vertical })
      });
      const data = await res.json();
      if (data.success && data.item) {
        setQueue(prev => [data.item, ...prev]);
        setSweepResult(`✅ Influx Success: Raw procurement payload extracted from ${portalUrl}. Assigned Queue ID: ${data.leadId}`);
        loadData();
      }
    } catch (err: any) {
      setSweepResult(`Error: ${err.message}`);
    } finally {
      setIsSweeping(false);
    }
  };

  return (
    <div className="bg-[#0b1320] border border-[#16253b] rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-6xl mx-auto font-sans text-slate-200 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#16253b] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Radio className="w-4 h-4 animate-pulse" />
            </span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              High-Velocity Buyer Acquisition Matrix & Process Monitor
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-Time Inbound Portal Scraper Tracking, Influx Queue Telemetry & PM2 Cluster Performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer"
            title="Refresh Ingest"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wide bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 uppercase animate-pulse">
            ENGINE STATE: {ingestStats.status}
          </span>
        </div>
      </div>

      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-[#050a12] border border-[#17263c] p-4 rounded-xl space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block">RAW INGEST INFLUX QUEUE</span>
          <span className="text-2xl font-bold text-white block">{ingestStats.queueCount} Active Leads</span>
          <span className="text-[11px] text-slate-400">Buffered across Redis memory queue</span>
        </div>

        <div className="bg-[#050a12] border border-[#17263c] p-4 rounded-xl space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block">AGGREGATION VELOCITY</span>
          <span className="text-2xl font-bold text-cyan-400 block">{ingestStats.processingVelocity}</span>
          <span className="text-[11px] text-slate-400">Concurrent port sweep speed</span>
        </div>

        <div className="bg-[#050a12] border border-[#17263c] p-4 rounded-xl space-y-1">
          <span className="text-slate-500 text-[10px] uppercase block">CRAWLER TUNING CEILING</span>
          <span className="text-2xl font-bold text-emerald-400 block">{ingestStats.crawlerCeiling}</span>
          <span className="text-[11px] text-slate-400">Zero packet drop limit</span>
        </div>
      </div>

      {/* PM2 Cluster Process Monitor Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Real-Time Production Process Monitor Snapshot (pm2 status)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            CLUSTER ACTIVE · 6 NODES
          </span>
        </div>

        <div className="overflow-x-auto w-full rounded-xl border border-[#16253b]">
          <table className="w-full text-left font-mono text-xs text-slate-400">
            <thead>
              <tr className="border-b border-[#16253b] bg-[#070c16] text-slate-500 text-[10px] uppercase tracking-wider">
                <th className="py-2.5 pl-3">id</th>
                <th className="py-2.5">name</th>
                <th className="py-2.5">mode</th>
                <th className="py-2.5">status</th>
                <th className="py-2.5 text-center">restart</th>
                <th className="py-2.5">uptime</th>
                <th className="py-2.5 text-center">cpu</th>
                <th className="py-2.5 text-right">memory</th>
                <th className="py-2.5 text-right pr-3">user</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#090f1a] text-[11px]">
              {processes.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 pl-3 text-slate-500 font-bold">{p.id}</td>
                  <td className="py-2.5 font-bold text-slate-200">{p.name}</td>
                  <td className="py-2.5 text-slate-400">{p.mode}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-center text-slate-300">{p.restart}</td>
                  <td className="py-2.5 text-slate-300">{p.uptime}</td>
                  <td className="py-2.5 text-center text-cyan-400 font-bold">{p.cpu}</td>
                  <td className="py-2.5 text-right text-slate-200">{p.memory}</td>
                  <td className="py-2.5 text-right pr-3 text-slate-500">{p.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Scheduled Cron Routines */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Autonomous Scheduled Orchestration Crons (PM2 Worker Daemons)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          {crons.map((c, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950 border border-slate-800/90 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold flex items-center gap-1.5 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{c.timing}</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[9px] bg-slate-800 text-slate-300 font-bold">
                  {c.cronExpr}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {c.task}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Portal Scraper Valve Form */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1626] border border-cyan-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Manual Stealth Scraper Ingestion Trigger
          </h4>
          <span className="text-[10px] font-mono text-slate-400">Node Ingestion Valve</span>
        </div>

        <form onSubmit={handleRunManualSweep} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6">
            <label className="block text-[10px] font-mono text-slate-400 mb-1">Target Portal Feed URL</label>
            <select
              value={portalUrl}
              onChange={(e) => setPortalUrl(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-cyan-400 outline-none"
            >
              <option value="https://tenderbulletin.co.zw">tenderbulletin.co.zw (Construction Aggregates)</option>
              <option value="https://constructiondirectory.com">constructiondirectory.com (Heavy Mining Machinery)</option>
              <option value="https://estate-broker-intel.co.za">estate-broker-intel.co.za (International Real Estate)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[10px] font-mono text-slate-400 mb-1">Business Vertical</label>
            <select
              value={vertical}
              onChange={(e) => setVertical(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:border-cyan-400 outline-none"
            >
              <option value="construction_aggregate">Aggregates & Batching</option>
              <option value="mining_machinery">Mining & Earthmoving</option>
              <option value="international_real_estate">High-Net Estates</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={isSweeping}
              className="w-full py-2 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSweeping ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Zap className="w-3.5 h-3.5" />
              )}
              <span>Harvest Leads</span>
            </button>
          </div>
        </form>

        {sweepResult && (
          <div className="p-3 bg-slate-950 rounded-xl text-xs text-cyan-300 border border-cyan-500/30 font-mono">
            {sweepResult}
          </div>
        )}
      </div>

      {/* Raw Ingest Queue Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Raw Ingest Queue Stream (PostgreSQL: raw_ingest_queue)
          </h4>
          <span className="text-[10px] font-mono text-slate-500">{queue.length} Active Payloads</span>
        </div>

        <div className="space-y-2">
          {queue.map((item) => (
            <div key={item.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{item.id}</span>
                  <span className="text-slate-500 text-[10px]">{item.source_node}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-slate-800 text-cyan-400 font-bold">
                    {item.business_vertical}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] line-clamp-2">
                  {item.raw_content}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                  item.processing_status === 'PENDING' ? 'bg-amber-950/40 border-amber-500/40 text-amber-400' :
                  item.processing_status === 'PROCESSED' ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400' :
                  'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                }`}>
                  {item.processing_status}
                </span>

                <button
                  onClick={() => openWhatsAppLink('263784219178', `Review harvested buyer lead [${item.id}]: ${item.raw_content}`)}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] transition-colors cursor-pointer"
                >
                  Forward Alert ↗
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
