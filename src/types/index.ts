// User types
export interface User {
  id: string;
  name: string;
  email: string;
  type: 'CUSTOMER' | 'EMPLOYEE' | 'MANAGER';
}

export interface AuthResponse {
  sucesso: boolean;
  tipoUsuario: 'CLIENTE' | 'FUNCIONARIO';
  id: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

// Customer types
export interface Customer {
  id: string;
  name: string;
  cpf: string;
  age: number;
  phone: string;
  email: string;
  active: boolean;
}

export interface RegisterCustomerData {
  name: string;
  cpf: string;
  age: number;
  phone: string;
  email: string;
  password: string;
}

// Pizza types
export interface Pizza {
  id: string;
  sabor: string;
  description: string;
  ingredientes: string[];
  preco: number;
  imageUrl: string;
}

// Drink types
export interface Drink {
  id: string;
  nome: string;
  description: string;
  preco: number;
  available: boolean;
  imageUrl: string;
}

// Cart types
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'PIZZA' | 'DRINK';
  imageUrl: string;
}

// Order types
export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  type: 'PIZZA' | 'DRINK';
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Pedido {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'PENDING' | 'IN_PREPARATION' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  address: Address;
  createdAt: string;
}

export interface CreateOrderRequest {
  clienteId: number;
  endereco: string;
  valorTotal: number;
  pizzas: {
    pizzaId: number;
    quantidade: number;
    tamanho: string;
  }[];
  bebidas: {
    bebidaId: number;
    quantidade: number;
  }[];
}

// Payment types
export interface PaymentIntent {
  clientSecret: string;
  amount: number;
}

export interface DashboardCliente {
  nome: string;
  cpf: string;
  idade: number;
  telefone: string;
  email: string;
}

export interface DashboardPizza {
  sabor: string;
  preco: number;
  tamanho: string;
  quantidade: number;
}

export interface DashboardBebida {
  nome: string;
  preco: number;
  quantidade: number;
}

export interface DashboardPedido {
  cliente: DashboardCliente;
  valorTotal: number;
  endereco: string;
  dataHora: string;
  status: 'PENDENTE' | 'EM_PREPARACAO' | 'PRONTO' | 'SAIU_PARA_ENTREGA' | 'ENTREGUE' | 'CANCELADO';
  pizzas: DashboardPizza[];
  bebidas: DashboardBebida[];
}