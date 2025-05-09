import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200 last:border-0 group">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={item.imageUrl || (item.type === 'PIZZA'
            ? 'https://images.pexels.com/photos/2471171/pexels-photo-2471171.jpeg?auto=compress&cs=tinysrgb&w=100'
            : 'https://images.pexels.com/photos/2531189/pexels-photo-2531189.jpeg?auto=compress&cs=tinysrgb&w=100')}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <h3 className="text-base font-medium text-gray-800">{item.name}</h3>
          <p className="ml-4 text-base font-medium text-gray-900">
            R$ {(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        <p className="mt-1 text-sm text-gray-500 capitalize">{item.type.toLowerCase()}</p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center border border-gray-200 rounded-md">
            <button
              className="px-2 py-1 text-gray-600 hover:text-gray-900"
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
            >
              <Minus size={16} className={item.quantity <= 1 ? 'text-gray-300' : ''} />
            </button>

            <span className="px-2 py-1 text-gray-800">{item.quantity}</span>

            <button
              className="px-2 py-1 text-gray-600 hover:text-gray-900"
              onClick={handleIncrease}
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            className="text-gray-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
            onClick={() => onRemoveItem(item.id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;