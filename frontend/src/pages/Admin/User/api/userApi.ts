import type { User, UserRequest } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getHeaders = () => {
  const token = localStorage.getItem('itsm_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const userApi = {
  getUsers: async (page: number = 0, size: number = 10, search: string = '', sort: string = 'userId,asc') => {
    const response = await fetch(`${API_URL}/api/admin/users?page=${page}&size=${size}&search=${encodeURIComponent(search)}&sort=${sort}`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  createUser: async (request: UserRequest): Promise<User> => {
    const response = await fetch(`${API_URL}/api/admin/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  updateUser: async (userId: string, request: UserRequest): Promise<User> => {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  toggleUserStatus: async (userId: string): Promise<User> => {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}/toggle`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to toggle user status');
    return response.json();
  },

  deleteUser: async (userId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },
};
