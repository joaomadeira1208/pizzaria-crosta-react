import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';

interface PizzaPedido {
  id: number;
  sabor: string;
  preco: number;
  tamanho: string;
  imageUrl: string;
  quantidade: number;
  ingredientes: string[];
}

interface BebidaPedido {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

interface PedidoCliente {
  valorTotal: number;
  endereco: string;
  dataHora: string;
  status: string;
  pizzas: PizzaPedido[];
  bebidas: BebidaPedido[];
}

const OrdersPage: React.FC = () => {
  const { userId, isAuthenticated, userType } = useAuth();
  const [orders, setOrders] = useState<PedidoCliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userType === 'FUNCIONARIO') {
      navigate('/');
      return;
    }
    const fetchOrders = async () => {
      if (!isAuthenticated || !userId) return;
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/pedidos/por-cliente/${userId}`);
        if (!response.ok) throw new Error('Erro ao buscar pedidos');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        toast.error('Não foi possível carregar seus pedidos.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId, isAuthenticated, userType, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Meus Pedidos</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
              <Package className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Nenhum pedido ainda</h2>
            <p className="text-gray-600 mb-6">
              Você ainda não fez nenhum pedido conosco. Confira nosso cardápio para fazer seu primeiro pedido!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-red-700 text-white px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span className="font-medium">Pedido</span>
                  </div>
                  <span className="font-medium capitalize">{order.status}</span>
                </div>
                <div className="p-4">
                  <div className="mb-2 text-gray-800 text-sm">
                    <div><span className="font-semibold">Data:</span> {new Date(order.dataHora).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    <div><span className="font-semibold">Status:</span> {order.status}</div>
                    <div><span className="font-semibold">Valor Total:</span> R$ {order.valorTotal.toFixed(2)}</div>
                    <div><span className="font-semibold">Endereço:</span> {order.endereco}</div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="secondary" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                      {openIndex === idx ? 'Ocultar Itens' : 'Ver Itens'}
                    </Button>
                  </div>
                  {openIndex === idx && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Pizzas:</h4>
                      {order.pizzas.length === 0 ? <p className="text-gray-500 mb-2">Nenhuma pizza neste pedido.</p> : (
                        <ul className="mb-2">
                          {order.pizzas.map((pizza, i) => (
                            <li key={i} className="mb-2">
                              <span className="font-medium">{pizza.sabor}</span> - {pizza.tamanho} - {pizza.quantidade}x - R$ {pizza.preco.toFixed(2)}
                              <br />
                            </li>
                          ))}
                        </ul>
                      )}
                      <h4 className="font-semibold mb-2 mt-4">Bebidas:</h4>
                      {order.bebidas.length === 0 ? <p className="text-gray-500 mb-2">Nenhuma bebida neste pedido.</p> : (
                        <ul>
                          {order.bebidas.map((bebida, i) => (
                            <li key={i}>
                              <span className="font-medium">{bebida.nome}</span> - {bebida.quantidade}x - R$ {bebida.preco.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;