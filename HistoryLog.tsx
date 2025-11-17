
import React from 'react';
import { HistoryEntry, Status } from './types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface HistoryLogProps {
  history: HistoryEntry[];
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  return (
    <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Status History</h3>
      <div className="max-h-80 overflow-y-auto pr-2">
        {history.length === 0 ? (
          <p className="text-center text-slate-500 py-8">No status changes recorded yet.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((entry, index) => (
              <li key={index} className="flex items-center gap-4 text-sm">
                {entry.status === Status.UP ? (
                  <CheckCircleIcon className="w-5 h-5 text-brand-green flex-shrink-0" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-brand-red flex-shrink-0" />
                )}
                <span className={`font-medium ${entry.status === Status.UP ? 'text-brand-green' : 'text-brand-red'}`}>
                  {entry.status}
                </span>
                <span className="text-slate-400 text-xs ml-auto">
                  {entry.timestamp.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
