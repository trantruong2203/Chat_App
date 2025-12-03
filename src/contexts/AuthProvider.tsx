import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ContextAuth, type AuthContextType } from './AuthContext';
import axios from 'axios';
import type { UserResponse } from '../interface/UserResponse';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

interface AuthProviderProps {
    children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [accountLogin, setAccountLogin] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!hasCheckedAuth) {
            getToken();
        }
    }, [hasCheckedAuth]);

    const getToken = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API}/user/me`, {
                withCredentials: true
            });
            setAccountLogin(response.data.user);
        } catch (error) {
            console.log('Authentication check failed:', error);
            setAccountLogin(null);
        } finally {
            setIsLoading(false);
            setHasCheckedAuth(true);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API}/user/logout`, {}, {
                withCredentials: true,
            });
        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            setAccountLogin(null);
            setHasCheckedAuth(false);
            // Chỉ navigate nếu không đang ở trang login
            if (window.location.pathname !== '/') {
                navigate('/');
            }
        }
    };

    const authContextValue: AuthContextType = {
        accountLogin,
        logout,
        getToken,
        isLoading,
    };

    return (
        <ContextAuth.Provider value={authContextValue}>
            {children}
        </ContextAuth.Provider>
    );
}

export default AuthProvider;