import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [isNavOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setNavOpen(false)}>
          <img src="Logo_A.png" alt="CypherCode Logo"/>
        </Link>

        <div className={`navbar-links ${isNavOpen ? 'open' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setNavOpen(false)}>
            Accueil
          </Link>
          <Link to="/defis" className="navbar-link" onClick={() => setNavOpen(false)}>
            Défis
          </Link>
          <Link to="/classement" className="navbar-link" onClick={() => setNavOpen(false)}>
            Classement
          </Link>
          <Link to="/signin" className="navbar-link" onClick={() => setNavOpen(false)}>
            Se connecter
          </Link>
          <Link to="/signup" className="navbar-link" onClick={() => setNavOpen(false)}>
            S'inscrire
          </Link>
          <Link to="/about" className="navbar-link" onClick={() => setNavOpen(false)}>
            CGU
          </Link>
          <Link to="/account" className="navbar-link" onClick={() => setNavOpen(false)}>
            <FontAwesomeIcon icon={faUser} className="icon" />
            Mon compte
          </Link>
        </div>

        <div className="navbar-toggle" onClick={toggleNav}>
          <span className={`bar ${isNavOpen ? 'cross' : ''}`}></span>
          <span className={`bar ${isNavOpen ? 'cross' : ''}`}></span>
          <span className={`bar ${isNavOpen ? 'cross' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
