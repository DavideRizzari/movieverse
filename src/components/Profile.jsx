import React, { useState } from 'react';
import ChangePasswordModal from './ChangePasswordModal';

const GENRES = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama',
    'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller',
    'Western', 'Documentary', 'Musical', 'War', 'Biography', 'History'
];

function Profile({ user, onUpdateProfile, onChangePassword, onLogout }) {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [selectedGenres, setSelectedGenres] = useState(user.preferred_genres || []);
    const [favoriteDirectors, setFavoriteDirectors] = useState(user.favorite_directors || '');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [availableDirectors, setAvailableDirectors] = useState([]);
    const [directorSuggestions, setDirectorSuggestions] = useState([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    React.useEffect(() => {
        import('../services/api').then(api => {
            api.getDirectors().then(data => {
                setAvailableDirectors(data || []);
            }).catch(err => console.error("Failed to fetch directors", err));
        });
    }, []);

    const toggleGenre = (genre) => {
        setSelectedGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleSave = async () => {
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const updateData = {
                username,
                email,
                preferred_genres: selectedGenres,
                favorite_directors: favoriteDirectors
            };

            await onUpdateProfile(updateData);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (currentPassword, newPassword) => {
        setMessage('');
        setError('');

        try {
            await onChangePassword(currentPassword, newPassword);
            setMessage('Password changed successfully!');
        } catch (err) {
            throw err;
        }
    };

    return (
        <section className="profile-section">
            <h2>User Profile</h2>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="profile-form">
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        disabled
                        className="disabled-input"
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="disabled-input"
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <button
                        type="button"
                        className="change-password-btn"
                        onClick={() => setShowPasswordModal(true)}
                    >
                        Change Password
                    </button>
                </div>

                <div className="form-group" style={{ position: 'relative' }}>
                    <label>Favorite Directors (comma-separated)</label>
                    <input
                        type="text"
                        value={favoriteDirectors}
                        onChange={(e) => {
                            setFavoriteDirectors(e.target.value);
                            const value = e.target.value;
                            const lastCommaIndex = value.lastIndexOf(',');
                            const currentSegment = value.substring(lastCommaIndex + 1).trim().toLowerCase();

                            if (currentSegment.length > 1) {
                                const matches = availableDirectors.filter(d =>
                                    d.toLowerCase().includes(currentSegment) &&
                                    !value.toLowerCase().includes(d.toLowerCase())
                                ).slice(0, 5);
                                setDirectorSuggestions(matches);
                            } else {
                                setDirectorSuggestions([]);
                            }
                        }}
                        onBlur={() => setTimeout(() => setDirectorSuggestions([]), 200)}
                        placeholder="e.g. Christopher Nolan, Quentin Tarantino"
                        autoComplete="off"
                    />
                    {directorSuggestions.length > 0 && (
                        <div className="suggestions-dropdown" style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(26, 26, 35, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '0 0 12px 12px',
                            zIndex: 100,
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                            marginTop: '5px'
                        }}>
                            {directorSuggestions.map((director, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        const lastCommaIndex = favoriteDirectors.lastIndexOf(',');
                                        const prefix = lastCommaIndex !== -1 ? favoriteDirectors.substring(0, lastCommaIndex + 1) : '';
                                        const newValue = prefix + (prefix ? ' ' : '') + director + ', ';
                                        setFavoriteDirectors(newValue);
                                        setDirectorSuggestions([]);
                                    }}
                                    style={{
                                        padding: '10px 15px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                        color: 'white'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    {director}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Preferred Genres</label>
                    <div className="genre-grid">
                        {GENRES.map(genre => (
                            <button
                                key={genre}
                                className={`genre-tag ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                                onClick={() => toggleGenre(genre)}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="save-btn" onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button className="logout-btn-profile" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {showPasswordModal && (
                <ChangePasswordModal
                    user={user}
                    onClose={() => setShowPasswordModal(false)}
                    onChangePassword={handlePasswordChange}
                />
            )}
        </section>
    );
}

export default Profile;
