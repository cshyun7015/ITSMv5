import React, { useState } from 'react';
import { useSLAs } from '../hooks/useSLAs';
import type { SLAStatus } from '../types';

const STATUS_CONFIG: Record<SLAStatus, { label: string; color: string; bg: string; icon: string }> = {
  SLA_MET: { label: 'COMPLIANT', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: 'M5 13l4 4L19 7' },
  SLA_WARNING: { label: 'AT RISK', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  SLA_NOT_MET: { label: 'BREACHED', color: 'text-red-400', bg: 'bg-red-500/10', icon: 'M6 18L18 6M6 6l12 12' },
};

const SLAList: React.FC<{ user: any }> = ({ user }) => {
  const { slas, loading, createSLA } = useSLAs();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    serviceName: '', targetValue: 99.9, actualValue: 0, unit: '%', period: new Date().toISOString().slice(0, 7) 
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createSLA(form);
      setShowForm(false);
      setForm({ serviceName: '', targetValue: 99.9, actualValue: 0, unit: '%', period: new Date().toISOString().slice(0, 7) });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="flex space-x-2">
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );

  return (
    <div className="p-10">
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-[2px] bg-emerald-500"></div>
             <span className="text-emerald-500 font-black text-xs tracking-[0.5em] uppercase">Service Quality Assurance</span>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">SLA Monitoring</h1>
          <p className="text-slate-500 font-bold text-sm tracking-widest uppercase italic max-w-xl">Real-time performance tracking against contractual service level agreements.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className={`px-10 py-4 font-black text-xs tracking-widest transition-all clip-path-polygon ${
            showForm ? 'bg-slate-800 text-slate-500' : 'bg-white text-black hover:bg-emerald-500 hover:text-white'
          }`}
          style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
        >
          {showForm ? 'CLOSE RECORD' : 'LOG SLA RECORD'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border-l-4 border-emerald-500 p-12 mb-16 animate-in fade-in slide-in-from-left-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Service / Metric Name</label>
              <input 
                required 
                placeholder="Systems Availability..." 
                value={form.serviceName} 
                onChange={e => setForm({ ...form, serviceName: e.target.value })} 
                className="w-full px-0 py-3 bg-transparent border-b-2 border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-all font-black text-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Target Threshold</label>
              <div className="flex items-center gap-4">
                <input 
                  type="number" step="0.01"
                  value={form.targetValue} 
                  onChange={e => setForm({ ...form, targetValue: parseFloat(e.target.value) })} 
                  className="flex-1 px-0 py-3 bg-transparent border-b-2 border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-all font-black text-2xl"
                />
                <span className="text-slate-700 font-black text-xl">{form.unit}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Actual Measured Value</label>
              <input 
                type="number" step="0.01"
                value={form.actualValue} 
                onChange={e => setForm({ ...form, actualValue: parseFloat(e.target.value) })} 
                className="w-full px-0 py-3 bg-transparent border-b-2 border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-all font-black text-2xl text-emerald-400"
              />
            </div>
          </div>
          
          <div className="mt-12 flex justify-between items-center">
             <div className="flex gap-10">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-600 tracking-widest uppercase">Unit</label>
                  <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className="bg-transparent border-b border-slate-800 text-white font-black text-xs uppercase focus:outline-none">
                    <option>%</option><option>ms</option><option>min</option><option>hr</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-600 tracking-widest uppercase">Measurement Period</label>
                  <input type="month" value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} className="bg-transparent border-b border-slate-800 text-white font-black text-xs uppercase focus:outline-none" />
                </div>
             </div>
             <button 
                type="submit" 
                disabled={submitting} 
                className="px-12 py-5 bg-emerald-600 text-white font-black tracking-[0.3em] uppercase hover:bg-emerald-500 active:scale-95 transition-all disabled:bg-slate-800"
              >
                {submitting ? 'RECORDING...' : 'COMMIT AUDIT DATA'}
              </button>
          </div>
        </form>
      )}

      <div className="space-y-8">
        {slas.length === 0 ? (
          <div className="p-32 text-center bg-slate-900 border border-slate-800 border-dashed">
            <span className="text-slate-700 font-black tracking-[1em] uppercase">Historical matrix empty</span>
          </div>
        ) : slas.map(sla => {
          const config = STATUS_CONFIG[sla.status] || STATUS_CONFIG.SLA_MET;
          const percentage = Math.min(100, Math.max(0, (sla.actualValue / (sla.targetValue || 1)) * 100));
          
          return (
            <div key={sla.id} className="group flex items-center bg-[#0a0a0c] border border-slate-900 p-8 hover:bg-black hover:border-emerald-500/20 transition-all">
              <div className="w-48">
                <div className="text-[9px] font-black text-slate-600 tracking-widest uppercase mb-1">Period: {sla.period}</div>
                <h4 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{sla.serviceName}</h4>
              </div>

              <div className="flex-1 px-16">
                 <div className="flex justify-between text-[10px] font-black tracking-widest uppercase mb-3">
                    <span className="text-slate-500">Threshold: {sla.targetValue}{sla.unit}</span>
                    <span className={config.color}>Measured: {sla.actualValue}{sla.unit}</span>
                 </div>
                 <div className="h-2 w-full bg-slate-900 overflow-hidden relative">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out ${percentage >= 95 ? 'bg-emerald-500' : percentage >= 90 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-white opacity-20 shadow-[0_0_10px_white]" style={{ left: '99.9%' }}></div>
                 </div>
              </div>

              <div className="flex items-center gap-8 w-64 justify-end">
                 <div className={`px-4 py-2 border ${config.bg} ${config.color} border-current text-[10px] font-black tracking-widest flex items-center gap-2`}>
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d={config.icon} /></svg>
                   {config.label}
                 </div>
                 <div className="text-right">
                    <div className="text-[8px] font-black text-slate-700 uppercase">Audit Timestamp</div>
                    <div className="text-[10px] font-black text-slate-500">{new Date(sla.createdAt).toLocaleDateString()}</div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SLAList;
