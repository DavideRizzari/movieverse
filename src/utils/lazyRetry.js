import React from 'react';

// Utility to retry lazy imports
export const lazyRetry = (componentImport) => {
    return React.lazy(async () => {
        try {
            return await componentImport();
        } catch (error) {
            console.error("Lazy load failed, retrying...", error);
            // Retry page load (force refresh) if chunk fails
            // This is a nuclear option for chunk loading errors
            if (error.name === 'ChunkLoadError') {
                window.location.reload();
            }
            throw error;
        }
    });
};
