
import React from 'react';
import { ComplianceIssue } from '../types';
import { ShieldCheck, ShieldAlert, Shield, Info, Zap } from 'lucide-react';

const ComplianceAudit: React.FC<{ items: ComplianceIssue[] }> = ({ items }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pass': return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'Fail': return <ShieldAlert className="w-6 h-6 text-rose-400" />;
      case 'Warning': return <Shield className="w-6 h-6 text-amber-400" />;
      default: return <Info className="w-6 h-6 text-blue-400" />;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-3xl p-8 mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tighter">Compliance Engine</h2>
            <p className="text-indigo-300/60 text-sm">Automated SOC2 Type II & ISO 27001 policy scanning.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8 mt-8">
          <div className="text-center p-4 bg-gray-950/50 rounded-2xl border border-white/5">
            <p className="text-3xl font-bold text-white mb-1">{items.filter(i => i.status === 'Pass').length}</p>
            <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest">Passed Controls</p>
          </div>
          <div className="text-center p-4 bg-gray-950/50 rounded-2xl border border-white/5">
            <p className="text-3xl font-bold text-white mb-1">{items.filter(i => i.status === 'Fail').length}</p>
            <p className="text-[10px] uppercase font-bold text-rose-400 tracking-widest">Failures</p>
          </div>
          <div className="text-center p-4 bg-gray-950/50 rounded-2xl border border-white/5">
            <p className="text-3xl font-bold text-white mb-1">{items.filter(i => i.status === 'Warning').length}</p>
            <p className="text-[10px] uppercase font-bold text-amber-400 tracking-widest">Warnings</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-start gap-5">
              <div className="mt-1">{getStatusIcon(item.status)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{item.control}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                    item.status === 'Pass' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' :
                    item.status === 'Fail' ? 'text-rose-400 border-rose-400/20 bg-rose-400/5' : 'text-amber-400 border-amber-400/20 bg-amber-400/5'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">{item.finding}</p>
                <div className="bg-gray-950 border border-gray-800/50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Recommended Remediation
                  </p>
                  <p className="text-sm text-emerald-300/80">{item.remediation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceAudit;
