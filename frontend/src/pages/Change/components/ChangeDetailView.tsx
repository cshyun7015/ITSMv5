import React, { useState, useEffect } from 'react';
import { useChangeDetail } from '../hooks/useChanges';
import type { ChangeStatus, Change } from '../types';
import AdminModal from '../../../components/admin/AdminModal';

interface ChangeDetailViewProps {
  changeId: number;
  onBack: () => void;
  onDeleted: () => void;
}

export const ChangeDetailView: React.FC<ChangeDetailViewProps> = ({ changeId, onBack, onDeleted }) => {
  const { change, loading, error, updateChange, deleteChange, refresh } = useChangeDetail(changeId);
  
  const [formData, setFormData] = useState<Partial<Change>>({});
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  useEffect(() => {
    if (change) {
      setFormData({
        status: change.status,
        changeType: change.changeType,
        risk: change.risk,
        priority: change.priority,
        assignedGroup: change.assignedGroup,
        changeReason: change.changeReason,
        riskAssessment: change.riskAssessment,
        impactAnalysis: change.impactAnalysis,
        implementationPlan: change.implementationPlan,
        rollbackPlan: change.rollbackPlan,
        testPlan: change.testPlan,
        reviewNotes: change.reviewNotes,
        plannedStart: change.plannedStart ? change.plannedStart.slice(0, 16) : '',
        plannedEnd: change.plannedEnd ? change.plannedEnd.slice(0, 16) : '',
        actualStart: change.actualStart ? change.actualStart.slice(0, 16) : '',
        actualEnd: change.actualEnd ? change.actualEnd.slice(0, 16) : ''
      });
    }
  }, [change]);

  const handleUpdate = async () => {
    const updated = await updateChange(formData);
    if (updated) {
      setModal({ 
        isOpen: true, 
        title: '수정 완료', 
        message: '변경 요청 정보가 성공적으로 반영되었습니다.', 
        type: 'success', 
        onConfirm: () => { setModal({ ...modal, isOpen: false }); refresh(); } 
      });
    }
  };

  const handleDelete = () => {
    setModal({ 
      isOpen: true, 
      title: '삭제 확인', 
      message: '이 변경 요청을 영구적으로 삭제하시겠습니까?', 
      type: 'danger', 
      onConfirm: async () => {
        const success = await deleteChange();
        if (success) {
          setModal({ ...modal, isOpen: false });
          onDeleted();
        }
      }
    });
  };

  if (loading) return <div style={{ color: '#888', textAlign: 'center', padding: '5rem' }}>변경 요청 상세 정보 로딩 중...</div>;
  if (error || !change) return <div style={{ color: '#fa5252', textAlign: 'center', padding: '5rem' }}>{error || '데이터를 찾을 수 없습니다.'}</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CHG_DRAFT': return '#888';
      case 'CHG_AUTHORIZATION': return '#fcc419';
      case 'CHG_SCHEDULED': return '#339af0';
      case 'CHG_IMPLEMENTATION': return '#ff922b';
      case 'CHG_REVIEW': return '#748ffc';
      case 'CHG_COMPLETED': return '#51cf66';
      case 'CHG_CANCELED': return '#fa5252';
      default: return '#aaa';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CHG_DRAFT': return '초안 (Draft)';
      case 'CHG_AUTHORIZATION': return '승인 요청 (Auth)';
      case 'CHG_SCHEDULED': return '예약됨 (Scheduled)';
      case 'CHG_IMPLEMENTATION': return '수행 중 (Implementing)';
      case 'CHG_REVIEW': return '사후 검토 (Review)';
      case 'CHG_COMPLETED': return '완료 (Completed)';
      case 'CHG_CANCELED': return '취소 (Canceled)';
      default: return status;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={onBack} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #444', color: '#aaa', borderRadius: '6px', cursor: 'pointer' }}>← 목록으로</button>
          <h2 style={{ color: '#fff', margin: 0 }}>변경 요청 상세: {change.title}</h2>
        </div>
        <button onClick={handleDelete} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>변경 요청 취소/삭제</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Analysis & Planning */}
          <section style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#339af0', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>분석 및 기획 (Analysis & Planning)</h3>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                   <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>영향 분석 (Impact Analysis)</label>
                   <textarea value={formData.impactAnalysis || ''} onChange={e => setFormData({...formData, impactAnalysis: e.target.value})} rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#eee', fontFamily: 'inherit' }} />
                </div>
                <div>
                   <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>위험 평가 (Risk Assessment)</label>
                   <textarea value={formData.riskAssessment || ''} onChange={e => setFormData({...formData, riskAssessment: e.target.value})} rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#eee', fontFamily: 'inherit' }} />
                </div>
             </div>

             <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>변경 사유 (Reason for Change)</label>
                <textarea value={formData.changeReason || ''} onChange={e => setFormData({...formData, changeReason: e.target.value})} rows={2} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#eee', fontFamily: 'inherit' }} />
             </div>
          </section>

          {/* Implementation & Rollback */}
          <section style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#ff922b', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>구현 및 복구 계획 (Implementation & Rollback)</h3>
             
             <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>수행 절차 (Implementation Plan)</label>
                <textarea value={formData.implementationPlan || ''} onChange={e => setFormData({...formData, implementationPlan: e.target.value})} rows={4} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#eee', fontFamily: 'inherit' }} />
             </div>

             <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#fa5252', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>복구 계획 (Rollback Plan) *필수</label>
                <textarea value={formData.rollbackPlan || ''} onChange={e => setFormData({...formData, rollbackPlan: e.target.value})} rows={3} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #fa525233', backgroundColor: '#111', color: '#fa5252', fontFamily: 'inherit' }} />
             </div>

             <div>
                <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>검수 계획 (Test Plan)</label>
                <textarea value={formData.testPlan || ''} onChange={e => setFormData({...formData, testPlan: e.target.value})} rows={2} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#eee', fontFamily: 'inherit' }} />
             </div>
          </section>

          {/* PIR Section */}
          <section style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#748ffc', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>사후 검토 (Post Implementation Review)</h3>
             <textarea value={formData.reviewNotes || ''} onChange={e => setFormData({...formData, reviewNotes: e.target.value})} rows={3} placeholder="작업 결과 및 특이사항을 기록하세요..." style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#748ffc', fontFamily: 'inherit' }} />
          </section>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '1.2rem', fontSize: '1rem' }}>워크플로우 관리</h3>
             
             <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>현재 상태</label>
                <select 
                  value={formData.status || ''} 
                  onChange={e => setFormData({...formData, status: e.target.value as ChangeStatus})}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', backgroundColor: getStatusColor(formData.status || ''), color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  <option value="CHG_DRAFT">초안 (Draft)</option>
                  <option value="CHG_AUTHORIZATION">승인 요청 (Auth)</option>
                  <option value="CHG_SCHEDULED">예약됨 (Scheduled)</option>
                  <option value="CHG_IMPLEMENTATION">수행 중 (Implementing)</option>
                  <option value="CHG_REVIEW">사후 검토 (Review)</option>
                  <option value="CHG_COMPLETED">완료 (Completed)</option>
                  <option value="CHG_CANCELED">취소 (Canceled)</option>
                </select>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem' }}>
                <div>
                   <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>위험도</label>
                   <select value={formData.risk || ''} onChange={e => setFormData({...formData, risk: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #444' }}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Extreme">Extreme</option>
                   </select>
                </div>
                <div>
                   <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>우선순위</label>
                   <select value={formData.priority || ''} onChange={e => setFormData({...formData, priority: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #444' }}>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                   </select>
                </div>
             </div>

             <button onClick={handleUpdate} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(51, 154, 240, 0.3)' }}>
                변경 사항 저장
             </button>
          </section>

          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '1.2rem', fontSize: '1rem' }}>일정 관리</h3>
             <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>계획 시작</label>
                <input type="datetime-local" value={formData.plannedStart || ''} onChange={e => setFormData({...formData, plannedStart: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444' }} />
             </div>
             <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>계획 종료</label>
                <input type="datetime-local" value={formData.plannedEnd || ''} onChange={e => setFormData({...formData, plannedEnd: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444' }} />
             </div>
             <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>실제 시작</label>
                <input type="datetime-local" value={formData.actualStart || ''} onChange={e => setFormData({...formData, actualStart: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#111', color: '#eee', border: '1px solid #333' }} />
             </div>
             <div>
                <label style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>실제 종료</label>
                <input type="datetime-local" value={formData.actualEnd || ''} onChange={e => setFormData({...formData, actualEnd: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#111', color: '#eee', border: '1px solid #333' }} />
             </div>
          </section>

          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
             <div style={{ color: '#555', fontSize: '0.75rem' }}>기안자 ID: {change.requesterId}</div>
             <div style={{ color: '#555', fontSize: '0.75rem', marginTop: '0.3rem' }}>생성 일시: {new Date(change.createdAt).toLocaleString()}</div>
          </section>
        </div>
      </div>
    </div>
  );
};
