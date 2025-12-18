import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReviews, addReview, deleteReview } from '../services/api';
import { useToast } from '../context/ToastContext';

const ReviewSection = ({ movieId, movieTitle, onClose, isReadOnly }) => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [hoveredStar, setHoveredStar] = useState(0);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
        loadReviews();
    }, [movieId]);

    const loadReviews = async () => {
        try {
            const data = await getReviews(movieId);
            setReviews(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to review');

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await addReview(token, movieId, rating, comment);
            setComment('');
            setRating(5);
            loadReviews();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId) => {
        try {
            const token = localStorage.getItem('token');
            await deleteReview(token, reviewId);
            addToast('Review deleted successfully', 'success');
            loadReviews();
        } catch (err) {
            if (err.message && err.message.toLowerCase().includes('token')) {
                addToast('Session error. Please login again.', 'error');
            } else {
                addToast(err.message || 'Failed to delete review', 'error');
            }
        }
    };

    const getAvatar = (username) => {
        return username ? username.charAt(0).toUpperCase() : '?';
    };

    return (
        <div className="review-section">
            {/* Review Form */}
            {user && !isReadOnly && (
                <form onSubmit={handleSubmit} className="review-form">
                    <h3>Reviews</h3>
                    <div className="rating-selector">
                        <label>Rating:</label>
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    className={`star ${star <= (hoveredStar || rating) ? 'active' : ''}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredStar(star)}
                                    onMouseLeave={() => setHoveredStar(0)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about this movie..."
                        className="review-textarea"
                        required
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className="post-btn"
                    >
                        {submitting ? 'Posting...' : 'Post Review'}
                    </button>
                    {error && <p style={{ color: '#ff4444', marginTop: '10px' }}>{error}</p>}
                </form>
            )}

            {!user && !isReadOnly && (
                <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '1rem' }}>
                    <p style={{ marginBottom: '10px' }}>Join the community to leave a review!</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="post-btn"
                        style={{ width: 'auto', padding: '8px 20px' }}
                    >
                        Login to Review
                    </button>
                </div>
            )}

            {/* Reviews List */}
            {loading ? (
                <p className="loading">Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem' }}>No reviews yet. Be the first!</p>
            ) : (
                <div className="reviews-list">
                    {reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-avatar">
                                {getAvatar(review.username)}
                            </div>
                            <div className="review-content">
                                <div className="review-header">
                                    <span className="review-author">{review.username}</span>
                                    <span className="review-rating">{'★'.repeat(review.rating)}</span>
                                </div>
                                <p className="review-text">{review.comment}</p>
                                <div className="review-footer">
                                    <span>{new Date(review.created_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                    {user && user.username === review.username && !isReadOnly && (
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="delete-review-btn"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSection;
