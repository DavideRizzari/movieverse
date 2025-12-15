import React from 'react';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

const Search = ({ loading, results, onAdd, isInCollection, onMovieClick }) => {
    return (
        <section className="search-section">
            <h2>Search Results</h2>
            {loading ? (
                <div className="grid">
                    {[...Array(12)].map((_, i) => (
                        <MovieCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid">
                    {results.map(movie => (
                        <MovieCard
                            key={movie.imdbID}
                            movie={movie}
                            onAdd={onAdd}
                            isAdded={isInCollection(movie.imdbID)}
                            onClick={onMovieClick}
                        />
                    ))}
                </div>
            )}
            {results.length === 0 && !loading && (
                <p className="empty-state">No results. Try searching for a movie!</p>
            )}
        </section>
    );
};

export default Search;
