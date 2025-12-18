import React, { useEffect, useRef } from 'react';

const Home = ({ setActiveTab, loadTrending }) => {
    const aboutRef = useRef(null);
    const featuresRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (aboutRef.current) {
            observer.observe(aboutRef.current);
        }

        if (featuresRef.current) {
            observer.observe(featuresRef.current);
        }

        return () => {
            if (aboutRef.current) {
                observer.unobserve(aboutRef.current);
            }
            if (featuresRef.current) {
                observer.unobserve(featuresRef.current);
            }
        };
    }, []);

    return (
        <section className="home-section">
            <div className="hero">
                <h2>Welcome to MovieVerse</h2>
                <p className="tagline">Discover, Collect, Experience</p>
            </div>

            <div className="about" ref={aboutRef}>
                <div className="about-content">
                    <div className="about-item">
                        <h3>Who We Are</h3>
                        <p>
                            MovieVerse is a sanctuary for cinema lovers. We bridge the gap between you and the silver screen,
                            offering a seamless gateway to millions of stories, from timeless classics to the latest blockbusters.
                            We are dedicated to bringing the magic of movies directly to your fingertips.
                        </p>
                    </div>

                    <div className="about-item">
                        <h3>What We Do</h3>
                        <p>
                            We transform how you experience entertainment. Dive into detailed insights, uncover hidden gems,
                            and curate your personal anthology. Whether you're a casual viewer or a dedicated cinephile,
                            MovieVerse empowers your journey through the cinematic universe.
                        </p>
                    </div>
                </div>
            </div>

            <div className="features" ref={featuresRef}>
                <div className="feature-card" onClick={() => setActiveTab('search')}>
                    <h4>🔍 Search</h4>
                    <p>Navigate a vast galaxy of titles with precision</p>
                </div>
                <div className="feature-card" onClick={() => setActiveTab('collection')}>
                    <h4>📚 Collect</h4>
                    <p>Build your personal library of masterpieces</p>
                </div>
                <div className="feature-card" onClick={() => { setActiveTab('trending'); loadTrending(); }}>
                    <h4>⭐ Discover</h4>
                    <p>Stay ahead with trending and popular hits</p>
                </div>
            </div>
        </section>
    );
};

export default Home;
