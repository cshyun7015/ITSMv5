import React, { useState } from 'react';
import { useCodes } from './hooks/useCodes';
import { codeApi } from './api/codeApi';
import AdminModal from '../../../components/admin/AdminModal';
import type { CommonCode, CommonCodeRequest } from './types';

const CodeManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ field: 'groupCode', dir: 'asc' });

  const { codes, loading, totalPages, totalElements, error, refetch } = useCodes(search, page, sort);

  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState<CommonCode | null>(null);
  const [formData, setFormData] = useState<CommonCodeRequest>({
    codeId: '', groupCode: '', codeName: '', sortOrder: 0, isUse: true
  });

  const [modal, setModal] = useState({
    isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {}
  });

  const handleSort = (field: string) => {
    const isSame = sort.field === field;
    setSort({ field, dir: isSame ? (sort.dir === 'asc' ? 'desc' : 'asc') : 'asc' });
    setPage(0);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const target = editingCode ? (editingCode as CommonCodeRequest) : formData;
      await codeApi.saveCode(target);
      setModal({
        isOpen: true,
        title: '성공',
        message: '코드 정보가 저장되었습니다.',
        type: 'success',
        onConfirm: () => { setModal({ ...modal, isOpen: false }); setShowForm(false); setEditingCode(null); refetch(); }
      });
    } catch (err) {
      setModal({ isOpen: true, title: '오류', message: '저장 중 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const handleDelete = async (codeId: string) => {
    try {
      await codeApi.deleteCode(codeId);
      setModal({
        isOpen: true,
        title: '삭제 완료',
        message: '코드가 삭제되었습니다.',
        type: 'success',
        onConfirm: () => { setModal({ ...modal, isOpen: false }); refetch(); }
      });
    } catch (err) {
      setModal({ isOpen: true, title: '오류', message: '삭제 중 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  return (
    <div className="space-y-6">
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-white">공통 코드 관리 ({totalElements})</h3>
        <div className="flex flex-1 justify-end gap-3 min-w-[300px]">
          <input
            placeholder="그룹코드, 코드ID, 코드명 검색..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="w-72 rounded-lg border border-[#444] bg-[#1e1e1e] px-4 py-2 text-white focus:border-[#339af0] focus:outline-none"
          />
          <button
            onClick={() => { setShowForm(!showForm); setEditingCode(null); }}
            className={`rounded-lg px-6 py-2 font-bold text-white transition-colors ${showForm ? 'bg-[#c92a2a] hover:bg-[#e03131]' : 'bg-[#339af0] hover:bg-[#228be6]'}`}
          >
            {showForm ? '✕ 취소' : '+ 코드 추가'}
          </button>
        </div>
      </div>

      {(showForm || editingCode) && (
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg border border-[#339af0] bg-[#1e1e1e] p-6 shadow-lg">
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">그룹 코드 (Group Code)</label>
            <input 
              required 
              value={editingCode ? editingCode.groupCode : formData.groupCode} 
              onChange={e => editingCode ? setEditingCode({...editingCode, groupCode: e.target.value}) : setFormData({...formData, groupCode: e.target.value})} 
              className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white" 
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">코드 ID (Code ID)</label>
            <input 
              required 
              disabled={!!editingCode}
              value={editingCode ? editingCode.codeId : formData.codeId} 
              onChange={e => setFormData({...formData, codeId: e.target.value})} 
              className={`w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white ${editingCode ? 'opacity-50' : ''}`} 
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">코드 명 (Code Name)</label>
            <input 
              required 
              value={editingCode ? editingCode.codeName : formData.codeName} 
              onChange={e => editingCode ? setEditingCode({...editingCode, codeName: e.target.value}) : setFormData({...formData, codeName: e.target.value})} 
              className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white" 
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">정렬 순서</label>
            <input 
              type="number"
              value={editingCode ? editingCode.sortOrder : formData.sortOrder} 
              onChange={e => {
                const val = parseInt(e.target.value) || 0;
                editingCode ? setEditingCode({...editingCode, sortOrder: val}) : setFormData({...formData, sortOrder: val});
              }}
              className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white" 
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox"
                checked={editingCode ? editingCode.isUse : formData.isUse}
                onChange={e => editingCode ? setEditingCode({...editingCode, isUse: e.target.checked}) : setFormData({...formData, isUse: e.target.checked})}
                className="w-4 h-4 rounded border-[#555]"
              />
              <span className="text-sm text-white">사용 여부</span>
            </label>
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-4">
            <button type="submit" className="rounded-md bg-[#51cf66] px-8 py-2 font-bold text-black transition-colors hover:bg-[#40c057]">
              {editingCode ? '수정 사항 저장' : '코드 생성'}
            </button>
            <button 
              type="button" 
              onClick={() => { setShowForm(false); setEditingCode(null); }}
              className="rounded-md border border-[#444] bg-transparent px-8 py-2 text-[#888] transition-colors hover:bg-[#252525]"
            >
              취소
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-20 text-center text-[#888]">데이터 로딩 중...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#333]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#2c2c2c] text-sm font-semibold text-[#888]">
                <th onClick={() => handleSort('groupCode')} className="cursor-pointer px-6 py-4 text-left hover:text-white">그룹 코드</th>
                <th onClick={() => handleSort('codeId')} className="cursor-pointer px-6 py-4 text-left hover:text-white">코드 ID</th>
                <th onClick={() => handleSort('codeName')} className="cursor-pointer px-6 py-4 text-left hover:text-white">코드 명</th>
                <th onClick={() => handleSort('sortOrder')} className="cursor-pointer px-6 py-4 text-center hover:text-white">순서</th>
                <th onClick={() => handleSort('isUse')} className="cursor-pointer px-6 py-4 text-center hover:text-white">사용</th>
                <th className="px-6 py-4 text-center">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {codes.map((c) => (
                <tr key={`${c.groupCode}_${c.codeId}`} className="transition-colors hover:bg-[#252525]">
                  <td className="px-6 py-4 text-[#339af0] font-mono text-sm">{c.groupCode}</td>
                  <td className="px-6 py-4 text-[#888] font-mono text-sm">{c.codeId}</td>
                  <td className="px-6 py-4 text-white font-bold">{c.codeName}</td>
                  <td className="px-6 py-4 text-center text-[#aaa]">{c.sortOrder}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${c.isUse ? 'bg-[#2b8a3e] text-[#b2f2bb]' : 'bg-[#c92a2a] text-[#ffc9c9]'}`}>
                      {c.isUse ? 'USE' : 'HIDE'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => { setEditingCode({...c}); setShowForm(false); }} 
                        className="rounded bg-[#444] px-3 py-1 text-xs text-white transition-colors hover:bg-[#555]"
                      >
                        수정
                      </button>
                      <button 
                        onClick={() => setModal({
                          isOpen: true,
                          title: '코드 삭제 확인',
                          message: `정말 코드(${c.codeName})를 삭제하시겠습니까?`,
                          type: 'danger',
                          onConfirm: () => handleDelete(c.codeId)
                        })} 
                        className="rounded bg-[#c92a2a] px-3 py-1 text-xs text-white transition-colors hover:bg-[#e03131]"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {codes.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-[#666]">등록된 코드가 없습니다.</td>
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

export default CodeManagement;
