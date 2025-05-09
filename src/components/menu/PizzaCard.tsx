import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Pizza } from '../../types';
import Card, { CardBody, CardFooter } from '../common/Card';
import Button from '../common/Button';
import useAuth from '../../hooks/useAuth';

interface PizzaCardProps {
  pizza: Pizza;
  onAddToCart: (pizza: Pizza, quantity: number) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onAddToCart }) => {
  console.log('🍕 Pizza recebida:', pizza);
  const [quantity, setQuantity] = useState(1);
  const { userType } = useAuth();

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(pizza, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <Card className="h-full flex flex-col transform hover:scale-105 transition-transform duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={pizza.imageUrl || 'https://images.pexels.com/photos/2471171/pexels-photo-2471171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
          alt={pizza.sabor}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-lg">
          R$ {pizza.preco.toFixed(2)}
        </div>
      </div>

      <CardBody className="flex-grow">
        <h3 className="text-xl font-semibold mb-2">{pizza.sabor}</h3>
        <p className="text-gray-600 mb-3">{pizza.description}</p>

        <div className="mb-2">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Ingredientes:</h4>
          <p className="text-sm text-gray-600">
            {pizza.ingredientes.join(', ')}
          </p>
        </div>
      </CardBody>

      <CardFooter className="bg-gray-50">
        {userType !== 'FUNCIONARIO' && (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Quantidade:</span>
              <div className="flex items-center">
                <button
                  onClick={decreaseQuantity}
                  className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} className={quantity <= 1 ? 'text-gray-400' : 'text-gray-700'} />
                </button>

                <span className="mx-3 font-medium">{quantity}</span>

                <button
                  onClick={increaseQuantity}
                  className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                >
                  <Plus size={16} className="text-gray-700" />
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              variant="primary"
              fullWidth
              icon={<Plus size={18} />}
            >
              Adicionar ao Carrinho
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default PizzaCard;