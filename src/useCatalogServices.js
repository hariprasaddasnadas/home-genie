import { useEffect, useState } from 'react';
import { fetchJson } from './api';
import { services as fallbackServices } from './data';

export default function useCatalogServices() {
  const [services, setServices] = useState(fallbackServices);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        const { response, data } = await fetchJson('/api/services/');
        if (!isMounted) return;
        if (response.ok && Array.isArray(data.results) && data.results.length > 0) {
          setServices(data.results);
        } else {
          setServices(fallbackServices);
        }
      } catch (error) {
        if (isMounted) {
          setServices(fallbackServices);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  return { services, isLoading };
}
