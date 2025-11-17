
import React from 'react';
import { Status } from './types';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from './icons';

interface StatusDisplayProps {
  status: Status;
  url: string;
  lastChecked: Date | null;
}

const statusConfig = {
  [Status.UP]: {
    text: 'Online',
    color: 'text-brand-green',
    bgColor: 'bg-brand-green/10',
    borderColor: 'border-brand-green/20',
    icon: <CheckCircleIcon className="w-8 h-8" />,
  },
  [Status.DOWN]: {
    text: 'Offline',
    color: 'text-brand-red',
    bgColor: 'bg-brand-red/10',
    borderColor: 'border-brand-red/20',
    icon: <XCircleIcon className="w-8 h-8" />,
  },
  [Status.CHECKING]: {
    text: 'Checking...',
    color: 'text-brand-yellow',
    bgColor: 'bg-brand-yellow/10',
    borderColor: 'border-brand-yellow/20',
    icon: <ArrowPathIcon className="w-8 h-8 animate-spin" />,
  },
  [Status.INITIAL]: {
    text: 'Initializing...',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/20',
    icon: <ArrowPathIcon className="w-8 h-8 animate-spin" />,
  },
};

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ status, url, lastChecked }) => {
  const config = statusConfig[status];

  return (
    <div className={`p-6 rounded-2xl border ${config.bgColor} ${config.borderColor} shadow-lg transition-all duration-300`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-grow text-center sm:text-left">
          <p className="text-sm text-slate-400">Monitoring URL</p>
          <a href={`https://${url}`} target="_blank" rel="noopener noreferrer" className="text-lg md:text-xl font-semibold text-brand-blue hover:underline break-all">{url}</a>
        </div>
        <div className={`flex items-center gap-4 p-4 rounded-lg ${config.bgColor}`}>
          <div className={config.color}>
            {config.icon}
          </div>
          <p className={`text-2xl font-bold ${config.color}`}>{config.text}</p>
        </div>
      </div>
      <div className="text-right text-xs text-slate-500 mt-4 h-4">
        {lastChecked && `Last checked: ${lastChecked.toLocaleTimeString()}`}
      </div>
    </div>
  );
};
