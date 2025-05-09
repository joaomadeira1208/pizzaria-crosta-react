import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import customerService from '../services/customerService';
import Card, { CardBody, CardFooter } from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Customer } from '../types';
import { toast } from 'react-toastify';

const EditAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [customer, setCustomer] = useState<Customer>({
    id: '',
    name: '',
    cpf: '',
    age: 0,
    phone: '',
    email: '',
    active: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!isAuthenticated || !userId) {
        navigate('/login');
        return;
      }
      
      try {
        setLoading(true);
        const customerData = await customerService.getCustomerById(userId);
        setCustomer(customerData);
      } catch (error) {
        console.error('Error fetching customer data:', error);
        toast.error('Failed to load your account information. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomer();
  }, [userId, isAuthenticated, navigate]);
  
  // For demo purposes, if API fails to return data
  useEffect(() => {
    if (loading && !customer.id && userId) {
      // Populate with mock data if needed
      setCustomer({
        id: userId,
        name: 'John Doe',
        cpf: '12345678900',
        age: 30,
        phone: '(555) 123-4567',
        email: 'john.doe@example.com',
        active: true
      });
      setLoading(false);
    }
  }, [loading, customer.id, userId]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customer.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!customer.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    if (!customer.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (customer.age < 18) {
      newErrors.age = 'Age must be at least 18';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      setSaving(true);
      
      // Exclude id and cpf from update
      const { id, cpf, ...updateData } = customer;
      
      await customerService.updateCustomer(id, updateData);
      toast.success('Account updated successfully!');
      navigate('/account');
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Link 
            to="/account" 
            className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to Account</span>
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Account</h1>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardBody>
              <div className="mb-6 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={customer.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
                
                <Input
                  label="CPF"
                  name="cpf"
                  value={customer.cpf}
                  disabled
                  className="bg-gray-100"
                />
                
                <Input
                  label="Age"
                  name="age"
                  type="number"
                  value={customer.age.toString()}
                  onChange={handleChange}
                  error={errors.age}
                  required
                />
                
                <Input
                  label="Phone"
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                />
                
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={customer.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                  className="md:col-span-2"
                />
              </div>
            </CardBody>
            
            <CardFooter className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                icon={<Save size={18} />}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EditAccountPage;