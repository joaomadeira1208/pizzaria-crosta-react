import React, { useState, useEffect } from 'react';
import { Pizza as PizzaIcon, Coffee } from 'lucide-react';
import { Pizza, Drink } from '../types';
import menuService from '../services/menuService';
import useCart from '../hooks/useCart';
import useAuth from '../hooks/useAuth';
import PizzaCard from '../components/menu/PizzaCard';
import DrinkCard from '../components/menu/DrinkCard';
import { toast } from 'react-toastify';

const MenuPage: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pizza' | 'drinks'>('pizza');
  const { addPizzaToCart, addDrinkToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const fetchMenuItems = async () => {
    try {
      // Check if we're online before making the request
      if (!navigator.onLine) {
        throw new Error('You are offline. Please check your internet connection.');
      }

      setLoading(true);
      const [pizzaData, drinkData] = await Promise.all([
        menuService.getPizzas(),
        menuService.getAvailableDrinks()
      ]);

      setPizzas(pizzaData);
      setDrinks(drinkData);
    } catch (error: any) {
      console.error('Error fetching menu items:', error);

      // Provide more specific error messages based on the error type
      if (!navigator.onLine) {
        toast.error('You are offline. Please check your internet connection.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please try again.');
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(`Server error: ${error.response.status}. Please try again later.`);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('Could not connect to the server. Please try again later.');
      } else {
        toast.error('Failed to load menu. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [isAuthenticated]); // Recarrega os dados quando o estado de autenticação mudar

  // For demo purposes, if API fails to return data
  useEffect(() => {
    if (!loading && pizzas.length === 0 && drinks.length === 0) {
      // Populate with mock data if needed
      setPizzas([
        {
          id: '1',
          sabor: 'Margherita',
          description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
          ingredientes: ['Tomato Sauce', 'Mozzarella', 'Fresh Basil', 'Olive Oil'],
          preco: 14.99,
          imageUrl: 'https://images.pexels.com/photos/2471171/pexels-photo-2471171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          id: '2',
          sabor: 'Pepperoni',
          description: 'American classic with tomato sauce, mozzarella, and pepperoni',
          ingredientes: ['Tomato Sauce', 'Mozzarella', 'Pepperoni'],
          preco: 16.99,
          imageUrl: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          id: '3',
          sabor: 'Vegetarian',
          description: 'Loaded with fresh vegetables and mozzarella',
          ingredientes: ['Tomato Sauce', 'Mozzarella', 'Bell Peppers', 'Mushrooms', 'Red Onions', 'Black Olives'],
          preco: 15.99,
          imageUrl: 'https://images.pexels.com/photos/5903317/pexels-photo-5903317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          id: '4',
          sabor: 'Quattro Formaggi',
          description: 'Four cheese pizza: mozzarella, gorgonzola, fontina, and parmesan',
          ingredientes: ['Tomato Sauce', 'Mozzarella', 'Gorgonzola', 'Fontina', 'Parmesan'],
          preco: 17.99,
          imageUrl: 'https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ]);

      setDrinks([
        {
          id: '101',
          nome: 'Cola',
          description: 'Refreshing cola drink, 500ml',
          preco: 3.99,
          available: true,
          imageUrl: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          id: '102',
          nome: 'Sparkling Water',
          description: 'Refreshing sparkling water, 500ml',
          preco: 2.99,
          available: true,
          imageUrl: 'https://images.pexels.com/photos/2995333/pexels-photo-2995333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          id: '103',
          nome: 'Orange Juice',
          description: 'Freshly squeezed orange juice, 400ml',
          preco: 4.99,
          available: true,
          imageUrl: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          id: '104',
          nome: 'Beer',
          description: 'Craft beer, 330ml',
          preco: 5.99,
          available: true,
          imageUrl: 'https://images.pexels.com/photos/5490965/pexels-photo-5490965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        }
      ]);
    }
  }, [loading, pizzas.length, drinks.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cardápio</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra nossas autênticas pizzas italianas e bebidas refrescantes
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setActiveTab('pizza')}
              className={`flex items-center rounded-md px-4 py-2 text-sm font-medium ${activeTab === 'pizza'
                ? 'bg-red-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <PizzaIcon className="mr-2 h-5 w-5" />
              Pizzas
            </button>

            <button
              onClick={() => setActiveTab('drinks')}
              className={`ml-1 flex items-center rounded-md px-4 py-2 text-sm font-medium ${activeTab === 'drinks'
                ? 'bg-red-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Coffee className="mr-2 h-5 w-5" />
              Bebidas
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${activeTab === 'pizza' ? 'block' : 'hidden'}`}>
            {pizzas.map(pizza => (
              <PizzaCard
                key={pizza.id}
                pizza={pizza}
                onAddToCart={addPizzaToCart}
              />
            ))}
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${activeTab === 'drinks' ? 'block' : 'hidden'}`}>
          {drinks.map(drink => (
            <DrinkCard
              key={drink.id}
              drink={drink}
              onAddToCart={addDrinkToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;