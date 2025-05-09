import api from './api';
import { AuthResponse, LoginCredentials, RegisterCustomerData } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    if (response.data.sucesso) {
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('userType', response.data.tipoUsuario);
    }

    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('userId');
  },

  getUserType: (): string | null => {
    return localStorage.getItem('userType');
  },

  getUserId: (): string | null => {
    return localStorage.getItem('userId');
  },

  registerCustomer: async (data: RegisterCustomerData): Promise<any> => {
    const response = await api.post('/clientes', data);
    return response.data;
  }
};

export default authService;