import React, { useState, useEffect } from 'react';
import { useReleaseDetail } from '../hooks/useReleases';
import type { ReleaseStatus, Release } from '../types';
import AdminModal from '../../../components/admin/AdminModal';

interface ReleaseDetailViewProps {
  releaseId: number;
  onBack: () => void;
  onDeleted: () => void;
}

export const ReleaseDetailView: React.FC<ReleaseDetailViewProps> = ({ releaseId, onBack, onDeleted }) => {
  const { release, loading, error, updateRelease, deleteRelease, refresh } = useReleaseDetail(releaseId);
  
  const [formData, setFormData] = useState<Partial<Release>>({});
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  useEffect(() => {
    if (release) {
      setFormData({
        status: release.status,
        releaseType: release.releaseType,
        version: release.version,
        buildNumber: release.buildNumber,
        packageUrl: release.packageUrl,
        deploymentMethod: release.deploymentMethod,
        backoutPlan: release.backoutPlan,
        testEvidenceUrl: release.testEvidenceUrl,
        releaseNotes: release.releaseNotes,
        targetDate: release.targetDate ? release.targetDate.slice(0, 16) : ''
      });
    }
  }, [release]);

  const handleUpdate = async () => {
    const updated = await updateRelease(formData);
    if (updated) {
      setModal({ 
        isOpen: true, 
        title: '수정 완료', 
        message: '릴리스 계획 및 정보가 성공적으로 업데이트되었습니다.', 
        type: 'success', 
        onConfirm: () => { setModal({ ...modal, isOpen: false }); refresh(); } 
      });
    }
  };

  const handleDelete = () => {
    setModal({ 
      isOpen: true, 
      title: '삭제 확인', 
      message: '이 릴리스 계획을 영구적으로 삭제하시겠습니까?', 
      type: 'danger', 
      onConfirm: async () => {
        const success = await deleteRelease();
        if (success) {
          setModal({ ...modal, isOpen: false });
          onDeleted();
        }
      }
    });
  };

  if (loading) return <div style={{ color: '#888', textAlign: 'center', padding: '5rem' }}>릴리스 상세 정보 로딩 중...</div>;
  if (error || !release) return <div style={{ color: '#fa5252', textAlign: 'center', padding: '5rem' }}>{error || '데이터를 찾을 수 없습니다.'}</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REL_PLANNING': return '#888';
      case 'REL_BUILD': return '#fcc419';
      case 'REL_TESTING': return '#748ffc';
      case 'REL_ROLLOUT': return '#ff922b';
      case 'REL_COMPLETED': return '#51cf66';
      case 'REL_FAILED': return '#fa5252';
      default: return '#aaa';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'REL_PLANNING': return '계획 중 (Planning)';
      case 'REL_BUILD': return '빌드/패키징 (Build)';
      case 'REL_TESTING': return '테스트/검증 (Testing)';
      case 'REL_ROLLOUT': return '배포 중 (Rollout)';
      case 'REL_COMPLETED': return '배포 완료 (Completed)';
      case 'REL_FAILED': return '배포 실패 (Failed)';
      default: return status;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={onBack} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #444', color: '#aaa', borderRadius: '6px', cursor: 'pointer' }}>← 목록으로</button>
          <h2 style={{ color: '#fff', margin: 0 }}>릴리스 상세: {release.title}</h2>
        </div>
        <button onClick={handleDelete} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>릴리스 삭제</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Release Artifacts & QA */}
          <section style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#fcc419', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>아티팩트 및 검증 (Artifacts & QA)</h3>
             
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                   <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>패키지 경로 (Package/Artifact URL)</label>
                   <input value={formData.packageUrl || ''} onChange={e => setFormData({...formData, packageUrl: e.target.value})} placeholder="https://..." style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#339af0' }} />
                </div>
                <div>
                   <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>테스트 증적 (Test Evidence URL)</label>
                   <input value={formData.testEvidenceUrl || ''} onChange={e => setFormData({...formData, testEvidenceUrl: e.target.value})} placeholder="Jira Link / Documentation..." style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#51cf66' }} />
                </div>
             </div>

             <div>
                <label style={{ color: '#fa5252', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>회수 계획 (Backout Plan)</label>
                <textarea value={formData.backoutPlan || ''} onChange={e => setFormData({...formData, backoutPlan: e.target.value})} rows={3} placeholder="배포 실패 시 이전 버전으로 원복하는 상세 절차..." style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #fa525233', backgroundColor: '#111', color: '#eee', fontFamily: 'inherit' }} />
             </div>
          </section>

          {/* Release Notes */}
          <section style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#748ffc', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>릴리스 노트 (Release Notes)</h3>
             <textarea value={formData.releaseNotes || ''} onChange={e => setFormData({...formData, releaseNotes: e.target.value})} rows={10} placeholder="이 릴리스에 포함된 주요 변경 사항, 버그 수정 등을 기록하세요..." style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#eee', fontFamily: 'inherit', lineHeight: '1.6' }} />
          </section>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '1.2rem', fontSize: '1rem' }}>워크플로우 상태</h3>
             
             <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>현재 상태</label>
                <select 
                  value={formData.status || ''} 
                  onChange={e => setFormData({...formData, status: e.target.value as ReleaseStatus})}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', backgroundColor: getStatusColor(formData.status || ''), color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  <option value="REL_PLANNING">계획 중 (Planning)</option>
                  <option value="REL_BUILD">빌드/패키징 (Build)</option>
                  <option value="REL_TESTING">테스트/검증 (Testing)</option>
                  <option value="REL_ROLLOUT">배포 중 (Rollout)</option>
                  <option value="REL_COMPLETED">배포 완료 (Completed)</option>
                  <option value="REL_FAILED">배포 실패 (Failed)</option>
                </select>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem' }}>
                <div>
                   <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>릴리스 타입</label>
                   <select value={formData.releaseType || ''} onChange={e => setFormData({...formData, releaseType: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #444' }}>
                      <option value="Major">Major</option>
                      <option value="Minor">Minor</option>
                      <option value="Patch">Patch</option>
                      <option value="Emergency">Emergency</option>
                   </select>
                </div>
                <div>
                   <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>배포 방식</label>
                   <select value={formData.deploymentMethod || ''} onChange={e => setFormData({...formData, deploymentMethod: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#2c2c2c', color: '#fff', border: '1px solid #444' }}>
                      <option value="Recreate">Recreate</option>
                      <option value="Rolling">Rolling</option>
                      <option value="Canary">Canary</option>
                      <option value="Blue/Green">Blue/Green</option>
                   </select>
                </div>
             </div>

             <button onClick={handleUpdate} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(51, 154, 240, 0.3)' }}>
                릴리스 업데이트 저장
             </button>
          </section>

          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '1.2rem', fontSize: '1rem' }}>버전 정보</h3>
             <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>버전 (Version)</label>
                <input value={formData.version || ''} onChange={e => setFormData({...formData, version: e.target.value})} placeholder="예: 1.2.0" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444' }} />
             </div>
             <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>빌드 번호 (Build #)</label>
                <input value={formData.buildNumber || ''} onChange={e => setFormData({...formData, buildNumber: e.target.value})} placeholder="예: 2026.03.28-01" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444' }} />
             </div>
             <div>
                <label style={{ color: '#888', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>목표 배포일</label>
                <input type="datetime-local" value={formData.targetDate || ''} onChange={e => setFormData({...formData, targetDate: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#111', color: '#fff', border: '1px solid #444' }} />
             </div>
          </section>

          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
             <div style={{ color: '#555', fontSize: '0.75rem' }}>생성 일시: {new Date(release.createdAt).toLocaleString()}</div>
             <div style={{ color: '#555', fontSize: '0.75rem', marginTop: '0.3rem' }}>최종 수정: {new Date(release.updatedAt).toLocaleString()}</div>
          </section>
        </div>
      </div>
    </div>
  );
};
