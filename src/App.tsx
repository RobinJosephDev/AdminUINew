import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import CustomNavbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { UserProvider } from './UserProvider'; // Import UserProvider

// Suppress warnings in development
if (process.env.NODE_ENV === 'development') {
  console.warn = () => {}; // Override console.warn in development to suppress warnings
}

const Layout: React.FC = () => {
  const location = useLocation();
  const hideNavbarRoutes: string[] = ['/login', '/register'];
  const hideFooterRoutes: string[] = ['/login', '/register'];

  return (
    <UserProvider>
      {/* Wrap Layout with UserProvider */}
      {!hideNavbarRoutes.includes(location.pathname) && <CustomNavbar />}
      <AppRoutes />
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </UserProvider>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
