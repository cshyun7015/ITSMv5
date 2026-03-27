export type SLA = {
  id: number;
  companyId: string;
  serviceName: string;
  targetValue: number;
  actualValue: number;
  unit: string;
  period: string;
  status: SLAStatus;
  createdAt: string;
  updatedAt: string;
};

export type SLAStatus = 'SLA_MET' | 'SLA_NOT_MET' | 'SLA_WARNING';

export type SLACreateRequest = {
  serviceName: string;
  targetValue: number;
  actualValue: number;
  unit: string;
  period: string;
};
