import React, { useEffect, useState } from 'react';

const Toast = ({ id, message, type, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Start exit animation shortly before removal would happen naturally
        // This logic relies on the parent handling the actual removal timeout
        return () => { };
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onRemove(id);
        }, 300); // Match animation duration
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <span style={{ color: '#4caf50', fontSize: '1.2rem' }}>✓</span>;
            case 'error':
                return <span style={{ color: '#f44336', fontSize: '1.2rem' }}>✕</span>;
            case 'info':
            default:
                return <span style={{ color: '#2196f3', fontSize: '1.2rem' }}>ℹ</span>;
        }
    };

    return (
        <div
            className={`toast-item toast-${type} ${isExiting ? 'toast-exit' : 'toast-enter'}`}
            role="alert"
        >
            <div className="toast-icon">{getIcon()}</div>
            <div className="toast-content">{message}</div>
            <button className="toast-close" onClick={handleClose}>×</button>
        </div>
    );
};

export default Toast;
