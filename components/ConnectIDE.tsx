
import React, { useState } from 'react';
import { Plug, Copy, Check, Terminal, FileJson, ExternalLink } from 'lucide-react';

const ConnectIDE: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.origin;

  const configJson = {
    "mcpServers": {
      "aether-arch": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-sse",
          `${currentUrl}/api/mcp`
        ]
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(configJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 mb-2">
          <Plug className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold tracking-tighter">Connect to IDE</h2>
        <p className="text-gray-400 max-w-lg mx-auto text-sm">
          Integrate Aether-Arch as a proactive MCP server in Claude Desktop, Cursor, or VSCode. 
          The server uses SSE (Server-Sent Events) for real-time architectural auditing.
        </p>
      </div>

      <div className="grid gap-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileJson className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Claude Desktop Configuration</span>
            </div>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-black rounded-lg text-[10px] font-black hover:bg-emerald-400 transition-all"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'COPIED' : 'COPY CONFIG'}
            </button>
          </div>
          <div className="p-8">
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Add this snippet to your <code className="bg-gray-800 px-1 rounded text-emerald-300">claude_desktop_config.json</code> to enable the <span className="text-white font-bold">inspect_architecture</span> tool in Claude's interface.
            </p>
            <div className="bg-gray-950 rounded-2xl border border-white/5 p-6 relative group">
              <pre className="text-xs text-emerald-400/80 font-mono leading-relaxed overflow-x-auto">
                {JSON.stringify(configJson, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              1. Host Endpoint
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              The server is currently exposed at:
            </p>
            <div className="bg-black/50 p-3 rounded-lg border border-white/5 text-[10px] font-mono text-emerald-500 truncate">
              {currentUrl}/api/mcp
            </div>
          </div>

          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-amber-400" />
              2. Configuration Path
            </h4>
            <div className="space-y-2">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">macOS</p>
              <div className="text-[9px] font-mono text-gray-400 bg-black/30 p-2 rounded">~/Library/Application Support/Claude/claude_desktop_config.json</div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Windows</p>
              <div className="text-[9px] font-mono text-gray-400 bg-black/30 p-2 rounded">%APPDATA%\Claude\claude_desktop_config.json</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <a 
          href="https://modelcontextprotocol.io/docs/concepts/transports#sse" 
          target="_blank" 
          rel="noreferrer"
          className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest hover:text-emerald-400 transition-colors border-b border-emerald-500/20 pb-1"
        >
          Read the MCP Protocol Specification
        </a>
      </div>
    </div>
  );
};

export default ConnectIDE;
