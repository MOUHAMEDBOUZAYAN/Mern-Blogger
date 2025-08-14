import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ArticleProvider } from './contexts/ArticleContext';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const ArticleList = lazy(() => import('./pages/ArticleList'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const CreateArticle = lazy(() => import('./pages/CreateArticle'));
const EditArticle = lazy(() => import('./pages/EditArticle'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const About = lazy(() => import('./pages/About'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-900 flex items-center justify-center">
    <LoadingSpinner size="large" />
  </div>
);

function App() {
  useEffect(() => {
    // Register service worker for PWA support
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Preload critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.href = '/fonts/inter.woff2';
    preloadLink.as = 'font';
    preloadLink.type = 'font/woff2';
    preloadLink.crossOrigin = 'anonymous';
    document.head.appendChild(preloadLink);
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <ThemeProvider>
            <AuthProvider>
              <ArticleProvider>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen">
                  <main className="flex-grow">
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/articles" element={<ArticleList />} />
                        <Route path="/articles/:id" element={<ArticleDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />
                        
                        {/* Protected Routes */}
                        <Route path="/articles/create" element={
                          <PrivateRoute>
                            <CreateArticle />
                          </PrivateRoute>
                        } />
                        <Route path="/articles/:id/edit" element={
                          <PrivateRoute>
                            <EditArticle />
                          </PrivateRoute>
                        } />
                        <Route path="/profile" element={
                          <PrivateRoute>
                            <Profile />
                          </PrivateRoute>
                        } />
                        
                        {/* 404 Route */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </div>
                
                {/* Global Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#10b981',
                      color: '#fff',
                      borderRadius: '8px',
                      fontSize: '14px'
                    },
                    success: {
                      iconTheme: {
                        primary: '#fff',
                        secondary: '#10b981'
                      }
                    },
                    error: {
                      style: {
                        background: '#ef4444'
                      },
                      iconTheme: {
                        primary: '#fff',
                        secondary: '#ef4444'
                      }
                    }
                  }}
                />
              </ArticleProvider>
            </AuthProvider>
          </ThemeProvider>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;