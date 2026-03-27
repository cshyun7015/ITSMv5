export type Release = {
  id: number;
  companyId: string;
  title: string;
  description: string;
  status: ReleaseStatus;
  releaseType: string;
  targetDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReleaseStatus = 
  | 'REL_PLANNED' 
  | 'REL_DEVELOPING' 
  | 'REL_TESTING' 
  | 'REL_DEPLOYING' 
  | 'REL_COMPLETED' 
  | 'REL_ROLLED_BACK';

export type ReleaseCreateRequest = {
  title: string;
  description: string;
  releaseType: string;
  targetDate?: string;
};
