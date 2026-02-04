
import React from 'react';
import { 
  Server, 
  Settings, 
  Activity, 
  Code, 
  Terminal as TerminalIcon, 
  ShieldCheck, 
  Zap, 
  Database,
  Radio,
  FileCode,
  Layers,
  ListFilter,
  Monitor,
  Link2,
  Link2Off
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  hasResults: boolean;
  bridgeConnected?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, hasResults, bridgeConnected }) => {
  const navItems = [
    { id: 'server', icon: Server, label: 'Node Control', enabled: true },
    { id: 'ide', icon: Monitor, label: 'Connect VS Code', enabled: true },
    { id: 'tools', icon: Radio, label: 'Tool Definitions', enabled: true },
    { id: 'logs', icon: ListFilter, label: 'Protocol Logs', enabled: true },
    { id: 'explorer', icon: FileCode, label: 'Context Mounted', enabled: true },
    { id: 'debt', icon: Database, label: 'Debt Schema', enabled: hasResults },
    { id: 'refactor', icon: Zap, label: 'Refactor Lab', enabled: hasResults },
    { id: 'compliance', icon: ShieldCheck, label: 'Audit Output', enabled: hasResults },
    { id: 'sandbox', icon: Layers, label: 'Sandbox VM', enabled: hasResults },
  ];

  return (
    <aside className="w-60 border-r border-white/5 bg-gray-950 flex flex-col z-40">
      <div className="p-4 space-y-1">
        <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">MCP Node Management</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => item.enabled && onViewChange(item.id as ViewType)}
            disabled={!item.enabled}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
              activeView === item.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
                : item.enabled 
                  ? 'text-gray-500 hover:bg-gray-900 hover:text-gray-300' 
                  : 'text-gray-700 cursor-not-allowed opacity-40'
            }`}
          >
            <item.icon className={`w-4 h-4 ${activeView === item.id ? 'text-emerald-400' : ''}`} />
            <span className="text-xs font-semibold tracking-tight">{item.label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-auto p-4 space-y-3">
        {bridgeConnected !== undefined && (
          <div className={`p-4 rounded-2xl border transition-all ${bridgeConnected ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'}`}>
             <div className="flex items-center gap-3 mb-2">
                {bridgeConnected ? <Link2 className="w-4 h-4 text-emerald-400" /> : <Link2Off className="w-4 h-4 text-rose-400" />}
                <span className={`text-[10px] font-black uppercase tracking-widest ${bridgeConnected ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {bridgeConnected ? 'Bridge Linked' : 'Roo Bridge Offline'}
                </span>
             </div>
             <p className="text-[9px] text-gray-600 leading-tight">
               {bridgeConnected ? 'UI is receiving live JSON-RPC traffic from your local VS Code.' : 'Run bridge.js to link your IDE to this UI.'}
             </p>
          </div>
        )}

        <div className="bg-gray-900/40 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Server Uptime</span>
            <span className="text-[10px] font-mono text-emerald-500/80">99.9%</span>
          </div>
          <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
             <div className="bg-emerald-500 h-full w-full opacity-50"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
