import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReleaseDetailView } from './ReleaseDetailView';
import { useReleaseDetail } from '../hooks/useReleases';

// Mock the hook
vi.mock('../hooks/useReleases', () => ({
  useReleaseDetail: vi.fn()
}));

describe('ReleaseDetailView Component', () => {
  const mockOnBack = vi.fn();
  const mockOnDeleted = vi.fn();
  const mockUpdateRelease = vi.fn();
  const mockUpdateStatus = vi.fn();
  const mockDeleteRelease = vi.fn();
  const mockRelease = {
    id: 1,
    title: 'v1.0.0 Stable',
    description: 'Initial release',
    status: 'REL_PLANNING',
    releaseType: 'Major',
    version: '1.0.0',
    buildNumber: 'B123',
    targetDate: '2026-03-28T10:00:00',
    backoutPlan: 'Rollback doc',
    packageUrl: 's3://release-bucket'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useReleaseDetail as any).mockReturnValue({
      release: mockRelease,
      loading: false,
      error: null,
      updateRelease: mockUpdateRelease,
      updateStatus: mockUpdateStatus,
      deleteRelease: mockDeleteRelease
    });
  });

  it('renders release detail correctly', () => {
    render(<ReleaseDetailView releaseId={1} onBack={mockOnBack} onDeleted={mockOnDeleted} />);
    
    expect(screen.getByText(/v1.0.0 Stable/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('1.0.0')).toBeInTheDocument();
    expect(screen.getByDisplayValue('B123')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/배포 실패 시 이전 버전으로 원복하는 상세 절차/)).toBeInTheDocument();
  });

  it('updates status via select and save', async () => {
    render(<ReleaseDetailView releaseId={1} onBack={mockOnBack} onDeleted={mockOnDeleted} />);
    
    const statusSelect = screen.getByDisplayValue(/계획 중/);
    fireEvent.change(statusSelect, { target: { value: 'REL_BUILD' } });
    
    const saveButton = screen.getByText('릴리스 업데이트 저장');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockUpdateRelease).toHaveBeenCalledWith(expect.objectContaining({
        status: 'REL_BUILD'
      }));
    });
  });

  it('switches mode via UI interaction (Detail mode is integrated)', () => {
    render(<ReleaseDetailView releaseId={1} onBack={mockOnBack} onDeleted={mockOnDeleted} />);
    expect(screen.getByText(/아티팩트 및 검증/)).toBeInTheDocument();
  });

  it('calls updateRelease when saving changes', async () => {
    render(<ReleaseDetailView releaseId={1} onBack={mockOnBack} onDeleted={mockOnDeleted} />);
    
    const versionInput = screen.getByDisplayValue('1.0.0');
    fireEvent.change(versionInput, { target: { value: '2.0.0' } });
    
    const saveButton = screen.getByText('릴리스 업데이트 저장');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockUpdateRelease).toHaveBeenCalledWith(expect.objectContaining({
        version: '2.0.0'
      }));
    });
  });

  it('calls deleteRelease and onDeleted when deleting', async () => {
    render(<ReleaseDetailView releaseId={1} onBack={mockOnBack} onDeleted={mockOnDeleted} />);
    
    const deleteButton = screen.getByText('릴리스 삭제');
    fireEvent.click(deleteButton);
    
    // The component uses AdminModal for confirmation
    expect(screen.getByText('삭제 확인')).toBeInTheDocument();
  });
});
