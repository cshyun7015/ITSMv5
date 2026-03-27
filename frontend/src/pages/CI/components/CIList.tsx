import React, { useState } from 'react';
import { useCI } from '../hooks/useCI';

const CI_TYPES = ['Server', 'Database', 'Application', 'Cluster', 'Network Node', 'Storage LUN'];

const CIList: React.FC<{ user: any }> = ({ user }) => {
  const { cis, loading, createCI } = useCI();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'Server', status: 'CI_ACTIVE', model: '', location: '', specifications: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCI(form);
      setShowForm(false);
      setForm({ name: '', type: 'Server', status: 'CI_ACTIVE', model: '', location: '', specifications: '' });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      <span className="text-[10px] font-black text-indigo-500 tracking-widest uppercase animate-pulse">Mapping Topology...</span>
    </div>
  );

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-16 border-b border-white/5 pb-12">
        <div className="flex items-center gap-10">
          <div className="w-20 h-20 border border-indigo-500/30 flex items-center justify-center relative group">
            <div className="absolute inset-2 border border-indigo-500/10 group-hover:border-indigo-500/40 transition-all"></div>
            <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-widest uppercase leading-none italic">CI Engine</h1>
            <p className="text-indigo-400 font-bold text-xs tracking-[0.5em] uppercase">Service Configuration & Topology</p>
          </div>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-white text-black px-12 py-5 font-black text-[10px] tracking-[0.4em] uppercase hover:bg-indigo-500 hover:text-white transition-all shadow-[8px_8px_0_rgba(255,255,255,0.1)] hover:translate-x-[-4px] hover:translate-y-[-4px] active:translate-x-0 active:translate-y-0"
        >
          {showForm ? 'CANCEL LINK' : 'ADD NEW COMPONENT'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-indigo-950/20 border border-indigo-500/20 p-12 mb-16 relative backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="space-y-2 col-span-1 lg:col-span-2">
               <label className="text-[10px] font-black text-indigo-400 tracking-widest uppercase opacity-50">CI Identifier / Name</label>
               <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white font-black text-xl placeholder:text-white/10 focus:outline-none focus:border-indigo-500 transition-all" placeholder="vSphere-Cluster-PRD-01" />
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-indigo-400 tracking-widest uppercase opacity-50">Component Type</label>
               <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full bg-white/5 border border-white/10 px-6 py-4 text-white font-black text-sm focus:outline-none focus:border-indigo-500 uppercase">
                 {CI_TYPES.map(t => <option key={t} className="bg-slate-900">{t}</option>)}
               </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-12">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-400 tracking-widest uppercase opacity-50">Model / Version</label>
                <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className="w-full bg-transparent border-b border-indigo-500/30 py-2 text-white font-black text-xs uppercase focus:outline-none focus:border-indigo-500 transition-all" />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-indigo-400 tracking-widest uppercase opacity-50">Physical/Virtual Node</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-transparent border-b border-indigo-500/30 py-2 text-white font-black text-xs uppercase focus:outline-none focus:border-indigo-500 transition-all" />
             </div>
             <div className="col-span-1 lg:col-span-2 flex items-end">
                <button type="submit" disabled={submitting} className="w-full py-5 bg-indigo-600 text-white font-black text-[10px] tracking-[0.5em] uppercase hover:bg-indigo-500 transition-all">
                  {submitting ? 'REBUILDING MATRIX...' : 'COMMIT TO CONFIGURATION RECORD'}
                </button>
             </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cis.length === 0 ? (
          <div className="col-span-full border-2 border-dashed border-indigo-900/30 p-24 text-center">
            <span className="text-indigo-900/50 font-black tracking-[1em] uppercase text-xs">Infrastructure Topology Empty</span>
          </div>
        ) : cis.map(ci => (
          <div key={ci.id} className="group relative bg-[#0d0d12] border border-white/5 p-8 hover:border-indigo-500/50 transition-all">
             <div className="absolute top-0 right-10 w-px h-6 bg-indigo-500/30 group-hover:h-full group-hover:bg-indigo-500/10 transition-all"></div>
             
             <div className="flex flex-col gap-8 h-full">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[9px] font-black text-indigo-400 tracking-widest uppercase border border-indigo-500/20 px-2 py-1 leading-none bg-indigo-500/5">{ci.type}</span>
                     <span className="text-[8px] font-black text-white/20 tracking-tighter uppercase italic">{ci.status}</span>
                  </div>
                  <h3 className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{ci.name}</h3>
                </div>

                <div className="space-y-1">
                   <div className="flex justify-between text-[9px] font-black uppercase text-white/30 tracking-widest">
                      <span>Node Status</span>
                      <span className="text-indigo-500">Active Map</span>
                   </div>
                   <div className="h-0.5 w-full bg-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-indigo-500 w-full animate-pulse opacity-50"></div>
                   </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-end">
                   <div>
                      <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Infrastructure Ref</div>
                      <div className="text-[10px] font-black text-white/60 uppercase">{ci.model || 'Native Component'}</div>
                   </div>
                   <div className="flex gap-2">
                      <button className="w-8 h-8 border border-white/10 text-white/20 hover:text-indigo-500 hover:border-indigo-500/50 transition-all flex items-center justify-center">
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </button>
                      <button className="px-3 py-1 bg-white/5 text-[8px] font-black text-white/40 uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">Relations</button>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CIList;
