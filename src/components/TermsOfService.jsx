import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
    return (
        <div className="tos-container" style={{ paddingTop: '100px', paddingBottom: '60px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px', color: 'white' }}>Terms of Service</h1>

            <div style={{ background: 'rgba(26, 26, 35, 0.9)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>1. Acceptance of Terms</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        By accessing and using MovieVerse ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>2. Use of Service</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6', marginBottom: '10px' }}>
                        MovieVerse provides a platform for discovering movies, tracking personal collections, and viewing streaming availability. You agree to use the Service only for lawful purposes and in accordance with these Terms.
                    </p>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>3. User Content</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        Users may post reviews and comments. You retain ownership of your content, but you grant MovieVerse a non-exclusive license to display and distribute it on the platform. We reserve the right to remove content found to be offensive, illegal, or violating these Terms.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>4. Intellectual Property</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        The Service and its original content are owned by MovieVerse and are protected by international copyright laws. Movie data and images are provided by third-party APIs (e.g., OMDb) and are subject to their respective licenses.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>5. Limitation of Liability</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        MovieVerse is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Service or reliance on any information provided.
                    </p>
                </section>

                <section style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', color: 'white' }}>6. Changes to Terms</h2>
                    <p style={{ color: '#ccc', lineHeight: '1.6' }}>
                        We reserve the right to modify these terms at any time. Your continued use of the Service following any changes indicates your acceptance of the new Terms of Service.
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

export default TermsOfService;
