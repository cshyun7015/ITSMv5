import { useState, useEffect } from 'react';
import AdminModal from './AdminModal';

export default function ServiceRequestDetail({ apiUrl, headers, requestId, onBack, currentUser }: any) {
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resolution, setResolution] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/requests/admin/${requestId}`, { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setRequest(data);
        setStatus(data.status);
        setPriority(data.priority);
        setResolution(data.resolution || '');
      }
    } catch (e) {
      console.error('Failed to fetch SR detail:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [requestId]);

  const handleUpdate = async () => {
    try {
      const updates = { status, priority, resolution };
      // If status changes to ASSIGNED or IN_PROGRESS and no assignee, auto-assign to current user
      if ((status === 'ASSIGNED' || status === 'IN_PROGRESS') && !request.assignee) {
        updates['assigneeId'] = currentUser.userId;
      }

      const res = await fetch(`${apiUrl}/api/requests/admin/${requestId}`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        setModal({ 
          isOpen: true, 
          title: '수정 완료', 
          message: '요청 상태 및 처리 결과가 저장되었습니다.', 
          type: 'success', 
          onConfirm: () => { setModal({ ...modal, isOpen: false }); fetchDetail(); } 
        });
      }
    } catch (e) {
      setModal({ isOpen: true, title: '오류', message: '저장 중 오류가 발생했습니다.', type: 'danger', onConfirm: () => setModal({ ...modal, isOpen: false }) });
    }
  };

  const renderFormData = () => {
    if (!request?.formData) return null;
    try {
      const data = JSON.parse(request.formData);
      return (
        <div style={{ backgroundColor: '#252525', padding: '1rem', borderRadius: '8px', border: '1px solid #333' }}>
          <h4 style={{ color: '#888', marginTop: 0, marginBottom: '0.8rem', fontSize: '0.9rem' }}>동적 폼 입력 데이터</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {Object.entries(data).map(([key, value]: [string, any]) => (
              <div key={key}>
                <div style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase' }}>{key}</div>
                <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>{value?.toString() || '-'}</div>
              </div>
            ))}
          </div>
        </div>
      );
    } catch (e) {
      return <div style={{ color: '#fa5252' }}>폼 데이터를 파싱할 수 없습니다.</div>;
    }
  };

  if (loading) return <div style={{ color: '#888', textAlign: 'center', padding: '5rem' }}>상세 정보 로딩 중...</div>;
  if (!request) return <div style={{ color: '#fa5252', textAlign: 'center', padding: '5rem' }}>데이터를 찾을 수 없습니다.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button onClick={onBack} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #444', color: '#aaa', borderRadius: '6px', cursor: 'pointer' }}>← 목록으로</button>
        <h2 style={{ color: '#fff', margin: 0 }}>요청 상세: {request.title}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ color: '#555', fontSize: '0.8rem' }}>요청 번호</div>
                <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>SR#{request.id}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#555', fontSize: '0.8rem' }}>생성일시</div>
                <div style={{ color: '#aaa' }}>{new Date(request.createdAt).toLocaleString()}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#888', fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>요청 내용 (설명)</label>
              <div style={{ color: '#eee', lineHeight: '1.6', whiteSpace: 'pre-wrap', backgroundColor: '#252525', padding: '1rem', borderRadius: '8px' }}>
                {request.description || '내용 없음'}
              </div>
            </div>

            {renderFormData()}
          </section>

          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '1rem' }}>처리 결과 (Resolution)</h3>
            <textarea 
              value={resolution} 
              onChange={e => setResolution(e.target.value)} 
              placeholder="조치 사항 및 처리 결과를 입력하세요..." 
              rows={6} 
              style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#51cf66', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </section>
        </div>

        {/* Right Column: Sidebar Management */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '1rem', fontSize: '1rem' }}>관리 및 배정</h3>
            
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>현재 상태</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #444' }}>
                <option value="OPEN">접수 (Open)</option>
                <option value="ASSIGNED">할당됨 (Assigned)</option>
                <option value="IN_PROGRESS">처리 중 (InProgress)</option>
                <option value="RESOLVED">해결됨 (Resolved)</option>
                <option value="CLOSED">종표 (Closed)</option>
                <option value="CANCELED">취소 (Canceled)</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>우선순위</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #444' }}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>담당자</label>
              <div style={{ color: '#fff', padding: '0.6rem', backgroundColor: '#111', borderRadius: '6px', border: '1px solid #222' }}>
                {request.assignee ? (
                  <span>👤 {request.assignee.userName}</span>
                ) : (
                  <span style={{ color: '#ff6b6b' }}>미지정 (미할당)</span>
                )}
              </div>
            </div>

            <button onClick={handleUpdate} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' }}>
              변경 사항 저장
            </button>
          </section>

          <section style={{ backgroundColor: '#1e1e1e', padding: '1.2rem', borderRadius: '12px', border: '1px solid #333' }}>
            <h4 style={{ color: '#888', marginTop: 0, marginBottom: '0.8rem', fontSize: '0.85rem' }}>요청자 정보</h4>
            <div style={{ color: '#fff', fontWeight: 'bold' }}>{request.requester?.userName || 'System'}</div>
            <div style={{ color: '#666', fontSize: '0.8rem' }}>{request.requester?.email || 'No Email'}</div>
            <div style={{ color: '#339af0', fontSize: '0.8rem', marginTop: '0.3rem' }}>🏢 {request.tenant?.tenantName}</div>
          </section>
        </div>
      </div>
    </div>
  );
}
