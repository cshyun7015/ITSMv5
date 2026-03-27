export interface SLA {
  id: number;
  tenantId: string;
  serviceName: string;
  targetValue: number;
  actualValue: number;
  unit: string;
  period: string;
  status: SLAStatus;
  createdAt: string;
  updatedAt: string;
}

export type SLAStatus = 'SLA_MET' | 'SLA_NOT_MET' | 'SLA_WARNING';

export interface SLACreateRequest {
  serviceName: string;
  targetValue: number;
  actualValue: number;
  unit: string;
  period: string;
}
