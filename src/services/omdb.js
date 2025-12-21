const API_URL = '/api';

const translateQuery = async (text) => {
    // Simple check to avoid translating if it looks like English or very short
    if (!text || text.length < 2) return text;

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=Autodetect|en`);
        const data = await response.json();

        if (data.responseData && data.responseData.translatedText) {
            console.log(`Translated "${text}" to "${data.responseData.translatedText}"`);
            return data.responseData.translatedText;
        }
        return text;
    } catch (error) {
        console.warn("Translation failed, using original query:", error);
        return text;
    }
};

export const searchMovies = async (query, year = '') => {
    try {
        // 1. Try TMDb (Italian optimized)
        // If TMDB_API_KEY is not set on server, this returns empty/false quickly
        const tmdbUrl = `${API_URL}/tmdb/search?q=${encodeURIComponent(query)}`;
        const tmdbResponse = await fetch(tmdbUrl);
        const tmdbData = await tmdbResponse.json();

        if (tmdbData.Response === "True" && tmdbData.Search && tmdbData.Search.length > 0) {
            return tmdbData.Search;
        }

        console.log("TMDb no results, falling back to OMDb...");

        // 2. Fallback to original OMDb Search (English mainly)
        // We can keep the translation attempt if we want, but it was unreliable. 
        // Let's keep it as a last resort if TMDb fails (e.g. key missing).
        const translatedQuery = await translateQuery(query);

        let url = `${API_URL}/omdb/search?s=${encodeURIComponent(translatedQuery)}`;
        if (year) url += `&y=${year}`;

        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(url, { headers });
        const data = await response.json();

        if (data.Response === "True" || Array.isArray(data)) {
            return Array.isArray(data) ? data : data.Search;
        } else {
            // 3. Last chance: Original Query without translation
            if (translatedQuery !== query) {
                let fallbackUrl = `${API_URL}/omdb/search?s=${encodeURIComponent(query)}`;
                if (year) fallbackUrl += `&y=${year}`;
                const fallbackResponse = await fetch(fallbackUrl, { headers });
                const fallbackData = await fallbackResponse.json();
                if (fallbackData.Response === "True" || Array.isArray(fallbackData)) {
                    return Array.isArray(fallbackData) ? fallbackData : fallbackData.Search;
                }
            }
            throw new Error(data.Error || 'No results found');
        }
    } catch (error) {
        console.error("Error searching movies:", error);
        return [];
    }
};

export const searchMoviesWithDetails = async (query, year = '') => {
    const movies = await searchMovies(query, year);
    if (!movies.length) return [];

    const detailedMovies = await Promise.all(
        movies.map(movie => getMovieDetails(movie.imdbID))
    );

    return detailedMovies.filter(movie => movie !== null);
};

export const getMovieDetails = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(`${API_URL}/omdb/details/${id}`, { headers });
        const data = await response.json();

        if (data.Response === "True" || data.Title) {
            return data;
        } else {
            throw new Error(data.Error);
        }
    } catch (error) {
        console.error("Error getting movie details:", error);
        return null;
    }
};

export const getTrendingMovies = async () => {
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(`${API_URL}/omdb/trending`, { headers });

        if (!response.ok) {
            throw new Error('Failed to fetch trending movies');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
};
