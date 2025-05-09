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

    // Hooks do formulário de cadastro de funcionário SEMPRE no topo
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        idade: '',
        telefone: '',
        email: '',
        senha: '',
        cargo: 'ATENDENTE',
        turno: '1'
    });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const cargos = ['GERENTE', 'ATENDENTE', 'COZINHEIRO', 'ENTREGADOR'];
    const turnos = [
        { label: 'Manhã', value: '1' },
        { label: 'Tarde', value: '2' },
        { label: 'Noite', value: '3' }
    ];

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

        const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleFormSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setFormError('');
            setFormSuccess('');
            // Validação simples
            if (!formData.nome || !formData.cpf || !formData.idade || !formData.telefone || !formData.email || !formData.senha) {
                setFormError('Preencha todos os campos.');
                return;
            }
            try {
                const body = {
                    nome: formData.nome,
                    cpf: formData.cpf.replace(/\D/g, ''),
                    idade: parseInt(formData.idade),
                    telefone: formData.telefone,
                    email: formData.email,
                    senha: formData.senha,
                    cargo: formData.cargo,
                    turno: parseInt(formData.turno),
                    idFuncionarioExecutando: userId
                };
                const response = await api.post('/funcionario', body);
                if (response.status === 201 || response.status === 200) {
                    setFormSuccess('Funcionário cadastrado com sucesso!');
                    setFormData({ nome: '', cpf: '', idade: '', telefone: '', email: '', senha: '', cargo: 'ATENDENTE', turno: '1' });
                } else {
                    setFormError('Erro ao cadastrar funcionário.');
                }
            } catch (error) {
                setFormError('Erro ao cadastrar funcionário.');
            }
        };

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

                    {/* Cadastro de novo funcionário para GERENTE */}
                    {funcionario.cargo === 'GERENTE' && (
                        <div className="mt-10 bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Cadastrar Novo Funcionário</h3>
                            <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                                {showForm ? 'Fechar Formulário' : 'Cadastrar Novo Funcionário'}
                            </Button>
                            {showForm && (
                                <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleFormSubmit}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                        <input type="text" name="nome" value={formData.nome} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                                        <input type="text" name="cpf" value={formData.cpf} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                                        <input type="number" name="idade" value={formData.idade} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                        <input type="text" name="telefone" value={formData.telefone} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                                        <input type="password" name="senha" value={formData.senha} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                                        <select name="cargo" value={formData.cargo} onChange={handleFormChange} className="w-full border rounded px-3 py-2">
                                            {cargos.map(cargo => (
                                                <option key={cargo} value={cargo}>{cargo}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                                        <select name="turno" value={formData.turno} onChange={handleFormChange} className="w-full border rounded px-3 py-2">
                                            {turnos.map(turno => (
                                                <option key={turno.value} value={turno.value}>{turno.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {formError && <div className="col-span-2 text-red-600 text-sm mt-2">{formError}</div>}
                                    {formSuccess && <div className="col-span-2 text-green-600 text-sm mt-2">{formSuccess}</div>}
                                    <div className="col-span-2 flex justify-end">
                                        <Button type="submit" variant="primary">Cadastrar</Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
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