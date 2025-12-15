import React, { useState } from 'react';

const LazyImage = ({ src, alt, className, onError, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                background: isLoaded ? 'transparent' : 'linear-gradient(135deg, #1a1a23, #2a2a35)',
                overflow: 'hidden'
            }}
        >
            <img
                src={src}
                alt={alt}
                className={className}
                loading="lazy" // Native lazy loading
                onLoad={handleLoad}
                onError={onError}
                style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.4s ease-out',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    ...props.style,
                }}
                {...props}
            />
            {!isLoaded && (
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(178, 7, 16, 0.2)',
                        borderTop: '3px solid var(--accent)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }}
                />
            )}
        </div>
    );
};

export default LazyImage;
