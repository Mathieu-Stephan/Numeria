import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assurez-vous d'installer react-router-dom si vous ne l'avez pas déjà fait

const Navbar = () => {
  const [isNavOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="Logo_A.png" alt="CypherCode Logo"/>
        </Link>

        <div className={`navbar-links ${isNavOpen ? 'open' : ''}`}>
          <Link to="/" className="navbar-link" onClick={toggleNav}>
            Accueil
          </Link>
          <Link to="/defis" className="navbar-link" onClick={toggleNav}>
            Défis
          </Link>
          <Link to="/account" className="navbar-link" onClick={toggleNav}>
            Se connecter
          </Link>
          <Link to="/createaccount" className="navbar-link" onClick={toggleNav}>
            S'inscrire
          </Link>
          <Link to="/about" className="navbar-link" onClick={toggleNav}>
            A propos
          </Link>
          <Link to="/account" className="navbar-link" onClick={toggleNav}>
          <img src="account.png" alt="account" id="account" />
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
