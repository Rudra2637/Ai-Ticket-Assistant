import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import DocsView from './pages/DocsView.jsx';

export default function App() {
  const [currentView, setCurrentView] = useState('landing');

  // Listen to hash / URL path changes if any
  useEffect(() => {
    if (window.location.pathname.startsWith('/docs') || window.location.hash === '#docs') {
      setCurrentView('docs');
    }
  }, []);

  const openDocs = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('docs');
    window.location.hash = 'docs';
  };

  const openHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('landing');
    window.location.hash = '';
  };

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage onOpenDocs={openDocs} />
      ) : (
        <DocsView onBackToHome={openHome} />
      )}
    </>
  );
}
