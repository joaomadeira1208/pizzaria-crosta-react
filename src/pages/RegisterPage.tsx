import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Pizza } from 'lucide-react';
import Card, { CardBody, CardFooter } from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    age: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF is required';
    } else if (!/^\d{11}$/.test(formData.cpf.replace(/\D/g, ''))) {
      newErrors.cpf = 'CPF must be 11 digits';
    }
    
    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age) < 18) {
      newErrors.age = 'You must be at least 18 years old';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      await register({
        name: formData.name,
        cpf: formData.cpf.replace(/\D/g, ''),
        age: parseInt(formData.age),
        phone: formData.phone,
        email: formData.email,
        password: formData.password
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-yellow-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-red-600 rounded-full mb-4">
            <Pizza className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join Pizzaria Crosta for delicious pizzas and more!</p>
        </div>
        
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  autoFocus
                />
                
                <Input
                  label="CPF"
                  name="cpf"
                  placeholder="123.456.789-00"
                  value={formData.cpf}
                  onChange={handleChange}
                  error={errors.cpf}
                  required
                />
                
                <Input
                  label="Age"
                  name="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={handleChange}
                  error={errors.age}
                  required
                />
                
                <Input
                  label="Phone"
                  name="phone"
                  placeholder="(11) 98765-4321"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                />
                
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  className="md:col-span-2"
                />
                
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                />
                
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                />
              </div>
              
              <div className="mt-6">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={loading}
                  icon={<UserPlus size={18} />}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </CardBody>
          
          <CardFooter className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;