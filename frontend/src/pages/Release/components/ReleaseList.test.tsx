import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReleaseList from './ReleaseList';
import { useReleases } from '../hooks/useReleases';

// Mock the hook
vi.mock('../hooks/useReleases', () => ({
  useReleases: vi.fn()
}));

describe('ReleaseList Component', () => {
  const mockOnSelectDetail = vi.fn();
  const mockCreateRelease = vi.fn();
  const mockReleases = [
    {
      id: 1,
      title: 'v1.0.0 Stable',
      description: 'Initial release',
      status: 'REL_PLANNING',
      releaseType: 'Major',
      targetDate: '2026-03-28T10:00:00'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useReleases as any).mockReturnValue({
      releases: mockReleases,
      loading: false,
      error: null,
      createRelease: mockCreateRelease
    });
  });

  it('renders the release list correctly', () => {
    render(<ReleaseList user={{ role: 'ROLE_ADMIN' }} onSelectDetail={mockOnSelectDetail} />);
    
    expect(screen.getByText('v1.0.0 Stable')).toBeInTheDocument();
    expect(screen.getByText(/Initial release/i)).toBeInTheDocument();
    expect(screen.getByText(/계획 중/)).toBeInTheDocument();
  });

  it('opens the release creation form when "INITIATE RELEASE" is clicked', () => {
    render(<ReleaseList user={{ role: 'ROLE_ADMIN' }} onSelectDetail={mockOnSelectDetail} />);
    
    const initButton = screen.getByText('INITIATE RELEASE');
    fireEvent.click(initButton);
    
    expect(screen.getByText('Staging New Deployment')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Product v1.0.0 Stable...')).toBeInTheDocument();
  });

  it('calls createRelease with form data when submitted', async () => {
    render(<ReleaseList user={{ role: 'ROLE_ADMIN' }} onSelectDetail={mockOnSelectDetail} />);
    
    // Open form
    fireEvent.click(screen.getByText('INITIATE RELEASE'));
    
    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Product v1.0.0 Stable...'), {
      target: { value: 'Test Release' }
    });
    
    const submitButton = screen.getByText('PUBLISH RELEASE PLAN');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockCreateRelease).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Release'
      }));
    });
  });

  it('calls onSelectDetail when a release card is clicked', () => {
    render(<ReleaseList user={{ role: 'ROLE_ADMIN' }} onSelectDetail={mockOnSelectDetail} />);
    
    const releaseCard = screen.getByText('v1.0.0 Stable').closest('div');
    if (releaseCard) fireEvent.click(releaseCard);
    
    expect(mockOnSelectDetail).toHaveBeenCalledWith(1);
  });
});
