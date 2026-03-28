import React, { useState, useEffect } from 'react';
import { useProblemDetail } from '../hooks/useProblems';
import type { ProblemStatus, ProblemPriority, Problem } from '../types';
import AdminModal from '../../../components/admin/AdminModal';

interface ProblemDetailViewProps {
  problemId: number;
  onBack: () => void;
  onDeleted: () => void;
}

export const ProblemDetailView: React.FC<ProblemDetailViewProps> = ({ problemId, onBack, onDeleted }) => {
  const { problem, loading, error, updateProblem, deleteProblem, refresh } = useProblemDetail(problemId);
  
  const [formData, setFormData] = useState<Partial<Problem>>({});
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' as any, onConfirm: () => {} });

  useEffect(() => {
    if (problem) {
      setFormData({
        status: problem.status,
        urgency: problem.urgency,
        impact: problem.impact,
        category: problem.category,
        assignedGroup: problem.assignedGroup,
        rootCause: problem.rootCause,
        workaround: problem.workaround,
        resolution: problem.resolution
      });
    }
  }, [problem]);

  const handleUpdate = async () => {
    const updated = await updateProblem(formData);
    if (updated) {
      setModal({ 
        isOpen: true, 
        title: '수정 완료', 
        message: '문제 정보 및 분석 결과가 저장되었습니다.', 
        type: 'success', 
        onConfirm: () => { setModal({ ...modal, isOpen: false }); refresh(); } 
      });
    }
  };

  const handleDelete = () => {
    setModal({ 
      isOpen: true, 
      title: '삭제 확인', 
      message: '이 문제 기록을 삭제하시겠습니까? 연결된 장애 링크는 끊어지지만 장애 자체는 삭제되지 않습니다.', 
      type: 'danger', 
      onConfirm: async () => {
        const success = await deleteProblem();
        if (success) {
          setModal({ ...modal, isOpen: false });
          onDeleted();
        }
      }
    });
  };

  if (loading) return <div style={{ color: '#888', textAlign: 'center', padding: '5rem' }}>문제 상세 정보 로딩 중...</div>;
  if (error || !problem) return <div style={{ color: '#fa5252', textAlign: 'center', padding: '5rem' }}>{error || '데이터를 찾을 수 없습니다.'}</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRB_NEW': return '#339af0';
      case 'PRB_RCA': return '#fcc419';
      case 'PRB_KNOWN_ERROR': return '#ff922b';
      case 'PRB_RESOLVED': return '#51cf66';
      case 'PRB_CLOSED': return '#888';
      default: return '#aaa';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PRB_NEW': return '신규 (New)';
      case 'PRB_RCA': return '분석 중 (RCA)';
      case 'PRB_KNOWN_ERROR': return '기지 오류 (Known Error)';
      case 'PRB_RESOLVED': return '해결됨 (Resolved)';
      case 'PRB_CLOSED': return '종료 (Closed)';
      default: return status;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <AdminModal {...modal} onCancel={() => setModal({ ...modal, isOpen: false })} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={onBack} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #444', color: '#aaa', borderRadius: '6px', cursor: 'pointer' }}>← 목록으로</button>
          <h2 style={{ color: '#fff', margin: 0 }}>문제 상세: {problem.title}</h2>
        </div>
        <button onClick={handleDelete} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>문제 기록 삭제</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Analysis Section (RCA & Workaround) */}
          <section style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#fcc419', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>RCA (Root Cause Analysis)</h3>
             
             <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>임시 조치 (Workaround)</label>
                <textarea 
                  value={formData.workaround || ''} 
                  onChange={e => setFormData({...formData, workaround: e.target.value})} 
                  rows={4} 
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#ff922b', fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="영구 해결 전까지 장애를 회피할 수 있는 방법을 기술하세요..."
                />
             </div>

             <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>근본 원인 (Root Cause)</label>
                <textarea 
                  value={formData.rootCause || ''} 
                  onChange={e => setFormData({...formData, rootCause: e.target.value})} 
                  rows={4} 
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#eee', fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="분석된 장애의 근본적인 기술적 원인을 기술하세요..."
                />
             </div>
          </section>

          {/* Permanent Solution Section */}
          <section style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#51cf66', marginTop: 0, marginBottom: '1.5rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>영구 해결책 (Permanent Solution)</h3>
             
             <div>
                <label style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>최종 수정 내역 (Resolution Description)</label>
                <textarea 
                  value={formData.resolution || ''} 
                  onChange={e => setFormData({...formData, resolution: e.target.value})} 
                  rows={5} 
                  style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#111', color: '#51cf66', fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="장애를 영구적으로 제거하기 위해 적용된 수정 사항을 기술하세요..."
                />
             </div>
          </section>

          {/* Original Description */}
          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222' }}>
             <label style={{ color: '#555', fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>최초 문제 정의 (Problem Definition)</label>
             <div style={{ color: '#888', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {problem.description || '내용 없음'}
             </div>
          </section>
        </div>

        {/* Sidebar Info Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '1.2rem', fontSize: '1rem' }}>진행 상태 관리</h3>
             
             <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>현재 상태</label>
                <select 
                  value={formData.status || ''} 
                  onChange={e => setFormData({...formData, status: e.target.value as ProblemStatus})}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', backgroundColor: getStatusColor(formData.status || ''), color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  <option value="PRB_NEW">신규 (New)</option>
                  <option value="PRB_RCA">분석 중 (RCA)</option>
                  <option value="PRB_KNOWN_ERROR">기지 오류 (Known Error)</option>
                  <option value="PRB_RESOLVED">해결됨 (Resolved)</option>
                  <option value="PRB_CLOSED">종료 (Closed)</option>
                </select>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem' }}>
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
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                   </select>
                </div>
             </div>

             <div style={{ marginBottom: '1.5rem', padding: '0.8rem', backgroundColor: '#252525', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ color: '#555', fontSize: '0.75rem', marginBottom: '0.2rem' }}>분석된 우선순위</div>
                <div style={{ color: problem.priority === 'Critical' ? '#ff6b6b' : '#339af0', fontSize: '1.2rem', fontWeight: 800 }}>{problem.priority}</div>
             </div>

             <button onClick={handleUpdate} style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: 'none', backgroundColor: '#339af0', color: '#fff', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(51, 154, 240, 0.3)' }}>
                업데이트 사항 저장
             </button>
          </section>

          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h4 style={{ color: '#888', marginTop: 0, marginBottom: '1rem', fontSize: '0.9rem' }}>배정 및 분류</h4>
             <div style={{ marginBottom: '1.2rem' }}>
                <label style={{ color: '#555', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>담당 그룹 (Expert Group)</label>
                <input 
                  value={formData.assignedGroup || ''} 
                  onChange={e => setFormData({...formData, assignedGroup: e.target.value})} 
                  placeholder="예: SW 품질팀 / DBA" 
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', backgroundColor: '#252525', color: '#fff', border: '1px solid #444' }} 
                />
             </div>
             <div>
                <label style={{ color: '#555', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>카테고리</label>
                <input 
                  value={formData.category || ''} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  placeholder="예: 데이터 정합성" 
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', backgroundColor: '#252525', color: '#fff', border: '1px solid #444' }} 
                />
             </div>
          </section>

          <section style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
             <h4 style={{ color: '#888', marginTop: 0, marginBottom: '1rem', fontSize: '0.9rem' }}>생성 정보</h4>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ color: '#555', fontSize: '0.75rem' }}>회사 ID</div>
                  <div style={{ color: '#aaa', fontSize: '0.9rem' }}>{problem.companyId}</div>
                </div>
                <div>
                  <div style={{ color: '#555', fontSize: '0.75rem' }}>생성일시</div>
                  <div style={{ color: '#aaa', fontSize: '0.9rem' }}>{new Date(problem.createdAt).toLocaleString()}</div>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};
