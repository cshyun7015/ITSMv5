import React, { useState, useEffect } from 'react';
import { useIncidents } from '../hooks/useIncidents';
import { incidentApi } from '../api/incidentApi';
import FileUpload from '../../../components/common/FileUpload';
import type { Incident, IncidentPriority, IncidentStatus } from '../types';

const STATUS_COLOR: Record<IncidentStatus, string> = {
  INC_OPEN: '#ff6b6b',
  INC_IN_PROGRESS: '#ff922b',
  INC_RESOLVED: '#51cf66',
  INC_ON_HOLD: '#adb5bd',
  INC_CLOSED: '#495057',
  INC_CANCELED: '#fa5252',
};

const STATUS_LABEL: Record<IncidentStatus, string> = {
  INC_OPEN: '🔴 신규 접수',
  INC_IN_PROGRESS: '🟠 처리 중',
  INC_RESOLVED: '🟢 조치 완료',
  INC_ON_HOLD: '⚪ 보류',
  INC_CLOSED: '⚫ 종료',
  INC_CANCELED: '🔴 취소됨',
};

const PRIORITY_COLOR: Record<IncidentPriority, string> = {
  Critical: '#ff6b6b',
  High: '#ff922b',
  Medium: '#fcc419',
  Low: '#74c0fc',
};

const IncidentList: React.FC<{ user: any, onSelectDetail: (id: number) => void }> = ({ user, onSelectDetail }) => {
  const { incidents, loading, error, createIncident, refresh } = useIncidents();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'Medium', impact: 'Individual', assetId: '' });
  const [assets, setAssets] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const token = localStorage.getItem('itsm_token');
        try {
            const res = await fetch(`${apiUrl}/api/assets`, { headers: { 'Authorization': `Bearer ${token}` }});
            if (res.ok) setAssets(await res.json());
        } catch (e) {
            console.error(e);
        }
    };
    fetchAssets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createIncident({ ...form, reporterId: user.userId }, files);
      setShowForm(false);
      setForm({ title: '', description: '', priority: 'Medium', impact: 'Individual', assetId: '' });
      setFiles([]);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      <span className="ml-4 text-slate-400">Loading incidents...</span>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Incident Management</h1>
          <p className="mt-2 text-slate-400">Manage and resolve service disruptions efficiently.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className={`px-6 py-2.5 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
            showForm ? 'bg-slate-700 text-slate-300' : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {showForm ? '✕ Cancel' : '+ Report Incident'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl border border-red-900/40 shadow-2xl mb-12 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-2">
            <span className="text-2xl">🚨</span> New Incident Report
          </h2>
          
          <div className="grid gap-6">
            <div className="group">
              <label className="block text-slate-400 text-sm font-semibold mb-2 group-focus-within:text-red-400 transition-colors">Incident Title *</label>
              <input 
                required 
                placeholder="Brief summary of the issue..." 
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all font-medium"
              />
            </div>

            <div className="group">
              <label className="block text-slate-400 text-sm font-semibold mb-2 group-focus-within:text-red-400 transition-colors">Detailed Description</label>
              <textarea 
                placeholder="What exactly happened?" 
                rows={4} 
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all font-medium resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-slate-400 text-sm font-semibold mb-2">Priority</label>
                <select 
                  value={form.priority} 
                  onChange={e => setForm({ ...form, priority: e.target.value })} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-medium cursor-pointer"
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div className="group">
                <label className="block text-slate-400 text-sm font-semibold mb-2">Service Impact</label>
                <select 
                  value={form.impact} 
                  onChange={e => setForm({ ...form, impact: e.target.value })} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-medium cursor-pointer"
                >
                  <option>Service-wide</option>
                  <option>Department</option>
                  <option>Individual</option>
                </select>
              </div>
            </div>

            <div className="group">
              <label className="block text-slate-400 text-sm font-semibold mb-2">Linked Asset (BIA)</label>
              <select 
                value={form.assetId} 
                onChange={e => setForm({ ...form, assetId: e.target.value })} 
                className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-medium cursor-pointer"
              >
                <option value="">-- Select related equipment/software --</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.assetName} ({a.assetTag})</option>)}
              </select>
            </div>

            <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-700/50">
              <label className="block text-slate-400 text-sm font-semibold mb-3">Evidence & Attachments</label>
              <FileUpload files={files} onChange={setFiles} />
            </div>

            <button 
              type="submit" 
              disabled={submitting} 
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-extrabold text-lg transition-all transform hover:translate-y-[-2px] hover:shadow-xl hover:from-red-700 hover:to-red-600 active:translate-y-[0] disabled:bg-slate-700 disabled:cursor-not-allowed shadow-red-900/20"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                  Submitting Report...
                </span>
              ) : '🚨 Submit Incident Report'}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-6">
        {incidents.length === 0 ? (
          <div className="bg-slate-800/30 rounded-3xl p-24 text-center border border-slate-700/50 border-dashed backdrop-blur-sm">
            <div className="text-6xl mb-6 grayscale opacity-40">🏢</div>
            <div className="text-slate-300 text-2xl font-bold mb-3">No active incidents</div>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">System is performing optimally. Any reported issues will appear here for tracking and resolution.</p>
          </div>
        ) : (
          incidents.map((inc: Incident) => (
            <div 
              key={inc.id} 
              onClick={() => onSelectDetail(inc.id)}
              className="group bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:border-slate-500/40 cursor-pointer"
            >
              <div className="flex flex-wrap justify-between items-start gap-6">
                <div className="flex-1 min-w-[300px]">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="font-mono text-[10px] text-slate-500 tracking-tighter bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-800/50">INC#{inc.id}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg shadow-sm" style={{ backgroundColor: `${PRIORITY_COLOR[inc.priority]}22`, color: PRIORITY_COLOR[inc.priority], border: `1px solid ${PRIORITY_COLOR[inc.priority]}44` }}>
                        {inc.priority}
                    </span>
                    <h3 className="text-xl font-bold text-slate-100 group-hover:text-red-400 transition-colors truncate">{inc.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-6">
                    <span className="flex items-center gap-1.5"><span className="text-[10px] uppercase text-slate-600 font-black">Impact</span> {inc.impact}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-700"></span>
                    <span className="text-slate-600">{new Date(inc.createdAt).toLocaleString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    {/* Business Impact Analysis (BIA) View */}
                    {inc.assetId && <ImpactedServices assetId={inc.assetId} />}
                    <IncidentAttachments incidentId={inc.id} />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 min-w-[140px]">
                   <div className="px-5 py-2 rounded-2xl text-[11px] font-black tracking-wider uppercase border shadow-inner" style={{ backgroundColor: `${STATUS_COLOR[inc.status]}15`, color: STATUS_COLOR[inc.status], borderColor: `${STATUS_COLOR[inc.status]}30` }}>
                    {STATUS_LABEL[inc.status] || inc.status}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function IncidentAttachments({ incidentId }: { incidentId: number }) {
  const [attachments, setAttachments] = useState<any[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  useEffect(() => {
    incidentApi.getAttachments(incidentId)
        .then(setAttachments)
        .catch(err => console.error(err));
  }, [incidentId]);

  if (attachments.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {attachments.map(at => (
        <a 
            key={at.id} 
            href={`${apiUrl}/api/attachments/download/${at.id}`} 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 bg-blue-900/10 hover:bg-blue-500 hover:text-white transition-all px-3 py-1 rounded-lg border border-blue-900/20"
        >
          📎 {at.originalName}
        </a>
      ))}
    </div>
  );
}

function ImpactedServices({ assetId }: { assetId: number }) {
  const [impacted, setImpacted] = useState<any[]>([]);

  useEffect(() => {
    incidentApi.getImpactedServices(assetId)
        .then(setImpacted)
        .catch(console.error);
  }, [assetId]);

  if (impacted.length === 0) return null;

  return (
    <div className="bg-red-950/20 border border-red-900/30 rounded-xl px-4 py-3 shadow-inner">
      <div className="text-[10px] text-red-400 font-extrabold uppercase tracking-tighter mb-2 flex items-center gap-1.5">
        <span className="text-sm">⚠️</span> Business Impact Analysis (BIA)
      </div>
      <div className="flex flex-col gap-1.5">
        {impacted.map(svc => (
          <div key={svc.id} className="text-[11px] font-bold text-slate-200 flex items-center justify-between gap-4">
            <span className="flex items-center gap-2"><span className="h-1 w-1 bg-red-400 rounded-full"></span>{svc.name}</span>
            <span className="text-[9px] uppercase tracking-widest text-red-500/70">{svc.criticality}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IncidentList;
