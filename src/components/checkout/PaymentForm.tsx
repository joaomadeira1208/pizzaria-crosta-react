import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import Input from '../common/Input';

// This is a mock payment form since actual Stripe integration would be handled by the backend
const PaymentForm: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCardNumber(e.target.value);
    setCardNumber(value);
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 4) {
      let formatted = value;
      if (value.length > 2) {
        formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
      }
      setExpiryDate(formatted);
    }
  };
  
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <CreditCard className="h-6 w-6 text-red-600 mr-2" />
        <h2 className="text-xl font-semibold">Payment Details</h2>
      </div>
      
      <div className="space-y-4">
        <Input
          label="Card Number"
          value={cardNumber}
          onChange={handleCardNumberChange}
          placeholder="0000 0000 0000 0000"
          maxLength={19}
          required
        />
        
        <Input
          label="Cardholder Name"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="John Doe"
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expiry Date (MM/YY)"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            placeholder="MM/YY"
            maxLength={5}
            required
          />
          
          <Input
            label="CVV"
            value={cvv}
            onChange={handleCvvChange}
            placeholder="123"
            maxLength={3}
            type="password"
            required
          />
        </div>
        
        <div className="text-sm text-gray-500 mt-2">
          <p>This is a mock payment form. In production, this would be replaced with Stripe Elements.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;