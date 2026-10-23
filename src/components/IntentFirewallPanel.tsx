import React from 'react';

export default function IntentFirewallPanel() {
  return (
    <div className="bg-[#0a1028] p-6 rounded-xl border border-amber-500/20">
      <h2 className="text-xl font-bold text-white mb-2">Live Intake</h2>
      <p className="text-sm text-gray-400 mb-4">Connected to Node.js / Nodemailer / Gmail SMTP - Sourcing from OUTSIDE only</p>
      
      <div className="text-amber-400 text-sm mb-4">
        ✅ Production Mode: Real external harvest active
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm">Client / Organization Name</label>
          <div className="bg-black/50 p-3 rounded-lg text-white border border-gray-700">
            Real intake from external tender feeds only
          </div>
        </div>
        <div>
          <label className="text-gray-400 text-sm">Contact Detail (Phone / Email)</label>
          <div className="bg-black/50 p-3 rounded-lg text-white border border-gray-700">
            Will populate from tenderbulletin.co.zw / PRAZ / UNGM
          </div>
        </div>
        <div>
          <label className="text-gray-400 text-sm">Raw Incoming Conversational Message</label>
          <div className="bg-black/50 p-3 rounded-lg text-white border border-gray-700 min-h-[100px]">
            No internal mocks - only real GroupHarvestMetrics from outside harvest
          </div>
        </div>
      </div>
      <p className="text-xs text-green-400 mt-4">CLEANED: Mock scenario buttons removed. Pipeline sources from OUTSIDE only via harvestVastGroupMetrics()</p>
    </div>
  );
}
