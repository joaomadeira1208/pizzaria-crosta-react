import React from 'react';
import { Home } from 'lucide-react';
import Input from '../common/Input';
import { Address } from '../../types';

interface AddressFormProps {
  address: Address;
  setAddress: React.Dispatch<React.SetStateAction<Address>>;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, setAddress }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Home className="h-6 w-6 text-red-600 mr-2" />
        <h2 className="text-xl font-semibold">Delivery Address</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Street"
          name="street"
          value={address.street}
          onChange={handleChange}
          placeholder="Enter street name"
          required
        />
        
        <Input
          label="Number"
          name="number"
          value={address.number}
          onChange={handleChange}
          placeholder="Enter building number"
          required
        />
        
        <Input
          label="Complement"
          name="complement"
          value={address.complement}
          onChange={handleChange}
          placeholder="Apt, Suite, etc. (optional)"
        />
        
        <Input
          label="District/Neighborhood"
          name="district"
          value={address.district}
          onChange={handleChange}
          placeholder="Enter district or neighborhood"
          required
        />
        
        <Input
          label="City"
          name="city"
          value={address.city}
          onChange={handleChange}
          placeholder="Enter city"
          required
        />
        
        <Input
          label="State"
          name="state"
          value={address.state}
          onChange={handleChange}
          placeholder="Enter state"
          required
        />
        
        <Input
          label="ZIP Code"
          name="zipCode"
          value={address.zipCode}
          onChange={handleChange}
          placeholder="Enter ZIP code"
          required
        />
      </div>
    </div>
  );
};

export default AddressForm;