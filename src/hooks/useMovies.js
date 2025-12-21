import { useState, useEffect, useCallback } from 'react';
import { searchMovies, getTrendingMovies, getMovieDetails } from '../services/omdb';

export const useMovies = (user) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [trending, setTrending] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    // Trending Logic
    const loadTrending = useCallback(async (forceRefresh = false) => {
        const now = Date.now();
        const currentUserPrefs = user && user.preferred_genres ? JSON.stringify(user.preferred_genres) : 'none';

        // Cache specifically disabled for Trending as per user request for variety
        /* 
        if (!forceRefresh && cachedTrending && cachedTime && (now - cachedTime < 1800000) && cachedUser === currentUserPrefs) {
            ...
        }
        */

        setLoading(true);
        try {
            const data = await getTrendingMovies(user?.preferred_genres);
            // Always set trending to something (even empty) to break potential retry loops in App.jsx
            const finalData = (data && Array.isArray(data)) ? data : [];
            setTrending(finalData);

            if (finalData.length > 0) {
                localStorage.setItem('trendingMovies', JSON.stringify(finalData));
                localStorage.setItem('trendingMoviesTime', now);
                localStorage.setItem('trendingMoviesUser', currentUserPrefs);
            }
        } catch (e) {
            console.error("Failed to load trending", e);
            setTrending([]); // Break loop on error too
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Search & Suggestions Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query && query.length > 2) {
                // Always fetch suggestions if query > 2
                const data = await searchMovies(query);
                setSuggestions(data ? data.slice(0, 5) : []);
                if (document.activeElement.tagName === 'INPUT') { // Only show if still typing/focused
                    setShowSuggestions(true);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const performSearch = async (searchQuery) => {
        if (!searchQuery) return;
        setLoading(true);
        // We don't change tab here, the component using this hook should handle UI state
        const data = await searchMovies(searchQuery);
        setResults(data || []);
        setLoading(false);
    };

    const handleMovieClick = useCallback(async (movie) => {
        setModalLoading(true);
        setSelectedMovie(movie);

        if (!movie.Plot || movie.Plot === 'N/A') {
            const fullDetails = await getMovieDetails(movie.imdbID);
            setSelectedMovie(fullDetails || movie);
        }
        setModalLoading(false);
    }, []);

    return {
        query, setQuery,
        results,
        trending,
        suggestions,
        showSuggestions, setShowSuggestions,
        loading,
        modalLoading,
        selectedMovie, setSelectedMovie,
        loadTrending,
        performSearch,
        handleMovieClick
    };
};
