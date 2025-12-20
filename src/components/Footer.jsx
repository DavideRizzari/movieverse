import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section brand">
                    <h2>Movie<span className="highlight">Verse</span></h2>
                    <p>Your ultimate destination for movie discovery, tracking, and sharing. Join our community of film enthusiasts.</p>

                </div>

                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/search">Search</Link></li>
                        <li><Link to="/trending">Trending</Link></li>
                        <li><Link to="/collection">My Collection</Link></li>
                    </ul>
                </div>

                <div className="footer-section legal">
                    <h3>Legal</h3>
                    <ul>
                        {/* Placeholder links for legal pages */}
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li>
                    </ul>
                    <div style={{ marginTop: '20px' }}>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '5px', fontSize: '0.9rem' }}>Support</h4>
                        <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>movieversehelp@gmail.com</p>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} MovieVerse. All rights reserved.</p>
                <p className="made-with">Made with <span style={{ color: '#e50914' }}>❤</span> for movie lovers</p>
            </div>
        </footer>
    );
};

export default Footer;
