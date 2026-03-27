export interface Company {
  companyId: string;
  companyName: string;
  tier: string;
  isActive: boolean;
  createdAt: string;
}

export interface CompanyRequest {
  companyId?: string;
  companyName: string;
  tier: string;
  isActive?: boolean;
}
