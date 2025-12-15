import React, { useState } from 'react';
import { register, login, getSecurityQuestions, resetPassword } from '../services/api';
import { validateEmail } from '../utils/validators';

const Auth = ({ onLogin }) => {
    const [view, setView] = useState('login'); // 'login', 'register', 'recovery-email', 'recovery-questions'
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        securityQuestion1: '',
        securityAnswer1: '',
        securityQuestion2: '',
        securityAnswer2: ''
    });
    const [recoveryData, setRecoveryData] = useState({
        email: '',
        question1: '',
        question2: '',
        answer1: '',
        answer2: '',
        newPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const securityQuestions = [
        "What was the name of your first pet?",
        "What is your mother's maiden name?",
        "What was the make of your first car?",
        "What is the name of the city where you were born?",
        "What is your favorite food?",
        "What is the name of your favorite teacher?"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Email Validation for Register and Recovery
        const emailToValidate = view === 'login' ? null : formData.email;
        // Note: Login usually permits standard formats, strict checks often just on register.
        // But requested issue is specifically about "registration saves wrong email".

        if (view === 'register') {
            const emailValidation = validateEmail(formData.email);
            if (!emailValidation.isValid) {
                setError(emailValidation.error);
                return;
            }
        }

        setLoading(true);

        try {
            if (view === 'login') {
                const response = await login(formData.email, formData.password);
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                onLogin(response.user, response.token);
            } else if (view === 'register') {
                const response = await register(
                    formData.username,
                    formData.email,
                    formData.password,
                    formData.securityQuestion1,
                    formData.securityAnswer1,
                    formData.securityQuestion2,
                    formData.securityAnswer2
                );
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                onLogin(response.user, response.token);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRecoveryEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const questions = await getSecurityQuestions(recoveryData.email);

            if (!questions.question1 || !questions.question2) {
                setError('Account recovery is not set up for this user. Please contact support.');
                return;
            }

            setRecoveryData({ ...recoveryData, ...questions });
            setView('recovery-questions');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRecoveryResetSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await resetPassword(recoveryData.email, recoveryData.answer1, recoveryData.answer2, recoveryData.newPassword);
            setSuccess('Password reset successfully! You can now login.');
            setTimeout(() => {
                setView('login');
                setSuccess('');
                setFormData({ ...formData, email: recoveryData.email, password: '' });
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRecoveryChange = (e) => {
        setRecoveryData({ ...recoveryData, [e.target.name]: e.target.value });
    };

    const renderLoginForm = () => (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Login'}
            </button>
            <div className="auth-links">
                <button type="button" className="link-btn" onClick={() => setView('recovery-email')}>
                    Forgot Password?
                </button>
            </div>
        </form>
    );

    const renderRegisterForm = () => (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
            />

            <div className="security-questions-section">
                <h3>Security Questions</h3>
                <p className="section-desc">Required for password recovery</p>

                <div className="question-group">
                    <select
                        name="securityQuestion1"
                        value={formData.securityQuestion1}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Question 1</option>
                        {securityQuestions.map((q, i) => (
                            <option key={i} value={q}>{q}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="securityAnswer1"
                        placeholder="Answer 1"
                        value={formData.securityAnswer1}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="question-group">
                    <select
                        name="securityQuestion2"
                        value={formData.securityQuestion2}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Question 2</option>
                        {securityQuestions.filter(q => q !== formData.securityQuestion1).map((q, i) => (
                            <option key={i} value={q}>{q}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="securityAnswer2"
                        placeholder="Answer 2"
                        value={formData.securityAnswer2}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : 'Register'}
            </button>
        </form>
    );

    const renderRecoveryEmailForm = () => (
        <form onSubmit={handleRecoveryEmailSubmit}>
            <p className="section-desc">Enter your email address to recover your password.</p>
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={recoveryData.email}
                onChange={handleRecoveryChange}
                required
            />
            <button type="submit" className="auth-action-btn primary" disabled={loading}>
                {loading ? 'Checking...' : 'Next'}
            </button>
            <button type="button" className="auth-action-btn secondary" onClick={() => setView('login')}>
                Back to Login
            </button>
        </form>
    );

    const renderRecoveryQuestionsForm = () => (
        <form onSubmit={handleRecoveryResetSubmit}>
            <p>Answer your security questions to reset your password.</p>

            <div className="question-group">
                <label>{recoveryData.question1}</label>
                <input
                    type="text"
                    name="answer1"
                    placeholder="Answer"
                    value={recoveryData.answer1}
                    onChange={handleRecoveryChange}
                    required
                />
            </div>

            <div className="question-group">
                <label>{recoveryData.question2}</label>
                <input
                    type="text"
                    name="answer2"
                    placeholder="Answer"
                    value={recoveryData.answer2}
                    onChange={handleRecoveryChange}
                    required
                />
            </div>

            <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={recoveryData.newPassword}
                onChange={handleRecoveryChange}
                required
                minLength="6"
            />

            <button type="submit" className="auth-action-btn primary" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button type="button" className="auth-action-btn secondary" onClick={() => setView('login')}>
                Cancel
            </button>
        </form>
    );

    return (
        <div className="auth-container">
            <div className={`auth-box ${view.startsWith('recovery') ? 'auth-recovery' : ''}`}>
                <h1>Movie<span className="highlight">Verse</span></h1>
                <h2>
                    {view === 'login' && 'Welcome Back'}
                    {view === 'register' && 'Create Account'}
                    {view.startsWith('recovery') && 'Password Recovery'}
                </h2>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                {view === 'login' && renderLoginForm()}
                {view === 'register' && renderRegisterForm()}
                {view === 'recovery-email' && renderRecoveryEmailForm()}
                {view === 'recovery-questions' && renderRecoveryQuestionsForm()}

                {(view === 'login' || view === 'register') && (
                    <p className="auth-toggle">
                        {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={() => {
                            setView(view === 'login' ? 'register' : 'login');
                            setError('');
                            setSuccess('');
                        }}>
                            {view === 'login' ? 'Register' : 'Login'}
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Auth;
