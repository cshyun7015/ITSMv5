import React, { useState } from 'react';
import { useCompanies } from './hooks/useCompanies';
import { companyApi } from './api/companyApi';
import AdminModal from '../../../components/admin/AdminModal';
import type { Company, CompanyRequest } from './types';

const CompanyManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ field: 'createdAt', dir: 'desc' });
  
  const { companies, loading, totalPages, totalElements, error, refetch } = useCompanies(search, page, sort);
  
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [companyForm, setCompanyForm] = useState<CompanyRequest>({ companyId: '', companyName: '', tier: 'Standard' });
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  const handleSort = (field: string) => {
    const isSame = sort.field === field;
    setSort({ field, dir: isSame ? (sort.dir === 'asc' ? 'desc' : 'asc') : 'asc' });
    setPage(0);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await companyApi.createCompany(companyForm);
      setModal({ 
        isOpen: true, 
        title: '성공', 
        message: '고객사가 등록되었습니다.', 
        type: 'success', 
        onConfirm: () => { setModal({ ...modal, isOpen: false }); setShowForm(false); refetch(); } 
      });
      setCompanyForm({ companyId: '', companyName: '', tier: 'Standard' });
    } catch (err) { 
      setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCompany) return;
    try {
      await companyApi.updateCompany(editingCompany.companyId, { 
        companyName: editingCompany.companyName, 
        tier: editingCompany.tier,
        isActive: editingCompany.isActive
      });
      setModal({ 
        isOpen: true, 
        title: '수정 완료', 
        message: '정보가 성공적으로 반영되었습니다.', 
        type: 'success', 
        onConfirm: () => { setModal({ ...modal, isOpen: false }); setEditingCompany(null); refetch(); } 
      });
    } catch (err) { 
      setModal({ isOpen: true, title: '오류', message: '수정 중 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const handleDelete = async (companyId: string) => {
    setModal({ ...modal, isOpen: false }); 
    try {
      await companyApi.deleteCompany(companyId);
      setModal({ 
        isOpen: true, 
        title: '삭제 성공', 
        message: '정상적으로 삭제되었습니다.', 
        type: 'success', 
        onConfirm: () => { setModal({ ...modal, isOpen: false }); refetch(); } 
      });
    } catch (err) {
      setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const TIER_COLOR: Record<string, string> = { Premium: 'bg-[#fcc419]', Standard: 'bg-[#339af0]', Basic: 'bg-[#888]' };

  return (
    <div className="space-y-6">
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-white">관리 대상 고객사 ({totalElements})</h3>
        <div className="flex flex-1 justify-end gap-3 min-w-[300px]">
          <input 
            placeholder="고객사 이름 또는 ID 검색..." 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(0); }} 
            className="w-64 rounded-lg border border-[#444] bg-[#1e1e1e] px-4 py-2 text-white focus:border-[#339af0] focus:outline-none"
          />
          <button 
            onClick={() => { setShowForm(!showForm); setEditingCompany(null); }} 
            className="rounded-lg bg-[#339af0] px-6 py-2 font-bold text-white transition-colors hover:bg-[#228be6]"
          >
            {showForm ? '✕ 취소' : '+ 고객사 등록'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4 rounded-lg border border-[#444] bg-[#1e1e1e] p-6 shadow-lg">
          <div className="flex-1 min-w-[150px]">
            <label className="mb-1 block text-sm text-[#aaa]">고객사 ID</label>
            <input required value={companyForm.companyId} onChange={e => setCompanyForm({...companyForm, companyId: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white" />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="mb-1 block text-sm text-[#aaa]">고객사 이름</label>
            <input required value={companyForm.companyName} onChange={e => setCompanyForm({...companyForm, companyName: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white" />
          </div>
          <div className="w-32">
            <label className="mb-1 block text-sm text-[#aaa]">서비스 티어</label>
            <select value={companyForm.tier} onChange={e => setCompanyForm({...companyForm, tier: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white">
              <option>Premium</option><option>Standard</option><option>Basic</option>
            </select>
          </div>
          <button type="submit" className="rounded-md bg-[#51cf66] px-6 py-2 font-bold text-black transition-colors hover:bg-[#40c057]">등록</button>
        </form>
      )}

      {editingCompany && (
        <form onSubmit={handleUpdate} className="flex flex-wrap items-end gap-4 rounded-lg border border-[#339af0] bg-[#1e1e1e] p-6 shadow-lg">
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-sm text-[#aaa]">수정 중: {editingCompany.companyId}</label>
            <input required value={editingCompany.companyName} onChange={e => setEditingCompany({...editingCompany, companyName: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white" />
          </div>
          <div className="w-32">
            <label className="mb-1 block text-sm text-[#aaa]">서비스 티어</label>
            <select value={editingCompany.tier} onChange={e => setEditingCompany({...editingCompany, tier: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white">
              <option>Premium</option><option>Standard</option><option>Basic</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-md bg-[#339af0] px-6 py-2 font-bold text-white transition-colors hover:bg-[#228be6]">저장</button>
            <button type="button" onClick={() => setEditingCompany(null)} className="rounded-md border border-[#444] bg-transparent px-6 py-2 text-[#888] transition-colors hover:bg-[#252525]">취소</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-20 text-center text-[#888]">데이터 로딩 및 정렬 중...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#333]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#2c2c2c] text-sm font-semibold text-[#888]">
                <th onClick={() => handleSort('companyId')} className="cursor-pointer px-6 py-4 text-left hover:text-white">ID</th>
                <th onClick={() => handleSort('companyName')} className="cursor-pointer px-6 py-4 text-left hover:text-white">이름</th>
                <th onClick={() => handleSort('tier')} className="cursor-pointer px-6 py-4 text-left hover:text-white">티어</th>
                <th className="px-6 py-4 text-center">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {companies.map((t) => (
                <tr key={t.companyId} className="transition-colors hover:bg-[#252525]">
                  <td className="px-6 py-4 text-[#888] font-mono whitespace-nowrap">{t.companyId}</td>
                  <td className="px-6 py-4 font-bold text-white">{t.companyName}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded px-2 py-1 text-xs font-bold text-black ${TIER_COLOR[t.tier] || 'bg-[#888]'}`}>
                      {t.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => { setEditingCompany({...t}); setShowForm(false); }} 
                        className="rounded bg-[#444] px-3 py-1 text-sm text-white transition-colors hover:bg-[#555]"
                      >
                        수정
                      </button>
                      <button 
                        onClick={() => setModal({
                          isOpen: true,
                          title: '삭제 확인',
                          message: `정말 고객사(${t.companyId})를 삭제하시겠습니까?`,
                          type: 'danger',
                          onConfirm: () => handleDelete(t.companyId)
                        })} 
                        className="rounded bg-[#c92a2a] px-3 py-1 text-sm text-white transition-colors hover:bg-[#e03131]"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center text-[#666]">데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 border-t border-[#333] bg-[#1a1a1a] py-4">
              <button 
                disabled={page === 0} 
                onClick={() => setPage(page - 1)} 
                className={`rounded px-4 py-2 border border-[#444] text-sm ${page === 0 ? 'bg-[#222] text-[#555] cursor-not-allowed' : 'bg-[#333] text-white hover:bg-[#444]'}`}
              >
                이전
              </button>
              <span className="text-sm text-[#888]">Page {page + 1} of {totalPages}</span>
              <button 
                disabled={page >= totalPages - 1} 
                onClick={() => setPage(page + 1)} 
                className={`rounded px-4 py-2 border border-[#444] text-sm ${page >= totalPages - 1 ? 'bg-[#222] text-[#555] cursor-not-allowed' : 'bg-[#333] text-white hover:bg-[#444]'}`}
              >
                다음
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
