const API_URL = '/api';

export const getStreamingAvailability = async (imdbId) => {
    if (!imdbId) return null;

    try {
        const response = await fetch(`${API_URL}/streaming/${imdbId}`);
        if (!response.ok) {
            console.log(`Backend Streaming API: ${response.status} for ${imdbId}`);
            return null;
        }
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching streaming data:', error);
        return null;
    }
};
