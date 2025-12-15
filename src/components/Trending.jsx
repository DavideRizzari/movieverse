import React from 'react';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

const Trending = ({ loading, trending, onAdd, isInCollection, onMovieClick }) => {
    return (
        <section className="trending-section">
            <h2>Trending Movies</h2>
            {loading ? (
                <div className="grid">
                    {[...Array(12)].map((_, i) => (
                        <MovieCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid">
                    {trending.map(movie => (
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
        </section>
    );
};

export default Trending;
