import React from 'react';
import type { SRStatus } from '../types';

interface StatusBadgeProps {
  status: SRStatus;
}

const getStatusColor = (status: SRStatus) => {
  switch (status) {
    case 'OPEN': return '#339af0';
    case 'ASSIGNED': return '#fcc419';
    case 'IN_PROGRESS': return '#94d82d';
    case 'RESOLVED': return '#51cf66';
    case 'CLOSED': return '#888';
    case 'CANCELED': return '#fa5252';
    default: return '#eee';
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const color = getStatusColor(status);
  return (
    <span style={{ 
      padding: '0.3rem 0.6rem', 
      borderRadius: '4px', 
      fontSize: '0.75rem', 
      fontWeight: 'bold', 
      backgroundColor: `${color}22`, 
      color: color,
      border: `1px solid ${color}44`
    }}>
      {status}
    </span>
  );
};
