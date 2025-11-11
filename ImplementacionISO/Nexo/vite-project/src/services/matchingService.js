import { db } from '../config/firebase';
import { 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where,
    Timestamp 
} from 'firebase/firestore';
import { calculateSimilarity } from '../utils/helpers';

// Crear una coincidencia
export const createMatch = async (objectId, ticketId, userId, similarity) => {
    try {
    const matchesRef = collection(db, 'matches');
    const docRef = await addDoc(matchesRef, {
        objectId,
        ticketId,
        userId,
        similarity,
        notified: false,
        createdAt: Timestamp.now()
    });

    return { success: true, id: docRef.id };
    } catch (error) {
    console.error('Error al crear coincidencia:', error);
    return { success: false, error: error.message };
    }
};

// Buscar coincidencias automáticas entre un objeto y todos los tickets
export const findMatchesForObject = async (object) => {
    try {
    const ticketsRef = collection(db, 'tickets');
    const q = query(ticketsRef, where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    
    const matches = [];
    
    querySnapshot.forEach((doc) => {
        const ticket = { id: doc.id, ...doc.data() };

      // Calcular similitud
        let similarity = 0;

      // Comparar categoría (peso 30%)
        if (object.category === ticket.category) {
        similarity += 30;
        }

      // Comparar color (peso 25%)
        if (object.color === ticket.color) {
        similarity += 25;
        }

      // Comparar ubicación (peso 20%)
        if (object.location === ticket.lostLocation) {
        similarity += 20;
        }

      // Comparar título y descripción (peso 25%)
        const textSimilarity = Math.max(
        calculateSimilarity(object.title, ticket.title),
        calculateSimilarity(object.description, ticket.description)
        );
      similarity += (textSimilarity / 100) * 25;

      // Si la similitud es mayor al 50%, es una posible coincidencia
        if (similarity >= 50) {
        matches.push({
            ticket,
            similarity: Math.round(similarity)
        });
        }
    });
    
    // Ordenar por similitud descendente
    matches.sort((a, b) => b.similarity - a.similarity);
    
    return { success: true, data: matches };
    } catch (error) {
    console.error('Error al buscar coincidencias:', error);
    return { success: false, error: error.message };
    }
};

// Buscar coincidencias automáticas entre un ticket y todos los objetos
export const findMatchesForTicket = async (ticket) => {
    try {
    const objectsRef = collection(db, 'objects');
    const q = query(objectsRef, where('status', '==', 'available'));
    const querySnapshot = await getDocs(q);
    
    const matches = [];
    
    querySnapshot.forEach((doc) => {
        const object = { id: doc.id, ...doc.data() };

        let similarity = 0;

        if (object.category === ticket.category) {
        similarity += 30;
        }

        if (object.color === ticket.color) {
        similarity += 25;
        }

        if (object.location === ticket.lostLocation) {
        similarity += 20;
        }

        const textSimilarity = Math.max(
        calculateSimilarity(object.title, ticket.title),
        calculateSimilarity(object.description, ticket.description)
        );
      similarity += (textSimilarity / 100) * 25;

        if (similarity >= 50) {
        matches.push({
            object,
            similarity: Math.round(similarity)
        });
        }
    });
    
    matches.sort((a, b) => b.similarity - a.similarity);
    
    return { success: true, data: matches };
    } catch (error) {
    console.error('Error al buscar coincidencias:', error);
    return { success: false, error: error.message };
    }
};

// Obtener coincidencias de un ticket específico
export const getMatchesForTicket = async (ticketId) => {
    try {
    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, where('ticketId', '==', ticketId));
    const querySnapshot = await getDocs(q);
    
    const matches = [];
    querySnapshot.forEach((doc) => {
        matches.push({
        id: doc.id,
        ...doc.data()
        });
    });

    return { success: true, data: matches };
    } catch (error) {
    console.error('Error al obtener coincidencias:', error);
    return { success: false, error: error.message };
    }
};

// Obtener coincidencias de un usuario específico
export const getUserMatches = async (userId) => {
    try {
    const matchesRef = collection(db, 'matches');
    const q = query(matchesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const matches = [];
    querySnapshot.forEach((doc) => {
        matches.push({
        id: doc.id,
        ...doc.data()
        });
    });

    return { success: true, data: matches };
    } catch (error) {
    console.error('Error al obtener coincidencias:', error);
    return { success: false, error: error.message };
    }
};