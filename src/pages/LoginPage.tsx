import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pizza, LogIn } from 'lucide-react';
import Card, { CardBody, CardFooter } from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; senha?: string } = {};

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Formato de email inválido';
    }

    if (!senha) {
      newErrors.senha = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      await login({ email, senha });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-red-600 rounded-full mb-4 animate-bounce">
            <Pizza className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo de volta!</h1>
          <p className="text-gray-600">Entre na sua conta da Pizzaria Crosta</p>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                autoFocus
                required
              />

              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                error={errors.senha}
                required
              />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Lembrar-me
                  </label>
                </div>

                <a href="#" className="text-sm font-medium text-red-600 hover:text-red-500">
                  Esqueceu a senha?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                icon={<LogIn size={18} />}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardBody>

          <CardFooter className="text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-medium text-red-600 hover:text-red-500">
                Cadastre-se
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;