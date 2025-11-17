import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Status, HistoryEntry } from './types';
import { checkUrlStatus } from './monitoringService';
import { StatusDisplay } from './StatusDisplay';
import { AnalyticsCard } from './AnalyticsCard';
import { HistoryLog } from './HistoryLog';
import { ClockIcon, CalendarDaysIcon, ShieldExclamationIcon } from './icons';

const TARGET_URL = 'mconsultingprep.com';
const CHECK_INTERVAL = 5000; // 5 seconds

const App: React.FC = () => {
  const [status, setStatus] = useState<Status>(Status.INITIAL);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [outageCount, setOutageCount] = useState<number>(0);
  const [lastDownTime, setLastDownTime] = useState<Date | null>(null);
  const [totalDowntime, setTotalDowntime] = useState<number>(0);

  const downtimeStartRef = useRef<Date | null>(null);

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };
  
  const [displayDowntime, setDisplayDowntime] = useState<string>(formatDuration(0));

  useEffect(() => {
      const interval = setInterval(() => {
          let currentTotal = totalDowntime;
          if (downtimeStartRef.current) {
              const ongoingDowntime = (new Date().getTime() - downtimeStartRef.current.getTime()) / 1000;
              currentTotal += ongoingDowntime;
          }
          setDisplayDowntime(formatDuration(currentTotal));
      }, 1000);

      return () => clearInterval(interval);
  }, [totalDowntime]);


  const performCheck = useCallback(async () => {
    setStatus(Status.CHECKING);
    try {
      const result = await checkUrlStatus(TARGET_URL);
      setLastChecked(new Date());

      setStatus((prevStatus) => {
        if (prevStatus !== result.status) {
          setHistory((prevHistory) => [
            { status: result.status, timestamp: new Date() },
            ...prevHistory,
          ].slice(0, 50)); // Keep last 50 entries
        }

        if (result.status === Status.DOWN && prevStatus !== Status.DOWN) {
          setOutageCount((c) => c + 1);
          const now = new Date();
          setLastDownTime(now);
          downtimeStartRef.current = now;
        }

        if (result.status === Status.UP && prevStatus === Status.DOWN && downtimeStartRef.current) {
          const downDuration = (new Date().getTime() - downtimeStartRef.current.getTime()) / 1000;
          setTotalDowntime((t) => t + downDuration);
          downtimeStartRef.current = null;
        }

        return result.status;
      });

    } catch (error) {
      console.error("Failed to check status:", error);
      setStatus(Status.DOWN);
    }
  }, []);

  useEffect(() => {
    performCheck(); // Initial check
    const intervalId = setInterval(performCheck, CHECK_INTERVAL);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 tracking-tight">1 AM Panic Board</h1>
        </header>

        <main className="space-y-6">
          <StatusDisplay status={status} url={TARGET_URL} lastChecked={lastChecked} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnalyticsCard 
              icon={<ShieldExclamationIcon className="w-6 h-6"/>} 
              title="Total Outages" 
              value={outageCount} 
              description="Number of times the site went offline."
            />
         <AnalyticsCard 
              icon={<ClockIcon className="w-6 h-6"/>} 
              title="Time Since Last Outage" 
              value={displayDowntime}
              description = ""
            />
            <AnalyticsCard 
              icon={<CalendarDaysIcon className="w-6 h-6"/>} 
              title="Last Outage" 
              value={lastDownTime ? lastDownTime.toLocaleDateString() : 'N/A'}
              description={lastDownTime ? lastDownTime.toLocaleTimeString() : 'No outages recorded yet.'}
            />
          </div>

          <HistoryLog history={history} />
        </main>
        
        <footer className="text-center mt-12 text-sm text-slate-600">
            <p>1 AM Panic Board &copy; {new Date().getFullYear()}. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
