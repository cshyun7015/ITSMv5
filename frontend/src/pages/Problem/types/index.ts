export interface Problem {
  id: number;
  title: string;
  description: string;
  rootCause: string;
  workaround: string;
  status: ProblemStatus;
  priority: ProblemPriority;
  createdAt: string;
  companyId: string;
}

export type ProblemStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'CLOSED';
export type ProblemPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface ProblemCreateRequest {
  title: string;
  description: string;
  priority: string;
  rootCause: string;
  workaround: string;
  status: string;
}
