import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { LoginCredentials, RegisterCustomerData } from '../types';
import { toast } from 'react-toastify';

interface AuthContextType {
    isAuthenticated: boolean;
    userType: string | null;
    userId: string | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterCustomerData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userType, setUserType] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const updateAuthState = useCallback(() => {
        const userId = authService.getUserId();
        const userType = authService.getUserType();
        if (userId && userType) {
            setIsAuthenticated(true);
            setUserType(userType);
            setUserId(userId);
        } else {
            setIsAuthenticated(false);
            setUserType(null);
            setUserId(null);
        }
    }, []);

    useEffect(() => {
        updateAuthState();
        setLoading(false);
    }, [updateAuthState]);

    const login = async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            const response = await authService.login(credentials);
            if (response.sucesso) {
                setIsAuthenticated(true);
                setUserType(response.tipoUsuario);
                setUserId(response.id);
                toast.success('Login realizado com sucesso!');
                if (response.tipoUsuario === 'CLIENTE') {
                    navigate('/menu');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setIsAuthenticated(false);
                setUserType(null);
                setUserId(null);
                toast.error('Falha no login. Verifique suas credenciais.');
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUserType(null);
            setUserId(null);
            toast.error('Falha no login. Por favor, tente novamente.');
            console.error('Erro no login:', error);
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterCustomerData) => {
        try {
            setLoading(true);
            await authService.registerCustomer(data);
            toast.success('Cadastro realizado com sucesso! Por favor, faça login.');
            navigate('/login');
        } catch (error) {
            toast.error('Falha no cadastro. Por favor, tente novamente.');
            console.error('Erro no cadastro:', error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUserType(null);
        setUserId(null);
        navigate('/login');
        toast.info('Você foi desconectado.');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            userType,
            userId,
            loading,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}; 