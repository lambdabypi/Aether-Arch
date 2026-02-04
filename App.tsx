
import React, { useState, useEffect, useRef } from 'react';
import {
  Server,
  Settings,
  Activity,
  Code,
  Terminal as TerminalIcon,
  ShieldCheck,
  Zap,
  Database,
  Search,
  Cpu,
  Upload,
  Radio,
  Share2,
  Link2,
  Link2Off,
  FolderOpen
} from 'lucide-react';
import { FileContent, AnalysisResults, ViewType, ProtocolLog, TargetedRefactor, BridgeState } from './types';
import { executeMCPTool, TOOLS, analyzeActiveFile } from './services/geminiService';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import DebtRadar from './components/DebtRadar';
import RefactorCenter from './components/RefactorCenter';
import ComplianceAudit from './components/ComplianceAudit';
import SandboxTerminal from './components/SandboxTerminal';
import FileExplorer from './components/FileExplorer';
import ToolRegistry from './components/ToolRegistry';
import ProtocolLogs from './components/ProtocolLogs';
import MiniCopilotHUD from './components/MiniCopilotHUD';
import VSCodeIntegration from './components/VSCodeIntegration';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('server');
  const [files, setFiles] = useState<FileContent[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [logs, setLogs] = useState<ProtocolLog[]>([]);
  const [activeFile, setActiveFile] = useState<FileContent | null>(null);
  const [targetedAnalysis, setTargetedAnalysis] = useState<TargetedRefactor | null>(null);
  const [bridge, setBridge] = useState<BridgeState>({ connected: false, lastSync: null, error: null });

  const addLog = (type: ProtocolLog['type'], method: string, payload: any) => {
    setLogs(prev => [{
      timestamp: new Date().toLocaleTimeString(),
      type,
      method,
      payload
    }, ...prev].slice(0, 50));
  };

  // --- BRIDGE SYNC ENGINE ---
  useEffect(() => {
    let pollInterval: any;

    const syncWithBridge = async () => {
      try {
        const response = await fetch('http://localhost:3001/poll', {
          method: 'GET',
          mode: 'cors',
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          const data = await response.json();
          setBridge({ connected: true, lastSync: new Date().toLocaleTimeString(), error: null });

          if (data && data.method) {
            handleRemoteRequest(data);
          }
        } else {
          setBridge(prev => ({ ...prev, connected: false }));
        }
      } catch (err) {
        if (bridge.connected) {
          setBridge({ connected: false, lastSync: null, error: 'Bridge Lost' });
        }
      }
    };

    pollInterval = setInterval(syncWithBridge, 1000);
    return () => clearInterval(pollInterval);
  }, [bridge.connected]);

  const handleRemoteRequest = async (request: any) => {
    const { method, params, id } = request;
    addLog('request', method, params);

    try {
      let result: any;
      if (method === 'inspect_architecture' || method === 'audit_compliance') {
        setActiveView('server');
        if (params.files) {
          setFiles(params.files);
        }
        result = await executeMCPTool(method, params.files || files);
        setResults(result);
      } else if (method === 'targeted_refactor') {
        result = await analyzeActiveFile(params.fileName, params.content);
        setTargetedAnalysis(result);
      }

      await fetch('http://localhost:3001/respond', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, result })
      });

      addLog('response', method, { id, status: 'success' });
    } catch (error: any) {
      addLog('error', method, error.message);
      await fetch('http://localhost:3001/respond', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, error: error.message })
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    const newFiles: FileContent[] = [];
    let processedCount = 0;
    const total = uploadedFiles.length;

    Array.from(uploadedFiles).forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Use webkitRelativePath to preserve directory structure
        const path = file.webkitRelativePath || file.name;

        // Skip hidden files/folders (e.g., .git, .DS_Store)
        if (path.includes('/.') || path.startsWith('.')) {
          processedCount++;
          if (processedCount === total) setFiles(prev => [...prev, ...newFiles]);
          return;
        }

        newFiles.push({
          name: path,
          content: e.target?.result as string,
          type: file.type
        });

        processedCount++;
        if (processedCount === total) {
          setFiles(prev => [...prev, ...newFiles]);
          addLog('request', 'mount_directory', { count: newFiles.length });
        }
      };
      reader.readAsText(file);
    });
  };

  const callTool = async (toolName: string) => {
    if (files.length === 0) return;
    setIsBusy(true);
    addLog('request', toolName, { fileCount: files.length });

    try {
      const data = await executeMCPTool(toolName, files);
      setResults(data);
      addLog('response', toolName, { healthScore: data.overallHealthScore });
    } catch (error) {
      console.error("MCP Tool Failed", error);
      addLog('error', toolName, error);
    } finally {
      setIsBusy(false);
    }
  };

  const renderContent = () => {
    if (isBusy) {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="w-24 h-24 border-2 border-emerald-500/20 rounded-2xl flex items-center justify-center animate-spin-slow">
              <Radio className="text-emerald-400 w-10 h-10" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-mono text-emerald-400 uppercase tracking-widest">Executing Architecture Sweep...</h2>
            <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.2em]">Inference in progress</p>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'server':
        return (
          <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter">MCP Node Status</h2>
                <p className="text-gray-400 text-sm mt-1 font-mono">NODE_ID: AX-990-ALPHA | PROTOCOL: v1.0.4-STABLE</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveView('ide')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm hover:border-gray-700 transition-colors"
                >
                  <Code className="w-4 h-4 text-emerald-500" /> Connect to VS Code
                </button>
                <label className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg text-sm cursor-pointer hover:bg-emerald-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <FolderOpen className="w-4 h-4" /> Load Codebase
                  {/* Fix: use spread operator with type assertion to bypass TypeScript error for non-standard webkitdirectory and directory attributes */}
                  <input
                    type="file"
                    {...({ webkitdirectory: "", directory: "" } as any)}
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Active Plugin Clients</p>
                <div className="space-y-3">
                  <div className={`flex items-center justify-between p-2 rounded-xl border ${bridge.connected ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'}`}>
                    <span className={`text-xs font-mono ${bridge.connected ? 'text-emerald-400' : 'text-rose-400'}`}>Roo-Local-Bridge</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${bridge.connected ? 'bg-emerald-400/20 text-emerald-600 animate-pulse' : 'bg-rose-400/20 text-rose-600'}`}>
                      {bridge.connected ? 'TUNNEL_OPEN' : 'TUNNEL_CLOSED'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-xl border border-gray-700/50">
                    <span className="text-xs font-mono text-gray-400">Claude-Desktop-Proxy</span>
                    <span className="text-[9px] text-gray-500 font-bold px-2 py-0.5 bg-gray-700 rounded-full">OFFLINE</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Exposed Tools</p>
                <div className="flex flex-wrap gap-2">
                  {TOOLS.map(tool => (
                    <span key={tool.name} className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded-lg text-[9px] font-mono text-gray-300">
                      {tool.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-center">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 text-center">Protocol Context</p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-black text-white">{files.length}</span>
                  <span className="text-xs text-gray-500 font-mono tracking-tighter uppercase">FILES_MOUNTED</span>
                </div>
              </div>
            </div>

            {results ? <Dashboard results={results} /> : (
              <div className="border-2 border-dashed border-gray-800/50 rounded-[2.5rem] p-20 text-center bg-gray-900/10">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5">
                  <Database className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-300 tracking-tight">Node Context Empty</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">Upload your source directory or use Roo Code to trigger an architectural sweep.</p>
                <button
                  onClick={() => callTool('inspect_architecture')}
                  disabled={files.length === 0}
                  className={`mt-8 px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${files.length > 0 ? 'bg-white text-black hover:bg-emerald-400 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-emerald-500/30' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                >
                  Force Initial Sweep
                </button>
              </div>
            )}
          </div>
        );
      case 'tools': return <ToolRegistry tools={TOOLS} />;
      case 'ide': return <VSCodeIntegration tools={TOOLS} />;
      case 'explorer': return <FileExplorer files={files} onFileSelect={setActiveFile} selectedFile={activeFile} />;
      case 'debt': return results ? <DebtRadar items={results.debtItems} /> : null;
      case 'refactor': return results ? <RefactorCenter proposals={results.refactors} /> : null;
      case 'compliance': return results ? <ComplianceAudit items={results.compliance} /> : null;
      case 'sandbox': return results ? <SandboxTerminal logs={results.sandboxLogs} /> : null;
      case 'logs': return <ProtocolLogs logs={logs} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] text-gray-100 overflow-hidden font-sans">
      <Sidebar activeView={activeView} onViewChange={setActiveView} hasResults={!!results} bridgeConnected={bridge.connected} />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-gray-950/80 backdrop-blur-2xl sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-emerald-500 rounded flex items-center justify-center font-black text-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.5)]">A</div>
            <h1 className="text-sm font-black tracking-[0.2em] uppercase text-white">Aether-Arch <span className="text-emerald-500 font-mono opacity-80">:: MCP</span></h1>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] ${bridge.connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 opacity-50'}`}></div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${bridge.connected ? 'text-emerald-500' : 'text-gray-600'}`}>
                {bridge.connected ? 'Bridge Active' : 'Bridge Offline'}
              </span>
            </div>
            <button className="p-2 hover:bg-gray-900 rounded-xl transition-all">
              <Settings className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05)_0%,rgba(0,0,0,0)_100%)] pointer-events-none"></div>
          {renderContent()}
        </section>

        <MiniCopilotHUD analysis={targetedAnalysis} activeFile={activeFile} />
      </main>
    </div>
  );
};

export default App;
