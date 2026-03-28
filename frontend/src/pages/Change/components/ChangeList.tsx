import React, { useState } from 'react';
import { useChanges } from '../hooks/useChanges';
import type { ChangeStatus } from '../types';

const STATUS_COLOR: Record<ChangeStatus, string> = {
  CHG_DRAFT: 'border-slate-500/50 text-slate-400 bg-slate-500/10',
  CHG_AUTHORIZATION: 'border-amber-500/50 text-amber-400 bg-amber-500/10',
  CHG_SCHEDULED: 'border-blue-500/50 text-blue-400 bg-blue-500/10',
  CHG_IMPLEMENTATION: 'border-orange-500/50 text-orange-400 bg-orange-500/10',
  CHG_REVIEW: 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10',
  CHG_COMPLETED: 'border-green-500/50 text-green-400 bg-green-500/10',
  CHG_CANCELED: 'border-red-500/50 text-red-400 bg-red-500/10',
};

const STATUS_LABEL: Record<ChangeStatus, string> = {
  CHG_DRAFT: '초안 (DRAFT)',
  CHG_AUTHORIZATION: '승인 대기 (AUTH)',
  CHG_SCHEDULED: '예약됨 (SCHEDULED)',
  CHG_IMPLEMENTATION: '수행 중 (IMP)',
  CHG_REVIEW: '사후 검토 (REVIEW)',
  CHG_COMPLETED: '완료 (COMPLETED)',
  CHG_CANCELED: '취소 (CANCELED)',
};

const ChangeList: React.FC<{ user: any, onSelectDetail: (id: number) => void }> = ({ user, onSelectDetail }) => {
  const { changes, loading, error, createChange } = useChanges();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    title: '', description: '', changeReason: '', riskAssessment: '', 
    impactAnalysis: '', implementationPlan: '', rollbackPlan: '', 
    testPlan: '', changeType: 'Normal', risk: 'Medium', priority: 'Medium',
    plannedStart: '', plannedEnd: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createChange(form);
      setShowForm(false);
      setForm({ 
        title: '', description: '', changeReason: '', riskAssessment: '', 
        impactAnalysis: '', implementationPlan: '', rollbackPlan: '', 
        testPlan: '', changeType: 'Normal', risk: 'Medium', priority: 'Medium',
        plannedStart: '', plannedEnd: '' 
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-widest uppercase">Change Management</h1>
          <div className="h-1 w-20 bg-emerald-500 mt-2 mb-2"></div>
          <p className="text-slate-500 font-bold text-xs tracking-widest uppercase">Requests for Change (RFC) & CAB Governance</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className={`px-8 py-3 rounded-sm font-black text-xs tracking-[0.2em] transition-all transform hover:scale-105 active:scale-95 border-2 ${
            showForm ? 'border-slate-700 text-slate-500' : 'border-emerald-600 bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-white'
          }`}
        >
          {showForm ? 'CANCEL' : 'IDENTIFY RFC'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border-2 border-emerald-500/20 p-10 mb-12 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-4 mb-10">
            <div className="h-8 w-1 bg-emerald-500"></div>
            <h2 className="text-xl font-black text-white tracking-widest uppercase">New RFC Submission</h2>
          </div>
          
          <div className="grid gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Change Title*</label>
              <input 
                required 
                placeholder="High-level summary of the change..." 
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                className="w-full px-6 py-4 bg-black border-b-2 border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Scope of Work</label>
              <textarea 
                placeholder="Detail technical components and target systems..." 
                rows={3} 
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                className="w-full px-6 py-4 bg-black border-b-2 border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Business Case / Reason</label>
                <textarea 
                  placeholder="Why is this change necessary?" 
                  rows={3} 
                  value={form.changeReason} 
                  onChange={e => setForm({ ...form, changeReason: e.target.value })} 
                  className="w-full px-6 py-4 bg-black border-b-2 border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Risk Assessment</label>
                <textarea 
                  placeholder="Evaluate potential failures and mitigation..." 
                  rows={3} 
                  value={form.riskAssessment} 
                  onChange={e => setForm({ ...form, riskAssessment: e.target.value })} 
                  className="w-full px-6 py-4 bg-black border-b-2 border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Rollback Plan *필수</label>
                <textarea 
                  placeholder="Step-by-step restoration procedure..." 
                  rows={2} 
                  value={form.rollbackPlan} 
                  onChange={e => setForm({ ...form, rollbackPlan: e.target.value })} 
                  className="w-full px-6 py-4 bg-black border-b-2 border-slate-800 text-white focus:outline-none focus:border-red-500 transition-all font-bold resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Verification Test Plan</label>
                <textarea 
                  placeholder="How will you verify implementation success?" 
                  rows={2} 
                  value={form.testPlan} 
                  onChange={e => setForm({ ...form, testPlan: e.target.value })} 
                  className="w-full px-6 py-4 bg-black border-b-2 border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Type</label>
                <select value={form.changeType} onChange={e => setForm({ ...form, changeType: e.target.value })} className="w-full px-4 py-3 bg-black border-b-2 border-slate-800 text-white focus:border-emerald-500 focus:outline-none font-black appearance-none">
                  <option>Standard</option><option>Normal</option><option>Emergency</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Risk</label>
                <select value={form.risk} onChange={e => setForm({ ...form, risk: e.target.value })} className="w-full px-4 py-3 bg-black border-b-2 border-slate-800 text-white focus:border-emerald-500 focus:outline-none font-black appearance-none">
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Priority</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full px-4 py-3 bg-black border-b-2 border-slate-800 text-white focus:border-emerald-500 focus:outline-none font-black appearance-none">
                  <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                </select>
              </div>
               <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Window</label>
                <div className="flex gap-2">
                  <input type="datetime-local" value={form.plannedStart} onChange={e => setForm({ ...form, plannedStart: e.target.value })} className="flex-1 px-4 py-3 bg-black border-b-2 border-slate-800 text-white focus:border-emerald-500 focus:outline-none text-[10px] font-black" />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting} 
              className="mt-6 py-6 bg-emerald-600 text-white font-black tracking-[0.3em] uppercase transition-all hover:bg-emerald-500 disabled:bg-slate-800"
            >
              {submitting ? 'PROCESSING...' : 'TRANSMIT RFC TO CAB'}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-6">
        {changes.length === 0 ? (
          <div className="p-20 text-center border-2 border-slate-800 bg-slate-900/40">
            <span className="text-slate-700 font-black tracking-[0.5em] uppercase">No active records</span>
          </div>
        ) : changes.map(chg => (
          <div 
            key={chg.id} 
            onClick={() => onSelectDetail(chg.id)}
            className="group relative bg-[#0a0a0c] border border-slate-800 p-8 transition-all hover:border-emerald-500/40 hover:bg-black/80 cursor-pointer"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-800 group-hover:bg-emerald-600 transition-all"></div>
            
            <div className="flex flex-wrap justify-between items-start gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-black text-slate-600 tracking-tighter">CHG#{chg.id}</span>
                  <span className="text-[9px] font-black text-emerald-500/80 tracking-widest uppercase px-3 py-1 border border-emerald-500/20 bg-emerald-500/5">{chg.changeType}</span>
                  <span className={`text-[9px] font-black tracking-widest uppercase px-3 py-1 border ${chg.risk === 'High' ? 'border-red-500/40 text-red-500/80 bg-red-500/5' : 'border-amber-500/40 text-amber-500/80 bg-amber-500/5'}`}>Risk: {chg.risk}</span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight mb-2">{chg.title}</h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-3xl line-clamp-1">{chg.description}</p>
              </div>
              
              <div className="flex flex-col items-end gap-3 self-center">
                 <div className={`px-5 py-2 border font-black text-[10px] tracking-widest shadow-inner ${STATUS_COLOR[chg.status as ChangeStatus]}`}>
                    {STATUS_LABEL[chg.status as ChangeStatus] || chg.status}
                </div>
                <div className="text-[9px] font-black text-slate-700 tracking-widest uppercase">Created {new Date(chg.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            
            <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 mt-6 pt-6 border-t border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div>
                    <div className="text-[9px] font-black text-emerald-600 tracking-[0.2em] mb-2 uppercase">Analysis</div>
                    <p className="text-xs font-bold text-slate-400 italic">"{chg.impactAnalysis || 'Impact analysis document pending.'}"</p>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-emerald-600 tracking-[0.2em] mb-2 uppercase">Rollback Strategy</div>
                    <p className="text-xs font-bold text-slate-400 italic">"{chg.rollbackPlan || 'No rollback strategy documented.'}"</p>
                  </div>
                </div>
                <div className="bg-slate-900/50 p-6 border border-slate-800">
                   <div className="text-[9px] font-black text-slate-500 tracking-[0.2em] mb-4 uppercase">Implementation Window</div>
                   <div className="flex items-center gap-6">
                      <div>
                        <div className="text-[8px] font-black text-slate-600 uppercase mb-1">Start</div>
                        <div className="text-xs font-black text-white">{chg.plannedStart ? new Date(chg.plannedStart).toLocaleString() : 'TBD'}</div>
                      </div>
                      <div className="h-4 w-px bg-slate-800"></div>
                      <div>
                        <div className="text-[8px] font-black text-slate-600 uppercase mb-1">End</div>
                        <div className="text-xs font-black text-white">{chg.plannedEnd ? new Date(chg.plannedEnd).toLocaleString() : 'TBD'}</div>
                      </div>
                   </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangeList;
