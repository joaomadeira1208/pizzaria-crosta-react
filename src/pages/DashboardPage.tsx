import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, User, ArrowRight } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import orderService from '../services/orderService';
import { DashboardPedido } from '../types';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, userType } = useAuth();
    const [orders, setOrders] = useState<DashboardPedido[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || userType !== 'FUNCIONARIO') {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                const data = await orderService.getAllOrders();
                setOrders(data);
            } catch (error) {
                console.error('Erro ao buscar pedidos:', error);
                toast.error('Erro ao carregar pedidos');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [isAuthenticated, userType, navigate]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDENTE':
                return 'bg-yellow-100 text-yellow-800';
            case 'EM_PREPARACAO':
                return 'bg-blue-100 text-blue-800';
            case 'PRONTO':
                return 'bg-green-100 text-green-800';
            case 'SAIU_PARA_ENTREGA':
                return 'bg-purple-100 text-purple-800';
            case 'ENTREGUE':
                return 'bg-gray-100 text-gray-800';
            case 'CANCELADO':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard de Pedidos</h1>

                <div className="grid gap-6">
                    {orders.map((order, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <User className="text-gray-500" size={20} />
                                        <span className="font-medium">Cliente: {order.cliente.nome}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock size={16} />
                                        <span>{formatDate(order.dataHora)}</span>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600 mb-4">
                                <MapPin size={16} />
                                <span>{order.endereco}</span>
                            </div>

                            <div className="space-y-4">
                                {order.pizzas.length > 0 && (
                                    <div>
                                        <h3 className="font-medium mb-2">Pizzas:</h3>
                                        <ul className="space-y-2">
                                            {order.pizzas.map((pizza, idx) => (
                                                <li key={idx} className="flex justify-between text-gray-600">
                                                    <span>
                                                        {pizza.quantidade}x {pizza.sabor} ({pizza.tamanho})
                                                    </span>
                                                    <span>R$ {pizza.preco.toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {order.bebidas.length > 0 && (
                                    <div>
                                        <h3 className="font-medium mb-2">Bebidas:</h3>
                                        <ul className="space-y-2">
                                            {order.bebidas.map((bebida, idx) => (
                                                <li key={idx} className="flex justify-between text-gray-600">
                                                    <span>
                                                        {bebida.quantidade}x {bebida.nome}
                                                    </span>
                                                    <span>R$ {bebida.preco.toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                <span className="font-bold text-lg">
                                    Total: R$ {order.valorTotal.toFixed(2)}
                                </span>
                                <Button
                                    variant="primary"
                                    icon={<ArrowRight size={18} />}
                                    onClick={() => {
                                        // Futuramente implementar a lógica de mudança de status
                                        toast.info('Funcionalidade em desenvolvimento');
                                    }}
                                >
                                    Próximo Status
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage; 