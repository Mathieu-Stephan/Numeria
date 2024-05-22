import React from 'react';
import UserSection from './UserSection';
import StatSection from './StatSection';
import DefiSection from './DefiSection';
import DefiUserSection from './DefiUserSection';
import Navbar from './NavBar';
import Footer from './Footer';

const AdminPage = () => {
  return (
    <div className="admin-page">
        <Navbar />
            <h1>Admin Page</h1>
            <UserSection />
            <StatSection />
            <DefiSection />
            <DefiUserSection />
        <Footer />
    </div>
  );
};

export default AdminPage;
