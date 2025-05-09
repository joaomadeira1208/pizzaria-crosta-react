import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Pizza } from 'lucide-react';
import Card, { CardBody, CardFooter } from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    idade: '',
    telefone: '',
    email: '',
    senha: '',
    confirmSenha: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^[0-9]{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }
    if (!formData.idade.trim()) {
      newErrors.idade = 'Idade é obrigatória';
    } else if (parseInt(formData.idade) < 18) {
      newErrors.idade = 'Você deve ter pelo menos 18 anos';
    }
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 3) {
      newErrors.senha = 'Senha deve ter pelo menos 3 caracteres';
    }
    if (formData.senha !== formData.confirmSenha) {
      newErrors.confirmSenha = 'As senhas não coincidem';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      try {
        const body = {
          nome: formData.nome,
          cpf: formData.cpf.replace(/\D/g, ''),
          idade: parseInt(formData.idade),
          telefone: formData.telefone,
          email: formData.email,
          senha: formData.senha
        };
        const response = await fetch('http://localhost:8080/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!response.ok) {
          throw new Error('Erro ao criar conta');
        }
        // Login automático após cadastro
        await login({ email: formData.email, senha: formData.senha });
      } catch (error) {
        setErrors({ geral: 'Erro ao criar conta. Tente novamente.' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-yellow-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-red-600 rounded-full mb-4">
            <Pizza className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Criar Conta</h1>
          <p className="text-gray-600">Junte-se à Pizzaria Crosta para saborear as melhores pizzas!</p>
        </div>
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  name="nome"
                  placeholder="João da Silva"
                  value={formData.nome}
                  onChange={handleChange}
                  error={errors.nome}
                  required
                  autoFocus
                />
                <Input
                  label="CPF"
                  name="cpf"
                  placeholder="12345678900"
                  value={formData.cpf}
                  onChange={handleChange}
                  error={errors.cpf}
                  required
                />
                <Input
                  label="Idade"
                  name="idade"
                  type="number"
                  placeholder="25"
                  value={formData.idade}
                  onChange={handleChange}
                  error={errors.idade}
                  required
                />
                <Input
                  label="Telefone"
                  name="telefone"
                  placeholder="(11) 98765-4321"
                  value={formData.telefone}
                  onChange={handleChange}
                  error={errors.telefone}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  className="md:col-span-2"
                />
                <Input
                  label="Senha"
                  name="senha"
                  type="password"
                  placeholder="••••••••"
                  value={formData.senha}
                  onChange={handleChange}
                  error={errors.senha}
                  required
                />
                <Input
                  label="Confirmar Senha"
                  name="confirmSenha"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmSenha}
                  onChange={handleChange}
                  error={errors.confirmSenha}
                  required
                />
              </div>
              {errors.geral && (
                <div className="text-red-600 text-sm mt-2 text-center">{errors.geral}</div>
              )}
              <div className="mt-6">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                  icon={<UserPlus size={18} />}
                >
                  {loading ? 'Criando Conta...' : 'Criar Conta'}
                </Button>
              </div>
            </form>
          </CardBody>
          <CardFooter className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                Entrar
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;