
import React from 'react';
import { MCPTool } from '../types';
import { Radio, ChevronRight, Copy } from 'lucide-react';

const ToolRegistry: React.FC<{ tools: MCPTool[] }> = ({ tools }) => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tighter">Exposed Protocol Capabilities</h2>
        <p className="text-gray-500 text-sm">
          Aether-Arch exports these tools to MCP clients. Connect your IDE or agent to these endpoints to enable autonomous architecture management.
        </p>
      </div>

      <div className="grid gap-6">
        {tools.map(tool => (
          <div key={tool.name} className="group bg-gray-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/20 transition-all">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                    <Radio className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-mono text-white">{tool.name}</h3>
                    <p className="text-gray-400 text-sm">{tool.description}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
                  <Copy className="w-3.5 h-3.5" /> Copy Schema
                </button>
              </div>

              <div className="bg-gray-950 rounded-2xl border border-white/5 p-6">
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-4">JSON-RPC Input Definition</p>
                <pre className="text-xs text-emerald-400/80 font-mono leading-relaxed overflow-x-auto">
                  {JSON.stringify(tool.inputSchema, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolRegistry;
