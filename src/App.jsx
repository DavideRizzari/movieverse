import React, { useEffect, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, Link, NavLink, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useCollection } from './hooks/useCollection';
import { useMovies } from './hooks/useMovies';
import MovieModal from './components/MovieModal';
import ActionModal from './components/ActionModal';
import AnimatedBackground from './components/AnimatedBackground';
import LazyImage from './components/LazyImage';
import ScrollToTop from './components/ScrollToTop';
import { trackSearch, trackMovieView, trackLogin, trackAddToCollection } from './utils/analytics';
import { lazyRetry } from './utils/lazyRetry';
import './App.css';

const Home = lazyRetry(() => import('./components/Home'));
const Search = lazyRetry(() => import('./components/Search'));
const Collection = lazyRetry(() => import('./components/Collection'));
const Trending = lazyRetry(() => import('./components/Trending'));
const Profile = lazyRetry(() => import('./components/Profile'));
const Auth = lazyRetry(() => import('./components/Auth'));
const TermsOfService = lazyRetry(() => import('./components/TermsOfService'));
const CookiePolicy = lazyRetry(() => import('./components/CookiePolicy'));
const PrivacyPolicy = lazyRetry(() => import('./components/PrivacyPolicy'));
const Footer = lazyRetry(() => import('./components/Footer'));

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Custom Hooks
  const {
    user,
    token,
    loading: authLoading, // Replay rename
    logoutMessage, // Keep for forced token expiries
    setLogoutMessage,
    handleLogin,
    handleLogout,
    handleUpdateProfile,
    handleChangePassword
  } = useAuth();


  const handleAuthError = React.useCallback((error) => {
    if (error.message === 'Invalid or expired token' || error.message === 'Access token required') {
      handleLogout();
      // Use ActionModal for session expiry
      setActionModal({
        title: "Session Expired",
        message: "Your session has expired. Please login again.",
        confirmText: "Login",
        onConfirm: () => {
          setActionModal(null);
          navigate('/login');
        },
        onClose: () => setActionModal(null)
      });
    } else {
      console.error('API Error:', error);
    }
  }, [handleLogout, navigate]);

  const {
    collection,
    sharedCollection,
    sharedUsername,
    addItem,
    removeItem,
    isInCollection
  } = useCollection(token, handleAuthError);

  const {
    query, setQuery,
    results,
    trending,
    suggestions,
    showSuggestions, setShowSuggestions,
    loading: moviesLoading,
    selectedMovie, setSelectedMovie,
    loadTrending,
    performSearch,
    handleMovieClick
  } = useMovies(user);

  // Sync route with loading data
  useEffect(() => {
    if ((location.pathname === '/' || location.pathname === '/trending') && trending.length === 0 && !moviesLoading) {
      loadTrending();
    }
  }, [location.pathname, trending.length, loadTrending, moviesLoading]);

  // Redirect to /shared when shared collection is loaded via legacy query param
  useEffect(() => {
    if (sharedCollection && location.pathname !== '/shared') {
      navigate('/shared');
    }
  }, [sharedCollection, location.pathname, navigate]);


  // Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (!query) return;
    trackSearch(query); // Track search event
    navigate('/search');
    performSearch(query);
  };

  const handleSuggestionClick = (movie) => {
    setQuery(movie.Title);
    setShowSuggestions(false);
    trackMovieView(movie.Title, movie.imdbID); // Track movie view from suggestion
    handleMovieClick(movie);
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (path === '/trending') loadTrending();
  };

  // Action Modal State
  const [actionModal, setActionModal] = React.useState(null);

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Wrapper for sensitive actions
  const handleRestrictedAction = (action, pendingData = null) => {
    // Save state
    localStorage.setItem('returnPath', location.pathname);
    if (pendingData) {
      localStorage.setItem('pendingMovie', JSON.stringify(pendingData));
    }

    // Close current movie modal if open
    setSelectedMovie(null);

    // Show custom modal
    setActionModal({
      title: "Login Required",
      message: "You need to log in to add movies to your collection.",
      confirmText: "Go to Login",
      onConfirm: () => {
        setActionModal(null);
        navigate('/login');
      },
      onClose: () => setActionModal(null)
    });
  };

  const handleAddItem = (movie) => {
    if (!user) {
      handleRestrictedAction('add', movie);
      return;
    }
    trackAddToCollection(movie.Title, 'My Collection'); // Track add to collection
    addItem(movie);
  };

  // Direct Logout
  const handleDirectLogout = () => {
    handleLogout();
    navigate('/');
  };

  // Watch for logoutMessage (forced logouts from hook)
  useEffect(() => {
    if (logoutMessage) {
      setActionModal({
        title: "Session Expired",
        message: logoutMessage,
        confirmText: "Login",
        onConfirm: () => {
          setLogoutMessage(null);
          setActionModal(null);
          navigate('/login');
        },
        onClose: () => {
          setLogoutMessage(null);
          setActionModal(null);
        }
      });
    }
  }, [logoutMessage, setLogoutMessage, navigate]);

  // Login Success Handler (Restore state)
  const onLoginSuccess = () => {
    const returnPath = localStorage.getItem('returnPath');
    const pendingMovie = localStorage.getItem('pendingMovie');

    if (returnPath) {
      navigate(returnPath);
      localStorage.removeItem('returnPath');
    } else {
      navigate('/');
    }

    if (pendingMovie) {
      try {
        const movie = JSON.parse(pendingMovie);
        // Small delay to allow navigation to complete
        setTimeout(() => {
          setSelectedMovie(movie);
        }, 100);
        localStorage.removeItem('pendingMovie');
      } catch (e) {
        console.error("Failed to restore pending movie", e);
      }
    }
  };

  // Global Loading State - Render Check AFTER all hooks
  if (authLoading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="app-container" onClick={() => setShowSuggestions(false)}>
      <ScrollToTop />
      <AnimatedBackground />

      {/* Modals */}
      {actionModal && (
        <ActionModal
          title={actionModal.title}
          message={actionModal.message}
          onConfirm={actionModal.onConfirm}
          confirmText={actionModal.confirmText}
          onClose={actionModal.onClose}
          isDestructive={actionModal.isDestructive}
        />
      )}



      {location.pathname !== '/shared' && location.pathname !== '/login' && (
        <header>
          {/* Mobile Hamburger Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className="logo-container" onClick={() => navigate('/')}>
            <h1>Movie<span className="highlight">Verse</span></h1>
          </div>

          <div className="search-container" style={{ position: 'relative', flex: 1, maxWidth: '600px' }}>
            <form onSubmit={handleSearch} className="search-bar" style={{ maxWidth: '100%' }}>
              <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <button type="submit">Search</button>
            </form>
            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown" style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'rgba(26, 26, 35, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0 0 12px 12px',
                zIndex: 1000,
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                marginTop: '5px',
                overflow: 'hidden'
              }}>
                {suggestions.map(movie => (
                  <div
                    key={movie.imdbID}
                    className="suggestion-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSuggestionClick(movie);
                    }}
                    style={{
                      padding: '10px 15px',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {movie.Poster !== "N/A" && (
                      <img
                        src={movie.Poster}
                        alt=""
                        style={{ width: '30px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                    <div>
                      <div style={{ color: 'white', fontWeight: '500' }}>{movie.Title}</div>
                      <div style={{ color: '#aaa', fontSize: '0.8rem' }}>{movie.Year}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="user-info">
            {user ? (
              <>
                <span>Welcome, {user.username}!</span>
                <button onClick={handleDirectLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <button onClick={() => navigate('/login')} className="logout-btn login-btn">Login / Register</button>
            )}
          </div>
        </header>
      )}

      {location.pathname !== '/shared' && location.pathname !== '/login' && (
        <>
          {/* Desktop Navigation */}
          <nav className="main-nav desktop-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} end>
              Home
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              Search Movies
            </NavLink>
            {user && (
              <NavLink to="/collection" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                My Collection
              </NavLink>
            )}
            <NavLink
              to="/trending"
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              onClick={() => loadTrending()}
            >
              Trending
            </NavLink>
            {user && (
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                Profile
              </NavLink>
            )}
            <a
              href="https://pay.sumup.com/b2c/QA19ABX9"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'flex' }}
            >
              <button className="donation-btn">
                Donate
              </button>
            </a>
          </nav>

          {/* Mobile Navigation Drawer */}
          <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}>
            <nav className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="mobile-nav-header">
                <h2>Menu</h2>
                <button className="mobile-nav-close" onClick={() => setMobileMenuOpen(false)}>
                  ✕
                </button>
              </div>
              <div className="mobile-nav-links">
                <NavLink
                  to="/"
                  className={({ isActive }) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}
                  end
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🏠 Home
                </NavLink>
                <NavLink
                  to="/search"
                  className={({ isActive }) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔍 Search Movies
                </NavLink>
                {user && (
                  <NavLink
                    to="/collection"
                    className={({ isActive }) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    📚 My Collection
                  </NavLink>
                )}
                <NavLink
                  to="/trending"
                  className={({ isActive }) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}
                  onClick={() => { loadTrending(); setMobileMenuOpen(false); }}
                >
                  🔥 Trending
                </NavLink>
                {user && (
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => isActive ? 'mobile-nav-item active' : 'mobile-nav-item'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    👤 Profile
                  </NavLink>
                )}
                <a
                  href="https://pay.sumup.com/b2c/QA19ABX9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-nav-item donation"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  💝 Donate
                </a>
              </div>
            </nav>
          </div>
        </>
      )}

      <main>
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          <Routes>
            <Route
              path="/login"
              element={
                !user ? (
                  <Auth onLogin={(u, t) => {
                    trackLogin(); // Track successful login
                    handleLogin(u, t);
                    onLoginSuccess();
                  }} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/search"
              element={
                <Search
                  loading={moviesLoading}
                  results={results}
                  onAdd={handleAddItem}
                  isInCollection={isInCollection}
                  onMovieClick={handleMovieClick}
                />
              }
            />
            <Route
              path="/collection"
              element={
                user ? (
                  <Collection
                    collection={collection}
                    onMovieClick={handleMovieClick}
                    onRemove={removeItem}
                    setActiveTab={(tab) => handleNavClick('/' + (tab === 'home' ? '' : tab))}
                  />
                ) : (
                  <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h2>Access Denied</h2>
                    <p>Please <Link to="/login" style={{ color: 'var(--accent)' }}>login</Link> to view your collection.</p>
                  </div>
                )
              }
            />
            <Route
              path="/trending"
              element={
                <Trending
                  loading={moviesLoading}
                  trending={trending}
                  onAdd={handleAddItem}
                  isInCollection={isInCollection}
                  onMovieClick={handleMovieClick}
                />
              }
            />
            <Route
              path="/profile"
              element={
                user ? (
                  <Profile
                    user={user}
                    onUpdateProfile={handleUpdateProfile}
                    onChangePassword={handleChangePassword}
                    onLogout={handleDirectLogout}
                  />
                ) : (
                  <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h2>Access Denied</h2>
                    <p>Please <Link to="/login" style={{ color: 'var(--accent)' }}>login</Link> to view your profile.</p>
                  </div>
                )
              }
            />

            <Route path="/shared" element={
              sharedCollection ? (
                <section className="collection-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>{sharedUsername}'s Collection ({sharedCollection.length})</h2>
                    {!user && (
                      <button onClick={() => navigate('/login')} style={{ background: '#e50914', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
                        Login to Create Yours
                      </button>
                    )}
                  </div>
                  <div className="grid">
                    {sharedCollection.map(movie => (
                      <div key={movie.imdbID} className="collection-item">
                        <div onClick={() => handleMovieClick(movie)} style={{ cursor: 'pointer', height: '100%' }}>
                          <div style={{ aspectRatio: '2/3', borderRadius: '8px', overflow: 'hidden' }}>
                            <LazyImage
                              src={movie.Poster}
                              alt={movie.Title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={() => { }}
                            />
                          </div>
                          <h3 style={{ fontSize: '1rem', marginTop: '10px' }}>{movie.Title}</h3>
                          <p style={{ fontSize: '0.8rem', color: '#aaa' }}>{movie.Year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Shared Collection...</div>
              )
            } />

            <Route
              path="/"
              element={<Home setActiveTab={(tab) => handleNavClick('/' + (tab === 'home' ? '' : tab))} loadTrending={loadTrending} />}
            />

            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />

            <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.5rem' }}>404 - Page Not Found</div>} />
          </Routes>
        </Suspense>
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onAdd={handleAddItem}
          isAdded={isInCollection(selectedMovie.imdbID)}
          isReadOnly={location.pathname === '/shared'}
        />
      )}



      {location.pathname !== '/login' && <Footer />}
    </div>
  );
}

export default App;
