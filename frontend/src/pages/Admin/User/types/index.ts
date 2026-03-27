export interface User {
  userId: string;
  companyId: string;
  userName: string;
  email: string;
  role: string;
}

export interface UserRequest {
  userId?: string;
  companyId?: string;
  userName: string;
  email: string;
  password?: string;
  role?: string;
}
