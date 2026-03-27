export type Change = {
  id: number;
  companyId: string;
  requesterId: string;
  title: string;
  description: string;
  changeReason: string;
  riskAssessment: string;
  impactAnalysis: string;
  implementationPlan: string;
  rollbackPlan: string;
  changeType: string;
  status: ChangeStatus;
  risk: string;
  priority: string;
  plannedStart: string | null;
  plannedEnd: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ChangeStatus = 
  | 'CHG_DRAFT' 
  | 'CHG_SUBMITTED' 
  | 'CHG_REVIEW' 
  | 'CHG_APPROVED' 
  | 'CHG_SCHEDULED' 
  | 'CHG_IMPLEMENTING' 
  | 'CHG_CLOSED';

export type ChangeCreateRequest = {
  title: string;
  description: string;
  changeReason: string;
  riskAssessment: string;
  impactAnalysis: string;
  implementationPlan: string;
  rollbackPlan: string;
  changeType: string;
  risk: string;
  priority: string;
  plannedStart?: string;
  plannedEnd?: string;
};
