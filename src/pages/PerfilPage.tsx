import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit } from 'lucide-react';
import Card, { CardBody, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import { toast } from 'react-toastify';

interface ClienteData {
    nome: string;
    cpf: string;
    idade: number;
    telefone: string;
    email: string;
}

interface FuncionarioData {
    nome: string;
    cpf: string;
    idade: number;
    telefone: string;
    email: string;
    cargo: string;
    turno: number;
    status: boolean;
}

const PerfilPage: React.FC = () => {
    const navigate = useNavigate();
    const { userId, userType } = useAuth();
    const [loading, setLoading] = useState(true);
    const [cliente, setCliente] = useState<ClienteData | null>(null);
    const [funcionario, setFuncionario] = useState<FuncionarioData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (userType === 'FUNCIONARIO') {
                    const response = await api.get<FuncionarioData>(`/funcionario/${userId}`);
                    setFuncionario(response.data);
                } else {
                    const response = await api.get<ClienteData>(`/clientes/${userId}`);
                    setCliente(response.data);
                }
            } catch (error) {
                console.error('Erro ao buscar dados do perfil:', error);
                toast.error('Não foi possível carregar seus dados. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchData();
        }
    }, [userId, userType]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (userType === 'FUNCIONARIO' && !funcionario) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Perfil não encontrado</h1>
                    <p className="text-gray-600 mb-6">Não foi possível carregar suas informações.</p>
                    <Button variant="primary" onClick={() => navigate('/login')}>
                        Voltar para o Login
                    </Button>
                </div>
            </div>
        );
    }

    if (userType === 'FUNCIONARIO' && funcionario) {
        const turnoLabel = funcionario.turno === 1 ? 'Manhã' : funcionario.turno === 2 ? 'Tarde' : funcionario.turno === 3 ? 'Noite' : 'Desconhecido';
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <Card>
                                <CardBody className="flex flex-col items-center py-8">
                                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                        <User className="h-12 w-12 text-gray-400" />
                                    </div>

                                    <h2 className="text-xl font-bold text-gray-800 mb-1">{funcionario.nome}</h2>
                                    <p className="text-gray-600 mb-4">{funcionario.email}</p>
                                </CardBody>
                            </Card>
                        </div>

                        <div className="md:col-span-2">
                            <Card>
                                <CardBody>
                                    <h3 className="text-lg font-semibold mb-6">Informações do Funcionário</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nome Completo
                                            </label>
                                            <p className="text-gray-900">{funcionario.nome}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                CPF
                                            </label>
                                            <p className="text-gray-900">{funcionario.cpf}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Idade
                                            </label>
                                            <p className="text-gray-900">{funcionario.idade} anos</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Telefone
                                            </label>
                                            <p className="text-gray-900">{funcionario.telefone}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <p className="text-gray-900">{funcionario.email}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cargo
                                            </label>
                                            <p className="text-gray-900">{funcionario.cargo}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Turno
                                            </label>
                                            <p className="text-gray-900">{turnoLabel}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Status
                                            </label>
                                            <p className="text-gray-900">{funcionario.status ? 'Ativo' : 'Inativo'}</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Exibição padrão do cliente
    if (!cliente) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Perfil não encontrado</h1>
                    <p className="text-gray-600 mb-6">Não foi possível carregar suas informações.</p>
                    <Button variant="primary" onClick={() => navigate('/login')}>
                        Voltar para o Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <Card>
                            <CardBody className="flex flex-col items-center py-8">
                                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                    <User className="h-12 w-12 text-gray-400" />
                                </div>

                                <h2 className="text-xl font-bold text-gray-800 mb-1">{cliente.nome}</h2>
                                <p className="text-gray-600 mb-4">{cliente.email}</p>

                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/perfil/editar')}
                                    icon={<Edit size={18} />}
                                >
                                    Editar Perfil
                                </Button>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="md:col-span-2">
                        <Card>
                            <CardBody>
                                <h3 className="text-lg font-semibold mb-6">Informações Pessoais</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nome Completo
                                        </label>
                                        <p className="text-gray-900">{cliente.nome}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            CPF
                                        </label>
                                        <p className="text-gray-900">{cliente.cpf}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Idade
                                        </label>
                                        <p className="text-gray-900">{cliente.idade} anos</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Telefone
                                        </label>
                                        <p className="text-gray-900">{cliente.telefone}</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <p className="text-gray-900">{cliente.email}</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfilPage; 