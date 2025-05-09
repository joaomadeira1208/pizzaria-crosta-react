import React, { useEffect } from 'react';
import { ShoppingCart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import Button from '../components/common/Button';

const CartPage: React.FC = () => {
  const {
    cartItems,
    cartTotal,
    updateItemQuantity,
    removeItemFromCart,
    clearCart
  } = useCart();
  const { userType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userType === 'FUNCIONARIO') {
      navigate('/');
    }
  }, [userType, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Seu Carrinho</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Seu carrinho está vazio</h2>
            <p className="text-gray-600 mb-6">
              Parece que você ainda não adicionou nenhum item ao carrinho.
            </p>
            <Link to="/menu">
              <Button variant="primary" icon={<ShoppingBag size={18} />}>
                Ver Cardápio
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Carrinho ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} itens)
                    </h2>

                    <button
                      onClick={clearCart}
                      className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      Limpar carrinho
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map(item => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateItemQuantity}
                      onRemoveItem={removeItemFromCart}
                    />
                  ))}
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <Link
                    to="/menu"
                    className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    <span>Continuar comprando</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <CartSummary cartItems={cartItems} cartTotal={cartTotal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;