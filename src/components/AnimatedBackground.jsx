import React from 'react';

const AnimatedBackground = () => {
    return (
        <div className="animated-background">
            <div className="grid-overlay"></div>
            <svg className="curved-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path className="curve-line line-1" d="M0,50 Q25,30 50,50 T100,50" />
                <path className="curve-line line-2" d="M0,70 Q25,50 50,70 T100,70" />
                <path className="curve-line line-3" d="M0,30 Q25,10 50,30 T100,30" />
            </svg>
        </div>
    );
};

export default AnimatedBackground;
