export interface Tenant {
  tenantId: string;
  tenantName: string;
  tier: string;
  isActive: boolean;
  createdAt: string;
}

export interface TenantRequest {
  tenantId?: string;
  tenantName: string;
  tier: string;
  isActive?: boolean;
}
