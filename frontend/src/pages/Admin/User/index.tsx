import React, { useState, useEffect, useCallback } from 'react';
import { useUsers } from './hooks/useUsers';
import { userApi } from './api/userApi';
import { companyApi } from '../Company/api/companyApi';
import AdminModal from '../../../components/admin/AdminModal';
import type { User, UserRequest } from './types';
import type { Company } from '../Company/types';

const UserManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ field: 'userId', dir: 'asc' });
  
  const { users, loading, totalPages, totalElements, error, refetch } = useUsers(search, page, sort);
  const [companies, setCompanies] = useState<Company[]>([]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserRequest>({ 
    userId: '', userName: '', email: '', password: '', companyId: '', role: 'ROLE_USER' 
  });
  const [modal, setModal] = useState({ 
    isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} 
  });

  const fetchCompanies = useCallback(async () => {
    try {
      const data = await companyApi.getCompanies(0, 100);
      setCompanies(data.content || []);
    } catch (e) {
      console.error('Failed to fetch companies for user mapping:', e);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSort = (field: string) => {
    const isSame = sort.field === field;
    setSort({ field, dir: isSame ? (sort.dir === 'asc' ? 'desc' : 'asc') : 'asc' });
    setPage(0);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userApi.createUser(userForm);
      setModal({ 
        isOpen: true, 
        title: '성공', 
        message: '사용자가 생성되었습니다.', 
        type: 'success', 
        onConfirm: () => { setModal({ ...modal, isOpen: false }); setShowForm(false); refetch(); } 
      });
      setUserForm({ userId: '', userName: '', email: '', password: '', companyId: '', role: 'ROLE_USER' }); 
    } catch (err) { 
      setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await userApi.updateUser(editingUser.userId, editingUser as UserRequest);
      setModal({ 
        isOpen: true, 
        title: '수정 완료', 
        message: '사용자 정보가 성공적으로 반영되었습니다.', 
        type: 'success', 
        onConfirm: () => { setModal({ ...modal, isOpen: false }); setEditingUser(null); refetch(); } 
      });
    } catch (err) { 
      setModal({ isOpen: true, title: '오류', message: '수정 중 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const handleDelete = async (userId: string) => {
    setModal({ ...modal, isOpen: false }); 
    try {
      await userApi.deleteUser(userId);
      setModal({ 
        isOpen: true, 
        title: '삭제 성공', 
        message: '사용자가 정상적으로 삭제되었습니다.', 
        type: 'success', 
        onConfirm: () => { setModal({ ...modal, isOpen: false }); refetch(); } 
      });
    } catch (err) {
      setModal({ isOpen: true, title: '오류', message: '오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  return (
    <div className="space-y-6">
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-white">관리 대상 사용자 ({totalElements})</h3>
        <div className="flex flex-1 justify-end gap-3 min-w-[300px]">
          <input 
            placeholder="이름, ID, 이메일 검색..." 
            value={search} 
            onChange={e => { setSearch(e.target.value); setPage(0); }} 
            className="w-64 rounded-lg border border-[#444] bg-[#1e1e1e] px-4 py-2 text-white focus:border-[#339af0] focus:outline-none"
          />
          <button 
            onClick={() => { setShowForm(!showForm); setEditingUser(null); }} 
            className="rounded-lg bg-[#339af0] px-6 py-2 font-bold text-white transition-colors hover:bg-[#228be6]"
          >
            {showForm ? '✕ 취소' : '+ 사용자 추가'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg border border-[#444] bg-[#1e1e1e] p-6 shadow-lg">
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">사용자 ID</label>
            <input required value={userForm.userId} onChange={e => setUserForm({...userForm, userId: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">사용자 이름</label>
            <input required value={userForm.userName} onChange={e => setUserForm({...userForm, userName: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">이메일</label>
            <input required type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">비밀번호</label>
            <input required type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">고객사 선택</label>
            <select required value={userForm.companyId} onChange={e => setUserForm({...userForm, companyId: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white text-sm">
              <option value="">-- 고객사 선택 --</option>
              <option value="system">System (CSP)</option>
              {companies.map((t) => <option key={t.companyId} value={t.companyId}>{t.companyName}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">권한</label>
            <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white text-sm">
              <option>ROLE_USER</option><option>ROLE_AGENT</option><option>ROLE_ADMIN</option>
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end">
            <button type="submit" className="rounded-md bg-[#51cf66] px-8 py-2 font-bold text-black transition-colors hover:bg-[#40c057]">사용자 생성</button>
          </div>
        </form>
      )}

      {editingUser && (
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg border border-[#339af0] bg-[#1e1e1e] p-6 shadow-lg">
          <div className="md:col-span-2 lg:col-span-3">
            <label className="text-sm text-[#aaa]">수정 중: <span className="text-[#339af0] font-mono font-bold">{editingUser.userId}</span></label>
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">사용자 이름</label>
            <input required value={editingUser.userName} onChange={e => setEditingUser({...editingUser, userName: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">이메일</label>
            <input required type="email" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">고객사</label>
            <select required value={editingUser.companyId} onChange={e => setEditingUser({...editingUser, companyId: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white text-sm">
              <option value="system">System (CSP)</option>
              {companies.map((t) => <option key={t.companyId} value={t.companyId}>{t.companyName}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#aaa]">권한</label>
            <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})} className="w-full rounded-md border border-[#555] bg-[#2c2c2c] p-2 text-white text-sm">
              <option>ROLE_USER</option><option>ROLE_AGENT</option><option>ROLE_ADMIN</option>
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2">
            <button type="submit" className="rounded-md bg-[#339af0] px-8 py-2 font-bold text-white transition-colors hover:bg-[#228be6]">저장</button>
            <button type="button" onClick={() => setEditingUser(null)} className="rounded-md border border-[#444] bg-transparent px-8 py-2 text-[#888] transition-colors hover:bg-[#252525]">취소</button>
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
                <th onClick={() => handleSort('userId')} className="cursor-pointer px-6 py-4 text-left hover:text-white">사용자 ID</th>
                <th onClick={() => handleSort('userName')} className="cursor-pointer px-6 py-4 text-left hover:text-white">이름 / 이메일</th>
                <th className="px-6 py-4 text-left">고객사</th>
                <th onClick={() => handleSort('role')} className="cursor-pointer px-6 py-4 text-left hover:text-white">권한</th>
                <th className="px-6 py-4 text-center">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333]">
              {users.map((u) => (
                <tr key={u.userId} className="transition-colors hover:bg-[#252525]">
                  <td className="px-6 py-4 text-[#888] font-mono text-sm whitespace-nowrap">{u.userId}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{u.userName}</div>
                    <div className="text-xs text-[#666]">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm ${u.companyId === 'system' ? 'text-[#fcc419] font-bold' : 'text-[#339af0]'}`}>
                      {u.companyId === 'system' ? '🛠️ System (CSP)' : u.companyId}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded border ${u.role === 'ROLE_ADMIN' ? 'border-[#ff6b6b] text-[#ff6b6b]' : 'border-[#444] text-[#aaa]'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => { setEditingUser({...u}); setShowForm(false); }} 
                        className="rounded bg-[#444] px-3 py-1 text-sm text-white transition-colors hover:bg-[#555]"
                      >
                        수정
                      </button>
                      <button 
                        onClick={() => setModal({
                          isOpen: true,
                          title: '삭제 확인',
                          message: `정말 사용자(${u.userId})를 삭제하시겠습니까?`,
                          type: 'danger',
                          onConfirm: () => handleDelete(u.userId)
                        })} 
                        className="rounded bg-[#c92a2a] px-3 py-1 text-sm text-white transition-colors hover:bg-[#e03131]"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-[#666]">사용자 검색 결과가 없습니다.</td>
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

export default UserManagement;
