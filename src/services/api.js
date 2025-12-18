const API_URL = '/api';

const handleResponse = async (response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }
        return data;
    } else {
        // Handle non-JSON response (likely an empty 200 OK or a raw error text)
        const text = await response.text();
        if (!response.ok) {
            throw new Error(text || 'Request failed');
        }
        // If success but no JSON (e.g. empty 200 OK), return null or empty object
        return text ? { message: text } : {};
    }
};

export const register = async (username, email, password, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username,
            email,
            password,
            securityQuestion1,
            securityAnswer1,
            securityQuestion2,
            securityAnswer2
        })
    });
    return handleResponse(response);
};

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
};

export const getCollection = async (token) => {
    const response = await fetch(`${API_URL}/collection`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const addToCollection = async (token, movie) => {
    const response = await fetch(`${API_URL}/collection`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movie })
    });
    return handleResponse(response);
};


export const removeFromCollection = async (token, movieId) => {
    const response = await fetch(`${API_URL}/collection/${movieId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const updateProfile = async (token, profileData) => {
    const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
    });
    return handleResponse(response);
};

export const changePassword = async (token, currentPassword, newPassword) => {
    const response = await fetch(`${API_URL}/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
    });
    return handleResponse(response);
};

export const getDirectors = async () => {
    const response = await fetch(`${API_URL}/directors`);
    return handleResponse(response);
};

// Reviews
export const getReviews = async (movieId) => {
    const response = await fetch(`${API_URL}/reviews/${movieId}`);
    return handleResponse(response);
};

export const addReview = async (token, movieId, rating, comment) => {
    const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ movieId, rating, comment })
    });
    return handleResponse(response);
};

export const deleteReview = async (token, reviewId) => {
    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

// Public Collection
export const getPublicCollection = async (username) => {
    const response = await fetch(`${API_URL}/collections/public/${username}`);
    return handleResponse(response);
};


// Password Recovery
export const getSecurityQuestions = async (email) => {
    const response = await fetch(`${API_URL}/security-questions/${email}`);
    return handleResponse(response);
};

export const resetPassword = async (email, answer1, answer2, newPassword) => {
    const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, answer1, answer2, newPassword })
    });
    return handleResponse(response);
};
