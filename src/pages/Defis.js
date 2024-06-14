import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './NavBar';
import Footer from './Footer';
import './Defis.css';
import axios from 'axios';

const Defis = () => {
  const [defis, setDefis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDefis = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/defis');
        setDefis(response.data);
        setLoading(false);
      } catch (error) {
        setError('Erreur lors de la récupération des défis');
        setLoading(false);
      }
    };

    fetchDefis();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <h1>Liste des Défis</h1>
      </div>
      <div className="defis-container">
        {defis.map((defi) => (
          <Link key={defi.idDefi} to={`/defis/${defi.idDefi}`} className="defi-square">
            <div className="defi-card">
              <h2>{defi.titre}</h2>
              <p>{defi.description}</p>
              <div>
                {[...Array(defi.nbEtoiles)].map((_, index) => (
                  <span key={index} className="star">&#9733;</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Defis;
