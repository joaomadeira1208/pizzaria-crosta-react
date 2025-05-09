import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Edit, ToggleLeft, ToggleRight, Package } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import customerService from '../services/customerService';
import Card, { CardBody, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import { Customer } from '../types';
import { toast } from 'react-toastify';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [toggling, setToggling] = useState<boolean>(false);
  
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
    if (loading && !customer && userId) {
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
  }, [loading, customer, userId]);
  
  const handleToggleStatus = async () => {
    if (!customer) return;
    
    try {
      setToggling(true);
      await customerService.toggleCustomerStatus(customer.id);
      
      setCustomer(prev => {
        if (!prev) return null;
        return { ...prev, active: !prev.active };
      });
      
      toast.success(`Account ${customer.active ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      console.error('Error toggling account status:', error);
      toast.error('Failed to update account status. Please try again.');
    } finally {
      setToggling(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't load your account information.</p>
          <Button variant="primary" onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardBody className="flex flex-col items-center py-8">
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-1">{customer.name}</h2>
                <p className="text-gray-600 mb-2">{customer.email}</p>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  customer.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {customer.active ? 'Active' : 'Inactive'}
                </div>
                
                <div className="mt-2 flex flex-col w-full gap-2">
                  <Button 
                    variant="outline"
                    fullWidth
                    icon={<Edit size={16} />}
                    onClick={() => navigate('/account/edit')}
                  >
                    Edit Profile
                  </Button>
                  
                  <Button
                    variant={customer.active ? 'danger' : 'primary'}
                    fullWidth
                    icon={customer.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    onClick={handleToggleStatus}
                    disabled={toggling}
                  >
                    {toggling 
                      ? 'Processing...' 
                      : customer.active 
                        ? 'Deactivate Account' 
                        : 'Activate Account'
                    }
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardBody>
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
                  Account Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium">{customer.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">CPF</p>
                    <p className="font-medium">
                      {customer.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Age</p>
                    <p className="font-medium">{customer.age}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link to="/orders">
                      <Button 
                        variant="secondary" 
                        fullWidth
                        icon={<Package size={18} />}
                      >
                        My Orders
                      </Button>
                    </Link>
                    
                    <Button 
                      variant="outline" 
                      fullWidth
                      onClick={logout}
                    >
                      Logout
                    </Button>
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

export default AccountPage;