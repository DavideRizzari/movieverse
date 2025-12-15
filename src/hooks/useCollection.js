import { useState, useEffect, useCallback } from 'react';
import { getCollection, addToCollection, removeFromCollection, getPublicCollection } from '../services/api';
import { getMovieDetails } from '../services/omdb';

export const useCollection = (token, handleAuthError) => {
    const [collection, setCollection] = useState([]);
    const [sharedCollection, setSharedCollection] = useState(null);
    const [sharedUsername, setSharedUsername] = useState(null);
    const [loading, setLoading] = useState(false);

    // Load user collection
    const loadCollection = useCallback(async () => {
        if (!token) return;
        try {
            const data = await getCollection(token);
            setCollection(data);
        } catch (error) {
            console.error('Error loading collection:', error);
            if (handleAuthError) handleAuthError(error);
        }
    }, [token, handleAuthError]);

    useEffect(() => {
        if (token) {
            loadCollection();
        } else {
            setCollection([]);
        }
    }, [token, loadCollection]);

    // Load shared collection from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sharedUser = params.get('view_collection');

        if (sharedUser) {
            const loadShared = async () => {
                try {
                    setLoading(true);
                    const data = await getPublicCollection(sharedUser);
                    setSharedCollection(data.movies);
                    setSharedUsername(data.username);
                } catch (error) {
                    console.error('Error loading shared collection:', error);
                } finally {
                    setLoading(false);
                }
            };
            loadShared();
        }
    }, []);

    const addItem = async (movie) => {
        if (!token) return;
        try {
            // Ensure full details
            let movieToAdd = movie;
            if (!movie.Plot || movie.Plot === 'N/A') {
                movieToAdd = await getMovieDetails(movie.imdbID) || movie;
            }
            await addToCollection(token, movieToAdd);
            await loadCollection();
        } catch (error) {
            if (handleAuthError) handleAuthError(error);
        }
    };

    const removeItem = async (movieId) => {
        if (!token) return;
        try {
            await removeFromCollection(token, movieId);
            await loadCollection();
        } catch (error) {
            if (handleAuthError) handleAuthError(error);
        }
    };

    const isInCollection = useCallback((movieId) => {
        return collection.some(item => item.imdbID === movieId);
    }, [collection]);

    return {
        collection,
        sharedCollection,
        sharedUsername,
        loading,
        addItem,
        removeItem,
        isInCollection,
        loadCollection // Exposed in case we need manual reload
    };
};
