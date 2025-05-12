import { User } from '@/types';
import { MOCK_USERS } from '../data/mockData';

// Import des comptes de démonstration
import { DEMO_USERS } from '../data/mockData';

// Type pour l'état d'authentification
export interface AuthUser {
  isAuthenticated: boolean;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

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

export const initializeAuthState = (
  setCurrentUser: (user: User | null) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
    }
    setLoading(false);
  } catch (error) {
    console.error("Error initializing auth state:", error);
    setLoading(false);
  }
};

export const setupAuthStateListener = (
  setCurrentUser: (user: User | null) => void
) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'authUser') {
      if (event.newValue) {
        setCurrentUser(JSON.parse(event.newValue));
      } else {
        setCurrentUser(null);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);
  
  return {
    unsubscribe: () => {
      window.removeEventListener('storage', handleStorageChange);
    }
  };
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
    
    // Map the demoUser properties to User interface properties
    const mappedUser: User = {
      id: demoUser.id,
      name: demoUser.prenom + ' ' + demoUser.nom,
      email: demoUser.email,
      role: demoUser.role as any, // Using any to bypass strict typing temporarily
      phone: demoUser.telephone,
      dateCreation: demoUser.dateCreation,
      // Keep original properties for compatibility
      nom: demoUser.nom,
      prenom: demoUser.prenom,
      telephone: demoUser.telephone,
      avatar: demoUser.avatar
    };
    
    localStorage.setItem('authUser', JSON.stringify(mappedUser));
    return mappedUser;
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
