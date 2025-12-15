/**
 * Google Analytics 4 Tracking Utilities
 * Centralized module for tracking custom events throughout MovieVerse
 */

/**
 * Track a custom event in Google Analytics
 * @param {string} eventName - Name of the event
 * @param {object} eventParams - Additional parameters for the event
 */
export const trackEvent = (eventName, eventParams = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', eventName, eventParams);
    }
};

/**
 * Track movie search
 * @param {string} searchQuery - The search term used
 */
export const trackSearch = (searchQuery) => {
    trackEvent('search', {
        search_term: searchQuery,
        content_type: 'movie'
    });
};

/**
 * Track movie view (when user opens movie details)
 * @param {string} movieTitle - Title of the movie
 * @param {string} movieId - IMDb ID of the movie
 */
export const trackMovieView = (movieTitle, movieId) => {
    trackEvent('view_item', {
        item_id: movieId,
        item_name: movieTitle,
        content_type: 'movie'
    });
};

/**
 * Track collection creation
 * @param {string} collectionName - Name of the collection
 */
export const trackCollectionCreate = (collectionName) => {
    trackEvent('create_collection', {
        collection_name: collectionName
    });
};

/**
 * Track adding movie to collection
 * @param {string} movieTitle - Title of the movie
 * @param {string} collectionName - Name of the collection
 */
export const trackAddToCollection = (movieTitle, collectionName) => {
    trackEvent('add_to_collection', {
        item_name: movieTitle,
        collection_name: collectionName
    });
};

/**
 * Track user registration
 */
export const trackRegistration = () => {
    trackEvent('sign_up', {
        method: 'email'
    });
};

/**
 * Track user login
 */
export const trackLogin = () => {
    trackEvent('login', {
        method: 'email'
    });
};

/**
 * Track review submission
 * @param {string} movieTitle - Title of the movie
 * @param {number} rating - Rating given
 */
export const trackReviewSubmit = (movieTitle, rating) => {
    trackEvent('submit_review', {
        item_name: movieTitle,
        rating: rating
    });
};

/**
 * Track streaming availability check
 * @param {string} movieTitle - Title of the movie
 */
export const trackStreamingCheck = (movieTitle) => {
    trackEvent('check_streaming', {
        item_name: movieTitle
    });
};

/**
 * Track filter/genre selection
 * @param {string} filterType - Type of filter (genre, year, etc.)
 * @param {string} filterValue - Value selected
 */
export const trackFilterUse = (filterType, filterValue) => {
    trackEvent('filter_use', {
        filter_type: filterType,
        filter_value: filterValue
    });
};
