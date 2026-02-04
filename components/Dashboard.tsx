
import React from 'react';
import { AnalysisResults } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertTriangle, ShieldCheck, Zap, Activity } from 'lucide-react';

const Dashboard: React.FC<{ results: AnalysisResults }> = ({ results }) => {
  const debtSeverityData = [
    { name: 'Critical', value: results.debtItems.filter(i => i.severity === 'Critical').length, color: '#f43f5e' },
    { name: 'High', value: results.debtItems.filter(i => i.severity === 'High').length, color: '#fb923c' },
    { name: 'Medium', value: results.debtItems.filter(i => i.severity === 'Medium').length, color: '#fbbf24' },
    { name: 'Low', value: results.debtItems.filter(i => i.severity === 'Low').length, color: '#34d399' },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          label="Health Score" 
          value={`${results.overallHealthScore}%`} 
          icon={Activity} 
          color="emerald" 
        />
        <StatCard 
          label="Arch Debt Items" 
          value={results.debtItems.length} 
          icon={AlertTriangle} 
          color="rose" 
        />
        <StatCard 
          label="Refactor Paths" 
          value={results.refactors.length} 
          icon={Zap} 
          color="amber" 
        />
        <StatCard 
          label="SOC2 Readiness" 
          value={`${Math.round((results.compliance.filter(i => i.status === 'Pass').length / results.compliance.length) * 100)}%`} 
          icon={ShieldCheck} 
          color="indigo" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Debt Distribution by Severity
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={debtSeverityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#1f2937'}}
                  contentStyle={{backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {debtSeverityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Top Compliance Findings
          </h3>
          <div className="space-y-4">
            {results.compliance.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex items-start justify-between p-3 rounded-lg bg-gray-800/40 border border-gray-700/50">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-200">{item.control}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{item.finding}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; icon: any; color: string }> = ({ label, value, icon: Icon, color }) => {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colorMap[color]} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6 opacity-80" />
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs font-medium uppercase tracking-wider opacity-60">{label}</p>
    </div>
  );
};

const StatusBadge: React.FC<{ status: 'Pass' | 'Fail' | 'Warning' }> = ({ status }) => {
  const styles = {
    Pass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Fail: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    Warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${styles[status]}`}>
      {status}
    </span>
  );
};

export default Dashboard;
