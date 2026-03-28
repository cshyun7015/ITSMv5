import React, { useState, useEffect } from 'react';
import { useIncidentDetail } from '../hooks/useIncidents';
import type { IncidentStatus, IncidentPriority, Incident } from '../types';
import AdminModal from '../../../components/admin/AdminModal';

interface IncidentDetailViewProps {
  incidentId: number;
  onBack: () => void;
  onDeleted: () => void;
}

export const IncidentDetailView: React.FC<IncidentDetailViewProps> = ({ incidentId, onBack, onDeleted }) => {
  const { incident, loading, error, updateIncident, deleteIncident, refresh } = useIncidentDetail(incidentId);
  
  const [formData, setFormData] = useState<Partial<Incident>>({});
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  useEffect(() => {
    if (incident) {
      setFormData({
        status: incident.status,
        urgency: incident.urgency,
        impact: incident.impact,
        category: incident.category,
        subcategory: incident.subcategory,
        assignedGroup: incident.assignedGroup,
        resolutionCode: incident.resolutionCode,
        resolutionDescription: incident.resolutionDescription
      });
    }
  }, [incident]);

  const handleUpdate = async () => {
    const updated = await updateIncident(formData);
    if (updated) {
      setModal({ 
        isOpen: true, 
        title: '수정 완료', 
        message: '장애 정보가 성공적으로 업데이트되었습니다.', 
        type: 'success', 
        onConfirm: () => { setModal({ ...modal, isOpen: false }); refresh(); } 
      });
    }
  };

  const handleDelete = () => {
    setModal({ 
      isOpen: true, 
      title: '삭제 확인', 
      message: '이 장애 기록을 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.', 
      type: 'danger', 
      onConfirm: async () => {
        const success = await deleteIncident();
        if (success) {
          setModal({ ...modal, isOpen: false });
          onDeleted();
        }
      }
    });
  };

  if (loading) return <div style={{ color: '#888', textAlign: 'center', padding: '5rem' }}>장애 상세 정보 로딩 중...</div>;
  if (error || !incident) return <div style={{ color: '#fa5252', textAlign: 'center', padding: '5rem' }}>{error || '데이터를 찾을 수 없습니다.'}</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'INC_OPEN': return '#339af0';
      case 'INC_IN_PROGRESS': return '#fcc419';
      case 'INC_RESOLVED': return '#51cf66';
      case 'INC_CLOSED': return '#888';
      case 'INC_CANCELED': return '#ff6b6b';
      default: return '#aaa';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={onBack} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #444', color: '#aaa', borderRadius: '6px', cursor: 'pointer' }}>← 목록으로</button>
          <h2 style={{ color: '#fff', margin: 0 }}>장애 상세: {incident.title}</h2>
        </div>
        <button onClick={handleDelete} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>장애 기록 삭제</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Main Info Section */}
          <section style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ color: '#555', fontSize: '0.85rem' }}>분류 (Category)</div>
                  <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>{incident.category} / {incident.subcategory || '-'}</div>
                </div>
                <div>
                  <div style={{ color: '#555', fontSize: '0.85rem' }}>유입 경로</div>
                  <div style={{ color: '#339af0', fontSize: '1rem' }}>{incident.source}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#555', fontSize: '0.85rem' }}>등록 일시</div>
                  <div style={{ color: '#aaa', fontSize: '1rem' }}>{new Date(incident.createdAt).toLocaleString()}</div>
                </div>
             </div>

             <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#888', fontSize: '0.9rem', display: 'block', marginBottom: '0.8rem' }}>장애 현상 및 설명</label>
                <div style={{ color: '#eee', lineHeight: '1.6', whiteSpace: 'pre-wrap', backgroundColor: '#252525', padding: '1.2rem', borderRadius: '10px', border: '1px solid #333' }}>
                  {incident.description || '내용 없음'}
                </div>
             </div>
          </section>

          {/* Resolution Section */}
          <section style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '1.5rem' }}>처리 결과 및 해결 정보</h3>
             
             <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>해결 코드 (Resolution Code)</label>
                <select 
                  value={formData.resolutionCode || ''} 
                  onChange={e => setFormData({...formData, resolutionCode: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', backgroundColor: '#252525', color: '#fff', border: '1px solid #444' }}
                >
                  <option value="">-- 선택하세요 --</option>
                  <option value="FIXED">장애 해결 (Fixed)</option>
                  <option value="WORKAROUND">임시 조치 (Workaround)</option>
                  <option value="NO_FAULT">장애 아님 (No Fault Found)</option>
                  <option value="HARDWARE_REPLACEMENT">장비 교체 (HW Replaced)</option>
                  <option value="CANCELED">요청 취소 (Canceled by User)</option>
                </select>
             </div>

             <div>
                <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>해결 내용 기술 (Resolution Description)</label>
                <textarea 
                  value={formData.resolutionDescription || ''} 
                  onChange={e => setFormData({...formData, resolutionDescription: e.target.value})} 
                  rows={6} 
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#51cf66', fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="장애를 해결하기 위한 구체적인 조치 내용을 입력하세요..."
                />
             </div>
          </section>
        </div>

        {/* Sidebar Info Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '1.2rem', fontSize: '1rem' }}>진행 상태 관리</h3>
             
             <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>현재 상태</label>
                <select 
                  value={formData.status || ''} 
                  onChange={e => setFormData({...formData, status: e.target.value as IncidentStatus})}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', backgroundColor: getStatusColor(formData.status || ''), color: '#000', border: 'none', fontWeight: 'bold' }}
                >
                  <option value="INC_OPEN">신규 (Open)</option>
                  <option value="INC_IN_PROGRESS">진행 중 (In Progress)</option>
                  <option value="INC_ON_HOLD">보류 (On Hold)</option>
                  <option value="INC_RESOLVED">해결됨 (Resolved)</option>
                  <option value="INC_CLOSED">종료 (Closed)</option>
                  <option value="INC_CANCELED">취소됨 (Canceled)</option>
                </select>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                   <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>긴급도</label>
                   <select value={formData.urgency || ''} onChange={e => setFormData({...formData, urgency: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #444' }}>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                   </select>
                </div>
                <div>
                   <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>영향도</label>
                   <select value={formData.impact || ''} onChange={e => setFormData({...formData, impact: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #444' }}>
                      <option value="High">High (Service-wide)</option>
                      <option value="Medium">Medium (Department)</option>
                      <option value="Low">Low (Individual)</option>
                   </select>
                </div>
             </div>

             <div style={{ marginBottom: '1.2rem', padding: '0.8rem', backgroundColor: '#252525', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ color: '#555', fontSize: '0.75rem', marginBottom: '0.2rem' }}>결정된 우선순위</div>
                <div style={{ color: incident.priority === 'Critical' ? '#ff6b6b' : '#339af0', fontSize: '1.2rem', fontWeight: 800 }}>{incident.priority}</div>
             </div>

             <button onClick={handleUpdate} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(51, 154, 240, 0.3)' }}>
                상태 및 조치 내역 저장
             </button>
          </section>

          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h4 style={{ color: '#888', marginTop: 0, marginBottom: '1rem', fontSize: '0.9rem' }}>배정 정보</h4>
             <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#555', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>할당 그룹</label>
                <input 
                  value={formData.assignedGroup || ''} 
                  onChange={e => setFormData({...formData, assignedGroup: e.target.value})} 
                  placeholder="예: NW 인프라팀" 
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', backgroundColor: '#252525', color: '#fff', border: '1px solid #444' }} 
                />
             </div>
             <div>
                <label style={{ color: '#555', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>담당자</label>
                <div style={{ padding: '0.7rem', backgroundColor: '#111', borderRadius: '6px', color: '#aaa', fontSize: '0.9rem', border: '1px solid #222' }}>
                   {incident.assigneeId ? `👤 ${incident.assigneeId}` : '미배정'}
                </div>
             </div>
          </section>

          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h4 style={{ color: '#888', marginTop: 0, marginBottom: '1rem', fontSize: '0.9rem' }}>신고자 정보</h4>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>👤</div>
                <div>
                   <div style={{ color: '#fff', fontWeight: 'bold' }}>{incident.reporterId}</div>
                   <div style={{ color: '#555', fontSize: '0.8rem' }}>🏢 {incident.companyId}</div>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};
