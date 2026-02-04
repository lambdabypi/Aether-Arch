
import React, { useState } from 'react';
import { TargetedRefactor, FileContent } from '../types';
import { 
  Zap, 
  Activity, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft, 
  Minimize2, 
  Maximize2,
  CheckCircle2,
  AlertCircle,
  FileCode
} from 'lucide-react';

interface HUDProps {
  analysis: TargetedRefactor | null;
  activeFile: FileContent | null;
}

const MiniCopilotHUD: React.FC<HUDProps> = ({ analysis, activeFile }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showDiff, setShowDiff] = useState(false);

  if (!activeFile) return null;

  if (isMinimized) {
    return (
      <button 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all z-50 border border-emerald-400/50 group"
      >
        <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Zap className="w-6 h-6 text-black fill-current" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#030712] flex items-center justify-center">
           <span className="text-[8px] font-bold text-white">1</span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-gray-900/80 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500">
      <div className="p-4 bg-emerald-500/10 border-b border-emerald-500/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Aether-HUD</span>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setShowDiff(!showDiff)} className="p-1 hover:bg-emerald-500/10 rounded transition-colors">
              <Activity className={`w-3.5 h-3.5 ${showDiff ? 'text-emerald-400' : 'text-gray-500'}`} />
           </button>
           <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-emerald-500/10 rounded transition-colors">
              <Minimize2 className="w-3.5 h-3.5 text-gray-500" />
           </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center border border-white/5">
                <FileCode className="w-4 h-4 text-gray-400" />
             </div>
             <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Focusing File</p>
                <p className="text-xs font-mono text-white truncate max-w-[120px]">{activeFile.name}</p>
             </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Health Score</p>
              <p className={`text-lg font-black font-mono ${!analysis ? 'text-gray-600' : analysis.health > 80 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {analysis ? `${analysis.health}%` : '--'}
              </p>
           </div>
        </div>

        {!analysis ? (
           <div className="py-4 text-center space-y-3">
              <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">Scanning Context...</p>
           </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="p-3 bg-gray-800/40 rounded-2xl border border-white/5">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                   <p className="text-xs font-bold text-gray-200">{analysis.proposal.title}</p>
                   <p className="text-[10px] text-gray-500 mt-1 leading-relaxed line-clamp-2">{analysis.proposal.description}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowDiff(true)}
              className="w-full py-3 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-[0_8px_16px_-4px_rgba(16,185,129,0.3)] hover:shadow-emerald-500/40 transition-all active:scale-95"
            >
              Verify Propose Fix
            </button>
          </div>
        )}
      </div>

      {showDiff && analysis && (
        <div className="absolute inset-0 bg-gray-950/95 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <button onClick={() => setShowDiff(false)} className="flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase hover:text-white transition-colors">
               <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Code Diff Explorer</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {analysis.proposal.codeChanges.map((change, i) => (
              <div key={i} className="space-y-2">
                <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1 truncate">{change.file}</p>
                <div className="rounded-xl overflow-hidden border border-white/5">
                  <div className="bg-rose-500/10 p-3">
                    <pre className="text-[10px] text-rose-300/60 font-mono line-through whitespace-pre-wrap">{change.before}</pre>
                  </div>
                  <div className="bg-emerald-500/10 p-3">
                    <pre className="text-[10px] text-emerald-400 font-mono whitespace-pre-wrap">{change.after}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-emerald-500/5 flex gap-2">
             <button className="flex-1 py-2 rounded-lg bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest">Apply Change</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCopilotHUD;
