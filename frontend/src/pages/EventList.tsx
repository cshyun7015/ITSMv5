import React, { useState, useEffect } from 'react';

interface Event {
    id: number;
    alertName: string;
    status: string;
    severity: string;
    description: string;
    source: string;
    instance: string;
    timestamp: string;
    linkedIncidentId: number | null;
}

const EventList: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    useEffect(() => {
        fetchEvents();
        const interval = setInterval(fetchEvents, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('itsm_token');
            const res = await fetch(`${apiUrl}/api/events`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setEvents(data);
            }
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) return <div className="p-8 text-slate-400">Loading event stream...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Event Management</h1>
                <div className="text-sm text-slate-400">
                    Real-time monitoring alerts from integrated sources
                </div>
            </div>

            <div className="grid gap-4">
                {events.length === 0 ? (
                    <div className="bg-slate-800/50 rounded-xl p-12 text-center border border-slate-700/50">
                        <div className="text-slate-500 mb-2">No events recorded yet.</div>
                        <div className="text-xs text-slate-600">Events from monitoring webhooks will appear here.</div>
                    </div>
                ) : (
                    events.map(event => (
                        <div key={event.id} className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 transition-all hover:border-slate-500">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityColor(event.severity)}`}>
                                        {event.severity}
                                    </span>
                                    <h3 className="text-lg font-semibold text-slate-100">{event.alertName}</h3>
                                </div>
                                <div className="text-xs text-slate-500">
                                    {new Date(event.timestamp).toLocaleString()}
                                </div>
                            </div>
                            
                            <div className="text-sm text-slate-400 mb-4 px-1">
                                {event.description}
                                <div className="mt-1 text-xs text-slate-500 italic">
                                    Source: {event.source} | Instance: {event.instance}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
                                <div className={`text-sm font-medium ${getStatusColor(event.status)}`}>
                                    ● {event.status.toUpperCase()}
                                </div>
                                {event.linkedIncidentId && (
                                    <div className="text-xs bg-amber-900/30 text-amber-400 px-3 py-1 rounded-full border border-amber-800/50">
                                        Auto-Linked: INC#{event.linkedIncidentId}
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
