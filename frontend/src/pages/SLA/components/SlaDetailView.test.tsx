import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SlaDetailView from './SlaDetailView';
import { useSlaDetail } from '../hooks/useSlas';

vi.mock('../hooks/useSlas', () => ({
  useSlaDetail: vi.fn()
}));

vi.mock('../../../components/admin/AdminModal', () => ({
  default: () => null
}));

describe('SlaDetailView Component', () => {
  const mockUpdateSla = vi.fn();
  const mockDeleteSla = vi.fn();
  const mockOnBack = vi.fn();
  const mockOnDeleted = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSlaDetail as any).mockReturnValue({
      sla: {
        id: 1,
        name: 'Platinum SLA',
        customerName: 'MegaCorp',
        status: 'SLA_ACTIVE',
        serviceHours: '24x7',
        metrics: [
          { name: 'Uptime', targetValue: 99.9, unit: '%', frequency: 'Monthly', isActive: true }
        ]
      },
      loading: false,
      error: null,
      updateSla: mockUpdateSla,
      deleteSla: mockDeleteSla,
      refresh: vi.fn()
    });
  });

  it('renders SLA details correctly', () => {
    render(<SlaDetailView slaId={1} onBack={mockOnBack} onDeleted={mockOnDeleted} />);
    
    expect(screen.getByText(/Agreement Details: Platinum SLA/)).toBeDefined();
    expect(screen.getByDisplayValue('MegaCorp')).toBeDefined();
    expect(screen.getByText('Uptime')).toBeDefined();
  });

  it('calls updateSla when Save Changes is clicked', async () => {
    mockUpdateSla.mockResolvedValue({ id: 1 });
    render(<SlaDetailView slaId={1} onBack={mockOnBack} onDeleted={mockOnDeleted} />);
    
    const saveButton = screen.getByText('SAVE CHANGES');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockUpdateSla).toHaveBeenCalled();
    });
  });

  it('allows adding and removing metrics in state', () => {
    render(<SlaDetailView slaId={1} onBack={mockOnBack} onDeleted={mockOnDeleted} />);
    
    // Test removal (using 'Remove' button)
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    
    expect(screen.queryByText('Uptime')).toBeNull();
  });
});
