import React, { useState, useEffect } from 'react';
import { userApi } from '../../Admin/User/api/userApi';
import { serviceCatalogApi } from '../../ServiceCatalog/api/serviceCatalogApi';
import { serviceRequestApi } from '../api/serviceRequestApi';
import type { User } from '../../Admin/User/types';
import type { ServiceCatalog, FormField } from '../../ServiceCatalog/types';

interface ServiceRequestManualFormProps {
  onBack: () => void;
}

export const ServiceRequestManualForm: React.FC<ServiceRequestManualFormProps> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [catalogs, setCatalogs] = useState<ServiceCatalog[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(null);
  const [catalog, setCatalog] = useState<ServiceCatalog | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        const uData = await userApi.getUsers(0, 100);
        setUsers(uData.content || []);
        const cData = await serviceCatalogApi.getServiceCatalogs();
        setCatalogs(cData || []);
      } catch (err) {
        console.error('Failed to init manual form:', err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedCatalogId) {
      const c = catalogs.find(x => x.id === selectedCatalogId);
      setCatalog(c || null);
      setFormData({}); // Reset form data when catalog changes
    } else {
      setCatalog(null);
    }
  }, [selectedCatalogId, catalogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedCatalogId) {
      alert('요청자와 서비스 카탈로그를 선택해 주세요.');
      return;
    }

    setLoading(true);
    setStatusMsg('등록 중...');
    
    const payload = {
      catalogId: selectedCatalogId,
      requesterId: selectedUserId,
      title: title || `${catalog?.catalogName} 수동 등록`,
      description,
      priority,
      formData: JSON.stringify(formData)
    };

    try {
      await serviceRequestApi.createRequest(payload);
      setStatusMsg('정상적으로 등록되었습니다! 목록으로 이동합니다.');
      setTimeout(onBack, 1500);
    } catch (err) {
      setStatusMsg('등록 실패: ' + err);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ backgroundColor: 'transparent', border: 'none', color: '#339af0', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '1rem' }}>
        &larr; 목록으로 돌아가기
      </button>

      <div style={{ backgroundColor: '#1e1e1e', padding: '2.5rem', borderRadius: '12px', border: '1px solid #333' }}>
        <h2 style={{ color: '#fff', marginBottom: '2rem' }}>수동 서비스 요청 등록 (Admin)</h2>
        
        {statusMsg && <div style={{ padding: '1rem', backgroundColor: '#339af022', color: '#339af0', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #339af044', textAlign: 'center' }}>{statusMsg}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem', backgroundColor: '#252525', borderRadius: '8px' }}>
            <div>
              <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>요청자 선택 (Requester) *</label>
              <select required value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff' }}>
                <option value="">-- 사용자 선택 --</option>
                {users.map(u => <option key={u.userId} value={u.userId}>{u.userName} ({u.userId})</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#888', marginBottom: '0.5rem', fontSize: '0.9rem' }}>서비스 유형 선택 (Catalog) *</label>
              <select required value={selectedCatalogId || ''} onChange={e => setSelectedCatalogId(Number(e.target.value))} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff' }}>
                <option value="">-- 카탈로그 선택 --</option>
                {catalogs.map(c => <option key={c.id} value={c.id}>[{c.category}] {c.catalogName}</option>)}
              </select>
            </div>
          </div>

          <div style={{ padding: '2rem', backgroundColor: '#252525', borderRadius: '8px' }}>
            <h4 style={{ color: '#fff', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>기본 정보</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', color: '#aaa', marginBottom: '0.4rem' }}>요청 제목</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="미입력 시 카탈로그명이 제목으로 설정됩니다." style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#aaa', marginBottom: '0.4rem' }}>우선순위 (Priority)</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff' }}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
                <div>
                   {/* Empty for future use */}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', color: '#aaa', marginBottom: '0.4rem' }}>상세 설명</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', fontFamily: 'inherit' }} />
              </div>
            </div>
          </div>

          {catalog && catalog.fields && catalog.fields.length > 0 && (
            <div style={{ padding: '2rem', backgroundColor: '#252525', borderRadius: '8px' }}>
              <h4 style={{ color: '#339af0', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #339af033', paddingBottom: '0.5rem' }}>서비스별 상세 입력 항목</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {catalog.fields.map((field: FormField, idx: number) => (
                  <div key={idx}>
                    <label style={{ display: 'block', color: '#ccc', marginBottom: '0.4rem' }}>
                      {field.fieldLabel} {field.isRequired && <span style={{color: '#ff6b6b'}}>*</span>}
                    </label>
                    {field.fieldType === 'TEXT' && (
                      <input required={field.isRequired} type="text" onChange={(e) => setFormData({...formData, [field.fieldName]: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff' }} />
                    )}
                    {field.fieldType === 'NUMBER' && (
                      <input required={field.isRequired} type="number" onChange={(e) => setFormData({...formData, [field.fieldName]: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff' }} />
                    )}
                    {field.fieldType === 'DATE' && (
                      <input required={field.isRequired} type="date" onChange={(e) => setFormData({...formData, [field.fieldName]: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff' }} />
                    )}
                    {field.fieldType === 'SELECT' && (
                      <select required={field.isRequired} onChange={(e) => setFormData({...formData, [field.fieldName]: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff' }}>
                        <option value="">-- 선택 --</option>
                        {field.fieldOptions && JSON.parse(field.fieldOptions).map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    )}
                    {field.fieldType === 'CHECKBOX' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" onChange={(e) => setFormData({...formData, [field.fieldName]: e.target.checked})} style={{ width: '1.2rem', height: '1.2rem' }} />
                        <span style={{ color: '#aaa', fontSize: '0.9rem' }}>확인</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              padding: '1.2rem', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: loading ? '#444' : '#51cf66', 
              color: '#000', 
              fontWeight: 800, 
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(81, 207, 102, 0.2)'
            }}>
            {loading ? '처리 중...' : '서비스 요청 즉시 등록'}
          </button>
        </form>
      </div>
    </div>
  );
};
