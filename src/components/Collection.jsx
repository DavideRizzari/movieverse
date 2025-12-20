import React from 'react';
import MovieCard from './MovieCard';

const Collection = ({ collection, onMovieClick, onRemove, setActiveTab }) => {
    const [copied, setCopied] = React.useState(false);

    const handleShare = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        const url = `${window.location.origin}/?view_collection=${user.username}`;
        navigator.clipboard.writeText(url);

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="collection-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 className="collection-title">My Collection <span className="collection-count">({collection.length})</span></h2>
                <button
                    className={`share-btn ${copied ? 'copied' : ''}`}
                    onClick={handleShare}
                >
                    <span style={{ fontSize: '1.1rem', position: 'relative', zIndex: 2 }}>{copied ? '✓' : '🔗'}</span>
                    <span style={{ position: 'relative', zIndex: 2 }}>{copied ? 'Link Copied!' : 'Share Collection'}</span>
                </button>
            </div>
            <div className="grid">
                {collection.map(movie => (
                    <div key={movie.imdbID} className="collection-item">
                        <MovieCard movie={movie} onClick={onMovieClick} />
                        <button
                            className="remove-btn"
                            onClick={() => onRemove(movie.imdbID)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>
            {collection.length === 0 && (
                <div className="empty-state">
                    <p>Your collection is empty.</p>
                    <button onClick={() => setActiveTab('search')}>Start Searching</button>
                </div>
            )}
        </section>
    );
};

export default Collection;
