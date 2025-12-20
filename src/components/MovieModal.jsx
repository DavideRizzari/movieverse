import React, { useEffect, useState } from 'react';
import { getStreamingAvailability } from '../services/streaming';
import LazyImage from './LazyImage';

import ReviewSection from './ReviewSection';

const MovieModal = ({ movie, onClose, onAdd, isAdded, isReadOnly }) => {
    const [imgError, setImgError] = React.useState(false);
    const [streamingData, setStreamingData] = useState(null);
    const [loadingStreaming, setLoadingStreaming] = useState(false);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    useEffect(() => {
        const fetchStreaming = async () => {
            if (movie?.imdbID) {
                setLoadingStreaming(true);
                try {
                    const data = await getStreamingAvailability(movie.imdbID);
                    setStreamingData(data);
                } catch (error) {
                    console.error("Failed to fetch streaming data", error);
                    setStreamingData(null);
                } finally {
                    setLoadingStreaming(false);
                }
            }
        };
        fetchStreaming();
    }, [movie]);

    if (!movie) return null;

    // Helper to get unique streaming services with fallback logic
    const getStreamingServices = () => {
        const emptyResult = { services: [], country: null };
        if (!streamingData || !streamingData.streamingOptions) return emptyResult;

        // Priority order: Italy, France, Spain, Germany, UK, US
        const countryPriority = ['it', 'fr', 'es', 'de', 'gb', 'us'];
        let selectedCountry = null;
        let allServices = [];

        // Try to find first available country from priority list
        for (const country of countryPriority) {
            if (streamingData.streamingOptions[country] && streamingData.streamingOptions[country].length > 0) {
                selectedCountry = country;
                allServices = streamingData.streamingOptions[country];
                break;
            }
        }

        // If none of the priority countries have data, use any available country
        if (!selectedCountry) {
            const availableCountries = Object.keys(streamingData.streamingOptions);
            if (availableCountries.length > 0) {
                selectedCountry = availableCountries[0];
                allServices = streamingData.streamingOptions[selectedCountry];
            }
        }

        if (allServices.length === 0) return emptyResult;

        // Remove duplicates by keeping only the first occurrence of each service.id
        const uniqueServices = [];
        const seenServiceIds = new Set();

        for (const service of allServices) {
            if (!seenServiceIds.has(service.service.id)) {
                seenServiceIds.add(service.service.id);
                uniqueServices.push(service);
            }
        }

        return { services: uniqueServices, country: selectedCountry };
    };

    const streamingResult = getStreamingServices();
    const streamingServices = streamingResult.services || [];
    const displayCountry = streamingResult.country;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                <div className="modal-body">
                    <div className="media-column">
                        <div className="modal-poster">
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
                    </div>

                    <div className="modal-info">
                        <h2>{movie.Title}</h2>
                        <div className="meta">
                            <span className="year">{movie.Year}</span>
                            <span className="rated">{movie.Rated}</span>
                            <span className="runtime">{movie.Runtime}</span>
                        </div>

                        {movie.imdbRating && (
                            <div className="rating">
                                <span className="imdb-badge">IMDb</span>
                                <span className="score">{movie.imdbRating}/10</span>
                            </div>
                        )}

                        <div className="section">
                            <h3>Plot</h3>
                            <p>{movie.Plot || 'No plot available'}</p>
                        </div>

                        {movie.Genre && (
                            <div className="section">
                                <h3>Genre</h3>
                                <p>{movie.Genre}</p>
                            </div>
                        )}

                        {movie.Director && (
                            <div className="section">
                                <h3>Director</h3>
                                <p>{movie.Director}</p>
                            </div>
                        )}

                        {movie.Actors && (
                            <div className="section">
                                <h3>Cast</h3>
                                <p>{movie.Actors}</p>
                            </div>
                        )}

                        {/* Streaming Section - Moved here */}
                        <div className="streaming-section">
                            <h3 className="streaming-title">
                                Where to Watch {displayCountry && `(${displayCountry.toUpperCase()})`}
                            </h3>
                            {loadingStreaming ? (
                                <div className="streaming-loading">Checking availability...</div>
                            ) : streamingServices.length > 0 ? (
                                <div className="streaming-grid">
                                    {streamingServices.map((service, index) => (
                                        <a
                                            key={index}
                                            href={service.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="streaming-service"
                                        >
                                            <div className="service-logo">
                                                {service.service.imageSet?.darkThemeImage ? (
                                                    <img
                                                        src={service.service.imageSet.darkThemeImage}
                                                        alt={service.service.name}
                                                    />
                                                ) : (
                                                    <div className="service-fallback">
                                                        {service.service.id.toUpperCase().substring(0, 4)}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="service-name">{service.service.name}</span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="streaming-unavailable">Not available for streaming</div>
                            )}
                        </div>

                        {onAdd && !isReadOnly && (
                            <button
                                className={`modal-add-btn ${isAdded ? 'added' : ''}`}
                                onClick={() => onAdd(movie)}
                                disabled={isAdded}
                            >
                                {isAdded ? '✓ Added' : '+ Add to Collection'}
                            </button>
                        )}

                        {/* Trailer and Cast buttons - Moved here */}
                        <div className="modal-actions">
                            <a
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + " official trailer " + movie.Year)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="modal-action-btn"
                            >
                                <span className="action-icon">▶</span>
                                <span>Trailer</span>
                            </a>
                            <a
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + " cast interviews")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="modal-action-btn"
                            >
                                <span className="action-icon">🎬</span>
                                <span>Interviews</span>
                            </a>
                        </div>

                        <ReviewSection
                            movieId={movie.imdbID}
                            movieTitle={movie.Title}
                            onClose={onClose}
                            isReadOnly={isReadOnly}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieModal;
