
import React from 'react';
import { DebtItem } from '../types';
import { AlertCircle, Target, ArrowRight } from 'lucide-react';

const DebtRadar: React.FC<{ items: DebtItem[] }> = ({ items }) => {
  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Architectural Debt Backlog</h2>
          <p className="text-gray-400 text-sm mt-1">AI-identified structural risks and technical entropy nodes.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg">
          <AlertCircle className="w-4 h-4 text-rose-400" />
          <span className="text-sm font-medium">{items.length} Risk Nodes</span>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="group bg-gray-900/40 border border-gray-800 rounded-2xl p-6 transition-all hover:border-gray-700 hover:bg-gray-900/60">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getSeverityStyles(item.severity)}`}>
                  {item.severity}
                </span>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">{item.category}</span>
              </div>
              <span className="mono text-xs text-gray-500 group-hover:text-emerald-400 transition-colors">{item.location}</span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-100 mb-2">{item.description}</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{item.impact}</p>
            
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400/80 group-hover:text-emerald-400 transition-colors">
              <Target className="w-3 h-3" />
              Propose automated resolution path
              <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebtRadar;
