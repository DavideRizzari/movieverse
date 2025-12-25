
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Try to load from ROOT .env (going up one level from server folder)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnvPath = path.resolve(__dirname, '../.env');

dotenv.config({ path: rootEnvPath });

console.log(`Checking path: ${rootEnvPath}`);
console.log("ROOT .env TMDB_API_KEY:", process.env.TMDB_API_KEY ? "FOUND" : "MISSING");
