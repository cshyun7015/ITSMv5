import React, { useState } from 'react';
import { useProblems } from '../hooks/useProblems';
import type { Problem, ProblemStatus, ProblemPriority } from '../types';

const STATUS_COLOR: Record<ProblemStatus, string> = {
  OPEN: 'border-blue-500/50 text-blue-400 bg-blue-500/10',
  INVESTIGATING: 'border-amber-500/50 text-amber-400 bg-amber-500/10',
  RESOLVED: 'border-green-500/50 text-green-400 bg-green-500/10',
  CLOSED: 'border-slate-500/50 text-slate-400 bg-slate-500/10',
};

const PRIORITY_COLOR: Record<ProblemPriority, string> = {
  Critical: 'bg-red-500 text-white',
  High: 'bg-orange-500 text-white',
  Medium: 'bg-blue-500 text-white',
  Low: 'bg-slate-500 text-white',
};

const ProblemList: React.FC<{ user: any }> = ({ user }) => {
  const { problems, loading, error, createProblem } = useProblems();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    priority: 'Medium', 
    rootCause: '', 
    workaround: '', 
    status: 'OPEN' 
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createProblem(form);
      setShowForm(false);
      setForm({ title: '', description: '', priority: 'Medium', rootCause: '', workaround: '', status: 'OPEN' });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      <span className="ml-4 text-slate-400 font-medium">Loading problem records...</span>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Problem Management</h1>
          <p className="mt-2 text-slate-400 font-medium">Root Cause Analysis (RCA) and Known Error Database.</p>
        </div>
        {user.role !== 'ROLE_USER' && (
          <button 
            onClick={() => setShowForm(!showForm)} 
            className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
              showForm ? 'bg-slate-700 text-slate-300' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-900/40'
            }`}
          >
            {showForm ? '✕ Cancel' : '+ Identify Problem'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl border border-indigo-500/20 shadow-2xl mb-12 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-black text-indigo-400 mb-8 flex items-center gap-3">
            <span className="p-2 bg-indigo-500/10 rounded-lg">🔍</span> New Root Cause Investigation
          </h2>
          
          <div className="grid gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">Problem Statement*</label>
              <input 
                required 
                placeholder="High-level summary of the recurring issue..." 
                value={form.title} 
                onChange={e => setForm({ ...form, title: e.target.value })} 
                className="w-full px-5 py-4 rounded-2xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">Impact Description</label>
              <textarea 
                placeholder="Detail which services and users are affected..." 
                rows={3} 
                value={form.description} 
                onChange={e => setForm({ ...form, description: e.target.value })} 
                className="w-full px-5 py-4 rounded-2xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-semibold resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Root Cause (RCA)</label>
                <textarea 
                  value={form.rootCause} 
                  onChange={e => setForm({ ...form, rootCause: e.target.value })} 
                  rows={4} 
                  placeholder="Findings from technical investigation..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-semibold resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Temporary Workaround</label>
                <textarea 
                  value={form.workaround} 
                  onChange={e => setForm({ ...form, workaround: e.target.value })} 
                  rows={4} 
                  placeholder="Instructions to restore service temporarily..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-700 bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-semibold resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Priority Level</label>
                <select 
                  value={form.priority} 
                  onChange={e => setForm({ ...form, priority: e.target.value })} 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-700 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold cursor-pointer"
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Investigation Status</label>
                <select 
                  value={form.status} 
                  onChange={e => setForm({ ...form, status: e.target.value })} 
                  className="w-full px-5 py-4 rounded-2xl border border-slate-700 bg-slate-900/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold cursor-pointer"
                >
                  <option value="OPEN">Open</option>
                  <option value="INVESTIGATING">Investigating</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting} 
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-black text-xl transition-all transform hover:translate-y-[-2px] hover:shadow-2xl hover:from-indigo-700 hover:to-indigo-600 active:translate-y-[0] disabled:bg-slate-700 disabled:cursor-not-allowed shadow-indigo-900/20"
            >
              {submitting ? 'Analyzing & Saving...' : '✅ Commit Problem Record'}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-8">
        {problems.length === 0 ? (
          <div className="bg-slate-800/30 rounded-[2rem] p-24 text-center border border-slate-700/50 border-dashed backdrop-blur-sm">
            <div className="text-7xl mb-8 opacity-30">📂</div>
            <div className="text-slate-200 text-3xl font-black mb-4">No problem records yet</div>
            <p className="text-slate-500 max-w-lg mx-auto leading-relaxed text-lg">Use problem records to track root causes of recurring incidents and build a Knowledge Base of workarounds.</p>
          </div>
        ) : (
          problems.map((prob: Problem) => (
            <div key={prob.id} className="group bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 rounded-[2rem] p-8 transition-all duration-500 hover:shadow-3xl hover:border-indigo-500/30">
              <div className="flex flex-wrap justify-between items-start gap-8 mb-8">
                <div className="flex-1 min-w-[300px]">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="font-black text-[11px] text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 tracking-widest">PRB#{prob.id}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm ${PRIORITY_COLOR[prob.priority as ProblemPriority]}`}>
                        {prob.priority}
                    </span>
                    <h3 className="text-2xl font-black text-slate-100 group-hover:text-indigo-400 transition-colors leading-tight">{prob.title}</h3>
                  </div>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium line-clamp-2 italic">{prob.description}</p>
                </div>
                <div className={`px-6 py-2 rounded-2xl text-[12px] font-black tracking-widest uppercase border shadow-inner ${STATUS_COLOR[prob.status as ProblemStatus]}`}>
                  {prob.status}
                </div>
              </div>
              
              {(prob.rootCause || prob.workaround) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10 pt-10 border-t border-slate-700/30">
                  <div className="relative group/box">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500/30 group-hover/box:bg-indigo-500 transition-colors rounded-full"></div>
                    <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Root Cause Investigation</div>
                    <div className="bg-slate-900/30 p-6 rounded-2xl text-slate-300 text-base leading-relaxed font-semibold border border-indigo-500/5 group-hover/box:border-indigo-500/20 transition-all">
                      {prob.rootCause || 'Root cause investigation is currently ongoing.'}
                    </div>
                  </div>
                  <div className="relative group/box">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-green-500/30 group-hover/box:bg-green-500 transition-colors rounded-full"></div>
                    <div className="text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Documented Workaround</div>
                    <div className="bg-slate-900/30 p-6 rounded-2xl text-slate-300 text-base leading-relaxed font-semibold border border-green-500/5 group-hover/box:border-green-500/20 transition-all">
                      {prob.workaround || 'No verified workaround available at this stage.'}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <div className="text-xs font-bold text-slate-600 bg-slate-900/50 px-4 py-2 rounded-xl">
                   Identified on {new Date(prob.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProblemList;
