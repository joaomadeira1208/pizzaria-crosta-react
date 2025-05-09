import api from './api';
import { Customer } from '../types';

const customerService = {
  getCustomerById: async (id: string): Promise<Customer> => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },
  
  updateCustomer: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const response = await api.patch(`/clientes/${id}`, data);
    return response.data;
  },
  
  toggleCustomerStatus: async (id: string): Promise<Customer> => {
    const response = await api.post(`/clientes/alterar-status/${id}`);
    return response.data;
  }
};

export default customerService;