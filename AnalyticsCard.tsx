
import React from 'react';

interface AnalyticsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ icon, title, value, description }) => {
  return (
    <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 flex items-start gap-4 transition-all hover:bg-slate-800 hover:border-slate-700">
      <div className="bg-slate-700/50 p-3 rounded-lg text-brand-blue">
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-100">{value}</p>
        {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      </div>
    </div>
  );
};
