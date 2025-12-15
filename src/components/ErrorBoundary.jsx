import React from 'react';
import "../index.css";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="error-boundary-container" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    color: '#fff',
                    textAlign: 'center',
                    padding: '20px'
                }}>
                    <h2 style={{ color: 'var(--accent, #e50914)', marginBottom: '20px' }}>Something went wrong.</h2>
                    <p style={{ marginBottom: '20px', color: '#ccc' }}>
                        We're sorry, but an unexpected error has occurred.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '10px 20px',
                            fontSize: '1rem',
                            backgroundColor: 'var(--accent, #e50914)',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        Reload Page
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <details style={{ marginTop: '30px', textAlign: 'left', whiteSpace: 'pre-wrap', color: '#888', maxWidth: '800px' }}>
                            <summary>Error Details</summary>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
