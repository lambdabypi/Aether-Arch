
import React from 'react';
import { DebtItem } from '../types';
// Fixed: Added CheckCircle2 to imports
import { AlertCircle, AlertTriangle, Info, ChevronRight, CheckCircle2 } from 'lucide-react';

const ProblemsView: React.FC<{ items: DebtItem[] }> = ({ items }) => {
  const sortedItems = [...items].sort((a, b) => {
    const priority: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    return priority[a.severity] - priority[b.severity];
  });

  return (
    <div className="flex flex-col h-full bg-gray-950">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-500" />
          Architecture Problems
          <span className="ml-2 text-xs font-normal text-gray-500">
            {items.length} issues detected across active context
          </span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-[10px] uppercase font-bold text-gray-500 tracking-widest bg-gray-900/50">
              <th className="px-6 py-3 w-10"></th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Severity</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {sortedItems.map((item) => (
              <tr key={item.id} className="group hover:bg-gray-900/50 transition-colors cursor-pointer">
                <td className="px-6 py-4">
                  {item.severity === 'Critical' ? <AlertCircle className="w-4 h-4 text-rose-500" /> : 
                   item.severity === 'High' ? <AlertTriangle className="w-4 h-4 text-orange-400" /> :
                   <span className="flex items-center"><Info className="w-4 h-4 text-emerald-400" /></span>}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-200">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.impact}</p>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-gray-400">{item.location}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                    item.severity === 'Critical' ? 'text-rose-400 border-rose-400/20 bg-rose-400/5' :
                    item.severity === 'High' ? 'text-orange-400 border-orange-400/20 bg-orange-400/5' :
                    'text-emerald-400 border-emerald-400/20 bg-emerald-400/5'
                  }`}>
                    {item.severity}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-widest">{item.category}</td>
                <td className="px-6 py-4">
                   <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-emerald-400 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center p-20 text-gray-600">
            <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm italic">No architectural problems detected in the current context.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemsView;
