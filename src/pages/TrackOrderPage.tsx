import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, ChefHat, Package, Truck, Home } from 'lucide-react';
import orderService from '../services/orderService';
import Button from '../components/common/Button';

const OrderStatus = {
  PENDING: {
    icon: <Clock className="h-8 w-8 text-yellow-500" />,
    color: 'border-yellow-500 bg-yellow-50',
    activeColor: 'border-yellow-500 bg-yellow-500 text-white',
    title: 'Order Received',
    description: 'We\'ve received your order and are processing it.'
  },
  IN_PREPARATION: {
    icon: <ChefHat className="h-8 w-8 text-blue-500" />,
    color: 'border-blue-500 bg-blue-50',
    activeColor: 'border-blue-500 bg-blue-500 text-white',
    title: 'In Preparation',
    description: 'Our chefs are preparing your delicious order.'
  },
  READY: {
    icon: <Package className="h-8 w-8 text-purple-500" />,
    color: 'border-purple-500 bg-purple-50',
    activeColor: 'border-purple-500 bg-purple-500 text-white',
    title: 'Ready',
    description: 'Your order is ready and waiting for pickup/delivery.'
  },
  OUT_FOR_DELIVERY: {
    icon: <Truck className="h-8 w-8 text-orange-500" />,
    color: 'border-orange-500 bg-orange-50',
    activeColor: 'border-orange-500 bg-orange-500 text-white',
    title: 'Out for Delivery',
    description: 'Your order is on its way to you!'
  },
  DELIVERED: {
    icon: <Home className="h-8 w-8 text-green-500" />,
    color: 'border-green-500 bg-green-50',
    activeColor: 'border-green-500 bg-green-500 text-white',
    title: 'Delivered',
    description: 'Your order has been delivered. Enjoy!'
  },
  CANCELLED: {
    icon: <CheckCircle className="h-8 w-8 text-red-500" />,
    color: 'border-red-500 bg-red-50',
    activeColor: 'border-red-500 bg-red-500 text-white',
    title: 'Cancelled',
    description: 'Your order has been cancelled.'
  }
};

// Ordered statuses for the timeline
const statusOrder = ['PENDING', 'IN_PREPARATION', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const TrackOrderPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [status, setStatus] = useState<string>('PENDING');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        if (!orderId) return;
        
        setLoading(true);
        const orderStatus = await orderService.getOrderStatus(orderId);
        setStatus(orderStatus);
        setError(null);
      } catch (err) {
        console.error('Error fetching order status:', err);
        setError('Failed to load order status. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderStatus();
    
    // Polling for status updates every 30 seconds
    const intervalId = setInterval(fetchOrderStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, [orderId]);
  
  // For demo purposes, if API fails to return data
  useEffect(() => {
    if (loading) return;
    
    if (error) {
      setStatus('PENDING'); // Default to PENDING for demo
      setError(null);
    }
  }, [loading, error]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link to="/orders">
            <Button variant="primary">View My Orders</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // If order is cancelled, show a different UI
  if (status === 'CANCELLED') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Link 
              to="/orders" 
              className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Back to Orders</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Cancelled</h1>
            <p className="text-gray-600 mb-6">
              Your order #{orderId.slice(0, 8).toUpperCase()} has been cancelled.
            </p>
            <Link to="/menu">
              <Button variant="primary">Place a New Order</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const currentStatusIndex = statusOrder.indexOf(status);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link 
            to="/orders" 
            className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to Orders</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tracking Order #{orderId.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-gray-600">
              Current Status: <span className="font-medium">{OrderStatus[status as keyof typeof OrderStatus].title}</span>
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {statusOrder.map((statusKey, index) => {
                const isActive = index <= currentStatusIndex;
                const statusInfo = OrderStatus[statusKey as keyof typeof OrderStatus];
                
                return (
                  <div key={statusKey} className="relative z-10 flex flex-col items-center">
                    <div 
                      className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-3 transition-colors duration-300 ${
                        isActive ? statusInfo.activeColor : 'border-gray-300 bg-white'
                      }`}
                    >
                      {statusInfo.icon}
                    </div>
                    <h3 className="font-medium text-sm text-center mb-1">{statusInfo.title}</h3>
                    <p className="text-xs text-gray-500 text-center hidden md:block">
                      {statusInfo.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-10 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Estimated Delivery Time</h3>
            <p className="text-gray-700">
              {status === 'DELIVERED' 
                ? 'Your order has been delivered.' 
                : status === 'OUT_FOR_DELIVERY'
                  ? 'Your order is on its way and should arrive in 15-25 minutes.'
                  : 'Your order is being prepared and should be delivered within 45-60 minutes.'}
            </p>
            
            {status !== 'DELIVERED' && (
              <div className="mt-4 flex items-center">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-500">
                  {status === 'OUT_FOR_DELIVERY' ? 'Arriving soon' : 'Preparing your order'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;