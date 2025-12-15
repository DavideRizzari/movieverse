import React, { useState } from 'react';
import LazyImage from './LazyImage';

const MovieCard = ({ movie, onAdd, isAdded, onClick }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="movie-card" onClick={() => onClick && onClick(movie)}>
            <div className="poster-wrapper">
                {movie.Poster !== "N/A" && !imgError ? (
                    <LazyImage
                        src={movie.Poster}
                        alt={movie.Title}
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="no-poster">No Poster</div>
                )}
            </div>
            <div className="content">
                <h3>{movie.Title}</h3>
                <p className="year">{movie.Year}</p>
                <p className="type">{movie.Type}</p>
                {onAdd && (
                    <button
                        className={`add-btn ${isAdded ? 'added' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onAdd(movie);
                        }}
                        disabled={isAdded}
                    >
                        {isAdded ? 'Added' : 'Add to Collection'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default React.memo(MovieCard);
