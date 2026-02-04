
import React, { useEffect, useState } from 'react';
import { Terminal as TerminalIcon, Play, RefreshCw, Server, ShieldCheck, Activity } from 'lucide-react';

const SandboxTerminal: React.FC<{ logs: string[] }> = ({ logs }) => {
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setDisplayedLogs(prev => [...prev, logs[i]]);
        i++;
      } else {
        setIsRunning(false);
        clearInterval(interval);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [logs]);

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Antigravity Sandbox</h2>
          <p className="text-gray-400 text-sm mt-1">Simulated execution of proposed refactors in a hypervisor-isolated environment.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            <RefreshCw className="w-4 h-4" /> Reset VM
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black rounded-lg text-sm font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
            <Play className="w-4 h-4 fill-current" /> Run Verifier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-3">Resource Allocation</h4>
            <div className="space-y-3">
              <ResourceItem label="vCPU Entropy" value="12%" icon={Activity} />
              <ResourceItem label="Memory Page Cache" value="1.2GB" icon={Server} />
              <ResourceItem label="Network Isolation" value="100%" icon={ShieldCheck} />
            </div>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4">
             <h4 className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest mb-2">Test Coverage Report</h4>
             <div className="space-y-1">
                <p className="text-xs text-emerald-300/80">• Regression: Passed</p>
                <p className="text-xs text-emerald-300/80">• Integration: Validated</p>
                <p className="text-xs text-emerald-300/80">• Load Buffer: Optimized</p>
             </div>
          </div>
        </div>

        <div className="lg:col-span-3 bg-gray-950 border border-gray-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          <div className="h-10 border-b border-gray-800 bg-gray-900/50 flex items-center px-4 justify-between">
            <div className="flex items-center gap-4">
               <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/30"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/30"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/30"></div>
               </div>
               <div className="flex items-center gap-2">
                 <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
                 <span className="mono text-[10px] text-gray-400 uppercase tracking-widest">Sandbox-Antigravity.log</span>
               </div>
            </div>
            {isRunning && (
              <span className="text-[10px] text-emerald-400 font-bold animate-pulse uppercase tracking-widest">Live Execution</span>
            )}
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed space-y-1 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:20px_20px]">
            {displayedLogs.map((log, idx) => (
              <div key={idx} className="flex gap-4 group">
                <span className="text-gray-700 select-none w-10 text-right">{idx + 1}</span>
                <span className={`${log.includes('ERROR') ? 'text-rose-400' : log.includes('SUCCESS') || log.includes('Verified') ? 'text-emerald-400' : 'text-gray-300'}`}>
                   <span className="text-gray-600 mr-2 opacity-50">[{new Date().toLocaleTimeString()}]</span>
                   {log}
                </span>
              </div>
            ))}
            <div className="h-4"></div>
            <div id="logs-end"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResourceItem: React.FC<{ label: string; value: string; icon: any }> = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-gray-500" />
      <span className="text-xs text-gray-400">{label}</span>
    </div>
    <span className="text-xs font-bold text-gray-200">{value}</span>
  </div>
);

export default SandboxTerminal;
