export interface Incident {
  id: number;
  companyId: string;
  reporterId: string;
  assigneeId: string | null;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  impact: string;
  assetId: number | null;
  createdAt: string;
  resolvedAt: string | null;
}

export type IncidentStatus = 'INC_OPEN' | 'INC_IN_PROGRESS' | 'INC_RESOLVED' | 'INC_CLOSED';
export type IncidentPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface IncidentCreateRequest {
  title: string;
  description: string;
  priority: string;
  impact: string;
  assetId?: string;
  reporterId: string;
}
