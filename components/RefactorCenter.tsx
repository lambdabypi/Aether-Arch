
import React, { useState } from 'react';
import { RefactorProposal } from '../types';
import { Check, Copy, Code2, Layers, Zap, ChevronDown, ChevronUp } from 'lucide-react';

const RefactorCenter: React.FC<{ proposals: RefactorProposal[] }> = ({ proposals }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Verified Migration Paths</h2>
          <p className="text-gray-400 text-sm mt-1">Automated code transforms designed for resilience and scalability.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-black font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20">
          <Zap className="w-4 h-4 fill-current" /> Auto-Execute Batch
        </button>
      </div>

      <div className="space-y-6">
        {proposals.map((proposal, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <button 
              onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-xl">
                  <Layers className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{proposal.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{proposal.description}</p>
                </div>
              </div>
              {expandedIdx === idx ? <ChevronUp className="text-gray-500" /> : <ChevronDown className="text-gray-500" />}
            </button>

            {expandedIdx === idx && (
              <div className="p-6 pt-0 border-t border-gray-800 bg-gray-950/50 animate-in slide-in-from-top-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Strategic Benefits</p>
                    <ul className="space-y-3">
                      {proposal.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Blast Radius</p>
                    <div className="flex flex-wrap gap-2">
                      {proposal.codeChanges.map((change, cIdx) => (
                        <span key={cIdx} className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-md text-[10px] mono text-gray-300">
                          {change.file}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {proposal.codeChanges.map((change, cIdx) => (
                    <div key={cIdx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 mono">{change.file}</span>
                        <div className="flex items-center gap-2">
                           <button className="p-1.5 hover:bg-gray-800 rounded transition-colors" title="Copy patch">
                            <Copy className="w-3.5 h-3.5 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-gray-800 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
                        <div className="bg-gray-900/80 p-4">
                          <p className="text-[10px] font-bold text-rose-400 mb-2 uppercase">Current Implementation</p>
                          <pre className="text-xs text-rose-300/80 line-through overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                            {change.before}
                          </pre>
                        </div>
                        <div className="bg-emerald-950/20 p-4">
                          <p className="text-[10px] font-bold text-emerald-400 mb-2 uppercase">Proposed (Optimized)</p>
                          <pre className="text-xs text-emerald-300/90 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                            {change.after}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefactorCenter;
