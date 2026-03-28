export type SlaStatus = 'SLA_DRAFT' | 'SLA_ACTIVE' | 'SLA_INACTIVE' | 'SLA_EXPIRED';

export interface SlaMetric {
  id?: number;
  name: string;
  description?: string;
  targetValue?: number;
  unit?: string;
  warningThreshold?: number;
  criticalThreshold?: number;
  frequency?: string;
  isActive: boolean;
}

export interface Sla {
  id?: number;
  name: string;
  description?: string;
  customerName?: string;
  status: SlaStatus;
  serviceHours?: string;
  startDate?: string;
  endDate?: string;
  companyId?: string;
  metrics: SlaMetric[];
  createdAt?: string;
  updatedAt?: string;
}
