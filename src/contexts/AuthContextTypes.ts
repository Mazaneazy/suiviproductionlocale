
import { User, UserRole, Dossier } from '@/types';

// Define the AuthContext type
export interface AuthContextProps {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getAllUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  createUser: (user: Omit<User, 'id'>) => Promise<boolean>;
  hasAccess: (moduleName: string) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isAuthenticated: boolean;
  getUserActions: (userId: string) => any[];
  createProducteurAccount: (dossier: Dossier) => User;
}
