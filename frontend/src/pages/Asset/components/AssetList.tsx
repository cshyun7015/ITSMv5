import React, { useState } from 'react';
import { useAssets } from '../hooks/useAssets';
import type { Asset } from '../types';

const ASSET_TYPES = ['Server', 'Database', 'Network', 'Application', 'Storage', 'Laptop', 'Cloud'];
const ASSET_STATUSES = ['In Use', 'In Stock', 'Retired', 'Broken', 'Maintenance'];

const AssetList: React.FC<{ user: any }> = ({ user }) => {
  const { assets, loading, createAsset, updateAsset, deleteAsset } = useAssets();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [form, setForm] = useState({ 
    name: '', type: 'Server', status: 'In Use', 
    location: '', owner: '', serialNumber: '', model: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingAsset) {
        await updateAsset(editingAsset.id, form);
        setEditingAsset(null);
      } else {
        await createAsset(form);
      }
      setShowForm(false);
      setForm({ name: '', type: 'Server', status: 'In Use', location: '', owner: '', serialNumber: '', model: '' });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setForm({ 
      name: asset.name, type: asset.type, status: asset.status, 
      location: asset.location || '', owner: asset.ownerName || '', 
      serialNumber: asset.serialNumber || '', model: asset.model || '' 
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to decommission this asset?')) return;
    try {
      await deleteAsset(id);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="p-10 space-y-12">
      <div className="flex justify-between items-start border-b border-slate-900 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-blue-500"></div>
             <span className="text-[10px] font-black text-blue-500 tracking-[0.4em] uppercase">Inventory Control</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Asset Registry</h1>
          <p className="text-slate-500 font-bold text-xs tracking-widest uppercase italic">Infrastructure Life-cycle & ITAM Governance</p>
        </div>
        <div className="flex gap-4">
           <div className="relative group">
              <input 
                type="text" 
                placeholder="SEARCH REGISTRY..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-black/50 border border-slate-800 px-6 py-4 text-[10px] font-black tracking-widest text-white focus:outline-none focus:border-blue-500 w-64 transition-all"
              />
              <div className="absolute bottom-0 left-0 h-[1px] bg-blue-500 w-0 group-focus-within:w-full transition-all duration-300"></div>
           </div>
           <button 
              onClick={() => { setShowForm(!showForm); if(showForm) setEditingAsset(null); }} 
              className={`px-8 py-4 font-black text-[10px] tracking-[0.2em] uppercase transition-all ${
                showForm ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
              }`}
            >
              {showForm ? 'CANCEL ACTION' : 'REGISTER ASSET'}
            </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0f0f12] border border-blue-500/10 p-12 relative overflow-hidden animate-in slide-in-from-top-4">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase">Asset Name</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border-b border-slate-800 py-2 text-white font-black text-lg focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-800" placeholder="SRV-PROD-01" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase">Class / Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full bg-transparent border-b border-slate-800 py-2 text-white font-black text-sm focus:outline-none focus:border-blue-500 uppercase">
                {ASSET_TYPES.map(t => <option key={t} className="bg-slate-900">{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase">Operational Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-transparent border-b border-slate-800 py-2 text-white font-black text-sm focus:outline-none focus:border-blue-500 uppercase">
                {ASSET_STATUSES.map(s => <option key={s} className="bg-slate-900">{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase">Serial Number</label>
              <input value={form.serialNumber} onChange={e => setForm({ ...form, serialNumber: e.target.value })} className="w-full bg-transparent border-b border-slate-800 py-2 text-white font-black text-sm focus:outline-none focus:border-blue-500 font-mono" placeholder="SN-XXXX-XXXX" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
             <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase">Physical Location</label>
                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-transparent border-b border-slate-800 py-2 text-white font-black text-sm focus:outline-none focus:border-blue-500" placeholder="Data Room 4th Floor..." />
             </div>
             <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase">Model / Manufacturer</label>
                <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className="w-full bg-transparent border-b border-slate-800 py-2 text-white font-black text-sm focus:outline-none focus:border-blue-500" placeholder="PowerEdge R750 / Dell" />
             </div>
             <div className="flex items-end">
                <button type="submit" disabled={submitting} className="w-full py-4 bg-blue-600 text-white font-black text-[10px] tracking-[0.4em] uppercase hover:bg-blue-500 active:scale-95 transition-all disabled:bg-slate-800">
                  {submitting ? 'EXECUTING REGISTRY UPDATE...' : editingAsset ? 'UPDATE SYSTEM ENTITY' : 'FINALIZE REGISTRATION'}
                </button>
             </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-px bg-slate-900 border border-slate-900 shadow-2xl overflow-hidden rounded-sm">
        {filteredAssets.length === 0 ? (
          <div className="col-span-full p-32 text-center bg-black">
             <span className="text-slate-800 font-black tracking-[1em] uppercase text-xs animate-pulse">Global Inventory Clean</span>
          </div>
        ) : filteredAssets.map(asset => (
          <div key={asset.id} className="group flex flex-col justify-between bg-black p-10 hover:bg-[#0a0a0c] transition-all relative">
            <div className={`absolute top-0 right-0 p-3 text-[7px] font-black tracking-widest ${statusColor(asset.status)}`}>
               {asset.status.toUpperCase()}
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                   <div className="text-[8px] font-black text-slate-600 tracking-[0.3em] uppercase mb-1">{asset.type} // {asset.serialNumber || 'NO SERIAL'}</div>
                   <h3 className="text-2xl font-black text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight leading-none">{asset.name}</h3>
                   <div className="mt-2 flex gap-4">
                      <div className="flex items-center gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        <span className="text-[10px] font-black text-slate-400 capitalize">{asset.location || 'Undefined'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all delay-75">
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span className="text-[10px] font-black text-slate-400 capitalize">{asset.ownerName || 'IT Support'}</span>
                      </div>
                   </div>
                </div>
              </div>

              <div className="h-px bg-slate-900 w-full"></div>

              <div className="flex items-end justify-between">
                 <div className="space-y-1">
                    <div className="text-[7px] font-black text-slate-700 uppercase tracking-widest">Sys Integrity Checked</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase">{new Date(asset.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</div>
                 </div>
                 <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <button onClick={() => handleEdit(asset)} className="text-[10px] font-black text-blue-500 tracking-widest uppercase hover:text-white transition-colors">Modify</button>
                    <button onClick={() => handleDelete(asset.id)} className="text-[10px] font-black text-red-700 tracking-widest uppercase hover:text-red-500 transition-colors">DECOMMISSION</button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const statusColor = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('in use') || s.includes('active')) return 'text-emerald-500';
  if (s.includes('retired') || s.includes('broken')) return 'text-red-600';
  if (s.includes('stock')) return 'text-amber-500';
  return 'text-slate-500';
};

export default AssetList;
