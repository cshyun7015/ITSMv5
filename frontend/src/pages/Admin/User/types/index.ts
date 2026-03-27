export interface User {
  userId: string;
  tenantId: string;
  userName: string;
  email: string;
  role: string;
}

export interface UserRequest {
  userId?: string;
  tenantId?: string;
  userName: string;
  email: string;
  password?: string;
  role?: string;
}
