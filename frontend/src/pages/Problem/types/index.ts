export type Problem = {
  id: number;
  title: string;
  description: string;
  rootCause: string;
  workaround: string;
  resolution: string;
  status: ProblemStatus;
  priority: ProblemPriority;
  urgency: string;
  impact: string;
  category: string;
  assignedGroup?: string;
  createdAt: string;
  resolvedAt?: string;
  closedAt?: string;
  companyId: string;
};

export type ProblemStatus = 'PRB_NEW' | 'PRB_RCA' | 'PRB_KNOWN_ERROR' | 'PRB_RESOLVED' | 'PRB_CLOSED';
export type ProblemPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type ProblemCreateRequest = {
  title: string;
  description: string;
  urgency: string;
  impact: string;
  category: string;
};
