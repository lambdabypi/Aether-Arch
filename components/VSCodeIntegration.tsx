
import React, { useState } from 'react';
import { MCPTool } from '../types';
import { 
  Monitor, 
  Code, 
  Copy, 
  CheckCircle, 
  ExternalLink, 
  Box, 
  Terminal, 
  Settings, 
  Info, 
  Sparkles, 
  Zap, 
  Play,
  Share2,
  FileJson,
  Cpu,
  ArrowRight
} from 'lucide-react';

interface Props {
  tools: MCPTool[];
}

const VSCodeIntegration: React.FC<Props> = ({ tools }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'mac' | 'win' | 'linux'>('mac');
  const [activeMode, setActiveMode] = useState<'config' | 'script' | 'topology'>('config');

  const mcpConfig = {
    mcpServers: {
      "aether-arch": {
        command: "node",
        args: ["path/to/your/bridge.js"],
        env: {
          "AETHER_PORT": "3001"
        }
      }
    }
  };

  const bridgeScript = `
/**
 * Aether-Arch Local Bridge (Bi-directional Relay)
 * Save this as 'bridge.js'
 */
const http = require('http');
const readline = require('readline');

const PORT = 3001;
let requestQueue = [];
let pendingResponses = new Map();

// 1. Create Relay Server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.end(); return; }

  // App Polls for requests from Roo
  if (req.url === '/poll' && req.method === 'GET') {
    const nextRequest = requestQueue.shift() || {};
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(nextRequest));
    return;
  }

  // App Sends results back
  if (req.url === '/respond' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const { id, result, error } = JSON.parse(body);
      if (pendingResponses.has(id)) {
        pendingResponses.get(id)( { id, result, error } );
        pendingResponses.delete(id);
      }
      res.writeHead(200);
      res.end();
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, 'localhost', () => {
  console.error(\`Aether-Arch Relay started on http://localhost:\${PORT}\`);
});

// 2. Interface with Roo Code (STDIN/STDOUT)
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

rl.on('line', (line) => {
  if (!line) return;
  try {
    const request = JSON.parse(line);
    if (!request.id) return;

    // Add to queue for the Browser App to pick up
    requestQueue.push(request);

    // Wait for App to respond
    pendingResponses.set(request.id, (response) => {
       // Return to Roo Code STDOUT
       process.stdout.write(JSON.stringify(response) + '\\n');
    });
  } catch (e) {
    console.error('Bridge Error:', e.message);
  }
});
  `.trim();

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
          <Share2 className="w-10 h-10 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-4xl font-black tracking-tight text-white uppercase tracking-tighter">Bridge Protocol</h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-2">
            Link your local VS Code environment to this browser node.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 p-1 bg-gray-900/60 rounded-2xl border border-white/5 w-fit mx-auto">
        <button 
          onClick={() => setActiveMode('config')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'config' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
        >
          1. MCP Config
        </button>
        <button 
          onClick={() => setActiveMode('script')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'script' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
        >
          2. Bridge Script
        </button>
        <button 
          onClick={() => setActiveMode('topology')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMode === 'topology' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Topology
        </button>
      </div>

      {activeMode === 'config' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gray-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Step A: Setup Config</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Open Roo Code settings, click <b>"Configure MCP Servers"</b> and paste this:
            </p>
            <div className="relative group">
              <pre className="p-6 bg-black/80 rounded-3xl border border-white/5 text-[11px] font-mono text-emerald-400/90 overflow-x-auto">
                {JSON.stringify(mcpConfig, null, 2)}
              </pre>
              <button 
                onClick={() => copyText(JSON.stringify(mcpConfig, null, 2))}
                className="absolute top-4 right-4 p-2 bg-emerald-500 text-black rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-xl"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-amber-500 font-bold flex items-center gap-2">
              <Info className="w-3.5 h-3.5" /> Replace "path/to/your/bridge.js" with the actual full file path.
            </p>
          </div>
          <div className="space-y-6">
            <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Bidirectional Tunneling</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Roo Code sends commands via <b>STDIN</b>. The bridge forwards them to this Browser App via <b>HTTP Port 3001</b>. This UI computes the architecture scan and sends results back to Roo via <b>STDOUT</b>.
              </p>
            </div>
            <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-3xl">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Zap className="w-3 h-3 fill-current" /> Instant Sync
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                When you ask Roo "Inspect architecture", the browser will automatically flip views and show the health scores as they arrive!
              </p>
            </div>
          </div>
        </div>
      )}

      {activeMode === 'script' && (
        <div className="bg-gray-900/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">Step B: Create bridge.js</h3>
              <p className="text-xs text-gray-500 mt-1">This script acts as the relay server. It uses no external dependencies.</p>
            </div>
            <button 
              onClick={() => copyText(bridgeScript)}
              className="px-6 py-3 bg-emerald-500 text-black rounded-xl text-[10px] font-black hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Copy className="w-3.5 h-3.5" /> COPY FUNCTIONAL BRIDGE
            </button>
          </div>
          <div className="relative">
             <div className="absolute top-0 right-0 p-4">
                <span className="text-[10px] font-mono text-emerald-500/40 uppercase">Node.js Built-in Modules Only</span>
             </div>
             <pre className="p-6 bg-black/80 rounded-3xl border border-white/5 text-[11px] font-mono text-emerald-400/90 overflow-x-auto h-[400px] custom-scrollbar shadow-inner">
               {bridgeScript}
             </pre>
          </div>
        </div>
      )}

      {activeMode === 'topology' && (
        <div className="bg-gray-900/40 border border-white/5 p-12 rounded-[2.5rem] flex flex-col items-center gap-12 animate-in slide-in-from-bottom-4 duration-500">
           <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex flex-col items-center gap-3">
                 <div className="w-20 h-20 bg-blue-500/10 rounded-[2rem] flex items-center justify-center border border-blue-500/20 shadow-2xl shadow-blue-500/10">
                    <Code className="w-10 h-10 text-blue-400" />
                 </div>
                 <div className="text-center">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-blue-400">Roo Code</span>
                    <span className="text-[9px] text-gray-600">VS Code Context</span>
                 </div>
              </div>

              <div className="flex flex-col items-center gap-2 group">
                 <div className="flex items-center gap-1">
                    <ArrowRight className="w-4 h-4 text-white/20" />
                    <div className="w-12 h-px bg-white/10 group-hover:bg-emerald-500/50 transition-colors"></div>
                    <ArrowRight className="w-4 h-4 text-white/20" />
                 </div>
                 <span className="text-[9px] font-mono text-gray-700">STDIN / STDOUT</span>
              </div>

              <div className="flex flex-col items-center gap-3">
                 <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center border border-white/10 relative">
                    <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-20"></div>
                    <Terminal className="w-10 h-10 text-gray-400" />
                 </div>
                 <div className="text-center">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Local Bridge</span>
                    <span className="text-[9px] text-gray-600">localhost:3001</span>
                 </div>
              </div>

              <div className="flex flex-col items-center gap-2 group">
                 <div className="flex items-center gap-1">
                    <ArrowRight className="w-4 h-4 text-white/20" />
                    <div className="w-12 h-px bg-white/10 group-hover:bg-emerald-500/50 transition-colors"></div>
                    <ArrowRight className="w-4 h-4 text-white/20" />
                 </div>
                 <span className="text-[9px] font-mono text-gray-700">HTTP POLLING</span>
              </div>

              <div className="flex flex-col items-center gap-3">
                 <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                    <Cpu className="w-10 h-10 text-emerald-400" />
                 </div>
                 <div className="text-center">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-400">Gemini Engine</span>
                    <span className="text-[9px] text-gray-600">Browser UI Node</span>
                 </div>
              </div>
           </div>
           <p className="text-xs text-gray-500 text-center max-w-lg leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/5">
             This secure loop allows Roo Code to utilize Gemini's massive reasoning capabilities through this interface without needing expensive direct subscriptions.
           </p>
        </div>
      )}
    </div>
  );
};

export default VSCodeIntegration;
