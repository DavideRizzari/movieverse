import React, { useState, useEffect } from 'react';
import { getSecurityQuestions, resetPassword } from '../services/api';

function ChangePasswordModal({ user, onClose, onChangePassword }) {
    const [method, setMethod] = useState('password'); // 'password' or 'questions'
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Security Questions State
    const [questions, setQuestions] = useState({ question1: '', question2: '' });
    const [answers, setAnswers] = useState({ answer1: '', answer2: '' });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (method === 'questions' && user?.email) {
            setLoading(true);
            getSecurityQuestions(user.email)
                .then(data => {
                    setQuestions(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError('Failed to load security questions. Please use current password.');
                    setMethod('password');
                    setLoading(false);
                });
        }
    }, [method, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!newPassword || !confirmPassword) {
            setError('New password fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            if (method === 'password') {
                if (!currentPassword) {
                    setError('Current password is required');
                    setLoading(false);
                    return;
                }
                await onChangePassword(currentPassword, newPassword);
            } else {
                if (!answers.answer1 || !answers.answer2) {
                    setError('All security questions must be answered');
                    setLoading(false);
                    return;
                }
                await resetPassword(user.email, answers.answer1, answers.answer2, newPassword);
            }
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="password-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                <h2>Change Password</h2>

                <div className={`method-toggle mode-${method}`}>
                    <div className="toggle-slider"></div>
                    <button
                        className={`toggle-btn ${method === 'password' ? 'active' : ''}`}
                        onClick={() => setMethod('password')}
                    >
                        Use Current Password
                    </button>
                    <button
                        className={`toggle-btn ${method === 'questions' ? 'active' : ''}`}
                        onClick={() => setMethod('questions')}
                    >
                        Use Security Questions
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {method === 'password' ? (
                        <div className="form-group">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                required
                            />
                        </div>
                    ) : (
                        <div className="security-questions-form">
                            <div className="form-group">
                                <label>{questions.question1 || 'Loading question...'}</label>
                                <input
                                    type="text"
                                    value={answers.answer1}
                                    onChange={(e) => setAnswers({ ...answers, answer1: e.target.value })}
                                    placeholder="Answer"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>{questions.question2 || 'Loading question...'}</label>
                                <input
                                    type="text"
                                    value={answers.answer2}
                                    onChange={(e) => setAnswers({ ...answers, answer2: e.target.value })}
                                    placeholder="Answer"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                        />
                    </div>

                    <div className="password-modal-actions">
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Processing...' : 'Change Password'}
                        </button>
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordModal;
