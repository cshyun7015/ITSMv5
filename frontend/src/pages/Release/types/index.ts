export interface Release {
  id: number;
  tenantId: string;
  title: string;
  description: string;
  status: ReleaseStatus;
  releaseType: string;
  targetDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ReleaseStatus = 
  | 'REL_PLANNED' 
  | 'REL_DEVELOPING' 
  | 'REL_TESTING' 
  | 'REL_DEPLOYING' 
  | 'REL_COMPLETED' 
  | 'REL_ROLLED_BACK';

export interface ReleaseCreateRequest {
  title: string;
  description: string;
  releaseType: string;
  targetDate?: string;
}
