import api from './api';
import { Pedido, CreateOrderRequest, PaymentIntent, DashboardPedido } from '../types';

const orderService = {
  createOrder: async (orderData: CreateOrderRequest): Promise<Pedido> => {
    const response = await api.post('/pedidos', orderData);
    return response.data;
  },

  getOrdersByCustomerId: async (customerId: string): Promise<Pedido[]> => {
    const response = await api.get(`/pedidos/por-cliente/${customerId}`);
    return response.data;
  },

  getAllOrders: async (): Promise<DashboardPedido[]> => {
    const response = await api.get('/pedidos');
    return response.data;
  },

  getOrderStatus: async (orderId: string): Promise<string> => {
    const response = await api.get(`/pedidos/recuperar-status/${orderId}`);
    return response.data.status;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Pedido> => {
    const response = await api.post(`/pedidos/alterar-status/${orderId}`, { status });
    return response.data;
  },

  createPaymentIntent: async (orderId: string): Promise<PaymentIntent> => {
    const response = await api.post(`/pagamento/intencao`, { orderId });
    return response.data;
  }
};

export default orderService;