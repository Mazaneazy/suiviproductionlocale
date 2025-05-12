import { AuthUser } from './AuthContext';
import { User } from '@/types';
import { MOCK_USERS } from '../data/mockData';

// Import des comptes de démonstration
import { DEMO_USERS } from '../data/mockData';

export const initAuthState = (): AuthUser => {
  try {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      return {
        isAuthenticated: true,
        currentUser: parsedUser,
        loading: false,
        error: null
      };
    }
    return {
      isAuthenticated: false,
      currentUser: null,
      loading: false,
      error: null
    };
  } catch (error) {
    console.error("Error initializing auth state:", error);
    return {
      isAuthenticated: false,
      currentUser: null,
      loading: false,
      error: "Failed to initialize authentication state"
    };
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem('authUser');
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  // Vérifier d'abord dans les comptes de démonstration
  const demoUser = DEMO_USERS.find(
    user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
  );
  
  if (demoUser) {
    // Utiliser le compte de démonstration
    const { password, ...userWithoutPassword } = demoUser;
    
    localStorage.setItem('authUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword as User;
  }
  
  // Sinon, utiliser la méthode existante
  try {
    const user = MOCK_USERS.find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (!user) {
      throw new Error("User not found");
    }
    
    // Dans une véritable application, nous vérifierions le mot de passe haché ici
    // Pour cette démo, nous supposons que le mot de passe 'password' est correct pour tous les utilisateurs
    if (password !== 'password' && password !== user.password) {
      throw new Error("Invalid password");
    }
    
    // Stocker l'utilisateur dans le stockage local
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('authUser', JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
