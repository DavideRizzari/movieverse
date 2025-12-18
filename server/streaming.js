import pool from './database.js'; // Use the Postgres pool
import fetch from 'node-fetch';

const API_KEY = '7eb448b34dmshc149d7ef2d3e5f3p136c45jsn24e607b6140c';
const API_HOST = 'streaming-availability.p.rapidapi.com';
const CACHE_TTL = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds

export const getStreamingData = async (imdbId) => {
    console.log(`[STREAMING] Request for ${imdbId}`);

    // Check cache first
    try {
        const result = await pool.query('SELECT streaming_data, cached_at FROM streaming_cache WHERE imdb_id = $1', [imdbId]);

        if (result.rows.length > 0) {
            const row = result.rows[0];
            const now = Date.now();
            // Postgres BIGINT returns as string, so cast to Number
            const isExpired = (now - Number(row.cached_at)) > CACHE_TTL;

            if (!isExpired) {
                console.log(`[STREAMING] Cache HIT for ${imdbId}`);
                return JSON.parse(row.streaming_data);
            }
            console.log(`[STREAMING] Cache EXPIRED for ${imdbId}`);
        } else {
            console.log(`[STREAMING] Cache MISS for ${imdbId}`);
        }
    } catch (err) {
        console.error('[STREAMING] Cache Error:', err);
    }

    // Fetch from RapidAPI if miss or expired
    try {
        const url = `https://${API_HOST}/shows/${imdbId}`;
        console.log(`[STREAMING] Fetching from RapidAPI: ${url}`);
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_KEY,
                'X-RapidAPI-Host': API_HOST
            }
        };

        const response = await fetch(url, options);

        if (!response.ok) {
            console.log(`[STREAMING] RapidAPI error: ${response.status} for ${imdbId}`);
            return null;
        }

        const data = await response.json();
        console.log(`[STREAMING] Got data from RapidAPI for ${imdbId}`);

        // Save to cache
        const now = Date.now();
        await pool.query(
            `INSERT INTO streaming_cache (imdb_id, streaming_data, cached_at) VALUES ($1, $2, $3)
             ON CONFLICT(imdb_id) DO UPDATE SET streaming_data = $2, cached_at = $3`,
            [imdbId, JSON.stringify(data), now]
        );
        console.log(`[STREAMING] Cached streaming data for ${imdbId}`);

        return data;

    } catch (error) {
        console.error('[STREAMING] Error fetching from RapidAPI:', error);
        return null;
    }
};
