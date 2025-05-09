import api from './api';
import { Pizza, Drink } from '../types';

const menuService = {
  getPizzas: async (): Promise<Pizza[]> => {
    const response = await api.get('/pizzas');
    return response.data;
  },

  getAvailableDrinks: async (): Promise<Drink[]> => {
    const response = await api.get('/bebidas/disponiveis');
    return response.data;
  }
};

export default menuService;