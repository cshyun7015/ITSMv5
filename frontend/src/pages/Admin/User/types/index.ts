export type User = {
  userId: string;
  companyId: string;
  userName: string;
  email: string;
  role: string;
};

export type UserRequest = {
  userId?: string;
  companyId?: string;
  userName: string;
  email: string;
  password?: string;
  role?: string;
};
