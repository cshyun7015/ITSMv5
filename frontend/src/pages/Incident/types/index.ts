export type Incident = {
  id: number;
  companyId: string;
  reporterId: string;
  assigneeId: string | null;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  impact: string;
  urgency: string;
  category: string;
  subcategory?: string;
  source: string;
  assignedGroup?: string;
  resolutionCode?: string;
  resolutionDescription?: string;
  assetId: number | null;
  createdAt: string;
  resolvedAt: string | null;
  closedAt: string | null;
};

export type IncidentStatus = 'INC_OPEN' | 'INC_IN_PROGRESS' | 'INC_ON_HOLD' | 'INC_RESOLVED' | 'INC_CLOSED' | 'INC_CANCELED';
export type IncidentPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type IncidentCreateRequest = {
  title: string;
  description: string;
  urgency: string;
  impact: string;
  category: string;
  source: string;
  assetId?: number;
};
