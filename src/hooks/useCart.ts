import { useState, useEffect } from 'react';
import { CartItem, Pizza, Drink } from '../types';
import { toast } from 'react-toastify';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Erro ao carregar carrinho do localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    setLoading(false);
  }, []);

  // Update localStorage and calculate total whenever cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    setCartTotal(total);
  }, [cartItems]);

  const addPizzaToCart = (pizza: Pizza, quantity: number = 1) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        item => item.id === pizza.id && item.type === 'PIZZA'
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        toast.success(`Quantidade de ${pizza.sabor} atualizada no carrinho`);
        return newItems;
      } else {
        // Add new item
        toast.success(`${pizza.sabor} adicionada ao carrinho`);
        return [...prevItems, {
          id: pizza.id,
          name: pizza.sabor,
          price: pizza.preco,
          quantity,
          type: 'PIZZA',
          imageUrl: pizza.imageUrl
        }];
      }
    });
  };

  const addDrinkToCart = (drink: Drink, quantity: number = 1) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        item => item.id === drink.id && item.type === 'DRINK'
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        toast.success(`Quantidade de ${drink.nome} atualizada no carrinho`);
        return newItems;
      } else {
        // Add new item
        toast.success(`${drink.nome} adicionada ao carrinho`);
        return [...prevItems, {
          id: drink.id,
          name: drink.nome,
          price: drink.preco,
          quantity,
          type: 'DRINK',
          imageUrl: drink.imageUrl
        }];
      }
    });
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromCart(itemId);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const removeItemFromCart = (itemId: string) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.id === itemId);
      if (item) {
        toast.info(`${item.name} removido do carrinho`);
      }
      return prevItems.filter(item => item.id !== itemId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    toast.info('Carrinho limpo');
  };

  return {
    cartItems,
    cartTotal,
    addPizzaToCart,
    addDrinkToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart,
    loading
  };
};

export default useCart;