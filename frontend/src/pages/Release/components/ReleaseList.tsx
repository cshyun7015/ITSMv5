import React, { useState } from 'react';
import { useReleases } from '../hooks/useReleases';
import type { ReleaseStatus } from '../types';

const STATUS_COLOR: Record<ReleaseStatus, string> = {
  REL_PLANNING: 'border-slate-500/50 text-slate-400 bg-slate-500/10',
  REL_BUILD: 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10',
  REL_TESTING: 'border-blue-500/50 text-blue-400 bg-blue-500/10',
  REL_ROLLOUT: 'border-orange-500/50 text-orange-400 bg-orange-500/10',
  REL_COMPLETED: 'border-green-500/50 text-green-400 bg-green-500/10',
  REL_FAILED: 'border-red-500/50 text-red-400 bg-red-500/10',
};

const STATUS_LABEL: Record<ReleaseStatus, string> = {
  REL_PLANNING: '계획 중 (PLANNING)',
  REL_BUILD: '빌드 (BUILD)',
  REL_TESTING: '테스트 (TESTING)',
  REL_ROLLOUT: '배포 수행 (ROLLOUT)',
  REL_COMPLETED: '완료 (COMPLETED)',
  REL_FAILED: '실패/회수 (FAILED)',
};

const ReleaseList: React.FC<{ user: any, onSelectDetail: (id: number) => void }> = ({ user, onSelectDetail }) => {
  const { releases, loading, error, createRelease } = useReleases();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    title: '', description: '', releaseType: 'Minor', version: '', buildNumber: '', targetDate: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Send null if targetDate is empty string to avoid Jackson parsing error
      const payload = { 
        ...form, 
        targetDate: form.targetDate || undefined 
      };
      await createRelease(payload as any);
      setShowForm(false);
      setForm({ title: '', description: '', releaseType: 'Minor', version: '', buildNumber: '', targetDate: '' });
    } catch (e: any) {
      console.error(e);
      // Optional: Give feedback if needed, but for now we follow the existing log pattern
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-slate-700 h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-slate-700 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-700 rounded col-span-2"></div>
              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Release Control</h1>
          <p className="text-slate-500 font-bold text-xs tracking-[0.3em] uppercase mt-1">Deployment Governance & Versioning</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className={`flex items-center gap-3 px-8 py-4 font-black text-xs tracking-widest transition-all ${
            showForm ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
          }`}
        >
          {showForm ? 'CLOSE STAGING' : 'INITIATE RELEASE'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-blue-500/20 p-10 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full"></div>
          
          <div className="flex items-center gap-3 mb-10">
            <div className="h-1 w-6 bg-blue-500"></div>
            <h2 className="text-lg font-black text-white tracking-widest uppercase">Staging New Deployment</h2>
          </div>
          
          <div className="grid gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Deployment Title</label>
              <input 
                required 
                placeholder="Product v1.0.0 Stable..." 
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                className="w-full px-0 py-4 bg-transparent border-b border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-all font-bold text-xl"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Version</label>
                <input 
                  placeholder="v1.0.0" 
                  value={form.version} 
                  onChange={e => setForm({ ...form, version: e.target.value })} 
                  className="w-full px-6 py-4 bg-black/40 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-all font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Build Number</label>
                <input 
                  placeholder="2026.03.28-01" 
                  value={form.buildNumber} 
                  onChange={e => setForm({ ...form, buildNumber: e.target.value })} 
                  className="w-full px-6 py-4 bg-black/40 border border-slate-800 text-white focus:outline-none focus:border-blue-500 transition-all font-bold text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Classification</label>
                <div className="flex gap-4">
                  {['Major', 'Minor', 'Patch', 'Emergency'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, releaseType: type })}
                      className={`flex-1 py-3 text-[10px] font-black tracking-widest uppercase border transition-all ${
                        form.releaseType === type ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Target Launch Window</label>
                <input 
                  type="datetime-local" 
                  value={form.targetDate} 
                  onChange={e => setForm({ ...form, targetDate: e.target.value })} 
                  className="w-full px-6 py-3 bg-black/40 border border-slate-800 text-white focus:border-blue-500 focus:outline-none font-black text-xs" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting} 
              className="mt-6 py-5 bg-blue-600 text-white font-black tracking-[0.3em] uppercase hover:bg-blue-500 active:scale-[0.98] transition-all disabled:bg-slate-800"
            >
              {submitting ? 'COMMITTING TO REGISTRY...' : 'PUBLISH RELEASE PLAN'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {releases.length === 0 ? (
          <div className="col-span-full p-20 text-center border border-dashed border-slate-800">
            <span className="text-slate-600 font-black tracking-[0.5em] uppercase text-sm">Deployment Registry Empty</span>
          </div>
        ) : releases.map(rel => (
          <div 
            key={rel.id} 
            onClick={() => onSelectDetail(rel.id)}
            className="group relative bg-slate-900 border border-slate-800 p-8 transition-all hover:bg-black hover:border-blue-500/30 overflow-hidden cursor-pointer"
          >
            <div className={`absolute top-0 right-0 px-4 py-1 text-[8px] font-black tracking-widest uppercase border ${STATUS_COLOR[rel.status as ReleaseStatus]}`}>
               {STATUS_LABEL[rel.status as ReleaseStatus] || rel.status}
            </div>
            
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[9px] font-black text-blue-500 tracking-widest uppercase border border-blue-500/20 px-2 py-0.5 bg-blue-500/5">VERSION: {rel.releaseType}</span>
                  <span className="text-[9px] font-black text-slate-600 tracking-tighter italic">#REL-{rel.id}</span>
                </div>
                <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors tracking-tight uppercase">{rel.title}</h3>
                <p className="text-slate-500 font-bold text-xs leading-relaxed mt-2 line-clamp-2 italic">"{rel.description || 'No manifest provided.'}"</p>
              </div>

              <div className="flex items-end justify-between border-t border-slate-800/50 pt-6 mt-2">
                 <div className="space-y-1">
                    <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Deployment Date</div>
                    <div className="text-xs font-black text-slate-300">{rel.targetDate ? new Date(rel.targetDate).toLocaleString() : 'UNDEFINED'}</div>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-2 border border-slate-800 text-slate-500 hover:text-white hover:border-slate-700 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    <button className="px-4 py-2 bg-slate-800 text-[10px] font-black text-slate-300 hover:bg-slate-700 tracking-widest uppercase">
                      Audit Log
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default ReleaseList;
