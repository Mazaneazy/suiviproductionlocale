
import { useContext } from 'react';
import { AuthContext } from '../contexts/auth/AuthProvider';

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
