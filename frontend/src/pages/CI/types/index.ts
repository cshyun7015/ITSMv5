export interface CI {
  id: number;
  companyId: string;
  name: string;
  type: string;
  status: string;
  model?: string;
  location?: string;
  specifications?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CICreateRequest {
  name: string;
  type: string;
  status: string;
  model?: string;
  location?: string;
  specifications?: string;
}
