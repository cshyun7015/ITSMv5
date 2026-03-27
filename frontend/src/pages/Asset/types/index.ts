export interface Asset {
  id: number;
  name: string;
  type: string;
  status: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  location?: string;
  specifications?: string;
  ownerId?: string;
  ownerName?: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetCreateRequest {
  name: string;
  type: string;
  status: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  location?: string;
  specifications?: string;
}
