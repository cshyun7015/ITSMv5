import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SLAPage from './index';
import { useSlas, useSlaDetail } from './hooks/useSlas';

vi.mock('./hooks/useSlas', () => ({
  useSlas: vi.fn(),
  useSlaDetail: vi.fn()
}));

describe('SLAPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSlas as any).mockReturnValue({
      slas: [{ id: 1, name: 'Test SLA', customerName: 'Client A', status: 'SLA_ACTIVE', metrics: [] }],
      loading: false,
      error: null,
      createSla: vi.fn()
    });
    (useSlaDetail as any).mockReturnValue({
      sla: { id: 1, name: 'Test SLA', customerName: 'Client A', status: 'SLA_ACTIVE', metrics: [] },
      loading: false,
      error: null,
      updateSla: vi.fn(),
      deleteSla: vi.fn()
    });
  });

  it('switches from list to detail view when an SLA is clicked', async () => {
    render(<SLAPage user={{ username: 'testuser' }} />);
    
    expect(screen.getByText('Service Level Agreements')).toBeDefined();
    
    const slaItem = screen.getByText('Test SLA');
    fireEvent.click(slaItem);
    
    expect(screen.getByText(/Agreement Details: Test SLA/)).toBeDefined();
    expect(screen.getByText('← Back to List')).toBeDefined();
  });

  it('switches back to list view when Back button is clicked', async () => {
    render(<SLAPage user={{ username: 'testuser' }} />);
    
    // Go to detail
    fireEvent.click(screen.getByText('Test SLA'));
    
    // Go back
    fireEvent.click(screen.getByText('← Back to List'));
    
    expect(screen.getByText('Service Level Agreements')).toBeDefined();
  });
});
