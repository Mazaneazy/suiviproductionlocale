
import { useState, useEffect } from 'react';

/**
 * Hook pour mettre en cache et gérer les ressources
 * @param key Clé unique pour identifier la ressource
 * @param fetchFn Fonction de récupération de la ressource
 * @param ttl Durée de vie du cache en millisecondes (défaut 5 minutes)
 */
export function useResourceCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // Vérifier si les données sont déjà en cache
      const cachedData = localStorage.getItem(`cache_${key}`);
      
      if (cachedData) {
        try {
          const { data: storedData, expiry } = JSON.parse(cachedData);
          
          // Vérifier si le cache est encore valide
          if (expiry && expiry > Date.now()) {
            setData(storedData as T);
            return;
          }
        } catch (err) {
          // En cas d'erreur, supprimer le cache invalide
          localStorage.removeItem(`cache_${key}`);
        }
      }
      
      // Si le cache n'existe pas ou est expiré, récupérer les données
      setIsLoading(true);
      setError(null);
      
      try {
        const freshData = await fetchFn();
        setData(freshData);
        
        // Stocker les données dans le cache
        localStorage.setItem(`cache_${key}`, JSON.stringify({
          data: freshData,
          expiry: Date.now() + ttl
        }));
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [key, fetchFn, ttl]);

  // Fonction pour forcer le rafraîchissement du cache
  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const freshData = await fetchFn();
      setData(freshData);
      
      // Mettre à jour le cache
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data: freshData,
        expiry: Date.now() + ttl
      }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refreshData };
}
