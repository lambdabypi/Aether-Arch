
import React from 'react';
import { ProtocolLog } from '../types';
import { ArrowDownLeft, ArrowUpRight, AlertCircle, Clock } from 'lucide-react';

const ProtocolLogs: React.FC<{ logs: ProtocolLog[] }> = ({ logs }) => {
  return (
    <div className="p-8 h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Protocol Inspector</h2>
          <p className="text-gray-400 text-sm mt-1">Live stream of MCP JSON-RPC 2.0 traffic between server and clients.</p>
        </div>
        <div className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg text-[10px] font-mono text-gray-500">
          LOG_RETENTION: 50_EVENTS
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-700">
             <Clock className="w-8 h-8 mb-2 opacity-20" />
             <p className="text-sm italic">Waiting for protocol handshakes...</p>
          </div>
        ) : logs.map((log, idx) => (
          <div key={idx} className="bg-gray-900/50 border border-white/5 p-4 rounded-xl font-mono text-xs flex gap-4 hover:bg-gray-900 transition-colors group">
            <span className="text-gray-600 shrink-0 w-20">{log.timestamp}</span>
            <div className="shrink-0 w-6 mt-0.5">
              {log.type === 'request' && <ArrowUpRight className="w-4 h-4 text-blue-400" />}
              {log.type === 'response' && <ArrowDownLeft className="w-4 h-4 text-emerald-400" />}
              {log.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span className={`font-bold uppercase tracking-widest text-[10px] ${
                  log.type === 'request' ? 'text-blue-400' : log.type === 'response' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {log.type}
                </span>
                <span className="text-gray-300 font-bold">{log.method}</span>
              </div>
              <pre className="text-[10px] text-gray-500 bg-black/40 p-2 rounded-lg border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProtocolLogs;
