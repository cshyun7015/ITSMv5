import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SlaList from './SlaList';
import { useSlas } from '../hooks/useSlas';

vi.mock('../hooks/useSlas', () => ({
  useSlas: vi.fn()
}));

describe('SlaList Component', () => {
  const mockCreateSla = vi.fn();
  const mockOnSelectDetail = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSlas as any).mockReturnValue({
      slas: [],
      loading: false,
      error: null,
      createSla: mockCreateSla
    });
  });

  it('renders the create button and opens the form', async () => {
    render(<SlaList onSelectDetail={mockOnSelectDetail} />);
    
    const createButton = screen.getByText('CREATE NEW SLA');
    fireEvent.click(createButton);
    
    expect(screen.getByLabelText('Agreement Name')).toBeDefined();
    expect(screen.getByLabelText('Customer / Client Name')).toBeDefined();
  });

  it('submits the form with correct data', async () => {
    mockCreateSla.mockResolvedValue({ id: 1, name: 'Test SLA' });
    render(<SlaList onSelectDetail={mockOnSelectDetail} />);
    
    // Open Form
    fireEvent.click(screen.getByText('CREATE NEW SLA'));
    
    // Fill Form
    const nameInput = screen.getByLabelText('Agreement Name');
    const customerInput = screen.getByLabelText('Customer / Client Name');
    
    fireEvent.change(nameInput, { target: { value: 'Enterprise SLA' } });
    fireEvent.change(customerInput, { target: { value: 'ACME Corp' } });
    
    // Submit
    const submitButton = screen.getByText('INITIATE AGREEMENT');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockCreateSla).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Enterprise SLA',
        customerName: 'ACME Corp'
      }));
    });
  });

  it('displays existing SLAs', () => {
    (useSlas as any).mockReturnValue({
      slas: [
        { id: 1, name: 'Active Agreement', customerName: 'Client X', status: 'SLA_ACTIVE' }
      ],
      loading: false,
      error: null,
      createSla: mockCreateSla
    });
    
    render(<SlaList onSelectDetail={mockOnSelectDetail} />);
    expect(screen.getByText('Active Agreement')).toBeDefined();
    expect(screen.getByText('Client X')).toBeDefined();
  });

  it('calls onSelectDetail when an SLA card is clicked', () => {
    (useSlas as any).mockReturnValue({
      slas: [
        { id: 101, name: 'Clickable SLA', customerName: 'Client Y', status: 'SLA_ACTIVE' }
      ],
      loading: false,
      error: null,
      createSla: mockCreateSla
    });
    
    render(<SlaList onSelectDetail={mockOnSelectDetail} />);
    
    const slaCard = screen.getByText('Clickable SLA').closest('div');
    if (slaCard) fireEvent.click(slaCard);
    
    expect(mockOnSelectDetail).toHaveBeenCalledWith(101);
  });
});
