import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Drink } from '../../types';
import Card, { CardBody, CardFooter } from '../common/Card';
import Button from '../common/Button';
import useAuth from '../../hooks/useAuth';

interface DrinkCardProps {
  drink: Drink;
  onAddToCart: (drink: Drink, quantity: number) => void;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink, onAddToCart }) => {
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
    onAddToCart(drink, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <Card className="h-full flex flex-col transform hover:scale-105 transition-transform duration-300">
      <div className="relative h-36 overflow-hidden">
        <img
          src={drink.imageUrl || 'https://images.pexels.com/photos/2531189/pexels-photo-2531189.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
          alt={drink.nome}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg">
          R$ {drink.preco.toFixed(2)}
        </div>
      </div>

      <CardBody className="flex-grow">
        <h3 className="text-lg font-semibold mb-2">{drink.nome}</h3>
        <p className="text-gray-600 text-sm">{drink.description}</p>
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
              variant="secondary"
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

export default DrinkCard;