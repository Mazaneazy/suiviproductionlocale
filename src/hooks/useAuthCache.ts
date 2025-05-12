
import { useState, useEffect } from 'react';

type CachedAuth = {
  token: string | null;
  userId: string | null;
  expiresAt: number | null;
};

export function useAuthCache() {
  const [cachedAuth, setCachedAuth] = useState<CachedAuth>({
    token: null,
    userId: null,
    expiresAt: null
  });

  // Charger les données d'authentification du cache au démarrage
  useEffect(() => {
    const cachedAuthData = localStorage.getItem('auth_cache');
    
    if (cachedAuthData) {
      try {
        const parsedData = JSON.parse(cachedAuthData) as CachedAuth;
        
        // Vérifier si le token est encore valide
        if (parsedData.expiresAt && parsedData.expiresAt > Date.now()) {
          setCachedAuth(parsedData);
        } else {
          // Supprimer le cache expiré
          localStorage.removeItem('auth_cache');
        }
      } catch (error) {
        console.error('Erreur lors du chargement du cache d\'authentification:', error);
        localStorage.removeItem('auth_cache');
      }
    }
  }, []);

  // Fonction pour mettre en cache les données d'authentification
  const cacheAuthData = (token: string, userId: string, expiresInSeconds: number = 3600) => {
    const authData: CachedAuth = {
      token,
      userId,
      expiresAt: Date.now() + (expiresInSeconds * 1000)
    };
    
    setCachedAuth(authData);
    localStorage.setItem('auth_cache', JSON.stringify(authData));
  };

  // Fonction pour effacer le cache
  const clearAuthCache = () => {
    setCachedAuth({ token: null, userId: null, expiresAt: null });
    localStorage.removeItem('auth_cache');
  };

  return {
    cachedAuth,
    cacheAuthData,
    clearAuthCache,
    isAuthenticated: !!cachedAuth.token && !!cachedAuth.expiresAt && cachedAuth.expiresAt > Date.now()
  };
}
