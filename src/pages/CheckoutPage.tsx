import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import AddressForm from '../components/checkout/AddressForm';
import CartItem from '../components/cart/CartItem';
import orderService from '../services/orderService';
import { Address, CreateOrderRequest } from '../types';
import { toast } from 'react-toastify';
import CheckoutForm from '../components/payment/CheckoutForm';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, updateItemQuantity, removeItemFromCart, clearCart, loading } = useCart();
  const { userId, isAuthenticated } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [address, setAddress] = useState<Address>({
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    zipCode: ''
  });

  // Calculate order totals
  const subtotal = cartTotal;
  const deliveryFee = 4.99;
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const orderTotal = subtotal + deliveryFee + taxAmount;

  // Redirect to cart if cart is empty (mas só depois do loading)
  React.useEffect(() => {
    if (!loading && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, loading, navigate]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Por favor, faça login para continuar com o checkout');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const validateFields = () => {
    const requiredFields = ['street', 'number', 'district', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!address[field as keyof Address]) {
        toast.error(`${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      if (!userId) {
        toast.error('Usuário não autenticado');
        return;
      }

      console.log('userId:', userId);
      console.log('cartItems:', cartItems);

      const orderData = {
        clienteId: parseInt(userId),
        endereco: `${address.street}, ${address.number}${address.complement ? `, ${address.complement}` : ''}, ${address.district}, ${address.city} - ${address.state}, ${address.zipCode}`,
        valorTotal: orderTotal,
        pizzas: cartItems
          .filter(item => item.type === 'PIZZA')
          .map(item => ({
            pizzaId: parseInt(item.id),
            quantidade: item.quantity,
            tamanho: 'MEDIA'
          })),
        bebidas: cartItems
          .filter(item => item.type === 'DRINK')
          .map(item => ({
            bebidaId: parseInt(item.id),
            quantidade: item.quantity
          }))
      };

      console.log('orderData:', orderData);

      // Primeiro criamos o pedido
      const order = await orderService.createOrder(orderData);
      console.log('Pedido criado:', order);

      // Se o pedido foi criado com sucesso, mostramos o formulário de pagamento
      setShowPayment(true);
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      toast.error('Erro ao criar pedido. Por favor, tente novamente.');
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      clearCart();
      navigate('/pedidos');
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      toast.error('Erro ao finalizar pedido. Por favor, tente novamente.');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Carregando...</div>;
  }

  if (cartItems.length === 0) {
    return null; // Will redirect to cart
  }

  console.log('showPayment:', showPayment);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/cart"
            className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Voltar para o Carrinho</span>
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Address Form */}
            <AddressForm address={address} setAddress={setAddress} />
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  Resumo do Pedido
                </h2>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateItemQuantity}
                    onRemoveItem={removeItemFromCart}
                  />
                ))}
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
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

              <div className="p-4 bg-gray-50">
                {!showPayment ? (
                  <Button
                    variant="primary"
                    fullWidth
                    icon={<CheckCircle size={18} />}
                    onClick={handlePlaceOrder}
                    disabled={processing}
                  >
                    {processing ? 'Processando...' : 'Finalizar Pedido'}
                  </Button>
                ) : (
                  <CheckoutForm
                    amount={orderTotal}
                    onSuccess={handlePaymentSuccess}
                  />
                )}

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Ao finalizar o pedido, você concorda com nossos termos e condições.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;