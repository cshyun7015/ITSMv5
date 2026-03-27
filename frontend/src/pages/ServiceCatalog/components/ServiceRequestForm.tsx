import React, { useState, useEffect } from 'react';
import FileUpload from '../../../components/common/FileUpload';
import { serviceCatalogApi } from '../api/serviceCatalogApi';
// @ts-ignore
import type { ServiceCatalog, FormField } from '../types';

interface ServiceRequestFormProps {
  user: any;
  catalogId: number;
  onBack: () => void;
}

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ user, catalogId, onBack }) => {
  const [catalog, setCatalog] = useState<ServiceCatalog | null>(null);
  const [formSchema, setFormSchema] = useState<FormField[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const data = await serviceCatalogApi.getCatalog(catalogId);
        setCatalog(data);
        if (data.formSchema) {
          setFormSchema(JSON.parse(data.formSchema));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCatalog();
  }, [catalogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg('Submitting request...');
    
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');

    const payload = {
      catalogId,
      title: title || `${catalog?.catalogName} 요청`,
      description,
      formData: JSON.stringify(formData)
    };

    try {
      const response = await fetch(`${apiUrl}/api/requests`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        const createdRequest = await response.json();
        
        if (files.length > 0) {
          setStatusMsg('Uploading attachments...');
          for (let file of files) {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('relatedEntityType', 'SERVICE_REQUEST');
            fd.append('relatedEntityId', String(createdRequest.id));
            
            await fetch(`${apiUrl}/api/attachments/upload`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` },
              body: fd
            });
          }
        }

        setStatusMsg('Successfully submitted! Returning to catalog...');
        setTimeout(onBack, 2000);
      } else {
        setStatusMsg('Failed to submit request.');
        setIsSubmitting(false);
      }
    } catch (err) {
      setStatusMsg('Error: ' + err);
      setIsSubmitting(false);
    }
  };

  if (!catalog) return <div style={{ color: '#fff', padding: '2rem' }}>양식을 불러오는 중...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={onBack} style={{ 
        backgroundColor: 'transparent', 
        border: 'none', 
        color: '#339af0', 
        cursor: 'pointer', 
        marginBottom: '2rem', 
        padding: 0, 
        fontSize: '1rem', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        fontWeight: 500
      }}>
        &larr; 돌아가기
      </button>

      <div style={{ backgroundColor: '#1e1e1e', padding: '3rem', borderRadius: '16px', border: '1px solid #333', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
          <div style={{ 
            fontSize: '3.5rem', 
            width: '80px', 
            height: '80px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#252525',
            borderRadius: '16px',
            border: '1px solid #444'
          }}>
            {catalog.icon || '📋'}
          </div>
          <div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '2.2rem', fontWeight: 700 }}>{catalog.catalogName}</h2>
            <div style={{ color: '#339af0', fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{catalog.category}</div>
          </div>
        </div>
        <p style={{ color: '#aaa', marginBottom: '3rem', fontSize: '1.1rem', lineHeight: '1.7' }}>{catalog.description}</p>
        
        {statusMsg && <div style={{ 
          color: '#51cf66', 
          marginBottom: '2rem', 
          padding: '1.2rem', 
          backgroundColor: 'rgba(81, 207, 102, 0.1)', 
          borderRadius: '10px', 
          fontWeight: 600, 
          border: '1px solid rgba(81, 207, 102, 0.2)',
          textAlign: 'center'
        }}>{statusMsg}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <div style={{ padding: '2rem', backgroundColor: '#252525', borderRadius: '12px', border: '1px solid #333' }}>
            <h4 style={{ color: '#fff', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #444', paddingBottom: '0.75rem', fontSize: '1.2rem' }}>기본 정보</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontWeight: 630 }}>요청 제목 <span style={{color: '#ff6b6b'}}>*</span></label>
                <input required type="text" placeholder="요청 내용을 간략히 입력해 주세요" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #333', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '1rem', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#339af0'} onBlur={e => e.target.style.borderColor = '#333'} />
              </div>

              <div>
                <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontWeight: 630 }}>상세 설명</label>
                <textarea value={description} placeholder="추가적으로 필요한 사항을 자유롭게 기재해 주세요" onChange={e => setDescription(e.target.value)} rows={5} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #333', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#339af0'} onBlur={e => e.target.style.borderColor = '#333'} />
              </div>
            </div>
          </div>

          {formSchema.length > 0 && (
            <div style={{ padding: '2rem', backgroundColor: '#252525', borderRadius: '12px', border: '1px solid #333' }}>
              <h4 style={{ color: '#339af0', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #339af044', paddingBottom: '0.75rem', fontSize: '1.2rem' }}>상세 옵션</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                {formSchema.map((field: FormField, idx: number) => (
                  <div key={idx}>
                    <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontWeight: 630 }}>
                      {field.label}
                    </label>
                    {field.type === 'text' && (
                      <input type="text" onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #333', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '1rem' }} onFocus={e => e.target.style.borderColor = '#339af0'} onBlur={e => e.target.style.borderColor = '#333'} />
                    )}
                    {field.type === 'number' && (
                      <input type="number" onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #333', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '1rem' }} onFocus={e => e.target.style.borderColor = '#339af0'} onBlur={e => e.target.style.borderColor = '#333'} />
                    )}
                    {field.type === 'textarea' && (
                      <textarea onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} rows={3} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #333', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '1rem', fontFamily: 'inherit' }} onFocus={e => e.target.style.borderColor = '#339af0'} onBlur={e => e.target.style.borderColor = '#333'} />
                    )}
                    {field.type === 'select' && (
                      <select onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px solid #333', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '1rem' }} onFocus={e => e.target.style.borderColor = '#339af0'} onBlur={e => e.target.style.borderColor = '#333'}>
                        <option value="">-- 선텍해 주세요 --</option>
                        {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    )}
                    {field.type === 'checkbox' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem' }}>
                        <input type="checkbox" id={`chk-${idx}`} onChange={(e) => setFormData({...formData, [field.name]: e.target.checked})} style={{ width: '1.4rem', height: '1.4rem', accentColor: '#339af0', cursor: 'pointer' }} />
                        <label htmlFor={`chk-${idx}`} style={{ color: '#aaa', cursor: 'pointer', fontSize: '1.05rem' }}>확인하였습니다</label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed #444' }}>
            <FileUpload files={files} onChange={setFiles} />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
              padding: '1.2rem', 
              borderRadius: '10px', 
              border: 'none', 
              backgroundColor: isSubmitting ? '#444' : '#339af0', 
              color: '#fff', 
              fontWeight: 700, 
              cursor: isSubmitting ? 'not-allowed' : 'pointer', 
              marginTop: '1rem', 
              fontSize: '1.2rem', 
              transition: 'all 0.2s ease', 
              boxShadow: '0 4px 15px rgba(51, 154, 240, 0.3)'
            }}
            onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#228be6'; }}
            onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#339af0'; }}
          >
            {isSubmitting ? '요청을 처리 중입니다...' : '요청하기'}
          </button>
        </form>
      </div>
    </div>
  );
};
