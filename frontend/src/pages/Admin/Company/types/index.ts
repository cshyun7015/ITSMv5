export type Company = {
  companyId: string;
  companyName: string;
  tier: string;
  isActive: boolean;
  createdAt: string;
};

export type CompanyRequest = {
  companyId?: string;
  companyName: string;
  tier: string;
  isActive?: boolean;
};
