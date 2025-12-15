import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ FATAL: DATABASE_URL is missing in .env file.');
  console.error('Please create a PostgreSQL database (e.g. on Neon.tech) and add the URL to your .env file.');
  // We don't exit process so the user can see the error, but app will fail to connect
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for most cloud DBs like Neon/Heroku
  }
});

pool.on('connect', () => {
  // console.log('Connected to PostgreSQL database'); 
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const initDatabase = async () => {
  const client = await pool.connect();
  try {
    // Users Table
    await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                preferred_genres TEXT,
                favorite_directors TEXT,
                security_question1 TEXT,
                security_answer1 TEXT,
                security_question2 TEXT,
                security_answer2 TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

    // Collections Table
    await client.query(`
            CREATE TABLE IF NOT EXISTS collections (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                movie_id TEXT NOT NULL,
                movie_data TEXT NOT NULL,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, movie_id)
            );
        `);

    // Streaming Cache
    await client.query(`
            CREATE TABLE IF NOT EXISTS streaming_cache (
                imdb_id TEXT PRIMARY KEY,
                streaming_data TEXT NOT NULL,
                cached_at BIGINT NOT NULL
            );
        `);

    // API Cache
    await client.query(`
            CREATE TABLE IF NOT EXISTS api_cache (
                id SERIAL PRIMARY KEY,
                request_key TEXT UNIQUE NOT NULL,
                response_data TEXT NOT NULL,
                cached_at BIGINT NOT NULL
            );
        `);

    // Reviews Table
    await client.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                movie_id TEXT NOT NULL,
                rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, movie_id)
            );
        `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_reviews_movie_id ON reviews(movie_id)`);

    console.log('✅ PostgreSQL Tables initialized');
  } catch (err) {
    console.error('❌ Error initializing database tables:', err);
  } finally {
    client.release();
  }
};

// Initialize on start
initDatabase();

export default pool;
