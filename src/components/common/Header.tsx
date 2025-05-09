import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pizza, ShoppingCart, User, LogOut, ChevronDown } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { isAuthenticated, userType, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/perfil');
    } else {
      navigate('/login');
    }
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-red-700 to-red-900 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <Pizza className="h-8 w-8 text-yellow-400 group-hover:rotate-12 transition-transform duration-300" />
            <h1 className="text-2xl font-bold">Pizzaria Crosta</h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/menu"
              className="hover:text-yellow-300 transition-colors duration-200"
            >
              Cardápio
            </Link>

            {isAuthenticated && (
              <>
                {userType !== 'FUNCIONARIO' && (
                  <Link
                    to="/pedidos"
                    className="hover:text-yellow-300 transition-colors duration-200"
                  >
                    Meus Pedidos
                  </Link>
                )}

                {userType === 'FUNCIONARIO' ? (
                  <Link
                    to="/dashboard"
                    className="hover:text-yellow-300 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/perfil"
                    className="hover:text-yellow-300 transition-colors duration-200"
                  >
                    Meu Perfil
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {userType !== 'FUNCIONARIO' && (
                  <Link
                    to="/cart"
                    className="p-2 rounded-full hover:bg-red-800 transition-colors duration-200"
                    title="Carrinho"
                  >
                    <ShoppingCart className="h-6 w-6" />
                  </Link>
                )}

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-full hover:bg-red-800 transition-colors duration-200"
                    title="Perfil"
                  >
                    <User className="h-6 w-6" />
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <button
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Perfil
                      </button>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 py-2 px-4 bg-red-800 hover:bg-red-900 rounded-full transition-colors duration-200"
              >
                <User className="h-5 w-5" />
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;