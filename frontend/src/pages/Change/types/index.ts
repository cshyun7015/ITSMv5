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
  testPlan: string;
  changeType: string;
  status: ChangeStatus;
  risk: string;
  priority: string;
  assignedGroup: string;
  plannedStart: string | null;
  plannedEnd: string | null;
  actualStart: string | null;
  actualEnd: string | null;
  reviewNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type ChangeStatus = 
  | 'CHG_DRAFT' 
  | 'CHG_AUTHORIZATION' 
  | 'CHG_SCHEDULED' 
  | 'CHG_IMPLEMENTATION' 
  | 'CHG_REVIEW' 
  | 'CHG_COMPLETED' 
  | 'CHG_CANCELED';

export type ChangeCreateRequest = {
  title: string;
  description: string;
  changeReason: string;
  riskAssessment: string;
  impactAnalysis: string;
  implementationPlan: string;
  rollbackPlan: string;
  testPlan?: string;
  changeType: string;
  risk: string;
  priority: string;
  plannedStart?: string;
  plannedEnd?: string;
};
