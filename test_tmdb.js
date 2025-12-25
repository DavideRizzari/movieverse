const TMDB_API_KEY = '06bd598d8486ad4e7c93e7aad9ef439b';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const query = "Mamma ho perso l'aereo";

async function testSearch() {
    console.log(`Testing TMDb Search for: "${query}"`);
    try {
        const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=it-IT&include_adult=false`;
        const resp = await fetch(url);
        const data = await resp.json();

        console.log("Search Results Status:", resp.status);
        if (data.results && data.results.length > 0) {
            console.log(`Found ${data.results.length} results.`);
            const first = data.results[0];
            console.log(`First Result: ${first.title} (${first.release_date}) ID: ${first.id}`);

            // Test external IDs
            const extUrl = `${TMDB_BASE_URL}/movie/${first.id}/external_ids?api_key=${TMDB_API_KEY}`;
            const extResp = await fetch(extUrl);
            const extData = await extResp.json();
            console.log(`IMDb ID: ${extData.imdb_id}`);
        } else {
            console.log("No results found or error:", data);
        }
    } catch (e) {
        console.error("Test failed:", e);
    }
}

testSearch();

async function testTrending() {
    console.log(`Testing TMDb Trending Logic...`);
    try {
        const url = `${TMDB_BASE_URL}/trending/movie/day?api_key=${TMDB_API_KEY}&language=it-IT`;
        const resp = await fetch(url);
        const data = await resp.json();

        console.log("Trending API Status:", resp.status);
        if (data.results && data.results.length > 0) {
            console.log(`Found ${data.results.length} trending movies.`);

            const subset = data.results.slice(0, 5);
            console.log("Mapping top 5 to IMDb IDs...");

            const mapped = await Promise.all(subset.map(async (movie) => {
                const extUrl = `${TMDB_BASE_URL}/movie/${movie.id}/external_ids?api_key=${TMDB_API_KEY}`;
                const extResp = await fetch(extUrl);
                const extData = await extResp.json();
                console.log(`  - ${movie.title}: IMDb ID = ${extData.imdb_id}`);
                return extData.imdb_id ? { title: movie.title, imdbID: extData.imdb_id } : null;
            }));

            const final = mapped.filter(m => m !== null);
            console.log(`Final count: ${final.length}`);
        } else {
            console.log("No trending results:", data);
        }
    } catch (e) {
        console.error("Test failed:", e);
    }
}

testTrending();
