export type Release = {
  id: number;
  companyId: string;
  title: string;
  description: string;
  status: ReleaseStatus;
  releaseType: string;
  version: string;
  buildNumber: string;
  packageUrl: string;
  deploymentMethod: string;
  backoutPlan: string;
  testEvidenceUrl: string;
  releaseNotes: string;
  targetDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReleaseStatus = 
  | 'REL_PLANNING' 
  | 'REL_BUILD' 
  | 'REL_TESTING' 
  | 'REL_ROLLOUT' 
  | 'REL_COMPLETED' 
  | 'REL_FAILED';

export type ReleaseCreateRequest = {
  title: string;
  description: string;
  releaseType: string;
  version?: string;
  buildNumber?: string;
  targetDate?: string;
};
