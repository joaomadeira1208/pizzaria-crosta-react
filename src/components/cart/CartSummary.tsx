import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../../types';
import Button from '../common/Button';
import { toast } from 'react-toastify';

interface CartSummaryProps {
  cartItems: CartItem[];
  cartTotal: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cartItems, cartTotal }) => {
  const navigate = useNavigate();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate subtotal, delivery fee, and taxes
  const subtotal = cartTotal;
  const deliveryFee = 4.99;
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const orderTotal = subtotal + deliveryFee + taxAmount;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Adicione itens ao carrinho antes de finalizar o pedido');
      return;
    }

    navigate('/checkout', { replace: true });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 pb-4 border-b border-gray-200">Resumo do Pedido</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Itens ({itemCount})</span>
          <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Taxa de Entrega</span>
          <span className="font-medium">R$ {deliveryFee.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Imposto</span>
          <span className="font-medium">R$ {taxAmount.toFixed(2)}</span>
        </div>

        <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-xl text-red-700">R$ {orderTotal.toFixed(2)}</span>
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        icon={<ShoppingBag size={18} />}
        onClick={handleCheckout}
        disabled={cartItems.length === 0}
      >
        Finalizar Pedido
      </Button>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Ao finalizar o pedido, você concorda com nossos termos e condições.
      </p>
    </div>
  );
};

export default CartSummary;