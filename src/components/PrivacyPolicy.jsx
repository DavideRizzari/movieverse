import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-container" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px', color: 'white' }}>Privacy Policy</h1>

            <div style={{ background: 'rgba(26, 26, 35, 0.9)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>1. Data Controller</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        The data controller for this website is <strong>MovieVerse</strong>.<br />
                        Email: <a href="mailto:movieversehelp@gmail.com" style={{ color: '#b20710' }}>movieversehelp@gmail.com</a>
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>2. Types of Data Collected</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '10px' }}>
                        We collect the following types of information:
                    </p>
                    <ul style={{ color: '#ccc', lineHeight: '1.6', paddingLeft: '20px' }}>
                        <li><strong>Personal Data:</strong> Username and Email address (collected only during registration for login purposes).</li>
                        <li><strong>Usage Data:</strong> Anonymous information about how you navigate and use the site, collected via Google Analytics.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>3. Purpose of Processing</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        Your data is processed to:
                    </p>
                    <ul style={{ color: '#ccc', lineHeight: '1.6', paddingLeft: '20px' }}>
                        <li>Provide and maintain the MovieVerse service (authentication, collections).</li>
                        <li>Monitor the usage of our service to improve user experience (via Google Analytics).</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>4. Data Storage and Security</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        Your personal data is stored securely in our database. We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>5. Third-Party Services</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        We use <strong>Google Analytics</strong> to analyze website traffic. Google Analytics may collect data such as your IP address, browser type, and pages visited. This data is anonymized and used solely for statistical purposes.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>6. User Rights</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        You have the right to access, rectify, or delete your personal data. If you wish to delete your account and all associated data, please contact us at <a href="mailto:movieversehelp@gmail.com" style={{ color: '#b20710' }}>movieversehelp@gmail.com</a>.
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

export default PrivacyPolicy;
