
import { Dossier } from '@/types';

export interface ProducteurCredentials {
  email: string;
  password: string;
}

export interface ProducteurAccountHook {
  createAccount: boolean;
  producteurCredentials: ProducteurCredentials | null;
  handleAccountCreationToggle: () => void;
  createProducteurAccountFromDossier: (dossier?: Dossier) => boolean;
  resetState: () => void;
}
