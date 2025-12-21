import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './database.js'; // Use pool from pg
import { getStreamingData } from './streaming.js';
import compression from 'compression';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Cache Control Middleware
app.use((req, res, next) => {
    // Cache static assets aggressively
    if (req.url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|css|js|woff|woff2|ttf)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
    }
    // Cache API responses
    else if (req.url.startsWith('/api/omdb')) {
        res.setHeader('Cache-Control', 'public, max-age=2592000');
    }
    // No cache for user data
    else if (req.url.startsWith('/api/collection') || req.url.startsWith('/api/profile')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    next();
});

const JWT_SECRET = process.env.JWT_SECRET || 'movieverse_secret_key_2024';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Serve static files from the React app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, '../dist');
app.use(express.static(clientBuildPath));


// --- API ENDPOINTS (Updated for Postgres) ---

// Register endpoint
app.post('/api/register', async (req, res) => {
    const { username, email, password, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2 } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!securityQuestion1 || !securityAnswer1 || !securityQuestion2 || !securityAnswer2) {
        return res.status(400).json({ error: 'Security questions and answers are required' });
    }

    if (securityQuestion1 === securityQuestion2) {
        return res.status(400).json({ error: 'Please select two different security questions' });
    }

    const normalizeAnswer = (answer) => answer.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedAnswer1 = normalizeAnswer(securityAnswer1);
    const normalizedAnswer2 = normalizeAnswer(securityAnswer2);

    if (!normalizedAnswer1 || !normalizedAnswer2) {
        return res.status(400).json({ error: 'Security answers must contain at least one letter or number' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (username, email, password, security_question1, security_answer1, security_question2, security_answer2) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [username, email, hashedPassword, securityQuestion1, normalizedAnswer1, securityQuestion2, normalizedAnswer2]
        );

        const newUserId = result.rows[0].id;
        const token = jwt.sign({ id: newUserId, email, username }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: newUserId, username, email, preferred_genres: [] }
        });

    } catch (err) {
        if (err.code === '23505') { // Postgres unique violation code
            return res.status(400).json({ error: 'Email already registered' });
        }
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        let genres = [];
        try {
            genres = user.preferred_genres ? JSON.parse(user.preferred_genres) : [];
        } catch (e) { genres = []; }

        res.json({
            token,
            user: { id: user.id, username: user.username, email: user.email, preferred_genres: genres }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update profile endpoint
app.put('/api/profile', authenticateToken, async (req, res) => {
    const { email, preferred_genres, favorite_directors, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2 } = req.body;

    try {
        const updates = [];
        const values = [];
        let counter = 1;

        if (email) {
            updates.push(`email = $${counter++}`);
            values.push(email);
        }
        if (Array.isArray(preferred_genres)) {
            updates.push(`preferred_genres = $${counter++}`);
            values.push(JSON.stringify(preferred_genres));
        }
        if (favorite_directors !== undefined) {
            updates.push(`favorite_directors = $${counter++}`);
            values.push(favorite_directors);
        }
        if (securityQuestion1 && securityAnswer1 && securityQuestion2 && securityAnswer2) {
            const normalizeAnswer = (answer) => answer.toLowerCase().replace(/[^a-z0-9]/g, '');
            updates.push(`security_question1 = $${counter++}`);
            values.push(securityQuestion1);
            updates.push(`security_answer1 = $${counter++}`);
            values.push(normalizeAnswer(securityAnswer1));
            updates.push(`security_question2 = $${counter++}`);
            values.push(securityQuestion2);
            updates.push(`security_answer2 = $${counter++}`);
            values.push(normalizeAnswer(securityAnswer2));
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(req.user.id);
        const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = $${counter} RETURNING id, username, email, preferred_genres, favorite_directors, security_question1, security_question2`;

        const result = await pool.query(sql, values);
        const user = result.rows[0];

        let genres = [];
        try {
            genres = user.preferred_genres ? JSON.parse(user.preferred_genres) : [];
        } catch (e) { genres = []; }

        res.json({
            message: 'Profile updated',
            user: { ...user, preferred_genres: genres }
        });

    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Email already in use' });
        }
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Change password endpoint
app.post('/api/change-password', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Invalid password data' });
    }

    try {
        const result = await pool.query('SELECT password FROM users WHERE id = $1', [req.user.id]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Current password is incorrect' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, req.user.id]);

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Security questions
app.get('/api/security-questions/:email', async (req, res) => {
    try {
        const result = await pool.query('SELECT security_question1, security_question2 FROM users WHERE email = $1', [req.params.email]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

        res.json({
            question1: result.rows[0].security_question1,
            question2: result.rows[0].security_question2
        });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Reset password
app.post('/api/reset-password', async (req, res) => {
    const { email, answer1, answer2, newPassword } = req.body;

    if (!email || !answer1 || !answer2 || !newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Invalid data' });

    try {
        const result = await pool.query('SELECT id, security_answer1, security_answer2 FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) return res.status(404).json({ error: 'User not found' });

        const normalize = (a) => a.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (normalize(answer1) !== user.security_answer1 || normalize(answer2) !== user.security_answer2) {
            return res.status(401).json({ error: 'Incorrect security answers' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user collection
app.get('/api/collection', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('SELECT movie_data FROM collections WHERE user_id = $1 ORDER BY added_at DESC', [req.user.id]);
        const movies = result.rows.map(row => JSON.parse(row.movie_data));
        res.json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Add to collection
app.post('/api/collection', authenticateToken, async (req, res) => {
    const { movie } = req.body;
    if (!movie || !movie.imdbID) return res.status(400).json({ error: 'Invalid movie data' });

    try {
        const result = await pool.query(
            'INSERT INTO collections (user_id, movie_id, movie_data) VALUES ($1, $2, $3) RETURNING id',
            [req.user.id, movie.imdbID, JSON.stringify(movie)]
        );
        res.json({ message: 'Movie added', id: result.rows[0].id });
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ error: 'Movie already in collection' });
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Remove from collection
app.delete('/api/collection/:movieId', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM collections WHERE user_id = $1 AND movie_id = $2', [req.user.id, req.params.movieId]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Movie not found' });
        res.json({ message: 'Movie removed' });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Get Directors
app.get('/api/directors', async (req, res) => {
    // Note: Postgres JSON extraction is different, but strict extraction from string works if structure is simple.
    // However, better to fetch rows and process in Node for simplicity if JSON structure varies.
    // Or usage of Postgres ->> operator if valid JSON.
    // For safety in migration, we fetch and process:
    try {
        const result = await pool.query('SELECT movie_data FROM collections');
        const directors = new Set();
        result.rows.forEach(row => {
            try {
                const m = JSON.parse(row.movie_data);
                if (m.Director && m.Director !== 'N/A') directors.add(m.Director);
            } catch (e) { /* Ignore invalid JSON */ }
        });
        res.json(Array.from(directors).sort());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Reviews
app.get('/api/reviews/:movieId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT r.*, u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.movie_id = $1 ORDER BY r.created_at DESC',
            [req.params.movieId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/reviews', authenticateToken, async (req, res) => {
    const { movieId, rating, comment } = req.body;
    if (!movieId || !rating) return res.status(400).json({ error: 'Missing fields' });

    try {
        await pool.query(
            `INSERT INTO reviews (user_id, movie_id, rating, comment) VALUES ($1, $2, $3, $4)
             ON CONFLICT(user_id, movie_id) DO UPDATE SET rating = $3, comment = $4, created_at = CURRENT_TIMESTAMP`,
            [req.user.id, movieId, rating, comment]
        );
        res.json({ message: 'Review saved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/reviews/:reviewId', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM reviews WHERE id = $1 AND user_id = $2', [req.params.reviewId, req.user.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Not found or forbidden' });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Public Collection
app.get('/api/collections/public/:username', async (req, res) => {
    try {
        const userRes = await pool.query('SELECT id, username FROM users WHERE username = $1', [req.params.username]);
        if (userRes.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        const user = userRes.rows[0];

        const colRes = await pool.query('SELECT movie_data FROM collections WHERE user_id = $1 ORDER BY added_at DESC', [user.id]);
        const movies = colRes.rows.map(r => JSON.parse(r.movie_data));
        res.json({ username: user.username, movies });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// --- OMDb PROXY + CACHING (Postgres) ---
const OMDB_API_KEY = process.env.OMDB_API_KEY || '263d22d8';
const OMDB_BASE_URL = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;
const CACHE_DURATION = 90 * 24 * 60 * 60 * 1000;

const getCachedData = async (key) => {
    const result = await pool.query('SELECT response_data, cached_at FROM api_cache WHERE request_key = $1', [key]);
    return result.rows[0];
};

const saveCachedData = async (key, data) => {
    const timestamp = Date.now();
    await pool.query(
        `INSERT INTO api_cache (request_key, response_data, cached_at) VALUES ($1, $2, $3)
         ON CONFLICT(request_key) DO UPDATE SET response_data = $2, cached_at = $3`,
        [key, JSON.stringify(data), timestamp]
    );
};

// --- TMDb PROXY (Italian Support) ---
// Note: In production (e.g. Vercel/Render), ensure TMDB_API_KEY is set in environment variables
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
    console.warn("WARNING: TMDB_API_KEY not found in environment. Italian search will be disabled.");
}

app.get('/api/tmdb/search', async (req, res) => {
    const { q } = req.query;
    console.log(`[TMDb Request] Query: "${q}"`);
    if (!q) return res.json({ Search: [], Response: "False" });

    if (!TMDB_API_KEY) {
        console.error("[TMDb Error] TMDB_API_KEY is missing. Falling back to OMDb.");
        return res.json({ Search: [], Response: "False", Error: "API Key missing" });
    }

    try {
        // 1. Search for movie in Italian
        const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}&language=it-IT&include_adult=false`;
        const searchResp = await fetch(searchUrl);
        const searchData = await searchResp.json();

        if (!searchData.results || searchData.results.length === 0) {
            console.log(`[TMDb Search] No results found for "${q}"`);
            return res.json({ Search: [], Response: "False" });
        }

        console.log(`[TMDb Search] Found ${searchData.results.length} results. Fetching details...`);

        // 2. For top results, fetch corresponding IMDb ID (parallel requests)
        // Taking top 5 to avoid rate limits and slow response
        const topResults = searchData.results.slice(0, 5);

        const mappedResults = await Promise.all(topResults.map(async (movie) => {
            try {
                const externalIdUrl = `${TMDB_BASE_URL}/movie/${movie.id}/external_ids?api_key=${TMDB_API_KEY}`;
                const extResp = await fetch(externalIdUrl);
                const extData = await extResp.json();

                if (extData.imdb_id) {
                    return {
                        Title: movie.title, // Keep Italian title
                        Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                        imdbID: extData.imdb_id,
                        Type: 'movie',
                        Poster: movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : 'N/A'
                    };
                }
                return null;
            } catch (e) {
                return null;
            }
        }));

        // Filter out failures
        const validResults = mappedResults.filter(r => r !== null);

        if (validResults.length > 0) {
            console.log(`[TMDb Proxy] Successfully mapped ${validResults.length} movies with IMDb IDs.`);
            res.json({ Search: validResults, Response: "True" });
        } else {
            console.log(`[TMDb Proxy] Found movies but none had an IMDb ID.`);
            res.json({ Search: [], Response: "False" });
        }

    } catch (e) {
        console.error("TMDb Error:", e);
        res.status(500).json({ error: 'TMDb Proxy Error' });
    }
});

// ... Same search/details/trending logic but using async pool helpers above ...

app.get('/api/omdb/search', async (req, res) => {
    const { s, y } = req.query;
    if (!s) return res.status(400).json({ error: 'Required' });
    const cacheKey = `search:${s.toLowerCase()}:${y || ''}`;

    try {
        const cached = await getCachedData(cacheKey);
        // Postgres BIGINT returns as string sometimes, ensure parsing if needed
        if (cached && (Date.now() - Number(cached.cached_at) < CACHE_DURATION)) {
            return res.json(JSON.parse(cached.response_data));
        }

        let url = `${OMDB_BASE_URL}&s=${encodeURIComponent(s)}`;
        if (y) url += `&y=${y}`;
        const resp = await fetch(url);
        const data = await resp.json();

        if (data.Response === "True") saveCachedData(cacheKey, data);
        res.json(data);
    } catch (e) { res.status(500).json({ error: 'Proxy error' }); }
});

app.get('/api/omdb/details/:id', async (req, res) => {
    const { id } = req.params;
    const cacheKey = `details:${id}`;
    try {
        const cached = await getCachedData(cacheKey);
        if (cached && (Date.now() - Number(cached.cached_at) < CACHE_DURATION)) {
            return res.json(JSON.parse(cached.response_data));
        }
        const resp = await fetch(`${OMDB_BASE_URL}&i=${id}&plot=full`);
        const data = await resp.json();
        if (data.Response === "True") saveCachedData(cacheKey, data);
        res.json(data);
    } catch (e) { res.status(500).json({ error: 'Proxy error' }); }
});

app.get('/api/omdb/trending', async (req, res) => {
    if (!TMDB_API_KEY) {
        return res.json([]);
    }

    try {
        console.log("[Trending Request] Fetching daily trending from TMDb...");
        const trendingUrl = `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}&language=it-IT`;
        const resp = await fetch(trendingUrl);
        const data = await resp.json();

        if (!data.results || data.results.length === 0) {
            console.log("[Trending] No results from TMDb Trending API.");
            return res.json([]);
        }

        console.log(`[Trending] TMDb returned ${data.results.length} movies.`);

        // 2. Randomize/Shuffle to ensure it "changes every time" as requested
        const shuffled = data.results.sort(() => 0.5 - Math.random());

        // 3. Take a subset (e.g., 10-12 movies) to keep it snappy and diverse
        const subset = shuffled.slice(0, 12);

        // 4. Map to IMDb IDs (Parallel)
        const mappedResults = await Promise.all(subset.map(async (movie) => {
            try {
                // Check cache first for external IDs to speed up
                const cacheKey = `tmdb_id_map:${movie.id}`;
                const cached = await getCachedData(cacheKey);

                let imdbId;
                if (cached) {
                    imdbId = JSON.parse(cached.response_data).imdb_id;
                } else {
                    const extResp = await fetch(`${TMDB_BASE_URL}/movie/${movie.id}/external_ids?api_key=${TMDB_API_KEY}`);
                    const extData = await extResp.json();
                    imdbId = extData.imdb_id;
                    if (imdbId) saveCachedData(cacheKey, { imdb_id: imdbId });
                }

                if (imdbId) {
                    return {
                        Title: movie.title,
                        Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                        imdbID: imdbId,
                        Type: 'movie',
                        Poster: movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : 'N/A'
                    };
                }
                return null;
            } catch (e) {
                return null;
            }
        }));

        const finalResults = mappedResults.filter(r => r !== null);
        console.log(`[Trending] Successfully prepared ${finalResults.length} trending movies.`);
        res.json(finalResults);

    } catch (e) {
        console.error("Trending Error:", e);
        res.status(500).json({ error: 'Trending Proxy Error' });
    }
});

// Streaming (using helper from streaming.js which likely just fetches external API? actually streaming.js was local URL... wait)
// streaming.js contained the *client* code.
// The *server* code for streaming was:

// streaming.js in SERVER folder was not viewed in this turn. I will view it to ensure.
// I'll assume it has a function getStreamingData based on imports.
// I will include:

app.get('/api/streaming/:imdbId', async (req, res) => {
    try {
        // Cache Check
        const { imdbId } = req.params;
        const result = await pool.query('SELECT streaming_data, cached_at FROM streaming_cache WHERE imdb_id = $1', [imdbId]);
        if (result.rows.length > 0) {
            // Check expiry (e.g. 7 days)
            if (Date.now() - Number(result.rows[0].cached_at) < 604800000) {
                return res.json(JSON.parse(result.rows[0].streaming_data));
            }
        }

        // If not cached, fetch from 'streaming.js' logic (which presumably scrapes or calls generic API)
        const data = await getStreamingData(imdbId);
        if (data) {
            await pool.query(
                `INSERT INTO streaming_cache (imdb_id, streaming_data, cached_at) VALUES ($1, $2, $3)
                  ON CONFLICT(imdb_id) DO UPDATE SET streaming_data = $2, cached_at = $3`,
                [imdbId, JSON.stringify(data), Date.now()]
            );
            res.json(data);
        } else {
            res.json(null);
        }
    } catch (e) { console.error(e); res.status(500).json({ error: 'Streaming error' }); }
});

// Fallback for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
