import { useState, useEffect } from 'react';
import { getAllObjects } from '../services/objectService';

export const useObjects = (initialFilters = {}) => {
    const [objects, setObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);

    const fetchObjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Aplicando filtros:', filters); // Debug
        const result = await getAllObjects(filters);

        if (result.success) {
        console.log('📦 Objetos obtenidos:', result.data.length); // Debug
        setObjects(result.data);
        } else {
        setError(result.error);
        }
    } catch (err) {
        setError('Error al cargar los objetos');
        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
    fetchObjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]); // Dependencia correcta

    const refreshObjects = () => {
    fetchObjects();
    };

    const updateFilters = (newFilters) => {
    console.log('🔄 Actualizando filtros:', newFilters); // Debug
    setFilters(newFilters);
    };

    const clearFilters = () => {
    console.log('🧹 Limpiando filtros'); // Debug
    setFilters({});
    };

    return {
    objects,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refreshObjects
    };
};