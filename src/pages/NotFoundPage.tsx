import React from 'react';
import { Link } from 'react-router-dom';
import { Pizza, Home } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-6 animate-bounce">
          <Pizza className="h-12 w-12 text-red-600" />
        </div>
        
        <h1 className="text-9xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          Oops! The page you're looking for seems to have gone missing. 
          Perhaps it went out for a pizza delivery?
        </p>
        
        <Link to="/">
          <Button 
            variant="primary" 
            icon={<Home size={18} />}
          >
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;