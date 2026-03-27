export type SRStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELED';
export type SRPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export interface User {
  userId: number;
  userName: string;
  email: string;
  role: string;
}

export interface Company {
  id: number;
  companyName: string;
}

export interface Catalog {
  id: number;
  catalogName: string;
  category: string;
  icon?: string;
}

export interface ServiceRequest {
  id: number;
  title: string;
  description: string;
  status: SRStatus;
  priority: SRPriority;
  resolution?: string;
  formData?: string;
  requester?: User;
  assignee?: User;
  company?: Company;
  catalog?: Catalog;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestListResponse {
  content: ServiceRequest[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface ServiceRequestFilters {
  search: string;
  status: string;
  page: number;
  size: number;
  sort: string;
}
