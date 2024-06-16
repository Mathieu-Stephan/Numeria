import React, { useState, useEffect } from 'react';
import {useHistory} from "react-router-dom";
import UserSection from '../components/UserSection';
import StatSection from '../components/StatSection';
import DefiSection from '../components/DefiSection';
import DefiUserSection from '../components/DefiUserSection';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';

const AdminPage = () => {

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const pseudo = localStorage.getItem('pseudo');
    const admin = localStorage.getItem('admin');
    if (pseudo && admin == 1) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  const history = useHistory();
  
  const routeChange = () =>{ 
    let path = `/account`;
    history.push(path);
  }

  if (!isAdmin) {
    return (
      <div className="container">
        <Navbar />
        <div className="content myaccount-container">
          <h2>Vous devez être administrateur pour accéder à cette page</h2>
          <FontAwesomeIcon icon={faBan} className="icon" />
          <div className='button-container'>        
            <button onClick={routeChange}>Retour</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="admin-page">
        <Navbar />
            <center>
            <h1>Admin Page</h1>
            <UserSection />
            <StatSection />
            <DefiSection />
            <DefiUserSection />
            </center>
        <Footer />
    </div>
  );
};

export default AdminPage;
