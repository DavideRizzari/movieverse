import React from 'react';
import { Link } from 'react-router-dom';

const CookiePolicy = () => {
    return (
        <div className="tos-container" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px', color: 'white' }}>Cookie Policy</h1>

            <div style={{ background: 'rgba(26, 26, 35, 0.9)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>1. What Are Cookies?</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        Cookies are small text files that are stored on your device when you visit a website. In addition to traditional cookies, we use modern storage technologies like Local Storage to save your preferences and login state.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>2. Technical & Essential Technologies</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '10px' }}>
                        We use Local Storage to maintain your session and preferences. These are essential for the website to function correctly:
                    </p>
                    <ul style={{ color: '#ccc', lineHeight: '1.6', paddingLeft: '20px', listStyleType: 'disc' }}>
                        <li style={{ marginBottom: '5px' }}><strong>Authentication Token:</strong> Keeps you logged in securely.</li>
                        <li style={{ marginBottom: '5px' }}><strong>User Preferences:</strong> Remembers your collection settings.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>3. Analytics</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        We use Google Analytics to understand how visitors interact with MovieVerse. This helps us improve the user experience. These tools may collect anonymous data such as pages visited, time spent on the site, and general location data.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>4. Third-Party Content</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        Some content on our site, such as movie posters, is served from third-party sources (e.g., OMDb API). When your browser loads these images, these third parties may receive your IP address, but we do not share your personal data with them.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>5. Managing Your Preferences</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        You can control or delete cookies and clearing Local Storage through your browser settings. However, please note that clearing Local Storage will log you out of your account.
                    </p>
                </section>

                <div style={{ marginTop: '40px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>

                    <Link to="/">
                        <button className="logout-btn" style={{ background: '#b20710', borderColor: '#b20710', width: 'auto', padding: '10px 30px', color: 'white' }}>
                            Back to Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
