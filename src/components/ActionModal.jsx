import React, { useEffect } from 'react';

const ActionModal = ({ title, message, onConfirm, confirmText = "Confirm", onClose, isDestructive = false }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div className="action-modal-overlay" onClick={onClose}>
            <div className={`action-modal-content ${isDestructive ? 'destructive' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="action-icon-container">
                    {isDestructive ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    )}
                </div>

                <div className="action-modal-header">
                    <h2>{title}</h2>
                </div>

                <div className="action-modal-body">
                    <p>{message}</p>
                </div>

                <div className="action-modal-footer">
                    <button className="action-cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="action-confirm-btn" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionModal;
