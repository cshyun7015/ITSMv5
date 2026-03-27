import React from 'react';
import { useEvents } from '../hooks/useEvents';
import type { Event as IEvent } from '../types';

const EventList: React.FC = () => {
  const { events, loading, error } = useEvents();

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-900 text-red-100 border-red-700';
      case 'warning': return 'bg-yellow-900 text-yellow-100 border-yellow-700';
      default: return 'bg-blue-900 text-blue-100 border-blue-700';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'firing' ? 'text-red-400' : 'text-green-400';
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-slate-400">Loading events...</span>
    </div>
  );

  if (error) return (
    <div className="p-8 text-red-400 bg-red-900/10 border border-red-900/20 rounded-xl m-6">
      Error loading event stream: {error}
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Event Management</h1>
          <p className="mt-2 text-slate-400 max-w-2xl">
            Real-time monitoring alerts from integrated sources like Grafana and Prometheus.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {events.length === 0 ? (
          <div className="bg-slate-800/40 rounded-2xl p-20 text-center border border-slate-700/50 backdrop-blur-sm">
            <div className="text-5xl mb-6">🏜️</div>
            <div className="text-slate-300 text-xl font-medium mb-2">No events recorded yet.</div>
            <div className="text-slate-500 max-w-sm mx-auto">Events from monitoring webhooks will appear here in real-time.</div>
          </div>
        ) : (
          events.map((event: IEvent) => (
            <div key={event.id} className="group bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 transition-all hover:bg-slate-800/80 hover:border-slate-500/50 hover:shadow-2xl">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${getSeverityColor(event.severity)}`}>
                    {event.severity}
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                    {event.alertName}
                  </h3>
                </div>
                <div className="text-sm font-mono text-slate-500 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/50">
                  {new Date(event.timestamp).toLocaleString()}
                </div>
              </div>
              
              <div className="text-slate-400 mb-6 px-1 leading-relaxed">
                {event.description}
                <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold">
                   <div className="flex items-center gap-1.5 text-slate-500 bg-slate-900/30 px-2 py-1 rounded-md">
                      <span className="text-slate-600 uppercase text-[9px] tracking-tighter">Source</span>
                      {event.source}
                   </div>
                   <div className="flex items-center gap-1.5 text-slate-500 bg-slate-900/30 px-2 py-1 rounded-md">
                      <span className="text-slate-600 uppercase text-[9px] tracking-tighter">Instance</span>
                      {event.instance}
                   </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-5 border-t border-slate-700/30">
                <div className={`flex items-center gap-2 text-sm font-bold ${getStatusColor(event.status)}`}>
                  <span className={`h-2 w-2 rounded-full animate-pulse ${event.status === 'firing' ? 'bg-red-400' : 'bg-green-400'}`}></span>
                  {event.status.toUpperCase()}
                </div>
                {event.linkedIncidentId && (
                  <div className="group/btn flex items-center gap-2 text-xs bg-blue-500/10 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/20 transition-all hover:bg-blue-500 hover:text-white cursor-pointer">
                    <span className="font-bold">Auto-Linked:</span> INC#{event.linkedIncidentId}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;
