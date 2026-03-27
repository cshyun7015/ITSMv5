export type SRStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELED';
export type SRPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export type User = {
  userId: string;
  userName: string;
  email: string;
  role: string;
};

export type Company = {
  id: string;
  companyName: string;
};

export type Catalog = {
  id: number;
  catalogName: string;
  category: string;
  icon?: string;
};

export type ServiceRequest = {
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
};

export type ServiceRequestListResponse = {
  content: ServiceRequest[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};

export type ServiceRequestFilters = {
  search: string;
  status: string;
  page: number;
  size: number;
  sort: string;
};
