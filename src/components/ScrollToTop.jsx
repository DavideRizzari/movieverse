import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Immediate scroll
        window.scrollTo(0, 0);
        document.documentElement.scrollTo(0, 0);
        document.body.scrollTo(0, 0);

        // Delayed scroll to handle mobile browser address bars and layout shifts
        const timeoutId = setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTo(0, 0);
            document.body.scrollTo(0, 0);
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
