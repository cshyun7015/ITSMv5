import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';

export default function RequestForm({ user, catalogId, onBack }: { user: any, catalogId: number, onBack: () => void }) {
  const [catalog, setCatalog] = useState<any>(null);
  const [formSchema, setFormSchema] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    const fetchCatalog = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const token = localStorage.getItem('itsm_token');
      try {
        const response = await fetch(`${apiUrl}/api/catalogs/${catalogId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCatalog(data);
          if (data.formSchema) {
            setFormSchema(JSON.parse(data.formSchema));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCatalog();
  }, [catalogId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('Submitting...');
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const token = localStorage.getItem('itsm_token');

    const payload = {
      catalogId,
      requesterId: user.userId,
      title,
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
              headers: {
                'Authorization': `Bearer ${token}`
              },
              body: fd
            });
          }
        }

        setStatusMsg('Successfully submitted! Returning to catalog...');
        setTimeout(onBack, 2000);
      } else {
        setStatusMsg('Failed to submit request.');
      }
    } catch (err) {
      setStatusMsg('Error: ' + err);
    }
  };

  if (!catalog) return <div style={{ color: '#fff' }}>Loading form template...</div>;

  return (
    <div style={{ backgroundColor: '#1e1e1e', padding: '2.5rem', borderRadius: '12px', border: '1px solid #333', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
      <button onClick={onBack} style={{ backgroundColor: 'transparent', border: 'none', color: '#339af0', cursor: 'pointer', marginBottom: '1.5rem', padding: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        &larr; 카탈로그 목록으로 돌아가기
      </button>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '2.5rem' }}>{catalog.icon || '📋'}</span>
        <div>
          <h3 style={{ color: '#fff', margin: 0, fontSize: '1.8rem' }}>{catalog.catalogName}</h3>
          <div style={{ color: '#339af0', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{catalog.category}</div>
        </div>
      </div>
      <p style={{ color: '#aaa', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: '1.6' }}>{catalog.description}</p>
      
      {statusMsg && <div style={{ color: '#51cf66', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'rgba(81, 207, 102, 0.1)', borderRadius: '6px', fontWeight: 'bold', border: '1px solid rgba(81, 207, 102, 0.2)' }}>{statusMsg}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', maxWidth: '800px' }}>
        
        <div style={{ padding: '1.5rem', backgroundColor: '#252525', borderRadius: '10px', border: '1px solid #333' }}>
          <h4 style={{ color: '#fff', marginTop: 0, marginBottom: '1.2rem', borderBottom: '1px solid #444', paddingBottom: '0.5rem' }}>기본 정보</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontWeight: 'bold' }}>요청 제목 <span style={{color: '#ff6b6b'}}>*</span></label>
              <input required type="text" placeholder="요청 내용을 한 줄로 요약해 주세요" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '1rem' }} />
            </div>

            <div>
              <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontWeight: 'bold' }}>상세 설명</label>
              <textarea value={description} placeholder="필요한 사항을 상세히 기술해 주세요" onChange={e => setDescription(e.target.value)} rows={4} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '1rem', fontFamily: 'inherit' }} />
            </div>
          </div>
        </div>

        {/* Dynamic Form Rendering */}
        {formSchema.length > 0 && (
          <div style={{ padding: '1.5rem', backgroundColor: '#252525', borderRadius: '10px', border: '1px solid #333' }}>
            <h4 style={{ color: '#339af0', marginTop: 0, marginBottom: '1.2rem', borderBottom: '1px solid #339af044', paddingBottom: '0.5rem' }}>추가 입력 사항</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {formSchema.map((field: any, idx: number) => (
                <div key={idx}>
                  <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    {field.label}
                  </label>
                  {field.type === 'text' && (
                    <input type="text" onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '1rem' }} />
                  )}
                  {field.type === 'number' && (
                    <input type="number" onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '1rem' }} />
                  )}
                  {field.type === 'textarea' && (
                    <textarea onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '1rem', fontFamily: 'inherit' }} />
                  )}
                  {field.type === 'select' && (
                    <select onChange={(e) => setFormData({...formData, [field.name]: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: '#fff', fontSize: '1rem' }}>
                      <option value="">-- 선택하세요 --</option>
                      {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}
                  {field.type === 'checkbox' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" id={`chk-${idx}`} onChange={(e) => setFormData({...formData, [field.name]: e.target.checked})} style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} />
                      <label htmlFor={`chk-${idx}`} style={{ color: '#aaa', cursor: 'pointer' }}>확인함</label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <FileUpload files={files} onChange={setFiles} />

        <button type="submit" style={{ padding: '1rem', borderRadius: '6px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem', fontSize: '1.1rem', transition: 'background-color 0.2s' }}>
          Submit Request
        </button>
      </form>
    </div>
  );
}
